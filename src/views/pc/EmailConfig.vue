<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 'auto', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;padding: 0px;">
            <div class="regist-machine-line">
                <div class="z-system-setting-part">
                    <div class="z-system-setting-title">注册码推送邮件服务器参数</div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>服务器URL：</div>
                        <div><a-input v-model="emailServer" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>服务器端口：</div>
                        <div><a-input v-model="emailPort" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>邮件发送帐号：</div>
                        <div><a-input v-model="emailAccount" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>邮件发送密码：</div>
                        <div>
                            <a-input v-model="emailPwd" :type="pwdType" style="width: 384px;"></a-input>
                            <div class="eye-touch-part-content">
                            <div class="eye-touch-part" v-if="!isPwdShow" @click="showPwd">
                                <a-icon type="eye"  style="font-size: 16px;"/>
                            </div>
                            <div class="eye-touch-part" v-else @click="hidePwd">
                                <a-icon type="eye-invisible" style="font-size: 16px;"/>
                            </div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="regist-machine-submit">
                        <a-button type="primary" @click="submitModify">提交修改</a-button>
                    </div>
                </div>
            </div>
        </div>
    </a-layout-content>

</a-layout>
</template>

<script>
import EmailConfig from '../js/EmailConfig';

export default {...EmailConfig}

</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
