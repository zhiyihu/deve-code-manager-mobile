<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 'auto', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;padding: 0px;">
            <a-tabs v-if="codeList.length" :activeKey="currTypeIndex" @change="tabCallback">
                <a-tab-pane v-for="(item,index) in groupList" :key="index" :tab="item.tab">
                </a-tab-pane>
            </a-tabs>
            <div class="regist-machine-line">
                <div class="">全部主机个数：<span style="color: #1890ff;font-size: 20px;">{{codeList.length}}</span></div>
            </div>
            <div class="regist-machine-line">
                <div class="regist-machine-line-title">机号列表</div>
                <div class="regist-machine-list">
                    <div class="regist-machine-sn" v-for="(item, index) in showCodeList" :key="index">
                        <span style="width:auto;min-width:14px;">{{index + 1}}</span>
                        <img :src="item.pic" />
                        <span style="flex-grow:1;">{{item.value}}</span>
                        <button @click="bindDelCode(item.value)"><span class="iconfont icon-yichu" style="color:#18acff;font-size:18px;"></span></button>
                    </div>
                </div>
                <div class="regist-machine-list-addremove">
                    <a-button type="primary" icon="plus" @click="addDevice">添加机号</a-button>
                    <a-button type="primary" icon="scan" @click="showQrWin">扫码</a-button>
                    <a-button v-if="codeList.length" type="danger" @click="bindClearList">清空列表</a-button>
                </div>

            </div>
            <div class="regist-machine-line">
                <div class="regist-machine-line-title">当前主机所属公司：
                    <span v-if="deviceBelongCompany">{{deviceBelongCompany}}</span>
                    <span v-else style="color:red;">不存在的主机号</span>
                </div>
            </div>
            <div class="regist-machine-line">
                <div class="regist-machine-line-title">变更主机所属公司：
                    <a-select style="width: 240px;" default-value="" @change="onCompanyChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="regist-machine-submit">
                <a-button type="primary" @click="submitChangeCompany">变更公司</a-button>
            </div>
            <a-modal :width="520" :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">添加</a-button>
                </template>
                <div style="height: 240px;overflow: hidden;">
                    <a-textarea v-model="addDeviceSnListVal" placeholder="多个机号用换行或分号逗号等隔开" style="width: 480px;height: 210px;resize:none;" @change="codeStrChange"></a-textarea>
                    <div style="padding-top: 8px;">
                        <span>识别到{{machineNum}}个机号</span>
                    </div>
                </div>
            </a-modal>
            <a-modal :width="320" :centered="true" v-model="qrVisible" title="扫一扫">
                <template slot="footer">
                    <a-button key="back" @click="qrHandleCancel">取消</a-button>
                </template>
                <div style="height: 240px;overflow: hidden;">
                    <StreamBarcodeReader  @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
                </div>
            </a-modal>
        </div>
    </a-layout-content>

</a-layout>
</template>

<script>
import DeviceCompanyChange from '../js/DeviceCompanyChange';

export default {...DeviceCompanyChange}

</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
