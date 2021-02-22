<template>
<a-layout style="padding: 16px 0px;background:#fff;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">机型：</span>
                    <a-select style="width: calc(100vw - 130px)" default-value="" @change="onTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in deviceTypesArr" :key="index" :value="item">
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
                    <span style="margin-left: 16px;">生产日期：</span>
                    <a-range-picker v-model="dateRange" style="width: calc(100vw - 130px)" @change="onDateChange" />
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">机号：</span>
                    <a-input allow-clear v-model="searchSN" style="width: calc(100vw - 130px)"></a-input>
                </div>
                <div>
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                    <a-button type="primary" icon="plus" style="vertical-align: top;margin-left: 12px;" @click="addDevice">添加主机</a-button>
                </div>
            </div>
            <div class="table-bottom-page-count">一共有{{total}}条数据，每页{{pageSize}}条，当前第{{current}}页</div>
            <div>
                <div v-for="(item,index) in data" :key="index" class="table-info-part">
                    <div class="table-info-device-line">
                        <div class="machine-order">{{item.order}}</div>
                        <div class="machine-icon"><img :src="item.pic" /></div>
                        <div class="machine-sn">
                            {{ item.sn }}
                        </div>
                    </div>

                    <div class="table-info-line">
                        <div>机型：</div>
                        <div>{{item.device_type}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>生产时间：</div>
                        <div>{{item.product_time.substr(0,19)}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>公司：</div>
                        <div>
                            {{companyMap[item.company_id] || ""}}
                        </div>
                    </div>

                </div>
            </div>
       
            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size="Number(reqParam.per_page_max_record_count)" @change="onPageChange" v-model="current" :total="total" :show-total="(total) => ``" show-less-items>

            </a-pagination>
            <a-modal :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
                </template>
                <div style="height: 340px;overflow: hidden;">
                    <div class="amodal-edit-line">
                        <span><i>*</i>机型</span>
                        <a-select style="width: 350px;" default-value="" v-model="deviceTypeSel">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="(item, index) in deviceTypesArr" :key="index" :value="item">
                                {{item}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>生产日期</span>
                        <a-date-picker :inputReadOnly="true" v-model="productDate" style="width: 350px;" />
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>所属公司</span>
                        <a-select style="width: 350px;" v-model="companySel" :disabled="!companyCanChange">
                            <a-select-option value="" disabled>请选择</a-select-option>
                            <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="amodal-edit-line" style="height: 150px;">
                        <span style="vertical-align: top;"><i>*</i>机号列表</span>
                        <a-textarea v-model="addDeviceSnListVal" placeholder="多个机号用换行或分号逗号等隔开" style="width: 350px;height: 144px;resize:none;"></a-textarea>
                    </div>
                    <div class="amodal-edit-line">
                        <span></span>
                        <span style="width: 150px;text-align:left;">识别到0个机号</span>
                    </div>

                </div>
            </a-modal>
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
import DeviceManager from '../js/DeviceManager';

export default {...DeviceManager}
 
</script>

<style lang="css">
@import url('../../assets/css/manager-mobile.css');
</style>
