<template>
<a-layout style="padding: 20px 0px 0px 0px; background: #fff; margin-bottom: 0px">
    <a-layout-content :style="{
        background: '#fff',
        padding: '0px 0px',
        margin: 'auto',
        minHeight: '280px',
      }">
        <div style="
          position: relative;
          border: 0px solid #e8e8e8;
          width: 598pt;
          margin: auto;
          padding: 0px;
        ">
            <div>
                <span>打印类型：</span>
                <a-radio-group default-value="0" button-style="solid" v-model="printType" @change="onPrintTypeChange">
                    <a-radio-button value="0">外箱标签</a-radio-button>
                    <!-- <a-radio-button value="1">板卡号</a-radio-button>
                    <a-radio-button value="2">装箱清单</a-radio-button> -->
                </a-radio-group>
                <span style="margin-left: 20px;">其他类型：</span>
                <a href="/print/print-cardnum.html" target="blank" style="margin-right: 20px;">板卡号</a>
                <a href="/print/print-bill.html" target="blank">支付证明单</a>
            </div>
            <div v-if="printType==0">
                <div class="prt-product-bill-opt-part">
                    <div>
                        <div class="code-line-two-part my-toprint-textarea-part">
                            <table class="my-print-code-table">
                                <tbody>
                                    <tr>
                                        <td colspan="2">
                                            <div class="top-prt-code-title">
                                                <img v-if="!isDontUseCompanyIcon" :src="bdtitle" style="border:1px solid #ccc;cursor:pointer" @click="selectIconImg" />
                                                <input v-model="companyTitle" style="border: 1px solid #ccc;margin-left:4px;width: 80pt;height:13pt;" placeholder="公司名" type="text" class="rowtitle-ipt" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productCodeTitle" type="text" class="rowtitle-ipt" /></td>
                                        <td><input v-model="productCodeVal" type="text" class="rowval-ipt" /></td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productNameTitle" type="text" class="rowtitle-ipt" /></td>
                                        <td><input v-model="productNameVal" type="text" class="rowval-ipt" /></td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productTypeTitle" type="text" class="rowtitle-ipt" /></td>
                                        <td><input v-model="productTypeVal" type="text" class="rowval-ipt" /></td>
                                    </tr>
                                    <tr>
                                        <td>S/N</td>
                                        <td>
                                            <div class="barcode-td-main">
                                                <div class="barcode-td-part">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productNumTitle" type="text" class="rowtitle-ipt" /></td>
                                        <td><input v-model="productNumVal" type="text" class="rowval-ipt" /></td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productCheckTitle" type="text" class="rowtitle-ipt" /></td>
                                        <td><input v-model="productCheckVal" type="text" class="rowval-ipt" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2"><input v-model="remarksText" type="text" class="rowval-ipt" style="width:240pt" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="my-toprint-textarea-part">
                        <a-textarea @change="onCodesTextsChange" v-model="codeStr" style="resize:none;height: 144pt;width:280pt;" placeholder="在此处输入机号，用任意符号分隔。不使用机号时，在此处输入要打印的标签个数（1~200）。"></a-textarea>
                    </div>
                </div>
                <div class="prt-table-param-line">
                    <span class="normal-icon-desc">常用公司图标</span>
                    <a-select style="width: 180px;margin-right:36px;" default-value="" @change="onCompanySelectChange">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option v-for="(item, index) in companyIconsSelectArr" :key="index" :value="index">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                    <a-checkbox @change="onUseCompanyIconChange">不使用公司图标</a-checkbox>
                    <a-checkbox v-model="isNotUseSN" @change="onUseSNChange">不使用机号</a-checkbox>
                </div>
            </div>
            <div v-else-if="printType==1" class="machine-card-num-part">
                <div class="create-card-num-line">
                    <span>起始编号：</span>
                    <a-input v-model="cardBeginOrder" placeholder="请输入10位板卡号" :maxLength="10" style="width: 200px;margin-right:18px;"></a-input>
                    <span>个数：</span>
                    <a-input v-model="cardNum" placeholder="1~999" :maxLength="3" style="width: 130px;margin-right:6px;" type="number"></a-input>
                    <a-button type="primary" @click="createCardListNum">生成连续板卡号</a-button>
                </div>
                <a-textarea placeholder="在此处输入板卡号，用任意符号分隔。" style="resize:none; height:144pt;" @change="onCodesTextsChange" v-model="cardCodeStr"></a-textarea>
            </div>
            <div v-else class="machine-card-num-part">
                <div class="create-card-num-line">
                    <div>
                        <a-select placeholder="可输入料号或最新名称筛选" style="width: 400px;" v-model="materialSelVal" show-search option-filter-prop="children" :filter-option="filterOption">
                            <a-select-option v-for="(item,index) in materials" :key="index" :value="item.materials_order">
                                {{ item.materials_order +"    "+ item.newest_name }}
                            </a-select-option>
                        </a-select>
                        <a-button @click="applyMaterial">添加</a-button>
                    </div>
                </div>
            </div>
            <div class="prt-bill-btns-line">
                <a-button v-if="codeArr.length" v-print="'#printMe'" style="margin-right: 14px;" type="primary" icon="printer">打印</a-button>
                <span>标签个数：{{codeArr.length}}，每页{{aPageNum}}个，共{{Math.ceil(codeArr.length / aPageNum)}}页（请设置打印边距为无，保证格式统一）</span>
            </div>
            <div class="print-code-main" v-if="printType==0">
                <div class="print-code-content" id="printMe">
                    <div class="code-line-two-part" v-for="(item, index) in codeArr" :key="index">
                        <table class="my-print-code-table">
                            <tbody>
                                <tr>
                                    <td colspan="2">
                                        <div class="top-prt-code-title">
                                            <img v-if="!isDontUseCompanyIcon" :src="bdtitle" />
                                            <span>{{companyTitle}}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{productCodeTitle}}</td>
                                    <td><input :value="productCodeVal" type="text" class="rowval-ipt" /></td>
                                </tr>
                                <tr>
                                    <td>{{productNameTitle}}</td>
                                    <td><input :value="productNameVal" type="text" class="rowval-ipt" /></td>
                                </tr>
                                <tr>
                                    <td>{{productTypeTitle}}</td>
                                    <td><input :value="productTypeVal" type="text" class="rowval-ipt" /></td>
                                </tr>
                                <tr>
                                    <td>S/N</td>
                                    <td>
                                        <div class="barcode-td-main">
                                            <div class="barcode-td-part">
                                                <img :id="'barcode' + index" />
                                                <div class="prt-code-bottom-text">{{ item }}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{productNumTitle}}</td>
                                    <td><input :value="productNumVal" type="text" class="rowval-ipt" /></td>
                                </tr>
                                <tr>
                                    <td>{{productCheckTitle}}</td>
                                    <td><input :value="productCheckVal" type="text" class="rowval-ipt" /></td>
                                </tr>
                                <tr>
                                    <td colspan="2"><input :value="remarksText" type="text" class="rowval-ipt" style="width:240pt" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="print-code-main" v-else-if="printType==1">
                <div class="print-code-content" id="printMe" style="padding-left:11pt;padding-top:14pt;">
                    <div class="code-line-six-part" v-for="(item, index) in codeArr" :key="index">
                        <div class="barcode-card-main">
                            <div class="barcode-card-part">
                                <img :id="'barcode' + index" />
                                <div class="prt-code-bottom-text-card">{{ item }}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="print-code-main" v-else>
                <div class="print-box-detail-content" id="printMe">
                    <div class="box-detail-title">装箱清单</div>
                    <table class="box-detail-table">
                        <tbody>
                            <tr>
                                <td style="width:40pt">序号</td>
                                <td style="width:100pt">产品料号</td>
                                <td style="width:170pt">名称</td>
                                <td style="width:80pt">规格</td>
                                <td style="width:40pt">数量(PCS)</td>
                                <td style="width:120pt">备注</td>
                            </tr>
                            <tr v-for="(item,index) in boxDetailTableData" :key="index">
                                <td>{{index + 1}}</td>
                                <td contenteditable="true">
                                    {{item[1]}}
                                </td>
                                <td contenteditable="true">{{item[2]}}</td>
                                <td contenteditable="true">{{item[3]}}</td>
                                <td contenteditable="true">{{item[4]}}</td>
                                <td contenteditable="true">{{item[5]}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="box-detail-print-date">
                        <span>打印日期： {{today}}</span>
                    </div>
                </div>
            </div>
            <div class="prt-bottom-bottom">
                <input id="my-input-file" style="display:none;" accept="image/*" @change="onFileChange" type="file" />
            </div>
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
import BarCodePrint from '../js/BarCodePrint'
export default {
    ...BarCodePrint
}
</script>

<style>
@import url("../../assets/css/manager.css");
@import url("../../assets/iconfont/iconfont.css");
</style>
