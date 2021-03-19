<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 'auto', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;padding: 0px;">
            <div class="regist-machine-line">
                <div class="z-system-setting-part">
                    <div class="z-system-setting-title">设备功能码信息</div>
                    <div class="z-system-setting-line">
                        <div>设备类型：</div>
                        <div>
                            <a-select show-search option-filter-prop="children" :filter-option="filterOption" style="width: 420px;" default-value="" @change="onTypeChange">
                                <a-select-option value="">请选择</a-select-option>
                                <a-select-option v-for="(item, index) in deviceTypeSelectArr" :key="index" :value="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    
                    <div class="z-system-setting-line z-system-setting-line-func">
                        <div><span class="not-empty-span">*</span>设备功能：</div>
                        <div class="config-bit-funcs-part">
                            <div class="config-bit-funcs" v-for="(item,index) in bits" :key="index">
                                <div class="config-bit-name">Bit {{index}}</div>
                                <div class="config-bit-info">
                                    <span v-if="bitFuncObj[index]">{{bitFuncObj[index]}}</span>
                                    <input v-else type="text" v-model="bitNameIptArr[index]"/>
                                </div>
                                <div>
                                    <button v-if="bitFuncObj[index]" class="config-bit-btn config-bit-del-btn" @click="bindDelBitFunc(index)">
                                        <a-icon type="delete"/>
                                    </button>
                                    <button v-else class="config-bit-btn config-bit-add-btn" @click="bindAddBitFunc(index)">
                                        <a-icon type="plus-circle" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </a-layout-content>

</a-layout>
</template>

<script>
import DeviceFuncConfig from '../js/DeviceFuncConfig';

export default {...DeviceFuncConfig}

</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');

</style>
