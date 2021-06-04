<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 100vw;padding: 0px 16px;">
            <a-radio-group default-value="0" button-style="solid" v-model="topOptType">
                <a-radio-button value="0">变更品牌</a-radio-button>
                <a-radio-button value="1">管理主机品牌</a-radio-button>
            </a-radio-group>
            <div v-if="topOptType==0">
                <a-tabs v-if="codeList.length" :activeKey="currTypeIndex" @change="tabCallback">
                    <a-tab-pane v-for="(item,index) in groupList" :key="index" :tab="item.tab">
                    </a-tab-pane>
                </a-tabs>
                <div class="regist-machine-line">
                    <div class="">
                        <span>全部主机个数：</span>
                        <span style="color: #1890ff;font-size: 20px;">{{codeList.length}}</span>
                        <span style="margin-left: 48px;">更新到设备个数：</span>
                        <span style="color: #1890ff;font-size: 20px;">{{updateToDeviceCount}}</span>
                    </div>
                </div>
                <div class="regist-machine-line">
                    <div class="regist-machine-list-addremove">
                        <a-button type="primary" icon="plus" @click="addDevice">添加机号</a-button>
                        <a-button type="primary" icon="scan" @click="showQrWin">扫码</a-button>
                        <a-button v-if="codeList.length" type="danger" @click="bindClearList">清空列表</a-button>
                    </div>
                    <div style="min-height: 300px;max-height: 300px;overflow:auto;border: 1px solid #ddd;padding: 10px;margin: 10px 0px">
                        <table class="brand-change-table" v-if="showCodeList.length">
                            <tbody>
                                <tr style="background: #f8f8f8">
                                    <td>序号</td>
                                    <td>图标</td>
                                    <td>机号</td>
                                    <td>操作</td>
                                </tr>
                                <tr v-for="(item, index) in showCodeList" :key="index">
                                    <td>{{index + 1}}</td>
                                    <td><img :src="item.pic" style="width: 48px;height:32px;"/></td>
                                    <td>{{item.value}}</td>
                                    <td><a href="javascript:;" @click="bindDelCode(item.value)">移除</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="regist-machine-line">
                    <div class="regist-machine-line-title">当前主机所属公司：
                        <span v-if="deviceBelongCompany">{{deviceBelongCompany}}</span>
                        <span v-else style="color:red;">不存在的主机号</span>
                    </div>
                </div>
                <div class="regist-machine-line">
                    <div class="regist-machine-line-title">品牌公司：
                        <a-select style="width: 240px;" default-value="" @change="onCompanyChange" v-model="modfCompanyId" >
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="regist-machine-line">
                    <div class="regist-machine-line-title">品牌型号：
                        <a-select style="width: 240px;" default-value="" v-model="brandSelId">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="(item, index) in brandSelArr" :key="index" :value="item.brand_id">
                                {{item.dealer_brand}} <span style="margin-left:10px;"></span> {{item.dealer_mode}}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="regist-machine-submit">
                    <a-button type="primary" @click="submitChangeCompany">变更品牌</a-button>
                </div>
            </div>
            <div v-else>
                <div style="margin-top:12px; margin-bottom: 12px;">
                    <span>机型：</span>
                    <a-select  style="width: 240px;" default-value="" v-model="searchDeviceType">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in deviceTypeSelectArr" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
                <div style="margin-bottom: 12px;">
                    <span>公司：</span>
                    <a-select style="width: 240px;" default-value="" v-model="searchCompanyId">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </div>
                <div>
                    <a-button type="primary" icon="search" style="margin-left: 12px;" @click="reqData">查询</a-button>
                    <a-button type="primary" icon="plus" style="margin-left: 12px" @click="addItem">添加</a-button>
                </div>
                <div class="table-bottom-page-count">一共有{{total}}条数据，每页{{pageSize}}条，当前第{{current}}页</div>
                <div>
                    <div v-for="(item,index) in data.slice(current*pageSize-pageSize,current*pageSize)" :key="index" class="table-info-part">
                        
                        <div class="table-info-order-line">
                            {{item.order}}
                        </div>
                        <div class="table-info-line">
                            <div>机型：</div>
                            <div>{{item.device_type}}</div>
                        </div>
                        <div class="table-info-line">
                            <div>公司：</div>
                            <div>{{item.company_name}}</div>
                        </div>
                        <div class="table-info-line">
                            <div>品牌：</div>
                            <div>{{item.dealer_brand}}</div>
                        </div>
                        <div class="table-info-line">
                            <div>型号：</div>
                            <div>{{item.dealer_mode}}</div>
                        </div>
                        <div class="table-info-optbtns">
                            <a href="javascript:;" class="table-opt-alink" @click="del(item);">删除</a>
                        </div>
                    </div>
                </div>
        
                <a-pagination show-size-changer style="margin-top: 24px;margin-bottom: 20px;" :page-size="pageSize" @change="onPageChange" v-model="current" :total="total" :show-total="(total) => ``" show-less-items>
                </a-pagination>
            </div>
            <a-modal :width="320" :centered="true" v-model="brandVisible" :title="brandModalTitle" on-ok="brandHandleOk">
                <template slot="footer">
                    <a-button key="back" @click="brandHandleCancel">取消</a-button>
                    <a-button key="submit" type="primary" @click="brandHandleOk">提交</a-button>
                </template>
                <div style="max-height: 660px; overflow: auto">

                    <div class="amodal-edit-line">
                        <span><i>*</i>型号：</span>
                        <a-select  style="width: 180px;" default-value="" v-model="modalDeviceType">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="(item, index) in deviceTypeSelectArr" :key="index" :value="item">
                                {{item}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>公司：</span>
                        <a-select  style="width: 180px;" default-value="" v-model="modalCompanyId">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="(item, index) in companySelectArr" :key="index" :value="item.company_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>品牌</span>
                        <a-input style="width: 180px" :maxLength="20" v-model="dealerBrand"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>型号</span>
                        <a-input style="width: 180px" :maxLength="30" v-model="dealerModel"></a-input>
                    </div>
                </div>
            </a-modal>
            <a-modal :width="320" :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
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
import DeviceBrandChange from '../js/DeviceBrandChange';

export default {...DeviceBrandChange}

</script>

<style>
@import url('../../assets/css/manager-mobile.css');
@import url('../../assets/iconfont/iconfont.css');
</style>
