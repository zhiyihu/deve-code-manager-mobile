<template>
<a-layout style="padding: 16px 0px;background:#fff;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part">
                    <span>筛选：</span>
                    <a-input placeholder="输入公司名称筛选" allow-clear style="width: calc(100vw - 80px)" @change="search" v-model="searchText"></a-input>
                </div>
                <div style="margin-top: 10px;">
                    <a-button type="primary" icon="reload" style="vertical-align: top;" @click="reqData">刷新数据</a-button>
                    <a-button type="primary" icon="plus" style="vertical-align: top;margin-right: 8px;margin-left: 12px;" @click="addItem">添加公司</a-button>
                </div>
            </div>
            <div class="table-bottom-page-count">一共有{{total}}条数据，每页{{pageSize}}条，当前第{{current}}页</div>
            <div>
                <div v-for="(item,index) in data.slice(current*pageSize-pageSize,current*pageSize)" :key="index" class="table-info-part">
                    <div class="table-info-order-line">
                        {{item.order}}
                    </div>
                    <div class="table-info-line">
                        <div>公司名：</div>
                        <div>
                            <span v-if="item.company_id == myCompany" style="font-weight: bolder;color: #1890ff;">{{item.name}}</span>
                            <span v-else>{{item.name}}</span>
                        </div>
                    </div>

                    <div class="table-info-line">
                        <div>电话：</div>
                        <div>{{item.telephone}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>地址：</div>
                        <div>{{item.address}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>类型：</div>
                        <div>
                            {{ ['通用','代理商','驾校'][item.type || 0] }}
                        </div>
                    </div>
                    <div class="table-info-line">
                        <div>父公司：</div>
                        <div> {{companyMap[item.parent_id] || ""}}</div>
                    </div>

                    <div class="table-info-optbtns">
                        <a href="javascript:;" class="table-opt-alink" @click="modify(item);">修改</a>
                        <a href="javascript:;" class="table-opt-alink" v-if="item.company_id != myCompany && item.parent_id != '0'" @click="del(item);">删除</a>
                    </div>
                </div>
            </div>
            
            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size="pageSize" @change="onPageChange" v-model="current" :total="total" :show-total="(total) => ``" show-less-items>

            </a-pagination>

            <a-modal width="320px" :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
                </template>
                <div class="amodal-edit-line">
                    <span><i>*</i>公司类型</span>
                    <a-radio-group default-value="0" button-style="solid" v-model="companyType">
                        <a-radio-button value="0">通用</a-radio-button>
                        <a-radio-button value="1">代理商</a-radio-button>
                        <a-radio-button value="2">驾校</a-radio-button>
                    </a-radio-group>
                </div>
                <div class="amodal-edit-line">
                    <span><i>*</i>公司名称</span>
                    <a-input style="width: 180px;" :maxLength="24" :disabled="unameDisabled" v-model="companyName"></a-input>
                </div>
                <div class="amodal-edit-line">
                    <span><i>*</i>电话</span>
                    <a-input style="width: 180px;" :maxLength="20" v-model="telephone"></a-input>
                </div>
                <div class="amodal-edit-line">
                    <span><i>*</i>地址</span>
                    <a-input style="width: 180px;" :maxLength="30" v-model="address"></a-input>
                </div>
                <div class="amodal-edit-line">
                    <span><i>*</i>父公司</span>
                    <a-select style="width: 180px;" :disabled="!parentCanChange" v-model="companyParentSel">
                        <a-select-option value="" disabled>请选择</a-select-option>
                        <a-select-option v-if="operateType == 'modify'" value="0" disabled>无</a-select-option>
                        <a-select-option v-for="(item, index) in backData" :key="index" :value="item.company_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-modal>
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
import CompanyManager from '../js/CompanyManager';

export default {
    ...CompanyManager
}
</script>

<style>
@import url('../../assets/css/manager-mobile.css');
</style>
