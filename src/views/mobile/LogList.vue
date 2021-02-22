<template>
<a-layout style="padding: 16px 0px;background:#fff;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">用户列表：</span>
                    <a-select style="width: calc(100vw - 130px)" default-value="" @change="onUserChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in userSelectArr" :key="index" :value="item.user">
                            {{item.real_name}}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">日志类型：</span>
                    <a-select style="width: calc(100vw - 130px)" default-value="" @change="onLogTypeChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in Object.keys(logtypesMap)" :key="index" :value="item">
                            {{logtypesMap[item]}}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="opt-head-part-line">
                    <span style="margin-left: 16px;">起始日期：</span>
                    <a-range-picker :inputReadOnly="true" v-model="dateRange" style="width: calc(100vw - 130px)" @change="onDateChange" />
                </div>
                <div>
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                </div>

            </div>
            <div class="table-bottom-page-count">一共有{{total}}条数据，每页{{pageSize}}条，当前第{{current}}页</div>
            <div>
                <div v-for="(item,index) in data" :key="index" class="table-info-part">
                    <div class="table-info-order-line">
                        {{item.order}}
                    </div>
                    <div class="table-info-line">
                        <div>时间：</div>
                        <div>
                           {{ item.time.substr(0, 19) }}
                        </div>
                    </div>

                    <div class="table-info-line">
                        <div>来源：</div>
                        <div>{{item.client_ip}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>用户：</div>
                        <div>{{userMap[item.user_id] || item.user_id}}</div>
                    </div>
                    <div class="table-info-line">
                        <div>公司：</div>
                        <div>
                            {{companyMap[item.company_id] || ""}}
                        </div>
                    </div>
                    <div class="table-info-line">
                        <div>操作类型：</div>
                        <div> {{ logtypesMap[item.log_type] || item.log_type }}</div>
                    </div>
                    
                    
                    <div class="table-info-line">
                        <div>结果：</div>
                        <div> {{ ['失败', '成功'][item.result] || item.result }}</div>
                    </div>
                      <div class="table-info-line">
                        <div>描述：</div>
                        <div> {{item.message}}</div>
                    </div>
                </div>
            </div>

            <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size="Number(reqParam.per_page_max_record_count)" @change="onPageChange" v-model="current" :total="total"  :show-total="(total) => ``" show-less-items>
                
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
@import url('../../assets/css/manager-mobile.css');
</style>
