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
                    <a-range-picker  v-model="dateRange" style="width: 300px;" @change="onDateChange" />
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                </div>

            </div>

            <a-table style="overflow:auto;" :style="logTableStyle" :columns="columns" :data-source="data" :pagination="pagination">
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
import moment from "moment";

const columns = [{
        title: '序号',
        dataIndex: 'order',
    },
    {
        dataIndex: 'time',
        title: '时间',
        scopedSlots: {
            customRender: 'time'
        },
        
        customCell: () => {
            return {
                style: {
                    'min-width': '180px',
                },
            };
        },
    },
     {
        dataIndex: 'client_ip',
        title: '来源',
    },
    {
        title: '用户',
        dataIndex: 'user_id',
        scopedSlots: {
            customRender: 'user_id'
        },
        customCell: () => {
            return {
                style: {
                    'min-width': '88px',
                },
            };
        },
    },
    {
        title: '公司',
        dataIndex: 'company_id',
        scopedSlots: {
            customRender: 'company_id'
        },
    },
    {   title: '日志类型',
        dataIndex: 'log_type',
        scopedSlots: {
            customRender: 'log_type'
        },
    },
    {
        title: '结果',
        dataIndex: 'result',
        scopedSlots: {
            customRender: 'result'
        },
        customCell: () => {
            return {
                style: {
                    'min-width': '66px',
                },
            };
        },
    },
    {
        title: '描述',
        dataIndex: 'message',
        width: '400px',
    },
    
];

export default {
    data() {
        return {
            data: [],
            backData: [], //备份供筛选使用
            columns,
            companyMap: {0:'无'},
            userMap: {},
            userSelectArr: [],
            logtypesMap: {},
            dateRange: [],
            reqParam: {page_num:"1", per_page_max_record_count :"50", user: "", optype:""},
            pagination: false,
            pageSizeOptions: ['50', '100', '200'],
            logTableStyle: {maxHeight: Math.floor((document.body.clientHeight - 270)) + 'px'},
            total: 0, //记录总条数
            current: 1,  //分页的当前页码
        };
    },
    methods: {
        onDateChange(moment, dates) {
            this.reqParam.beg_time = dates[0] ? dates[0]+' 00:00:00': '';
            this.reqParam.end_time = dates[1] ? dates[1]+' 23:59:59': '';
        },
        onUserChange(val){
            this.reqParam.user = val;
        },
        onLogTypeChange(val){
            this.reqParam.optype = val;
        },

        onPageChange(pageIndex){
            this.current = pageIndex;
            this.reqParam.page_num = pageIndex.toString();
            this.reqLogs();
        },

        onShowSizeChange(current, size){
            this.reqParam.page_num = '1';
            this.reqParam.per_page_max_record_count = size.toString();
            this.reqLogs();
        },

        //查询记录总条数
        reqDataTotalCount(callback){
            const self = this;
            this.reqParam.page_num = "1";
            this.current = 1;
            const param = {action: "1",...this.reqParam};
            this.$api.post("/query_log", param).then(res=>{
                self.total = res.err_code == '0' ? Number(res.count) : 0;
                if(callback){
                    callback();
                }
                if(res.err_code != '0'){
                    this.$message.error(res.err_msg);
                }
            });
        },
        reqData(){
            this.reqDataTotalCount(()=>{
                this.reqLogs();
            });
        },
        //请求数据
        reqLogs() {
            const self = this;
            self.$loading.show();
            const param = {action: "0",...this.reqParam};
            this.$api.post("/query_log", param).then(res=>{
                if(res.err_code == '0'){
                    let i = 0;
                    const resData = [];
                    for(let log of res.logs){
                        log.key = log.log_id;
                        i += 1;
                        log.order = i + (self.current - 1) * self.reqParam.per_page_max_record_count;
                        resData.push(log);
                    }
                    self.data = resData;
                    self.backData = resData;
                }else{
                    self.$message.error(res.err_msg);
                    self.data = [];
                    self.backData = [];
                }
                self.$loading.hide();
            }).catch(()=>{
                self.$loading.hide();
            });
        },

        reqCompany(callback){
            const self = this;
            this.$loading.show();
            this.$api.post("/query_company", {
                type: "1",
            }).then(res=>{
                if(res.err_code == '0'){
                    const resData = [];
                    for(let company of res.companies){
                        resData.push(company);
                        self.companyMap[company.company_id] = company.name;
                    }
                    self.companys = resData;
                }
                if(callback){
                    callback();
                }
            }).catch(()=>{
                self.$loading.hide();
            });
        },

        //请求用户
        reqUser(callback) {
            const self = this;
            this.$api.post("/query_user", {
                type: "2",
            }).then(res=>{
                if(res.err_code == '0'){       
                    const obj = new Object();           
                    res.users.forEach((user)=>{
                        obj[user.id] = user.real_name;
                    });
                    self.userMap = obj;
                    
                    self.userSelectArr = res.users.filter(item=>{
                        return item.state != '1';
                    });
                }
                if(callback){
                    callback();
                }
            }).catch((err)=>{
                console.error(err);
            });
        },

        /**请求日志类型 */
        reqLogType(callback) {
            const self = this;
            this.$api.post("/get_log_optypes", {
            }).then(res=>{
                const obj = new Object();
                if(res.err_code == 0){
                    for(let key in res.op_types){
                        obj[key] = res.op_types[key];
                    }
                }
                self.logtypesMap = obj;
                if(callback){
                    callback();
                }
            }).catch(()=>{
            });
        },
        setDateRange(){
            const today = this.$util.getFmtDateStr(new Date());
            this.dateRange = [moment(today, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
            this.reqParam.beg_time = today +' 00:00:00';
            this.reqParam.end_time = today +' 23:59:59';
        }

    },
    mounted() {
        const self = this;
        this.setDateRange();
        this.reqLogType(()=>{
            self.reqUser(()=>{
                self.reqCompany(()=>{
                    self.reqData();
                });
            });
        });
    }
};
</script>

<style>
@import url('../../assets/css/manager.css');
</style>
