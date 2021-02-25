export default {
    data() {
        return {
           emailServer: '',
           emailPort: '',
           emailAccount: '',
           emailPwd: '',
           pwdType: 'password',
           isPwdShow: false,
        };
    },
    methods: {
        showPwd() {
            this.pwdType = 'text';
            this.isPwdShow = true;
        },
        hidePwd() {
            this.pwdType = 'password';
            this.isPwdShow = false;
        },
        submitModify() {
            const self = this;
            if (!this.$util.checkServer(this.emailServer)) {
                this.$message.error('url格式为xxxx://xxx.xxx.xxx');
                return false;
            }
            if (!this.$util.checkPort(this.emailPort)) {
                this.$message.error('端口范围1~65535');
                return false;
            }
            if (!this.$util.checkEmail(this.emailAccount)) {
                this.$message.error('邮箱格式不对');
                return false;
            }
            if (!this.$util.checkPwd(this.emailPwd)) {
                this.$message.error('密码须由字母数字符号组成，长度至少8位');
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
                    self.reqEmailConfigModify();
                },
                onCancel() {},
            });
        },
        
        reqEmailConfigModify() {
            const self = this;
            const param = new Object();
            param.email_server_addr = this.emailServer;
            param.email_server_port = this.emailPort;
            param.email_regist_code_sender = this.emailAccount;
            param.email_regist_code_password = this.emailPwd;

            this.$api.post('/set_erp_email_info', param).then(res => {
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

        reqEmailConfig() {
            const self = this;
            this.$api.post("/get_erp_email_info", {}).then(res => {
                if (res.err_code == 0) {
                    this.emailServer = res.email_server_addr;
                    this.emailPort = res.email_server_port;
                    this.emailAccount = res.email_regist_code_sender;
                    this.emailPwd = res.email_regist_code_password;
                } else {
                    self.$message.error(res.err_img);
                }
            }).catch(() => {});
        },

    },
    mounted() {
        this.reqEmailConfig();
    },
};