import {
    StreamBarcodeReader
} from "vue-barcode-reader";
import DeveCodeCommon from './DeveCodeCommon';
const columns = [{
    title: "序号",
    dataIndex: "order",
},
{
    dataIndex: "device_type",
    title: "型号",
},
{
    title: "品牌所属公司",
    dataIndex: "company_name"
},
{
    title: "品牌",
    dataIndex: "dealer_brand",
},
{
    title: "型号",
    dataIndex: "dealer_mode",
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
            topOptType: "0",
            columns: columns,
            data: [],
            pagination: {
                total: 0,
                pageSize: 10, //每页中显示10条数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            pageSize: 10,
            current: 1,
            searchDeviceType: "",
            searchCompanyId: "",

            modalDeviceType: "",
            modalCompanyId: "",
            dealerBrand: "",
            dealerModel: "",
            dealerId: "",
            brandVisible: false,
            brandModalTitle: "",
            operateType: "add",
            changeData: [],
            changeDataObj: {},
            brandSelArr: [],
            brandSelId: "",
            updateToDeviceCount: 0,
        };
    },
    computed: {
        total() {
            return this.data.length;
        }
    },
    methods: {
        onPageChange() {
        },
        brandHandleCancel(){
            this.brandVisible = false;
        },
        brandHandleOk(){
            if (this.operateType == 'add') {
                this.addReq();
            }
        },
        addReq() {
            const self = this;
            if (this.$util.checkNull([this.modalDeviceType, this.modalCompanyId, this.dealerBrand, this.dealerModel])){
                this.$message.error('必填项不能为空');
                return;
            }

            this.$api.post("/add_device_brand", {
                company_id: self.modalCompanyId,				
                brand: self.dealerBrand,			   	   
                model: self.dealerModel,				
                device_type: self.modalDeviceType,				
            }).then(res => {
                if (res.err_code == '0') {
                    self.brandVisible = false;
                    self.searchDeviceType = "";
                    self.searchCompanyId = "";
                    self.$message.success('添加成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });

        },
        reqData(){
            const self = this;
            self.$loading.show();
            this.$api.post("/query_device_brand", {}).then(res => {
                if (res.err_code == '0') {
                    
                    let deviceType = self.searchDeviceType;
                    let companyId = self.searchCompanyId;
                    self.changeDataObj = {};
                    self.changeData = res.brands.filter(item=>{
                        self.changeDataObj[item.brand_id] = item;
                        return item.state == 0;
                    });
                    
                    res.brands = res.brands.filter(item=>{
                        return item.state == 0 && (!deviceType || deviceType == item.device_type) && (!companyId || companyId == item.company_id);
                    });
                    
                    let i = 1;
                    for(let item of res.brands){
                        item.order = i++;
                        item.key = i;
                        item.company_name = self.companyMap[item.company_id] || item.company_id;
                    }
                    self.data = res.brands;
                }else{
                    self.$message.error(res.err_msg);
                }
                self.$loading.hide();
            }).catch(() => {
                self.$loading.hide();
            });
        },
        /**点击删除，弹出确认框*/
        del(record) {
            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '删除操作不可撤销，是否确认删除【' + record.dealer_mode + '】',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.delReq(record.brand_id);
                },
                onCancel() { },
            });
        },
        delReq(id) {
            const self = this;
            this.$api.post("/del_device_brand", {
                brand_id: id,
            }).then(res => {
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },
        addItem(){
            this.brandModalTitle = "添加品牌型号";
            this.modalDeviceType = "";
            this.modalCompanyId = "";
            this.dealerBrand = "";
            this.dealerModel = "";
            this.operateType = "add";
            this.brandVisible = true;
        },
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

            if (!(this.brandSelId + '')) {
                this.$message.info('请选择品牌类型');
                return;
            }
            let brandObj = self.changeDataObj[self.brandSelId];
            this.$confirm({
                title: '提示',
                content: '确认变更' + self.showCodeList.length + '台主机，品牌为【' + brandObj.dealer_brand + '  ' + brandObj.dealer_mode + '】？',
                okText: '确认',
                okType: 'primary',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqChangeMachineBrand();
                },
                onCancel() {},
            });
        },
        //变更公司
        reqChangeMachineBrand() {
            const self = this;
            const param = new Object();
            const devices = self.showCodeList.map(item => item.value);

            param.devices = devices;
            param.brand_id = this.brandSelId;
            self.$loading.show();

            this.$api.post('/change_device_brand', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.clearCurrList();
                    this.modfCompanyId = "";
                    this.brandSelId = "";
                    this.brandSelArr = [];
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
            this.refreshDeviceBelongCompany(currType);
        },

        refreshDeviceBelongCompany(currType) {
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
                        let obj = {};
                        for(let item of res.devices){
                            obj[item.sn] = item;
                        }
                        let count = 0;
                        self.codeList.forEach(item=>{
                            let device = obj[item.value]||{};
                            item.dealer_brand_modified = device.dealer_brand_modified;
                            count += device.dealer_brand_modified == 1 ? 1 : 0;
                            item.dealer_brand_id = device.dealer_brand_id;

                            item.dealer_mode = (self.changeDataObj[device.dealer_brand_id] || {dealer_mode: item.type}).dealer_mode;
                            item.dealer_brand = (self.changeDataObj[device.dealer_brand_id] || {dealer_brand: 'DEVECENT'}).dealer_brand;
                        });
                        self.codeList.sort((a,b)=>{
                            return -10000*(a.dealer_brand_modified+"").localeCompare(b.dealer_brand_modified+"")-(a.dealer_brand_id+"").localeCompare(b.dealer_brand_id+"");
                        });
                        self.updateToDeviceCount = count;
                        if(currType){
                            self.showCodeList = self.codeList.filter((item) => {
                                return item.type == currType;
                            });
                        }
                    } else {
                        self.$message.error(res.err_msg);
                        self.deviceBelongCompany = '无';
                        self.deviceBelongCompanyIds = [];
                    }
                }).catch((err) => {
                    self.$loading.hide();
                    console.error(err);
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
            this.modfCompanyId = "";
            this.brandSelId = "";
            this.brandSelArr = [];
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
            if(this.showCodeList.length > 0){
                let type = this.showCodeList[0].type;
                let arr = this.changeData.filter(item=>{
                    return item.company_id == val && item.device_type == type;
                });
                this.brandSelId = "";
                this.brandSelArr = arr;
            }
        },
    },
    mounted() {
        const self = this;
        this.reqQueryDeviceIcon();
        this.reqQueryDeviceType();
        this.reqQueryCompany(()=>{
            self.companyObj = self.companyMap;
            self.reqData();
        });
    },
};