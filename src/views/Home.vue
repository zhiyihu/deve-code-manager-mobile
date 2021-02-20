<template>
<a-layout id="components-layout-demo-responsive" style="height: 100vh">
    <a-layout-sider :style="{ overflowX: 'hidden',overflowY: 'auto', width: '220px', height: '100vh'}">
        <div class="logo logos" style="position: relative">
            <div class="system-title">
                <img src="../assets/logo.png" style="width: 28px; position: relative; bottom: 2px" />
                <span>注册码管理系统</span>
            </div>
        </div>
        <a-menu mode="inline" theme="dark" :default-selected-keys="['personal']" :default-open-keys="['person']" :style="asideMenuStyle" :open-keys="openKeys" @openChange="onOpenChange" :selectedKeys="selectKey">
            <template v-for="item in menuList">
                <a-sub-menu :key="item.key">
                    <span slot="title"><span class="iconfont" :class="item.icon" style="margin-right: 8px;"></span>{{item.title}}</span>
                    <a-menu-item v-for="sub in item.menus" :key="sub.key" @click="changeSelectKey(sub.key)">
                        <router-link :to="sub.link">{{sub.title}}</router-link>
                    </a-menu-item>
                </a-sub-menu>
            </template>
        </a-menu>
    </a-layout-sider>
    <a-layout>
        <a-layout-header :style="{ background: '#fff', padding: 0,position:'relative' }">
            <div class="user-head">
                <a-dropdown>
                    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()" style="color: #333">
                        <a-icon type="user" style="font-size: 24px" />
                        <span style="margin-left: 6px; font-size: 18px">{{
                loginName + (realName ? `(${realName})`: '')
              }}</span>
                    </a>
                    <a-menu slot="overlay" class="login-drop-down">
                        <a-menu-item>
                            <a href="javascript:;" @click="toPersonal">个人中心</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" @click="modifyPwd">修改密码</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" @click="loginout">退出</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </a-layout-header>
        <a-layout-content :style="{ margin: '16px 16px' }">
            <div style="padding: 0px;" :style="contentStyle">
                <router-view></router-view>
            </div>
        </a-layout-content>
         <a-modal width="420px" :centered="true" v-model="visible" title="修改密码" on-ok="handleOk">
                <template slot="footer">
                    <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
                    <a-button key="submit" type="primary" @click="handleOk">确认修改</a-button>
                </template>
                <div class="home-modify-pwd">
                    <span>用户名</span>
                    <a-input style="width: 240px;" :disabled="true" :value="loginName"></a-input>
                </div>
                <div class="home-modify-pwd">
                    <span>旧密码</span>
                    <a-input style="width: 240px;" :maxLength="24" type="password" v-model="oldPwd"></a-input>
                </div>
                <div class="home-modify-pwd">
                    <span>新密码</span>
                    <a-input style="width: 240px;" :maxLength="24" type="password" v-model="newPwd"></a-input>
                </div>
                <div class="home-modify-pwd">
                    <span>确认密码</span>
                    <a-input style="width: 240px;" :maxLength="24" type="password" v-model="confirmPwd"></a-input>
                </div>
            </a-modal>
    </a-layout>
</a-layout>
</template>

<script>
import {getMenus} from '../utils/menus';
export default {
    methods: {
        loginout() {
            const self = this;
            this.$api.logout().then(() => {
                sessionStorage.clear();
                self.$router.replace({
                    path: '/login'
                });
            }).catch(() => {
                sessionStorage.clear();
                self.$router.replace({
                    path: '/login'
                });
            });
        },

        toPersonal(){
            this.$router.replace({
                path: '/personal'
            });
        },

        modifyPwd(){
            this.visible = true;
            this.oldPwd = '';
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
                user: self.loginName,
                old_password: self.oldPwd,
                new_password: self.newPwd
            }).then(res => {
                if(res.err_code == '0'){
                    self.$message.success('密码修改成功');
                }else{
                    self.$message.error(res.err_msg);
                }
                self.visible = false;
            });
        },
        handleCancel() {
            this.visible = false;
        },
        changeSelectKey(key) {
            this.selectKey = [key];
        },
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find(
                (key) => this.openKeys.indexOf(key) === -1
            );
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys;
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        },

        reqUserInfo() {
            const self = this;
            this.$loading.show();
            this.$api.post("/query_user", {
                type: "0",
            }).then(res=>{
                if(res.err_code == '0'){
                    const user = res.users[0];
                    sessionStorage.setItem('user', JSON.stringify(user));
                    self.menuList = getMenus(user.permissions);
                    self.initMenuStatus();
                    self.realName = user.real_name;
                }
                self.$loading.hide();
            }).catch(()=>{
                self.$loading.hide();
            });
        },
        initMenuStatus(){
            //刷新的时候根据当前路由来匹配选中菜单
            const path = this.$route.path;
            const key = path.replace(/\//g, '') || 'personal';
            this.changeSelectKey(key);
            for (let item of this.menuList) {
                for (let menu of item.menus) {
                    if (menu.key == key) {
                        this.openKeys = [item.key];
                    }
                }
            }
        },
    },
    data() {
        return {
            asideMenuStyle: {},
            visible: false,
            realName: '',
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
            contentStyle: {
                background: "#fff",
                height: document.body.clientHeight - 100 + "px",
            },
            rootSubmenuKeys: ["person", "manager", "logs"],
            openKeys: ["person"],
            selectKey: ["personal"],
            loginName: sessionStorage.getItem("username"),
            menuList: [],
        }
    },
    watch:{
        $route(to){
            if("/" + this.selectKey[0] != to.path){
                this.initMenuStatus();
            }
        }
    },
    mounted() {
        const self = this;
        window.onresize = () => {
            self.contentStyle.height = document.body.clientHeight - 100 + "px";
        };
        this.reqUserInfo();
    },
};
</script>

<style>
@import url('../assets/iconfont/iconfont.css');

#components-layout-demo-responsive .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

.system-title {
    color: white;
    height: 60px;
    line-height: 60px;
    margin-left: 16px;
    margin-top: 10px;
    font-size: 20px;
}

.logos {
    background: none !important;
    width: 200px;
    margin: -8px !important;
    height: 64px !important;
}

.mheader {
    padding-left: 0px !important;
    position: relative;
}

.user-head {
    position: absolute;
    right: 46px;
    top: 0px;
    width: 300px;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
    text-align: right;
}

.home-modify-pwd{
    height: 54px;
}
.home-modify-pwd>span{
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 6px;
}
</style>
