import moment from "moment";

const columns = [{
    title: '序号',
    dataIndex: 'order',
    width: '60px',
},
{
    dataIndex: 'time',
    title: '时间',
    scopedSlots: {
        customRender: 'time'
    },
    width: '166px',
},
// {
//     dataIndex: 'client_ip',
//     title: '来源',
// },
{
    title: '用户',
    dataIndex: 'user_id',
    width: '120px',
    scopedSlots: {
        customRender: 'user_id'
    },
},
{
    title: '公司',
    dataIndex: 'company_id',
    scopedSlots: {
        customRender: 'company_id'
    },
    width: '225px',
},
{
    title: '日志类型',
    dataIndex: 'log_type',
    width: '140px',
    scopedSlots: {
        customRender: 'log_type'
    },
},
{
    title: '结果',
    dataIndex: 'result',
    width: '70px',
    scopedSlots: {
        customRender: 'result'
    },
},
{
    title: '描述',
    dataIndex: 'message',
    scopedSlots: {
        customRender: 'message'
    },
    customCell: () => {
        return {
            style: {
                'min-width': '500px',
                'max-width': '800px',
            },
        };
    },
},

];

export default {
    data() {
        return {
            data: [],
            columns: columns,
            companyMap: { 0: '无' },
            userMap: {},
            userSelectArr: [],
            logtypesMap: {},
            dateRange: [],
            reqParam: { page_num: "1", per_page_max_record_count: "10", user: "", optype: "" },
            pagination: false,
            pageSizeOptions: ['10', '20', '50', '100'],
            logTableStyle: {wordBreak:'break-all', maxHeight: Math.floor((document.body.clientHeight - 210)) + 'px' },
            tableScroll: {y: Math.floor((document.body.clientHeight - 280))},
            total: 0, //记录总条数
            current: 1,  //分页的当前页码
            pageSize: 10,

        };
    },
    methods: {
        onDateChange(moment, dates) {
            this.reqParam.beg_time = dates[0] ? dates[0] + ' 00:00:00' : '';
            this.reqParam.end_time = dates[1] ? dates[1] + ' 23:59:59' : '';
        },
        onUserChange(val) {
            this.reqParam.user = val;
        },
        onLogTypeChange(val) {
            this.reqParam.optype = val;
        },

        onPageChange(pageIndex) {
            this.current = pageIndex;
            this.reqParam.page_num = pageIndex.toString();
            this.reqLogs();
        },

        onShowSizeChange(current, size) {
            this.reqParam.page_num = '1';
            this.reqParam.per_page_max_record_count = size.toString();
            this.reqLogs();
        },

        //查询记录总条数
        reqDataTotalCount(callback) {
            const self = this;
            this.reqParam.page_num = "1";
            this.current = 1;
            const param = { action: "1", ...this.reqParam };
            this.$api.post("/query_log", param).then(res => {
                self.total = res.err_code == '0' ? Number(res.count) : 0;
                if (callback) {
                    callback();
                }
                if (res.err_code != '0') {
                    this.$message.error(res.err_msg);
                }
            });
        },
        reqData() {
            this.reqDataTotalCount(() => {
                this.reqLogs();
            });
        },
        //请求数据
        reqLogs() {
            const self = this;
            self.$loading.show();
            const param = { action: "0", ...this.reqParam };
            this.$api.post("/query_log", param).then(res => {
                if (res.err_code == '0') {
                    let i = 0;
                    const resData = [];
                    for (let log of res.logs) {
                        log.key = log.log_id;
                        i += 1;
                        log.order = i + (self.current - 1) * self.reqParam.per_page_max_record_count;
                        log.message = log.message.replace(/\n/g, '<br/>');
                        resData.push(log);
                    }
                    self.data = resData;
                } else {
                    self.$message.error(res.err_msg);
                    self.data = [];
                }
                self.$loading.hide();
            }).catch(() => {
                self.$loading.hide();
            });
        },

        reqCompany(callback) {
            const self = this;
            this.$loading.show();
            this.$api.post("/query_company", {
                type: "1",
            }).then(res => {
                if (res.err_code == '0') {
                    const resData = [];
                    for (let company of res.companies) {
                        resData.push(company);
                        self.companyMap[company.company_id] = company.name;
                    }
                    self.companys = resData;
                }
                if (callback) {
                    callback();
                }
            }).catch(() => {
                self.$loading.hide();
            });
        },

        //请求用户
        reqUser(callback) {
            const self = this;
            this.$api.post("/query_user", {
                type: "2",
            }).then(res => {
                if (res.err_code == '0') {
                    const obj = new Object();
                    res.users.forEach((user) => {
                        obj[user.id] = user.real_name;
                    });
                    self.userMap = obj;

                    self.userSelectArr = res.users.filter(item => {
                        return item.state != '1';
                    });
                }
                if (callback) {
                    callback();
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        /**请求日志类型 */
        reqLogType(callback) {
            const self = this;
            this.$api.post("/get_log_optypes", {
            }).then(res => {
                const obj = new Object();
                if (res.err_code == 0) {
                    for (let key in res.op_types) {
                        obj[key] = res.op_types[key];
                    }
                }
                self.logtypesMap = obj;
                if (callback) {
                    callback();
                }
            }).catch(() => {
            });
        },
        setDateRange() {
            const today = this.$util.getFmtDateStr(new Date());
            this.dateRange = [moment(today, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
            this.reqParam.beg_time = today + ' 00:00:00';
            this.reqParam.end_time = today + ' 23:59:59';
        }

    },
    mounted() {
        const self = this;
        this.setDateRange();
        this.reqLogType(() => {
            self.reqUser(() => {
                self.reqCompany(() => {
                    self.reqData();
                });
            });
        });
    }
};