<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 100vw;padding: 0px 16px;">
            <div>
                <div class="z-system-setting-part">
                    <div class="z-system-setting-title">设备生产入库默认做码信息</div>
                    <div class="z-system-setting-line">
                        <div>设备类型：</div>
                        <div>
                             <a-select style="width: 100%;" default-value="" @change="onTypeChange">
                                <a-select-option value="">请选择</a-select-option>
                                <a-select-option v-for="(item, index) in deviceTypeObjArr" :key="index" :value="index">
                                    {{item.name + ' - ' + item.sn_flag}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>

                     <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>设备图标：</div>
                        <div>
                            <img v-if="imgUrl" style="width: 64px;height: 43px;border: 1px solid #eee;margin-right: 10px;" :src="imgUrl"/>
                            <a-button :key="btnKey" style="position:relative;width: 120px;">
                                <a-icon type="upload"/>
                                上传图片
                                <input accept="image/*" type="file" style="height: 32px;width: 120px;opacity: 0;position: absolute;left:0px;top: 0px;z-index:99;" @change="onFileChange"/>
                            </a-button>
                            <span>（推荐尺寸64*43）</span>
                        </div>
                    </div>
                    <div style="height: 20px;"></div>

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
import DeviceImgConfig from '../js/DeviceImgConfig';

export default {...DeviceImgConfig}

</script>

<style>
@import url('../../assets/css/manager-mobile.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
