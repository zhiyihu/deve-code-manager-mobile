import {
    StreamBarcodeReader
} from "vue-barcode-reader";
import DeveCodeCommon from './DeveCodeCommon';

export default {
    extends: DeveCodeCommon,
    components: {
        StreamBarcodeReader,
    },
    data() {
        return {
            deviceTypesObj: {},
            loading: false,
            visible: false,
            modalTitle: '添加机号',
            addDeviceSnListVal: '',
            deviceTypeIconObj: {},
            deviceType: {},
            codeList: [],
            showCodeList: [],
            groupList: [],
            currTypeIndex: 0,
            currType: '',

            machineNum: 0,
            error: '',
            result: '',
            noStreamApiSupport: false,
            qrVisible: false,
            companySelectArr: [],
            modfCompanyId: '',
            companyObj: {},
            deviceBelongCompany: '无',
            deviceBelongCompanyIds: [],
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
            if (!this.qrVisible) {
                return;
            }
            this.qrVisible = false;
            this.addCode(result, true);
        },
        onLoaded() {},

        regResHandleOk() {
            this.regResVisible = false;
        },
        regResHandleCancel() {
            this.regResVisible = false;
        },
        submitChangeCompany() {
            const self = this;
            if (!this.codeList.length) {
                this.$message.info('请添加机号');
                return;
            }
            if (!(this.modfCompanyId + '')) {
                this.$message.info('请选择变更公司');
                return;
            }
            // if(this.deviceBelongCompanyIds.includes(this.modfCompanyId)){
            //     this.$message.info('请选择与设备所属公司不同的公司');
            //     return;
            // }
            this.$confirm({
                title: '提示',
                content: '确认变更' + self.codeList.length + '台主机，公司为【' + self.companyObj[self.modfCompanyId] + '】？',
                okText: '确认',
                okType: 'primary',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqChangeMachineCompany();
                },
                onCancel() {},
            });
        },
        //变更公司
        reqChangeMachineCompany() {
            const self = this;
            const param = new Object();
            const devices = self.codeList.map(item => item.value);

            param.devices = devices;
            param.company_id = this.modfCompanyId;
            self.$loading.show();

            this.$api.post('/change_device_company', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.clearAllList();
                    self.$message.success('操作成功');
                } else {
                    self.$error({
                        title: res.err_msg,
                        onOk() {},
                    });
                }
            }).catch(e => {
                self.$loading.hide();
                console.error(e);
            });
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
            let snFlag = this.$util.getSnFlag(code);
            const deviceType = this.deviceType;
            return deviceType[snFlag];
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
            const reg = new RegExp('([A-Z]1[0-9]{2}[1-9ABC][A-Z0-9]{14})|([A-Z]2[0-9]{2}[A-Z0-9]{10})|([A-Z]3[0-9][A-Z0-9]{12})', 'g');
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
                onCancel() {},
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
                this.refreshDeviceBelongCompany();
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
                onCancel() {},
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
            this.refreshDeviceBelongCompany();
        },
        clearAllList: function () {
            this.codeList = [];
            this.showCodeList = [];
            this.groupList = [];
            this.currTypeIndex = 0;
            this.deviceBelongCompany = '无';
            this.deviceBelongCompanyIds = [];
        },
        addCode(codeStr, isScan) {
            codeStr = (codeStr || '');
            if (!codeStr) {
                return;
            }
            const legalCodes = this.getLegalCodes(codeStr);
            let addTipText = '';
            if (codeStr.match(/^[A-Za-z0-9]+$/g)) {
                addTipText = codeStr.substr(0, 40);
            }
            if (!legalCodes.length) {
                this.$error({
                    title: '不正确的主机号' + (isScan ? addTipText : ''),
                    onOk() {},
                });
                return;
            }
            const codeList = this.codeList;
            if (codeList.length >= 5000) {
                this.$message.info('最多添加5000台');
                return;
            }

            for (let code of legalCodes) {
                const index = this.getIndexOfCode(code);
                if (index >= 0) {

                    this.$info({
                        title: code + '已在列表',
                        onOk() {},
                    });
                    return;
                }
            }

            for (let code of legalCodes) {
                let type = this.getMachineType(code);
                codeList.push({
                    type: type,
                    value: code,
                    pic: this.getIconPic(this.$util.getSnFlag(code), type)
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
            this.refreshDeviceBelongCompany();
        },

        refreshDeviceBelongCompany() {
            const self = this;
            if (!this.codeList.length) {
                this.deviceBelongCompany = '无';
                this.deviceBelongCompanyIds = [];
            } else {
                const param = new Object();
                param.action = '0';
                param.sn = self.codeList.map(item=>item.value);
                this.$api.post("/query_device", param).then(res => {
                    if (res.err_code == '0') {
                        self.deviceBelongCompany = [...new Set(res.devices.map(item=>self.companyObj[item.company_id]))].join('，');
                        self.deviceBelongCompanyIds = res.devices.map(item=>item.company_id);
                    } else {
                        self.$message.error(res.err_msg);
                        self.deviceBelongCompany = '无';
                        self.deviceBelongCompanyIds = [];
                    }
                }).catch(() => {
                    self.$loading.hide();
                });

            }
        },

        tabCallback(key) {
            const index = key;
            const currType = this.groupList[index].type;
            const codeList = this.codeList;
            this.currTypeIndex = key;
            this.showCodeList = codeList.filter((item) => {
                return item.type == currType
            });
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

        onCompanyChange(val) {
            this.modfCompanyId = val;
        },
    },
    mounted() {
        const self = this;
        this.reqQueryDeviceIcon();
        this.reqQueryDeviceType();
        this.reqQueryCompany(()=>{
            self.companyObj = self.companyMap;
        });
    },
};