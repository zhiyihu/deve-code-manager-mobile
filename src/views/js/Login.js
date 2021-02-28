export default {
     data() {
        return {
            isPwdShow: false,
            pwdType: 'password',
            visible: false,
            username: '',
            password: '',
            newPwd: '',
            confirmPwd: '',
            loading: false,
            resetPwdVisible: false,
            resetPwdUname: '',
            emailAddr: '',
            verifyEmailCode: '',
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
        loginUser() {
            const username = this.username.replace(/\s/g, '');
            const password = this.password.replace(/\s/g, '');
            if(!username){
                this.$message.error('用户名为空');
                return;
            }
            const clientTime = this.$util.getFmtTimeStr(new Date());
            const self = this;
            this.$api.login({
                user: username,
                password: password,
                client_time: clientTime
            }).then(res => {
                if(res.err_code == '0'){
                    sessionStorage.setItem('token', res.token);
                    sessionStorage.setItem('login_time', res.server_time);
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('password', password);
                    this.$router.replace({path: '/'});
                }else if(res.err_code == '306'){
                    this.showSetPwdModal();
                } else {
                    self.$message.error(res.err_msg);
                }
                self.password = '';
            }).catch(()=>{
                self.$message.error("请求异常");
            });
        },
        showSetPwdModal() {
            this.visible = true;
            this.newPwd = '';
            this.confirmPwd = '';
        },
        handleOk() {
            const self = this;
            if(!this.$util.checkPwd(this.newPwd)){
                this.$message.error('密码必须有字母、数字、符号，长度8~20');
                return;
            }
            if(this.newPwd != this.confirmPwd){
                this.$message.error('两次输入密码不一致');
                return;
            }
            this.$api.post('/change_password',{
                user: self.username,
                old_password: '',
                new_password: self.newPwd
            }).then(res => {
                if(res.err_code == '0'){
                    self.$message.success('密码初始化成功');
                }else{
                    self.$message.error('初始化失败');
                }
                self.visible = false;
            });
        },
        handleCancel() {
            this.visible = false;
        },

        showResetPwdModal(){
            this.resetPwdUname = '';
            this.emailAddr = '';
            this.verifyEmailCode = '';
            this.resetPwdVisible = true;
        },
        handleResetPwdOk() {
            // const self = this;
            // if(!this.$util.checkPwd(this.newPwd)){
            //     this.$message.error('密码必须有字母、数字、符号，长度8~20');
            //     return;
            // }
            // if(this.newPwd != this.confirmPwd){
            //     this.$message.error('两次输入密码不一致');
            //     return;
            // }
            if(this.$util.checkNull([this.resetPwdUname, this.verifyEmailCode])){
                this.$message.error('用户名和验证码不能为空');
                return;
            }
            // this.$api.post('/xxx',{
            //     param: 'param'
            // }).then(res => {
            //     if(res.err_code == '0'){
            //         self.$message.success('重置密码成功');
            //     }else{
            //         self.$message.error(res.err_msg);
            //     }
                
            // });
            this.resetPwdVisible = false;
        },
        handleResetPwdCancel() {
            this.resetPwdVisible = false;
        },

        sendVerifyEmail(){
            if(this.$util.checkNull([this.resetPwdUname])){
                this.$message.error('用户名不能为空');
                return;
            }
            if (!this.$util.checkEmail(this.emailAddr)) {
                this.$message.error('邮箱格式不对');
                return;
            }
            if(!this.sendEmailTime){
                this.sendEmailTime = new Date().getTime();
            }else if((new Date().getTime() - this.sendEmailTime < 30000)){
                this.$message.info('邮件已发送，请30秒后再操作');
                return;
            }
            this.$api.post('/xxx',{
                param: 'param'
            }).then(res => {
                if(res.err_code == '0'){
                    self.$message.success('邮件发送成功');
                }else{
                    self.$message.error(res.err_msg);
                }
                
            });
        }
    }
}
