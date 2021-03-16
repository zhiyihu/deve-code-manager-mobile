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
                <div class="regist-machine-line-title">激活天数（{{maxActText}}）</div>
                <div class="regist-machine-time">
                    <a-radio-group v-model="regTimeVal" @change="onRegTimeChange">
                        <a-radio-button v-for="(item, index) in actTimesArr" :key="index" :value="item.val">
                            {{item.name}}
                        </a-radio-button>
                    </a-radio-group>
                    <span class="regist-machine-tipspan" v-if="activeDays<=9999">
                        <span class="machine-passday-div" :style="actIptStyle">
                            <a-input v-model="activeDays" style="width:90px;" type="number" @change="onActiveDaysInput" @blur="onActiveDaysBlur"></a-input>
                        </span>
                        <span style="margin-left:6px">天</span>
                    </span>
                </div>
                <div class="regist-machine-passday" v-if="activeDays<=9999">
                    <div class="machine-passday-div" :style="dateStyle">
                        <a-date-picker :allowClear="false" :inputReadOnly="true" v-model="actPassDay" :disabled-date="disabledDate" @change="onDateChange" style="width: 180px;" />
                    </div>
                    <span class="regist-machine-tipspan">到期</span>
                </div>
            </div>
            
            <div class="regist-machine-line" v-if="deviceFuncOptions.length">
                <div class="regist-machine-line-title">主机功能</div>
                <div class="regist-machine-funclist">
                    <a-checkbox-group v-model="regFuncVal" name="checkboxgroup" :options="deviceFuncOptions" />
                </div>
            </div>

            <div class="regist-machine-line">
                <div class="regist-machine-line-title">注册原因</div>
                <div class="regist-machine-funclist">
                    <a-radio-group v-model="regReasonVal">
                        <a-radio-button v-for="(item,index) in actReasonArr" :key="index" :value="item">
                            {{item}}
                        </a-radio-button>
                    </a-radio-group>
                </div>
            </div>
            
            <div class="regist-machine-submit">
                <a-button type="primary" @click="submitRegist">申请注册</a-button>
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
            <a-modal :width="520" :centered="true" v-model="regResVisible" :title="regResModalTitle">
                <template slot="footer">
                    <a-button :visible="false" key="back" @click="regResHandleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" class="copy" :data-clipboard-text="copyText" @click="regResHandleOk">复制全部结果</a-button>
                </template>
                <div style="min-height: 220px;max-height: 300px;padding: 0px 14px;overflow: auto;">
                    <div class="code-list-detail" v-for="(item,index) in registResArr" :key="index">
                        <div class="machine-line-info">
                            <div>序号：</div>
                            <div><span user-select="true">第{{index + 1}}条</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>机号：</div>
                            <div><span user-select="true">{{item.sn}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>机型：</div>
                            <div><span user-select="true">{{item.type}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>注册码：</div>
                            <div><span user-select="true">{{item.codeShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>注册天数：</div>
                            <div><span user-select="true">{{item.daysShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>到期时间：</div>
                            <div><span user-select="true">{{item.passDayShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>主机功能：</div>
                            <div><span user-select="true">{{item.funcShow}}</span></div>
                        </div>
                        <div class="machine-line-info">
                            <div>操作人：</div>
                            <div><span user-select="true">{{item.user}}</span></div>
                        </div>
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
import CodeRegist from '../js/CodeRegist';

export default {...CodeRegist}
</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
