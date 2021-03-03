import DeveCodeCommon from './DeveCodeCommon'
export default {
    extends: DeveCodeCommon,
    data() {
        return {
            deviceName: '',
            deviceFlag: '',
            bits: new Array(16).fill(1),
            bitFuncObj: {},  //当前选择类型的bit对应功能Object
            bitNameIptArr: new Array(16).fill(''),
        };
    },
    methods: {
        bindDelBitFunc(index){
            if(!this.deviceName){
                this.$message.error('请选择设备类型');
                return;
            }
            const bit = index.toString();  //这里的bit必须是字符串
            const funcName = this.bitFuncObj[index];
            const self = this;
            this.$confirm({
                title: `${this.deviceName}`,
                content: `删除操作不可恢复，确认删除Bit ${bit}：${funcName}？`,
                okText: '确认',
                cancelText: '取消',
                centered: true,
                okType: 'danger',
                onOk() {
                    self.reqDelDeviceFunc(self.deviceName, bit);
                },
                onCancel() {},
            });
        },
        bindAddBitFunc(index){
            if(!this.deviceName){
                this.$message.error('请选择设备类型');
                return;
            }
            let funcName = this.bitNameIptArr[index];
            if(this.$util.checkNull([funcName])){
                this.$message.error('请填写功能名称');
                return;
            }
            const bit = Number(index); //这里的bit必须为数字
            const self = this;
            this.$confirm({
                title: `${this.deviceName}`,
                content: `确认添加Bit ${bit}：${funcName}？`,
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqAddDeviceFunc(self.deviceName, bit, funcName);
                },
                onCancel() {},
            });
        },
        reqAddDeviceFunc(type, bit, funcName){
            const param = new Object();
            param.device_type = type;
            param.funcs = [{
                func_name: funcName,
                func_bit: bit
            }];
            const self = this;
            this.$api.post('/add_device_func', param).then((res)=>{
                if(res.err_code == '0'){
                    self.$message.success('操作成功');
                    self.reqQueryDeviceFuncs(()=>{
                        self.refreshBitFuncObj(type);
                    });
                }else{
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err)
                });
        },
        reqDelDeviceFunc(type, bit){
            const param = new Object();
            param.device_type = type;
            param.func_bit = bit;
            const self = this;
            this.$api.post('/del_device_func', param).then((res)=>{
                if(res.err_code == '0'){
                    self.$message.success('操作成功');
                    self.reqQueryDeviceFuncs(()=>{
                        self.refreshBitFuncObj(type);
                    });
                }else{
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err)
                });
        },
        onTypeChange(val) {
            if (!val) {
                this.deviceName = '';
                this.bitFuncObj = {};
                this.clearFuncIptVals();
            } else {
                let type = val;
                this.deviceName = type;
                this.refreshBitFuncObj(type);
            }
        },

        refreshBitFuncObj(type){
            const bitFuncObj = new Object();
            const funcArr = this.deviceFunc[type] || [];
            for(let item of funcArr){
                bitFuncObj[item.bit] = item.name;
            }
            this.bitFuncObj = bitFuncObj;
            this.clearFuncIptVals();
        },

        clearFuncIptVals(){
            for(let i = 0; i < this.bitNameIptArr.length; i++){
                this.bitNameIptArr[i] = '';
            }
        },
    },
    mounted() {
        this.reqQueryDeviceType();
        this.reqQueryDeviceFuncs();
    },
};