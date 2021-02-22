<template>
    <div class="main">
		<div class="content">
			<div class="login">
                <div class="login-head">
                    <img src="../../assets/logo.png"/>
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
import Login from '../js/Login';

export default {
  ...Login
}

</script>
<style lang="css">
    @import url('../../assets/css/login.css');
</style>