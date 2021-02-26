import DeveCodeCommon from './DeveCodeCommon'
export default {
    extends: DeveCodeCommon,
    data() {
        return {
            deviceTypeObjArr: [],
            deviceName: '',
            deviceFlag: '',
            imgUrl: '',
            deviceImgObj: {},
            btnKey: '',
        };
    },
    methods: {
        onFileChange(e){
            const self = this;
            let files = e.target.files;
            if(files && files.length){
                var reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = function () {
                    var base = reader.result;
                    self.imgUrl = base;
                }
        
            }
        },
        
        onTypeChange(val) {
            this.btnKey = 'zx' + val;
            val = val + '';
            if (!val) {
                this.deviceName = '';
                this.deviceFlag = '';
                this.imgUrl = '';
            } else {
                let index = val;
                const item = this.deviceTypeObjArr[index];
                let imgage_base64 = this.deviceImgObj[item.name + '-' + item.sn_flag];
                this.deviceName = item.name;
                this.deviceFlag = item.sn_flag;
                this.imgUrl = (imgage_base64 ? 'data:image/png;base64,' + this.deviceImgObj[item.name + '-' + item.sn_flag] : '');
            }
        },

        submitModify() {
            const self = this;
            if (this.$util.checkNull([this.deviceName])) {
                this.$message.error('设备类型不能为空');
                return false;
            }

            if (this.$util.checkNull([this.imgUrl])) {
                this.$message.error('图片不能为空');
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
            param.device_flag = this.deviceFlag.toString();
            param.image_base64 = this.imgUrl.split(';base64,')[1];

            this.$api.post('/update_device_image', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqDeviceTypeImgs();
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(e => {
                self.$loading.hide();
                console.error(e);
            });
        },
        
        reqDeviceTypeImgs() {
            const self = this;
            self.$loading.show();
            this.$api.post("/query_device_image", {}).then(res => {
                if (res.err_code == 0) {
                    const deviceImgObj = new Object();
                    for(let item of res.device_images){
                        deviceImgObj[item.name + '-' + item.sn_flag] = item.image_base64;
                    }
                    self.deviceImgObj = deviceImgObj;
                } else {
                    self.$message.error(res.err_img);
                }
                self.$loading.hide();
            }).catch(() => {
                self.$loading.hide();
            });
        },



    },
    mounted() {
        this.reqQueryDeviceType();
        this.reqDeviceTypeImgs();
    },
};