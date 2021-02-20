<template>
    <div class="main">
		<div class="content">
			<div class="login">
                <div class="login-head">
                    <img src="../assets/logo.png"/>
                    <span>注册码管理系统</span>
                </div>
				<div class="login-content">
					<div class="login-title">用户登录</div>
					<div class="login-line">
						<a-icon type="user" style="font-size: 16px;"/>
						<input v-model="username" type="text" :maxLength="24" autocomplete="off" placeholder="用户名"/>
					</div>
					<div class="login-line">
						<a-icon type="lock" style="font-size: 16px;"/>
						<input v-model="password" :type="pwdType" :maxLength="24" autocomplete="off" placeholder="密码" @keyup.enter="loginUser"/>
                        <a-icon type="eye" v-if="!isPwdShow" style="font-size: 16px;cursor: pointer;" @mousedown="showPwd" @mouseup="hidePwd" @mouseleave="hidePwd"/>
                        <a-icon type="eye-invisible" v-if="isPwdShow" style="font-size: 16px;cursor: pointer;" @mousedown="showPwd" @mouseup="hidePwd" @mouseleave="hidePwd"/>
					</div>
					<div class="login-button-line">
						<a-button type="primary" @click="loginUser">登录</a-button>
					</div>
				</div>
			</div>
		</div>
         <a-modal width="430px" :centered="true" v-model="visible" title="初始化密码" on-ok="handleOk">
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
            </template>
            <div class="changepwd-edit-line">
                <span>用户名</span>
                <a-input style="width: 280px;" v-model="username" :disabled="true"></a-input>
            </div>
            <div class="changepwd-edit-line">
                <span>初始密码</span>
                <a-input type="password" :maxLength="24" style="width: 280px;" v-model="newPwd"></a-input>
            </div>
            <div class="changepwd-edit-line">
                <span>确认密码</span>
                <a-input type="password" :maxLength="24" style="width: 280px;" v-model="confirmPwd" @keyup.enter="handleOk"></a-input>
            </div>
           
        </a-modal>
	</div>
</template>

<script>
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

</script>
<style lang="css">
    @import url('../assets/css/login.css');
    .changepwd-edit-line{
        height: 60px;
        line-height: 60px;
    }
    .changepwd-edit-line>span{
        display: inline-block;
        width: 60px;
        text-align: right;
        margin-right: 20px;
    }
</style>