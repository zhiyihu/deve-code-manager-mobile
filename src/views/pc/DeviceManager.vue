<template>
<a-layout style="padding: 20px 16px 0px 16px;background:#fff;margin-bottom:18px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head" style="height: auto;line-height:45px;padding-bottom: 10px;">
                <div class="opt-head-part">
                    <span style="margin-left: 16px;">机型：</span>
                    <a-select show-search option-filter-prop="children" :filter-option="filterOption" style="width: 240px;" default-value="" @change="onDeviceTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in deviceTypeSelectArr" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 16px;">公司：</span>
                    <a-select show-search option-filter-prop="children" :filter-option="filterOption" style="width: 240px;" default-value="" @change="onCompanyChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                    <span v-if="isDevecent" style="margin-left: 16px;">生产日期：</span>
                    <a-range-picker v-if="isDevecent" :inputReadOnly="true" v-model="dateRange" style="width: 300px;" @change="onDateChange" />
                    <br v-if="isDevecent"/>
                    <span style="margin-left: 16px;">机号：</span>
                    <a-input allow-clear v-model="searchSN" style="width: 240px;"></a-input>
                    <a-button type="primary" icon="search" style="margin-left: 12px;" @click="reqData">查询</a-button>
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
                    <img :src="pic" style="width: 64px;height:43px;"/>
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
import DeviceManager from '../js/DeviceManager';

export default {...DeviceManager}
</script>

<style lang="css">
@import url('../../assets/css/manager.css');

</style>
