
export default {
    data() {
        return {
           aesKey: '',
           token: '',
        };
    },
    methods: {
        submitModify() {
            const self = this;
            if (this.$util.checkNull([this.token, this.aesKey])) {
                this.$message.error('配置项不能为空');
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
            param.wx_gzh_aeskey = this.aesKey;
            param.wx_gzh_token = this.token;

            this.$api.post('/set_wx_gzh_info', param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(e => {
                self.$loading.hide();
                console.error(e);
            });
        },

        reqConfig() {
            const self = this;
            this.$api.post("/get_wx_gzh_info", {}).then(res => {
                if (res.err_code == 0) {
                    this.aesKey = res.wx_gzh_aeskey;
                    this.token = res.wx_gzh_token;
                } else {
                    self.$message.error(res.err_img);
                }
            }).catch(() => {});
        },

    },
    mounted() {
        this.reqConfig();
    },
};