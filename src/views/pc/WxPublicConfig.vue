<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 'auto', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;padding: 0px;">
            <div class="regist-machine-line">
                <div class="z-system-setting-part">
                    <div class="z-system-setting-title">微信公众号参数</div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>公众号token：</div>
                        <div><a-input v-model="token" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>公众号AESKey：</div>
                        <div><a-input v-model="aesKey" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>公众号appId：</div>
                        <div><a-input v-model="appId" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>公众号Secret：</div>
                        <div><a-input v-model="secret" style="width: 420px;"></a-input></div>
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
import WxPublicConfig from '../js/WxPublicConfig';

export default {...WxPublicConfig}


</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
