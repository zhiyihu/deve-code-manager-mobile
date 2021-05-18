<template>
<a-layout style="padding: 14px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8;padding: 0px;padding: 0px 14px; width: 100%;">
                <a-tabs default-active-key="1" :animated="false" tab-position="top">
                    
                    <a-tab-pane key="1" tab="制作清单" force-render>
                        <div class="salebill-create">
                            <div style="padding-left: 20px;padding-bottom: 10px;">
                                <span>常用联系人：</span>
                                <a-select default-value="" show-search option-filter-prop="children" :filter-option="filterOption" style="width: 250px" @change="onFreqContactsSelChange">
                                    <a-select-option value="">请选择</a-select-option>
                                    <a-select-option v-for="(item, index) in SaleFreqContactsResult" :key="index" :value="index">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                                <span style="margin-left:16px;">常用套装：</span>
                                <a-select default-value="" show-search option-filter-prop="children" :filter-option="filterOption" style="width: 250px" @change="onFreqMaterialChange">
                                    <a-select-option value="">请选择</a-select-option>
                                    <a-select-option v-for="(item, index) in SaleFreqMaterialResult" :key="index" :value="index">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div>
                                <div style="width: 595pt;position: relative;" class="zx-prts" id="zx-prts">
                                    <div class="single-prt-part">
                                        <span style="position: absolute;top:10px;left: 10px;" class="noprint"></span>
                                        <div style="text-align: center;font-size:15pt;padding-top: 30pt;">广州展讯信息科技有限公司--销售出库清单</div>
                                        <div style="display: flex; width: 550pt;margin:16pt auto 4pt auto;">
                                            <div style="width: 350pt;">
                                                <div class="xinfos">
                                                    <div>类别：</div>
                                                    <!-- <div style="width: 0pt;" class="head-data-1">
                                                        <input class="salebill-ipt" type="text"/>
                                                    </div> -->
                                                    <select name="" id="" v-model="tbHeadDatas[0]">
                                                        <option value="" selected>--请选择--</option>
                                                        <option value="销售" selected>销售</option>
                                                        <option value="客返维修">客返维修</option>
                                                        <option value="借用">借用</option>
                                                        <option value="样品">样品</option>
                                                        <option value="生产改装">生产改装</option>
                                                        <option value="调拔">调拔</option>
                                                        <option value="研发改装">研发改装</option>
                                                        <option value="赠送">赠送</option>
                                                    </select>
                                                </div>
                                                <div class="xinfos">
                                                    <div>销售代表：</div>
                                                    <!-- <div style="width: 150pt;" class="head-data-2">
                                                        <input class="salebill-ipt" type="text"/>
                                                    </div> -->
                                                    <select name="" id="" v-model="tbHeadDatas[1]">
                                                        <option value="" selected>--请选择--</option>
                                                        <option value="胡斯涛">胡斯涛</option>
                                                        <option value="郑晓琼">郑晓琼</option>
                                                        <option value="张小丽">张小丽</option>
                                                        <option value="鄢尤帅">鄢尤帅</option>
                                                        <option value="彭子威">彭子威</option>
                                                    </select>
                                                </div>
                                                <div class="xinfos">
                                                    <div>客户名称：</div>
                                                    <div class="head-data-3">
                                                        <input class="salebill-ipt" v-model="tbHeadDatas[2]" type="text" style="width: 380px;"/>
                                                    </div>
                                                </div>
                                                <div class="xinfos">
                                                    <div>送货地址：</div>
                                                    <div class="head-data-4">
                                                        <input class="salebill-ipt" v-model="tbHeadDatas[3]" type="text" style="width: 380px;"/>
                                                    </div>
                                                </div>
                                                <div class="xinfos-sp">
                                                    <div style="margin-right: 8pt;">
                                                        <span style="width: 46pt;">联系人：</span>
                                                        <span style="width: 80pt;" class="head-data-5">
                                                            <input class="salebill-ipt" type="text" v-model="tbHeadDatas[4]" style="width: 100px;"/>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>电话：</span>
                                                        <span style="width: 120pt;" class="head-data-6">
                                                            <input class="salebill-ipt" v-model="tbHeadDatas[5]" type="text"/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="width: 200pt;">
                                                <div>&nbsp;</div>
                                                <div class="xinfos-r">
                                                    <div>订单编号：</div>
                                                    <div  class="head-data-7">
                                                        <input class="salebill-ipt" v-model="tbHeadDatas[6]" type="text"/>
                                                    </div>
                                                </div>
                                                <div class="xinfos-r">
                                                    <div>出货编号：</div>
                                                    <div  class="head-data-8">
                                                        <input class="salebill-ipt" v-model="tbHeadDatas[7]" type="text"/>
                                                    </div>
                                                </div>
                                                <div class="xinfos-r">
                                                    <div>运输方式：</div>
                                                    <!-- <div  class="head-data-9">
                                                        <input class="salebill-ipt"  type="text"/>
                                                    </div> -->
                                                    <select name="" id="" v-model="tbHeadDatas[8]">
                                                        <option value="">--请选择--</option>
                                                        <option value="顺丰速运（寄付）">顺丰速运（寄付）</option>
                                                        <option value="顺丰速运（到付）">顺丰速运（到付）</option>
                                                        <option value="客户自提">客户自提</option>
                                                        <option value="送货上门">送货上门</option>
                                                        <option value="其他快递（寄付）">其他快递（寄付）</option>
                                                        <option value="其他快递（到付）">其他快递（到付）</option>
                                                    </select>
                                                </div>
                                                <div class="xinfos-r">
                                                    <div>快递单号：</div>
                                                    <div  class="head-data-10">
                                                        <input class="salebill-ipt" v-model="tbHeadDatas[9]" type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table style="margin: auto">
                                            <tbody>
                                                <tr>
                                                    <td style="width: 24pt;">序号</td>
                                                    <td style="width: 80pt;">产品料号</td>
                                                    <td style="width: 170pt;">名称</td>
                                                    <td style="width: 60pt;">规格</td>
                                                    <td style="width: 30pt;">数量</td>
                                                    <td style="width: 30pt;">单位</td>
                                                    <td style="width: 120pt;">备注</td>
                                                </tr>
                                                <tr v-for="(tr, i) in cBillTbArr" :key="i">
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][0]" style="width: 22pt"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][1]" style="width: 80pt"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][2]" style="width: 170pt"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][3]" style="width: 60pt"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][4]" style="width: 30pt"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][5]" style="width: 30pt"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" v-model="cBillTbArr[i][6]" style="width: 120pt"/>
                                                    </td>
                                                </tr>
                                              
                                            </tbody>
                                        </table>
                                        <div style="text-align: center;margin-top: 2pt;">签收时请确认外包装是否破损等表面质量问题，否则视为包装完好无损！（以下为空）</div>
                                        <div style="text-align: center;margin-top: 2pt;">注：第一联：存根（白）、第二联：财务（红）、第三联：回执（蓝）、第四联：客户（绿）、第五联：业务（黄）</div>
                                        <div style="display: flex;justify-content: center;margin-top: 3pt;">
                                            <div style="width: 120pt;">
                                                <span>制单人：</span>
                                                <span  style="display: inline-block;width:70pt;" class="head-data-20">
                                                     <input class="salebill-ipt" type="text" style="width: 70pt" v-model="realName"/>
                                                </span>
                                            </div>
                                            <div style="width: 120pt;">
                                                <span>审核人：</span>
                                                <span  style="display: inline-block;width:70pt;"></span>
                                            </div>
                                            <div style="width: 110pt;">
                                                <span>仓管：</span>
                                                <span  style="display: inline-block;width:70pt;"></span>
                                            </div>
                                            <div style="width: 130pt;">
                                                <span>客户签收/日期：</span>
                                                <span  style="display: inline-block;width:60pt;"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-left: 14px;padding-top: 4px;">
                                <a-button type="primary" @click="saveBill">保存单据</a-button>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="已保存单据">
                        <div>
                            <a-button type="primary" @click="querySaleBill">查询</a-button>
                            <a-button type="primary" style="margin-left:10px;" @click="exportPrint">导出打印单</a-button>
                            <a-button type="primary" style="margin-left:10px;" @click="exportAllBillExcel">导出汇总表格</a-button>
                        </div>
                        <div>
                            <div v-for="(item,index) in salebillRecords" :key="index">
                                {{item.createTime}}
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="常用联系人">
                        <a-button type="primary" style="margin-bottom: 12px;" @click="reqFreqContacts">查询</a-button>
                        <a-button type="primary" style="margin-bottom: 12px;margin-left: 10px;" @click="exportFreContactsTable">导出表格</a-button>
                        <div class="salebill-freq-contacts">
                            <div>
                                <div class="salebill-single" v-for="(item, index) in SaleFreqContactsResult" :key="index">
                                    <div class="salebill-freq-line">
                                        <div>序号</div>
                                        <div>第{{index + 1}}条</div>
                                    </div>
                                    <div class="salebill-freq-line">
                                        <div>名称</div>
                                        <div>{{item.name}}</div>
                                    </div>
                                     <div class="salebill-freq-line">
                                        <div>客户名称</div>
                                        <div>{{item.customer_name}}</div>
                                    </div>
                                    <div class="salebill-freq-line">
                                        <div>送货地址</div>
                                        <div>{{item.address}}</div>
                                    </div>
                                    <div class="salebill-freq-line">
                                        <div>联系人</div>
                                        <div>{{item.contacts}}</div>
                                    </div>
                                    <div class="salebill-freq-line">
                                        <div>电话</div>
                                        <div>{{item.phone}}</div>
                                    </div>
                                    <div class="salebill-edit-btns">
                                        <a-button @click="updateFreqContact(item)">修改</a-button>
                                        <a-button style="margin: 0px 10px 0px 10px" @click="delFreqContact(item)">删除</a-button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="salebill-opt-line">
                                    <span><i>*</i>名称</span>
                                    <a-input :disabled="FreqContactsOptType!='add'" style="width: 320px;" v-model="SaleFreqContactsName"></a-input>
                                </div>
                                <div class="salebill-opt-line">
                                    <span><i>*</i>客户名称</span>
                                    <a-input style="width: 320px;" v-model="SaleFreqContactsCustomerName"></a-input>
                                </div>
                                <div class="salebill-opt-line">
                                    <span><i>*</i>送货地址</span>
                                    <a-input style="width: 320px;" v-model="SaleFreqContactsAddr"></a-input>
                                </div>
                                <div class="salebill-opt-line">
                                    <span><i>*</i>联系人</span>
                                    <a-input style="width: 320px;" v-model="SaleFreqContactsContacts"></a-input>
                                </div>
                                <div class="salebill-opt-line">
                                    <span><i>*</i>电话</span>
                                    <a-input style="width: 320px;" v-model="SaleFreqContactsPhone"></a-input>
                                </div>
                                <div class="salebill-opt-line">
                                    <span></span>
                                    <div v-if="FreqContactsOptType == 'add'">
                                        <a-button type="primary" @click="addFreqContactReq">保存</a-button>
                                    </div>
                                    <div v-else>
                                        <a-button type="primary" @click="updateFreqContactReq">修改</a-button>
                                        <a-button @click="cancelUpdateFreqContact" style="margin-left: 10px;">取消</a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="常用套装">
                        <a-button type="primary" style="margin-bottom: 12px;" @click="reqFreqMaterials">查询</a-button>
                        <a-button type="primary" style="margin-bottom: 12px;margin-left: 10px;" @click="addFreqMaterial">添加</a-button>
                        <a-button type="primary" style="margin-bottom: 12px;margin-left: 10px;" @click="exportFreMaterialTable">导出表格</a-button>
                        
                        <div class="salebill-freq-contacts">
                            <div style="width: 1000px;">
                                <div class="salebill-single" v-for="(item, index) in SaleFreqMaterialResult" :key="index">
                                    <div style="padding-left: 12px">
                                        <div>No.{{index + 1}} {{item.name}}</div>
                                    </div>
                                    <div>
                                        <table class="freq-material-table">
                                            <tbody>
                                                <tr>
                                                    <td style="width: 50px;">序号</td>
                                                    <td style="width: 120px;">产品料号</td>
                                                    <td style="width: 300px;">名称</td>
                                                    <td style="width: 100px;">规格</td>
                                                    <td style="width: 60px;">数量</td>
                                                    <td style="width: 60px;">单位</td>
                                                    <td style="width: 220px;">备注</td>
                                                </tr>
                                                <tr v-for="(tritem, i) in item.tbitem" :key="i">
                                                    <td>{{i+1}}</td>
                                                    <td>{{tritem[0]}}</td>
                                                    <td>{{tritem[1]}}</td>
                                                    <td>{{tritem[2]}}</td>
                                                    <td>{{tritem[3]}}</td>
                                                    <td>{{tritem[4]}}</td>
                                                    <td>{{tritem[5]}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="salebill-edit-btns">
                                        <a-button @click="updateFreqMaterial(item)">修改</a-button>
                                        <a-button style="margin: 0px 10px 0px 10px" @click="delFreqMaterial(item)">删除</a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-tab-pane>
                </a-tabs>
        </div>
        <a-modal
          width="950px"
          :centered="true"
          v-model="visible"
          :title="modalTitle"
          on-ok="handleOk"
        >
          <template slot="footer">
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button
              key="submit"
              type="primary"
              @click="handleOk"
              >提交</a-button
            >
          </template>
          <div style="max-height: 680px; overflow: auto">
            <div style="margin-bottom: 10px;">
                <span><i style="color:red;margin-right: 2px;">*</i>套装名称</span>
                <a-input :disabled="freaMaterialOptType != 'add'" style="width: 320px;margin-left: 4px;" v-model="freqMaterialName"></a-input>
            </div>
            <div>
                <a-textarea style="height: 320px;resize:none;" v-model="freqMaterialObjText"></a-textarea>
            </div>
          </div>
        </a-modal>
    </a-layout-content>

</a-layout>
</template>

<script>
import OutsaleBill from '../js/OutsaleBill'
export default {
    ...OutsaleBill
}

</script>

<style>
@import url('../../assets/css/bill.css');

</style>

