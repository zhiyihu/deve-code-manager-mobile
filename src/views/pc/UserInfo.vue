<template>
<div class="user-main">

    <div class="user-content">
        <div class="face-head">
            <div class="face-head-photo">
                <img src="https://devecent-web.oss-cn-shenzhen.aliyuncs.com/erp_web/img/head.png" />
            </div>
        </div>
        <div class="user-base-info">
            <div class="user-base-info-line">
                <div class="base-info-title">用户名</div>
                <div class="base-info-value">{{user}}</div>
            </div>
            <div class="user-base-info-line">
                <div class="base-info-title">姓名</div>
                <div class="base-info-value">
                    {{realName}}
                </div>
            </div>
            <div class="user-base-info-line">
                <div class="base-info-title">电话</div>
                <div class="base-info-value">
                    <input v-model="telephone" />
                    <img src="https://devecent-web.oss-cn-shenzhen.aliyuncs.com/erp_web/img/edit.png" />
                </div>
            </div>
            <div class="user-base-info-line">
                <div class="base-info-title">邮箱</div>
                <div class="base-info-value">
                    <input v-model="email" />
                    <img src="https://devecent-web.oss-cn-shenzhen.aliyuncs.com/erp_web/img/edit.png" />
                </div>
            </div>
            <div class="user-base-info-line">
                <div class="base-info-title">所属公司</div>
                <div class="base-info-value">{{companyName}}</div>
            </div>
            <div class="user-base-info-line">
                <div class="base-info-title">最大注册天数</div>
                <div class="base-info-value">{{maxActDay}}</div>
            </div>
            <div class="userinfo-modify-part">
                <a-button type="primary" @click="bindModifyUserInfo">提交修改</a-button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import UserInfo from '../js/UserInfo';

export default {
  ...UserInfo
}
</script>

<style scoped>
@import url('../../assets/css/personal.css');
</style>
