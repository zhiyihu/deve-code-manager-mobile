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
                    <a-radio-button value="1">板卡号</a-radio-button>
                </a-radio-group>
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
                                                <img v-if="!isDontUseCompanyIcon" :src="bdtitle" style="border:1px solid #ccc;cursor:pointer" @click="selectIconImg"/>
                                                <input v-model="companyTitle" style="border: 1px solid #ccc;margin-left:4px;width: 80pt;height:13pt;" placeholder="公司名" type="text" class="rowtitle-ipt"/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productCodeTitle" type="text" class="rowtitle-ipt"/></td>
                                        <td><input v-model="productCodeVal" type="text" class="rowval-ipt"/></td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productNameTitle" type="text" class="rowtitle-ipt"/></td>
                                        <td><input v-model="productNameVal" type="text" class="rowval-ipt"/></td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productTypeTitle" type="text" class="rowtitle-ipt"/></td>
                                        <td><input v-model="productTypeVal" type="text" class="rowval-ipt"/></td>
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
                                        <td><input v-model="productNumTitle" type="text" class="rowtitle-ipt"/></td>
                                        <td><input v-model="productNumVal" type="text" class="rowval-ipt"/></td>
                                    </tr>
                                    <tr>
                                        <td><input v-model="productCheckTitle" type="text" class="rowtitle-ipt"/></td>
                                        <td><input v-model="productCheckVal" type="text" class="rowval-ipt"/></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2"><input v-model="remarksText" type="text" class="rowval-ipt"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="my-toprint-textarea-part">
                        <a-textarea @change="onCodesTextsChange" v-model="codeStr" style="resize:none;height: 144pt;width:280pt;" placeholder="在此处输入机号，用任意符号分隔"></a-textarea>
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
                </div>
            </div>
            <div v-if="printType==1" class="machine-card-num-part">
                <div class="create-card-num-line">
                    <span>起始编号：</span>
                    <a-input v-model="cardBeginOrder" placeholder="请输入10位板卡号" :maxLength="10" style="width: 200px;margin-right:18px;"></a-input>
                    <span>个数：</span>
                    <a-input v-model="cardNum" placeholder="1~999" :maxLength="3" style="width: 130px;margin-right:6px;" type="number"></a-input>
                    <a-button type="primary" @click="createCardListNum">生成连续板卡号</a-button>
                </div>
                <a-textarea placeholder="在此处输入板卡号，用任意符号分隔" style="resize:none; height:144pt;" @change="onCodesTextsChange" v-model="cardCodeStr"></a-textarea>
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
                                    <td><input :value="productCodeVal" type="text" class="rowval-ipt"/></td>
                                </tr>
                                <tr>
                                    <td>{{productNameTitle}}</td>
                                    <td><input :value="productNameVal" type="text" class="rowval-ipt"/></td>
                                </tr>
                                <tr>
                                    <td>{{productTypeTitle}}</td>
                                    <td><input :value="productTypeVal" type="text" class="rowval-ipt"/></td>
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
                                    <td><input :value="productNumVal" type="text" class="rowval-ipt"/></td>
                                </tr>
                                <tr>
                                    <td>{{productCheckTitle}}</td>
                                    <td><input :value="productCheckVal" type="text" class="rowval-ipt"/></td>
                                </tr>
                                <tr>
                                    <td colspan="2"><input :value="remarksText" type="text" class="rowval-ipt"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="print-code-main" v-if="printType==1">
                <div class="print-code-content" id="printMe">
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
            <div class="prt-bottom-bottom">
                <input id="my-input-file" style="display:none;" accept="image/*" @change="onFileChange" type="file"/>
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
