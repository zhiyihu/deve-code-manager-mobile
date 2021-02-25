<template>
<a-layout style="padding: 20px 16px 0px 16px;background:#fff;margin-bottom:18px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head" style="height: 90px;">
                <div class="opt-head-part">
                    <span style="margin-left: 16px;">机型：</span>
                    <a-select style="width: 240px;" default-value="" @change="onTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in deviceTypesArr" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 16px;">公司：</span>
                    <a-select style="width: 240px;" default-value="" @change="onCompanyChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 16px;">生产日期：</span>
                    <a-range-picker :inputReadOnly="true" v-model="dateRange" style="width: 300px;" @change="onDateChange" />
                </div>
                <div class="opt-head-part" style="margin-top: 12px;">
                    <span style="margin-left: 16px;">机号：</span>
                    <a-input allow-clear v-model="searchSN" style="width: 240px;"></a-input>
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                </div>
            </div>

            <a-table :scroll="tableScroll" style="overflow:auto;" :style="tableStyle" :columns="columns" :data-source="data" :pagination="pagination">
                <span slot="time" slot-scope="time">
                    {{ time.substr(0, 19) }}
                </span>
                <span slot="user_id" slot-scope="user_id">
                    {{userMap[user_id] || user_id}}
                </span>
                <span slot="company_id" slot-scope="company_id">
                    {{companyMap[company_id] || ''}}
                </span>
                <span slot="pic" slot-scope="pic">
                    <img :src="pic" style="width: 64px;height:48px;"/>
                </span>
            </a-table>
            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size-options="pageSizeOptions" :page-size="Number(reqParam.per_page_max_record_count)" @change="onPageChange" @showSizeChange="onShowSizeChange" v-model="current" :total="total"  :show-total="(total) => `共有${total}条数据`" show-less-items>
                <template slot="buildOptionText" slot-scope="props">
                    <span>{{ props.value }}条/页</span>
                </template>
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
                        <a-date-picker v-model="productDate" style="width: 350px;"/>
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
@import url('../../assets/css/manager.css');

</style>
