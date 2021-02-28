import DeveCodeCommon from './DeveCodeCommon';
export default {
    extends: DeveCodeCommon,
    data() {
        return {
           aesKey: '',
           token: '',
           deviceFunc: {},
           deviceTypeObjArr: [],
           deviceName: '',
           deviceFlag: '',
           regDay: '',
           defaultFuncCode: '',
           deviceFuncOptions: [],
           regFuncVal: [],
        };
    },
    methods: {
        onFuncsCheckBoxChange(){
            let regFuncVal = this.regFuncVal;
            let total = 0;
            for (let key of regFuncVal) {
                total += Math.pow(2, key - 0);
            }
            this.defaultFuncCode = total.toString();
        },
        //通过功能码，计算对应的功能码二进制位数组
        calFuncCodeArr(funcCodeVal){
            const binaryStr = (funcCodeVal - 0).toString(2);
            const funcArr = new Array();
            let i = binaryStr.length;
            for(let c of binaryStr){
                if(c == 1){
                    funcArr.push(i - 1);
                }
                i--;
            }
            return funcArr;
        },
        onTypeChange(val){
            val = val + '';
            if(!val){
                this.deviceName = '';
                this.deviceFlag = '';
                this.regDay = '';
                this.defaultFuncCode = '';
                this.refreshDeviceFuncOptions();
                this.regFuncVal =[];
            }else{
                let index = val;
                const item = this.deviceTypeObjArr[index];
                this.deviceName = item.name;
                this.deviceFlag = item.sn_flag;
                this.regDay = item.product_regist_days;
                this.defaultFuncCode = item.product_func_code;
                this.refreshDeviceFuncOptions(item.name);
                this.regFuncVal = this.calFuncCodeArr(item.product_func_code);
            }
        },
        refreshDeviceFuncOptions(type) {
            if(!type){
                this.deviceFuncOptions = [];
                return;
            }
            let options = new Array();
            let funcArr = (this.deviceFunc[type] || []);
            for (let item of funcArr) {
                options.push({
                    label: item.name,
                    value: item.bit,
                });
            }
            this.deviceFuncOptions = options;
        },
        submitModify() {
            const self = this;
            if (this.$util.checkNull([this.deviceName])){
                this.$message.error('设备类型不能为空');
                return false;
            }
            if(!this.$util.checkDeviceFlag(this.deviceFlag)){
                this.$message.error('机号标识必须为3位数字，不足3位前面补0');
                return false;
            }
            if(!this.$util.checkDeviceRegDay(this.regDay)){
                this.$message.error('注册天数1~10000');
                return false;
            }
            this.$confirm({
                title: '提示',
                content: '确认提交修改信息',
                okText: '确认',
                okType: 'primary',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqConfigModify();
                },
                onCancel() {},
            });
        },
        
        reqConfigModify() {
            const self = this;
            const param = new Object();
            param.device_name = this.deviceName;
            param.product_func_code = this.defaultFuncCode.toString();
            param.product_regist_days = this.regDay.toString();
            param.device_flag = this.deviceFlag.toString();

            this.$api.post('/update_device_product_info', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqQueryDeviceType();
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(e => {
                self.$loading.hide();
                console.error(e);
            });
        },

    },
    mounted() {
        this.reqQueryDeviceType();
        this.reqQueryDeviceFuncs();
    },
};
