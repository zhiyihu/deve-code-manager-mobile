<template>
<a-layout style="padding: 20px 16px 0px 16px;background:#fff;margin-bottom:18px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head" style="height: 90px;">
                <div class="opt-head-part">
                    <span style="margin-left: 16px;">机型：</span>
                    <a-select style="width: 240px;" default-value="" @change="onTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in deviceTypeSelectArr" :key="index" :value="item">
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
                    <span style="margin-left: 16px;">注册日期：</span>
                    <a-range-picker :inputReadOnly="true" v-model="dateRange" style="width: 300px;" @change="onDateChange" />
                </div>
                <div class="opt-head-part" style="margin-top: 12px;">
                    <span style="margin-left: 16px;">用户：</span>
                    <a-select style="width: 240px;" default-value="" @change="onUserChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in userSelectArr" :key="index" :value="item.user">
                            {{item.real_name}}
                        </a-select-option>
                    </a-select>
                    <span style="margin-left: 16px;">机号：</span>
                    <a-input allow-clear v-model="searchSN" style="width: 240px;"></a-input>
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                    <a-button v-if="total>0" type="primary" icon="copy" class="copypage" @click="useClipboard('page');" :data-clipboard-text="copyText" style="vertical-align: top;margin-left: 12px;">复制本页</a-button>
                </div>
            </div>

            <a-table :scroll="tableScroll" style="overflow:auto;" :style="tableStyle" :columns="columns" :data-source="data" :pagination="pagination">
                <span slot="time" slot-scope="time">
                    {{ time.substr(0, 19) }}
                </span>
                <span slot="date" slot-scope="date">
                    {{ date.substr(0, 10) }}
                </span>
                <span slot="days" slot-scope="days">
                    {{ Number(days) > 9999 ? '永久' : days + '天'}}
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
                 <template v-slot:action="record">
                    <a href="javascript:;" :class="'table-opt-alink copy'+record.order" @click="useClipboard(record.order);" :data-clipboard-text="record.copyText">复制</a>
                 </template>
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
import CodeManager from '../js/CodeManager';

export default {
    ...CodeManager
}
</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');

</style>
