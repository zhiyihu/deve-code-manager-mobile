<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 'auto', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;padding: 0px;">
            <div class="regist-machine-line">
                <div class="z-system-setting-part">
                    <div class="z-system-setting-title">设备生产入库默认做码信息</div>
                    <div class="z-system-setting-line">
                        <div>设备类型：</div>
                        <div>
                            <a-select show-search option-filter-prop="children" :filter-option="filterOption" style="width: 420px;" default-value="" @change="onTypeChange">
                                <a-select-option value="">请选择</a-select-option>
                                <a-select-option v-for="(item, index) in deviceTypeObjArr" :key="index" :value="index">
                                    {{item.name + ' - ' + item.sn_flag}}
                                </a-select-option>
                            </a-select>
                    </div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>默认注册天数：</div>
                        <div><a-input v-model="regDay" placeholder="1~10000" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line">
                        <div><span class="not-empty-span">*</span>默认功能码：</div>
                        <div><a-input disabled v-model="defaultFuncCode" style="width: 420px;"></a-input></div>
                    </div>
                    <div class="z-system-setting-line z-system-checkbox-part" v-if="deviceFuncOptions.length">
                        <div></div>
                        <div><a-checkbox-group style="width: 420px;" v-model="regFuncVal" name="checkboxgroup" :options="deviceFuncOptions" @change="onFuncsCheckBoxChange"/></div>
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
import DeviceTypeConfig from '../js/DeviceTypeConfig';

export default {...DeviceTypeConfig}




</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
