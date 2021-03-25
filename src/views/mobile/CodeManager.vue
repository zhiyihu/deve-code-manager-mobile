<template>
<a-layout style="padding: 16px 0px;background:#fff;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">机型：</span>
                    <a-select style="width: calc(100vw - 130px)" default-value="" @change="onTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in deviceTypeSelectArr" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">公司：</span>
                    <a-select style="width: calc(100vw - 130px)" default-value="" @change="onCompanyChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">注册日期：</span>
                    <a-range-picker :inputReadOnly="true" v-model="dateRange" style="width: calc(100vw - 130px)" @change="onDateChange" />
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">用户：</span>
                    <a-select style="width: calc(100vw - 130px)" default-value="" @change="onUserChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in userSelectArr" :key="index" :value="item.user">
                            {{item.real_name}}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">机号：</span>
                    <a-input allow-clear v-model="searchSN" style="width: calc(100vw - 130px)"></a-input>

                </div>
                <div>
                    <a-button type="primary" icon="search" style="vertical-align: top;margin-left: 12px;" @click="reqData">查询</a-button>
                    <a-button v-if="total>0" type="primary" icon="copy" class="copypage" @click="useClipboard('page');" :data-clipboard-text="copyText" style="vertical-align: top;margin-left: 12px;">复制本页</a-button>
                </div>
            </div>
            <div class="table-bottom-page-count">一共有{{total}}条数据，每页{{pageSize}}条，当前第{{current}}页</div>
            <div>
                <div v-for="(item,index) in data" :key="index" class="table-info-part">
                    <div class="table-info-device-line">
                        <div class="machine-order">{{item.order}}</div>
                        <div class="machine-icon"><img :src="item.pic" /></div>
                        <div class="machine-sn">
                            <span :style="{color: item.isDev ? '#595959':'#1890ff'}">{{ item.sn }}</span>
                        </div>
                    </div>

                    <div class="table-info-line">
                        <div>机型：</div>
                        <div>{{item.type}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>注册码：</div>
                        <div>{{item.codeShow}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>注册时间：</div>
                        <div>{{item.regist_datetime.substr(0,19)}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>注册天数：</div>
                        <div>{{item.daysShow}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>到期时间：</div>
                        <div> {{ item.passDayShow}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>主机功能：</div>
                        <div> {{ item.func_list }}</div>
                    </div>

                    <div class="table-info-line">
                        <div>操作人：</div>
                        <div>
                            {{item.user}}
                        </div>
                    </div>
                    <div class="table-info-optbtns">
                        <a href="javascript:;" class="table-opt-alink" @click="showQrCodeModal(item.code);">二维码</a>
                        <a href="javascript:;" :class="'table-opt-alink copy'+item.order" @click="useClipboard(item.order);" :data-clipboard-text="item.copyText">复制</a>
                        <a href="javascript:;" :class="'table-opt-alink copy-'+item.order" @click="useClipboard('-'+item.order);" :data-clipboard-text="item.code">复制注册码</a>
                    </div>
                </div>
            </div>

            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size="Number(reqParam.per_page_max_record_count)" @change="onPageChange" v-model="current" :total="total" :show-total="(total) => ``" show-less-items>

            </a-pagination>
            <a-modal :width="320" :centered="true" v-model="qrCodeVisible" title="注册码">
                <template slot="footer">
                    <a-button :visible="false" key="back" @click="hideQrCodeModal">取消</a-button>
                    <a-button key="submit" type="primary" :loading="false" @click="hideQrCodeModal">确定</a-button>
                </template>
                <div style="padding: 0px 14px;overflow: auto;">
                    <div class="dragonfly-qrcode-part">
                        <img style="width:130px;height:130px;" :src="regQrcode"/>
                    </div>
                </div>
            </a-modal>

        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
import CodeManager from '../js/CodeManager';

export default {
    ...CodeManager
}
</script>

<style>
@import url('../../assets/css/manager-mobile.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
