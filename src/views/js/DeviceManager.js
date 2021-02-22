import moment from "moment";

const columns = [{
    title: '序号',
    dataIndex: 'order',
    width: 60,
}, {
    title: '图标',
    dataIndex: 'pic',
    width: 100,
    scopedSlots: {
        customRender: 'pic'
    },
},
{
    width: 240,
    title: '机号',
    dataIndex: 'sn',
},
{
    width: 90,
    title: '机型',
    dataIndex: 'device_type',
},
{
    title: '公司',
    dataIndex: 'company_id',
    scopedSlots: {
        customRender: 'company_id'
    },
},
{
    title: '生产时间',
    dataIndex: 'product_time',
    scopedSlots: {
        customRender: 'time'
    },
    customCell: () => {
        return {
            style: {
                'min-width': '66px',
            },
        };
    },
},

];

export default {
    data() {
        return {
            data: [],
            columns,
            companyMap: {
                0: '无'
            },
            userMap: {},
            userSelectArr: [],
            companySelectArr: [],
            companySel: '',
            deviceTypeSel: '',
            deviceTypesArr: [],
            dateRange: [],
            reqParam: {
                page_num: "1",
                per_page_max_record_count: "10",
            },
            pagination: false,
            pageSizeOptions: ['10', '20', '50', '100'],
            tableStyle: {
                maxHeight: Math.floor((document.body.clientHeight - 250)) + 'px'
            },
            tableScroll: {
                y: Math.floor((document.body.clientHeight - 320))
            },
            total: 0, //记录总条数
            current: 1, //分页的当前页码
            searchSN: '', //搜索机号
            loading: false,
            visible: false,
            modalTitle: '',
            companyCanChange: true,
            addDeviceSnListVal: '',
            productDate: '',
            deviceTypeIconObj: {}, //存储devicetype图标
            pageSize: 10,
        };
    },
    methods: {
        /**修改/添加弹出框点击提交*/
        handleOk() {
            this.visible = false;
        },
        handleCancel() {
            this.visible = false;
        },
        addDevice() {
            this.$message.info('添加设备功能正在开发中...');
            this.companySel = '';
            this.deviceTypeSel = '';
            this.addDeviceSnListVal = '';
            this.productDate = '';
            this.modalTitle = '添加设备';
            //this.visible = true;
        },
        onDateChange(moment, dates) {
            this.reqParam.beg_time = dates[0] ? dates[0] + ' 00:00:00' : '';
            this.reqParam.end_time = dates[1] ? dates[1] + ' 23:59:59' : '';
        },
        onCompanyChange(val) {
            this.reqParam.company_id = val;
        },
        onTypeChange(val) {
            this.reqParam.device_type = val;
        },

        onPageChange(pageIndex) {
            this.current = pageIndex;
            this.reqParam.page_num = pageIndex.toString();
            this.reqDevices();
        },

        onShowSizeChange(current, size) {
            this.reqParam.page_num = '1';
            this.reqParam.per_page_max_record_count = size.toString();
            this.reqDevices();
        },
        getReqParam(action) {
            const self = this;
            let param = new Object();
            param.action = action;
            param.beg_time = self.reqParam.beg_time;
            param.end_time = self.reqParam.end_time;
            param.device_type = self.reqParam.device_type;
            param.company_id = self.reqParam.company_id;
            param.page_num = self.reqParam.page_num;
            param.per_page_max_record_count = self.reqParam.per_page_max_record_count;
            if (self.searchSN) {
                param.sn = [self.searchSN];
            }
            return param;
        },
        //查询记录总条数
        reqDataTotalCount(callback) {
            const self = this;
            this.reqParam.page_num = "1";
            this.current = 1;
            const param = this.getReqParam('1');
            this.$api.post("/query_device", param).then(res => {
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
                this.reqDevices();
            });
        },
        getIconPic(type) {
            let deviceTypeIconObj = this.deviceTypeIconObj;
            return deviceTypeIconObj[type];
        },
        //请求数据
        reqDevices() {
            const self = this;
            self.$loading.show();
            const param = this.getReqParam('0');
            this.$api.post("/query_device", param).then(res => {

                if (res.err_code == '0') {
                    let i = 0;
                    for (let item of res.devices) {
                        i += 1;
                        let order = i + (self.current - 1) * self.reqParam.per_page_max_record_count;
                        item.key = order;
                        item.order = order;
                        item.pic = self.getIconPic(item.device_type);
                    }
                    self.data = res.devices;
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
                    self.companySelectArr = resData;
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

        /**请求类型 */
        reqDeviceType(callback) {
            const self = this;
            this.$api.post("/query_device_type", {}).then(res => {
                if (res.err_code == 0) {
                    self.deviceTypesArr = [...new Set(Object.values(res.device_typs))];
                    let obj = new Object();
                    for (let key of self.deviceTypesArr) {
                        let imgName = self.$util.getMachinePicByType(key);
                        obj[key] = require('../../assets/' + imgName + '.png');
                    }
                    self.deviceTypeIconObj = obj;
                } else {
                    self.$message.error(res.err_img);
                }
                if (callback) {
                    callback();
                }
            }).catch(() => { });
        },

        setDateRange() {
            const today = this.$util.getFmtDateStr(new Date());
            this.dateRange = [moment('2016-01-01', 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
            this.reqParam.beg_time = '2016-01-01' + ' 00:00:00';
            this.reqParam.end_time = today + ' 23:59:59';
        }

    },
    mounted() {
        const self = this;
        this.setDateRange();
        this.reqDeviceType(() => {
            self.reqUser(() => {
                self.reqCompany(() => {
                    self.reqData();
                });
            });
        });

    }
};