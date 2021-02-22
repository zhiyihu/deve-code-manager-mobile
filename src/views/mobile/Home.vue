<template>
<a-layout id="components-layout-demo-responsive" style="height: 100vh;overflow:hidden;">
    <a-layout-sider :style="menuStyle">
        <div class="logo logos" style="position: relative">
            <div class="system-title">
                <img src="../../assets/logo.png" style="width: 28px; position: relative; bottom: 2px" />
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
    <a-layout :style="{paddingTop:'0px',flexShrink:'0',width:'100vw'}">
        <a-layout-header :style="{ background: '#fff', padding: 0,paddingLeft:'12px',paddingTop:'12px',position:'relative',width:'100vw',boxShadow: '0 0 6px 1px rgb(0 0 0 / 10%)'}">
            <a-button icon="menu" size="large" :style="menuBtnStyle" @click="showMenuSlide"></a-button>
            <a-button icon="close" size="large" :style="closeBtnStyle" @click="hideMenuSlide"/>
            <div class="user-head" :style="userHeadStyle">
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
        <a-layout-content :style="{ margin: '0px',background:'#fff' }">
            <div style="padding: 0px;" :style="contentStyle">
                <router-view></router-view>
            </div>
        </a-layout-content>
         <a-modal width="320px" :centered="true" v-model="visible" title="修改密码" on-ok="handleOk">
                <template slot="footer">
                    <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
                    <a-button key="submit" type="primary" @click="handleOk">确认修改</a-button>
                </template>
                <div class="home-modify-pwd">
                    <span>用户名</span>
                    <a-input style="width: 180px;" :disabled="true" :value="loginName"></a-input>
                </div>
                <div class="home-modify-pwd">
                    <span>旧密码</span>
                    <a-input style="width: 180px;" :maxLength="24" type="password" v-model="oldPwd"></a-input>
                </div>
                <div class="home-modify-pwd">
                    <span>新密码</span>
                    <a-input style="width: 180px;" :maxLength="24" type="password" v-model="newPwd"></a-input>
                </div>
                <div class="home-modify-pwd">
                    <span>确认密码</span>
                    <a-input style="width: 180px;" :maxLength="24" type="password" v-model="confirmPwd"></a-input>
                </div>
            </a-modal>
    </a-layout>
</a-layout>
</template>

<script>
import Home from '../js/Home';

export default {
  ...Home
}
</script>

<style>
@import url('../../assets/iconfont/iconfont.css');
@import url('../../assets/css/home.css');
</style>
