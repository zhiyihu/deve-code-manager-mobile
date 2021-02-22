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
    }
}
