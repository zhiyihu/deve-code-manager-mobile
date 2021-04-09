import moment from "moment";
import ClipboardJS from 'clipboard';
import DeveCodeCommon from './DeveCodeCommon';
import QRCode from 'qrcode';

const columns = [{
    title: '序号',
    dataIndex: 'order',
    width: 100,
},{
    title: '图标',
    dataIndex: 'pic',
    width: 70,
    scopedSlots: {
        customRender: 'pic'
    },
},
 {
    width: 200,
    title: '机号',
    dataIndex: 'sn',
    scopedSlots: {
        customRender: 'sn'
    },
},
{
    width: 70,
    title: '机型',
    dataIndex: 'type',
},
{
    width: 200,
    title: '注册码',
    dataIndex: 'codeShow',
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
    dataIndex: 'daysShow',
},
{
    title: '到期时间',
    dataIndex: 'passDayShow',
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
    fixed: 'right',
    width: 224,
    scopedSlots: {
        customRender: "action",
    },
},

];

export default {
    extends: DeveCodeCommon,
    data() {
        return {
            data: [],
            columns: columns,
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
                y: Math.floor((document.body.clientHeight - 320)),
                x: 1340,
            },
            total: 0, //记录总条数
            current: 1, //分页的当前页码
            searchSN: '', //搜索机号
            pageSize: 10,
            copyText: '',
            qrCodeVisible: false,
            regQrcode: "",
        };
    },
    methods: {
        showQrCodeModal(code){
            this.qrCodeVisible = true;
            QRCode.toDataURL(code).then(url => {
                this.regQrcode = url;
            }).catch(err => {  //异常时的处理
                console.error(err);
            });
        },
        hideQrCodeModal(){
            this.qrCodeVisible = false;
        },
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
                        item.func_list = (item.func_list || '无').replace(/,/g,'，');
                        item.pic = self.getIconPic(self.$util.getSnFlag(item.sn), item.type);

                        item.regDayShow = item.regist_datetime.substr(0, 19);
                        item.daysShow = self.$util.fmtRegDay(item.days);
                        item.passDayShow = self.$util.fmtPassDay(item.days, item.expire_date);
                        item.codeShow = self.$util.fmtActCode(item.code);
                        item.funcShow = item.func_list;
                        item.copyText = self.getClipFmtTextSingle(item);
                        item.isDev = item.sn.charAt(0) == 'Z';
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
            let isDev = code.sn.charAt(0) == 'Z';
            res += '机号：' + code.sn + '\r\n';
            res += '机型：' + code.type + '\r\n';
            res += '注册码：' + code.codeShow + '\r\n';
            if(isDev){
                res += '注册时间：' + code.regDayShow + '\r\n';
            }
            res += '到期时间：' + code.passDayShow + '\r\n';
            if(isDev){
                res += '主机功能：' + code.funcShow + '\r\n';
            }
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


        setDateRange() {
            const nowDate = new Date();
            const today = this.$util.getFmtDateStr(nowDate);
            const lastWeek = this.$util.calDateStrByGap(nowDate, -6);
            this.dateRange = [moment(lastWeek, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
            this.reqParam.beg_time = lastWeek + ' 00:00:00';
            this.reqParam.end_time = today + ' 23:59:59';
        }

    },
    mounted() {
        const self = this;
        this.setDateRange();
        self.reqQueryDeviceType(() => {
            self.reqQueryDeviceIcon(()=>{
                self.reqQueryUser(() => {
                    self.userSelectArr = self.userSelectArr.filter(item => {
                        return item.user != 'admin';
                    });
                    self.reqQueryCompany(() => {
                        self.reqData();
                    });
                });
            });
        });
    }
};