<template>
<a-layout style="padding: 20px 16px 0px 16px;background:#fff;margin-bottom:18px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part">
                    <span style="margin-left: 16px;">用户列表：</span>
                    <a-select style="width: 160px;" default-value="" @change="onUserChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in userSelectArr" :key="index" :value="item.user">
                            {{item.real_name}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 16px;">日志类型：</span>
                    <a-select style="width: 160px;" default-value="" @change="onLogTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in Object.keys(logtypesMap)" :key="index" :value="item">
                            {{logtypesMap[item]}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 16px;">起始日期：</span>
                    <a-range-picker :inputReadOnly="true" v-model="dateRange" style="width: 300px;" @change="onDateChange" />
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                </div>

            </div>

            <a-table :scroll="tableScroll" style="overflow:auto;" :style="logTableStyle" :columns="columns" :data-source="data" :pagination="pagination">
                <span slot="parent_id" slot-scope="parent_id">
                    {{companyMap[parent_id] || ""}}
                </span>
                <span slot="time" slot-scope="time">
                    {{ time.substr(0, 19) }}
                </span>
                <span slot="result" slot-scope="result">
                    {{ ['失败', '成功'][result] || result }}
                </span>
                <span slot="log_type" slot-scope="log_type">
                    {{ logtypesMap[log_type] || log_type }}
                </span>
                <span slot="user_id" slot-scope="user_id">
                    {{userMap[user_id] || user_id}}
                </span>
                <span slot="company_id" slot-scope="company_id">
                    {{companyMap[company_id] || ''}}
                </span>
                <span slot="message" slot-scope="text" v-html="text">
                    {{text}}
                </span>
            </a-table>
            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size-options="pageSizeOptions" :page-size="Number(reqParam.per_page_max_record_count)" @change="onPageChange" @showSizeChange="onShowSizeChange" v-model="current" :total="total"  :show-total="(total) => `共有${total}条数据`" show-less-items>
                <template slot="buildOptionText" slot-scope="props">
                    <span>{{ props.value }}条/页</span>
                </template>
            </a-pagination>
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>

import LogList from '../js/LogList';

export default{
    ...LogList
}
</script>

<style>
@import url('../../assets/css/manager.css');
</style>
