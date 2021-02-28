import moment from "moment";
import ClipboardJS from 'clipboard';
import { StreamBarcodeReader } from "vue-barcode-reader";
import DeveCodeCommon from './DeveCodeCommon';

export default {
    extends: DeveCodeCommon,
    components: {
        StreamBarcodeReader,
    },
    data() {
        return {
            registResArr: [],
            copyText: '',
            regResVisible: false,
            regResModalTitle: '注册结果',
            dateStyle: {
                borderWidth: '0px'
            },
            maxActDay: 1,
            deviceTypesObj: {},
            dateRange: [],
            loading: false,
            visible: false,
            modalTitle: '添加机号',
            addDeviceSnListVal: '',
            deviceTypeIconObj: {},
            regTimeVal: '1',
            activeDays: 1,
            regReasonVal: '',
            deviceFunc: {},
            deviceType: {},
            deviceFuncOptions: [],
            actPassDay: moment().add(1, 'days'),
            regFuncVal: [],
            codeList: [],
            showCodeList: [],
            groupList: [],
            currTypeIndex: 0,
            currType: '',
            actTimesArr: [],
            actTimeConfigArr: [{
                "val": "1",
                "name": "1天"
            }, {
                "val": "3",
                "name": "3天"
            }, {
                "val": "7",
                "name": "7天"
            }, {
                "val": "15",
                "name": "15天"
            }, {
                "val": "30",
                "name": "30天"
            }, {
                "val": "60",
                "name": "60天"
            }, {
                "val": "90",
                "name": "90天"
            }, {
                "val": "180",
                "name": "180天"
            }, {
                "val": "365",
                "name": "1年"
            }, {
                "val": "1095",
                "name": "3年"
            }, {
                "val": "1825",
                "name": "5年"
            }, {
                "val": "10000",
                "name": "永久"
            }],
            actReasonArr: [],
            machineNum: 0,
            error: '',
            result: '',
            noStreamApiSupport: false,
            qrVisible: false,
        };
    },
    methods: {
        showQrWin() {
            this.qrVisible = true;
        },
        qrHandleCancel() {
            this.qrVisible = false;
        },
        qrHandleOk() {
            this.qrVisible = false;
        },
        onDecode(result) {
            if(!this.qrVisible){
                return;
            }
            this.qrVisible = false;
            this.addCode(result, true);
        },
        onLoaded() { },

        initClipboard() {
            const self = this
            this.clipboard = new ClipboardJS('.copy');
            this.clipboard.on('success', (e) => {
                e.clearSelection();
                self.$message.success('复制成功');
            });
            this.clipboard.on('error', () => {
                self.$message.error('复制错误，请重新复制！');
            });
        },

        destoryClipboard() {
            if (this.clipboard) {
                this.clipboard.destroy();
            }
        },
        regResHandleOk() {
            this.regResVisible = false;
        },
        regResHandleCancel() {
            this.regResVisible = false;
        },
        submitRegist() {
            const self = this;
            if (!this.codeList.length) {
                this.$message.info('请添加机号');
                return;
            }
            const currTypeIndex = self.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            this.$confirm({
                title: '激活提示',
                content: '确认激活全部' + currType + '？',
                okText: '确认',
                okType: 'primary',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqRegistMachine();
                },
                onCancel() { },
            });
        },
        getDeviceFuncVal() {
            let regFuncVal = this.regFuncVal;
            let total = 0;
            for (let key of regFuncVal) {
                total += Math.pow(2, key - 0);
            }
            return total;
        },
        reqRegistMachine() {
            const self = this;
            const param = new Object();
            const devices = new Array();
            const showCodeList = self.showCodeList;
            const actDay = (self.activeDays) + '';
            const functionCode = self.getDeviceFuncVal() + '';
            const actReason = self.regReasonVal;
            for (let item of showCodeList) {
                devices.push({
                    sn: item.value,
                    type: item.type,
                    days: actDay,
                    function_code: functionCode,
                    apply_reason: actReason,
                });
            }
            param.devices = devices;
            param.way = "web"; //激活方式为网页

            self.$loading.show();

            this.$api.post('/regist_device', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.clearCurrList();
                    self.showRegistResModal(res.codes);
                } else {
                    self.$error({
                        title: res.err_msg,
                        onOk() { },
                    });
                }
            }).catch(e => {
                self.$loading.hide();
                console.error(e);
            });

        },
        showRegistResModal(codes) {
            const self = this;
            let copyText = '';
            const len = codes.length;
            codes.forEach((item, index) => {
                item.regDayShow = item.regist_datetime.substr(0, 19);
                item.daysShow = self.$util.fmtRegDay(item.days);
                item.passDayShow = self.$util.fmtPassDay(item.days, item.expire_date);
                item.codeShow = self.$util.fmtActCode(item.code);
                item.funcShow = (item.func_list.join('，') || '无');
                copyText += '第' + (index + 1) + '条记录\r\n';
                copyText += this.getClipFmtTextSingle(item) + (index < len - 1 ? '\r\n\r\n' : '');
            });
            self.registResArr = codes;
            self.regResVisible = true;
            self.copyText = copyText;
            self.regResModalTitle = '注册成功（共' + codes.length + '条）';
        },
        getClipFmtTextSingle: function (code) {
            let res = '';
            res += '机号：' + code.sn + '\r\n';
            res += '机型：' + code.type + '\r\n';
            res += '注册码：' + code.codeShow + '\r\n';
            res += '注册天数：' + code.daysShow + '\r\n';
            res += '到期时间：' + code.passDayShow + '\r\n';
            res += '主机功能：' + code.funcShow + '\r\n';
            res += '操作人：' + code.user + '\r\n';
            return res;
        },
        disabledDate(current) {
            let maxActDay = this.maxActDay;
            return (current && current < moment().endOf('day')) || current > moment().add(maxActDay, 'days');
        },
        onDateChange(date) {
            this.regTimeVal = '';
            let dayGap = date.diff(moment().startOf('day'), 'day');
            this.activeDays = dayGap - 0;
            this.dateStyle = {
                borderWidth: '1px'
            };
        },
        refreshDeviceFuncOptions(isNotResetVal) {
            let options = new Array();
            const currTypeIndex = this.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            let funcArr = (this.deviceFunc[currType] || []);
            for (let item of funcArr) {
                options.push({
                    label: item.name,
                    value: item.bit,
                });
            }
            this.deviceFuncOptions = options;
            if (!isNotResetVal) {
                this.regFuncVal = [];
            }

        },
        codeStrChange(e) {
            const codeStr = e.target.value;
            const codesArr = this.getLegalCodes(codeStr);
            this.machineNum = codesArr.length;
        },
        calGroupList(codeList) {
            const groupList = new Array();
            const obj = new Object();
            for (let code of codeList) {
                obj[code.type] = (obj[code.type] || 0) + 1
            }
            for (let key in obj) {
                groupList.push({
                    type: key,
                    num: obj[key],
                    tab: key + ' * ' + obj[key]
                });
            }
            return groupList;
        },

        getMachineType(code) {
            let type = "";
            if (code.length == 15) {
                type = '0' + code.substr(5, 2);
            } else if (code.length == 14) {
                type = '0' + code.substr(2, 2);
            } else if (code.length == 19) {
                type = code.substr(6, 3);
            }
            const deviceType = this.deviceType;
            return deviceType[type];
        },

        getIndexOfCode(code) {
            const codeList = this.codeList;
            for (let i = 0; i < codeList.length; i++) {
                let codeObj = codeList[i];
                if (codeObj.value == code) {
                    return i;
                }
            }
            return -1;
        },
        getLegalCodes(codeStr) {
            codeStr = codeStr.toUpperCase();
            const reg = new RegExp('[A-Z][A-Z0-9]{13,18}', 'g');
            const self = this;
            return [...new Set(codeStr.match(reg) || [])].filter(item => {
                return self.getMachineType(item);
            });
        },
        bindDelCode: function (code) {

            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '确认移除' + code + '？',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.removeCode(code);
                },
                onCancel() { },
            });
        },

        removeCode: function (code) {
            const codeList = this.codeList;
            const index = this.getIndexOfCode(code);
            if (index >= 0) {
                codeList.splice(index, 1);
                const groupList = this.groupList;
                const newGroupList = this.calGroupList(codeList);
                const currTypeIndex = (newGroupList.length == groupList.length ? this.currTypeIndex : 0);
                const currType = (newGroupList[currTypeIndex] || {
                    type: ''
                }).type;
                const showCodeList = codeList.filter((item) => {
                    return item.type == currType
                });

                this.codeList = codeList;
                this.showCodeList = showCodeList;
                this.groupList = newGroupList;
                this.currTypeIndex = currTypeIndex;
                this.refreshDeviceFuncOptions(true);
            }

        },

        bindClearList: function () {
            const self = this;
            const currTypeIndex = self.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            this.$confirm({
                title: '删除提示',
                content: '确认清空全部' + currType + '？',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.clearCurrList();
                },
                onCancel() { },
            });

        },
        clearCurrList: function () {
            const self = this;
            const currTypeIndex = self.currTypeIndex;
            let currType = (this.groupList[currTypeIndex] || {
                type: ''
            }).type;
            const codeList = self.codeList.filter((item) => {
                return item.type != currType
            });
            const groupList = self.calGroupList(codeList);
            currType = (groupList[0] || {
                type: ''
            }).type;
            const showCodeList = codeList.filter((item) => {
                return item.type == currType
            });

            this.codeList = codeList;
            this.showCodeList = showCodeList;
            this.groupList = groupList;
            this.currTypeIndex = 0;
            this.refreshDeviceFuncOptions();
        },
        addCode(codeStr, isScan) {
            codeStr = (codeStr || '');
            if (!codeStr) {
                return;
            }
            const legalCodes = this.getLegalCodes(codeStr);
            let addTipText = '';
            if(codeStr.match(/^[A-Za-z0-9]+$/g)){
                addTipText = codeStr.substr(0,40);
            }
            if (!legalCodes.length) {
                this.$error({
                    title: '不正确的主机号' + (isScan ? addTipText: ''),
                    onOk() { },
                });
                return;
            }
            const codeList = this.codeList;
            if (codeList.length >= 300) {
                this.$message.info('最多添加300台');
                return;
            }

            for (let code of legalCodes) {
                const index = this.getIndexOfCode(code);
                if (index >= 0) {

                    this.$info({
                        title: code + '已在列表',
                        onOk() { },
                    });
                    return;
                }
            }

            for (let code of legalCodes) {
                let type = this.getMachineType(code);
                codeList.push({
                    type: type,
                    value: code,
                    pic: this.getIconPic(type)
                });
            }

            const groupList = this.calGroupList(codeList);
            const currTypeIndex = this.currTypeIndex;
            const currType = (groupList[currTypeIndex] || {
                type: ''
            }).type;
            const showCodeList = codeList.filter((item) => {
                return item.type == currType
            });

            this.codeList = codeList;
            this.showCodeList = showCodeList;
            this.groupList = groupList;

            this.refreshDeviceFuncOptions(true);

        },

        onRegTimeChange(e) {
            let day = e.target.value;
            this.activeDays = day - 0;
            this.actPassDay = moment().add(day, 'days');
            this.dateStyle = {
                borderWidth: '0px'
            };
        },

        tabCallback(key) {
            const index = key;
            const currType = this.groupList[index].type;
            const codeList = this.codeList;
            this.currTypeIndex = key;
            this.showCodeList = codeList.filter((item) => {
                return item.type == currType
            });
            this.refreshDeviceFuncOptions();
        },

        handleOk() {
            const codeStr = this.addDeviceSnListVal;
            this.addCode(codeStr);
            this.visible = false;
        },
        handleCancel() {
            this.visible = false;
        },
        addDevice() {
            this.addDeviceSnListVal = '';
            this.machineNum = 0;
            this.visible = true;
        },

        getIconPic(type) {
            let deviceTypeIconObj = this.deviceTypeIconObj;
            return deviceTypeIconObj[type];
        },

        reqRegistReasons() {
            const self = this;
            this.$api.post("/query_regist_reason", {}).then(res => {
                if (res.err_code == 0) {
                    self.actReasonArr = res.reasons;
                    self.regReasonVal = res.reasons[0];
                } else {
                    self.$message.error(res.err_img);
                }
            }).catch(() => { });
        },

        setDateRange() {
            const today = this.$util.getFmtDateStr(new Date());
            this.dateRange = [moment(today, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];

        },
        refreshMaxActDays: function () {
            let user = JSON.parse(sessionStorage.getItem("user"));
            const maxActDay = user.regist_max_days - 0;
            this.maxActDay = maxActDay;

            const timesArr = new Array();
            const actTimeConfigArr = this.actTimeConfigArr;
            for (let item of actTimeConfigArr) {
                if (item.val - 0 <= maxActDay) {
                    timesArr.push(item);
                }
            }
            this.actTimesArr = timesArr;
        },

    },
    mounted() {
        this.refreshMaxActDays();
        this.reqQueryDeviceType();
        this.reqRegistReasons();
        this.reqQueryDeviceFuncs();
        this.initClipboard();

    },
    destroyed() {
        this.destoryClipboard();
    },
    computed: {
        maxActText() {
            let maxActDay = this.maxActDay;
            return maxActDay - 0 <= 9999 ? '最多' + maxActDay + '天' : '可永久激活';
        }
    }
};