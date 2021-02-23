import moment from "moment";
import ClipboardJS from 'clipboard';

const columns = [{
    title: '序号',
    dataIndex: 'order',
    width: 60,
},{
    title: '图标',
    dataIndex: 'pic',
    width: 70,
    scopedSlots: {
        customRender: 'pic'
    },
},
 {
    width: 180,
    title: '机号',
    dataIndex: 'sn',
},
{
    width: 70,
    title: '机型',
    dataIndex: 'type',
},
{
    width: 200,
    title: '注册码',
    dataIndex: 'code',
},
{
    title: '注册时间',
    dataIndex: 'regist_datetime',
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
{
    width: 70,
    title: '天数',
    dataIndex: 'days',
    scopedSlots: {
        customRender: 'days'
    },
},
{
    title: '到期时间',
    dataIndex: 'expire_date',
    scopedSlots: {
        customRender: 'date'
    },
},
{
    title: '操作人',
    dataIndex: 'user',
},
{
    title: '主机功能',
    dataIndex: 'func_list',
},
{
    title: "操作",
    key: "action",
    scopedSlots: {
        customRender: "action",
    },
},

];

export default {
    data() {
        return {
            data: [],
            columns: columns,
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
                sn: '2'
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
            deviceTypeIconObj: {},
            pageSize: 10,
            copyText: '',
        };
    },
    methods: {
        useClipboard(className) {
            const self = this
            this.clipboard = new ClipboardJS('.copy' + className);
            this.clipboard.on('success', (e) => {
                e.clearSelection();
                self.$message.success('复制成功');
                if (self.clipboard) {
                    self.clipboard.destroy();
                }
            });
            this.clipboard.on('error', () => {
                self.$message.error('复制错误，请重新复制！');
            });
        },
        /**修改/添加弹出框点击提交*/
        handleOk() {
            this.visible = false;
        },
        handleCancel() {
            this.visible = false;
        },
        addDevice() {
            //this.$message.info('添加设备');
            this.$message.info('主机注册功能正在开发中...');
            this.companySel = '';
            this.deviceTypeSel = '';
            this.addDeviceSnListVal = '';
            this.productDate = '';
            this.modalTitle = '添加设备';
            // this.visible = true;
        },
        onDateChange(moment, dates) {
            this.reqParam.beg_time = dates[0] ? dates[0] + ' 00:00:00' : '';
            this.reqParam.end_time = dates[1] ? dates[1] + ' 23:59:59' : '';
        },
        onCompanyChange(val) {
            this.reqParam.company_id = val;
        },
        onUserChange(val) {
            this.reqParam.user = val;
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
            param.user = self.reqParam.user;
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
            this.$api.post("/query_regist_record", param).then(res => {
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
            this.$api.post("/query_regist_record", param).then(res => {
                if (res.err_code == '0') {
                    let i = 0;
                    const resData = [];
                    for (let item of res.codes) {
                        i += 1;
                        let order = i + (self.current - 1) * self.reqParam.per_page_max_record_count;
                        item.key = order;
                        item.order = order;
                        item.expire_date = item.days < 9999 ? item.expire_date : '9999-12-31';
                        item.func_list = item.func_list || '无';
                        item.pic = self.getIconPic(item.type);
                        item.code = self.$util.fmtActCode(item.code);

                        item.regDayShow = item.regist_datetime.substr(0, 19);
                        item.daysShow = (item.days <= 9999 ? item.days + '天' : '永久');
                        item.passDayShow = (item.days <= 9999 ? item.expire_date.substr(0, 10) : '9999-12-31');
                        item.codeShow = item.code;
                        item.funcShow = item.func_list;
                        item.copyText = self.getClipFmtTextSingle(item);
                        resData.push(item);

                    }
                    self.data = resData;
                    self.refreshCopyThisPage(self.data);
                } else {
                    self.$message.error(res.err_msg);
                    self.data = [];
                    self.refreshCopyThisPage([]);
                }
                self.$loading.hide();
            }).catch(() => {
                self.$loading.hide();
            });
        },

        getClipFmtTextSingle: function (code) {
            let res = '';
            res += '机号：' + code.sn + '\r\n';
            res += '机型：' + code.type + '\r\n';
            res += '注册码：' + code.code + '\r\n';
            res += '注册时间：' + code.regDayShow + '\r\n';
            res += '注册天数：' + code.daysShow + '\r\n';
            res += '到期时间：' + code.passDayShow + '\r\n';
            res += '主机功能：' + code.funcShow + '\r\n';
            res += '操作人：' + code.user + '\r\n';
            return res;
        },

        refreshCopyThisPage: function (items) {
            let i = (this.current - 1) * this.pageSize + 1;
            const machineArr = items;
            let copyTextArr = new Array();
            for (let code of machineArr) {
                let text = '';
                text += '第' + (i++) + '条记录\r\n';
                text += this.getClipFmtTextSingle(code);
                copyTextArr.push(text);
            }
            this.copyText = copyTextArr.join('\r\n');
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
                        return item.state != '1' && item.user != 'admin';
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
            this.dateRange = [moment(today, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
            this.reqParam.beg_time = today + ' 00:00:00';
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