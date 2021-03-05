<template>
<a-layout style="padding: 20px 0px 0px 0px;background:#fff;margin-bottom:0px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 'auto', minHeight: '280px' }">
        <div style="position: relative;border: 0px solid #e8e8e8; width: 900px;padding: 0px;">
            <div class="print-code-content">
                <div class="code-line-two-part" v-for="(item,index) in codeArr" :key="index">
                    <table class="my-print-code-table">
                        <tbody>
                            <tr>
                                <td colspan="2">
                                    <div>
                                        <img src="../../assets/bdlogo.png" />
                                        <span>北斗星通</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>产品编码</td>
                                <td>1011014600107</td>
                            </tr>
                            <tr>
                                <td>产品名称</td>
                                <td>全系统全频点GNSS高精度基准站接收机</td>
                            </tr>
                            <tr>
                                <td>产品型号</td>
                                <td>UR4B0-D</td>
                            </tr>
                            <tr>
                                <td>S/N</td>
                                <td>
                                    <div class="barcode-td-part">
                                        <barcode v-bind:value="item" height="50" width="1" marginBottom="0" displayValue="false">
                                            Show this if the rendering fails.
                                        </barcode>
                                        <div class="prt-code-bottom-text">{{item}}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>数量</td>
                                <td>1套</td>
                            </tr>
                            <tr>
                                <td>校验</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="2">备注：</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <input v-model="barcodeValue" /><br>
            </div>
        </div>
    </a-layout-content>

</a-layout>
</template>

<script>
import VueBarcode from 'vue-barcode';
export default {
    components: {
        'barcode': VueBarcode
    },
    data() {
        return {
            barcodeValue: 'Z31086668018092',
            codeArr: ["Z117740889900002004", "Z117740889900002060", "Z117740889900002123", "Z117740889900002062", "Z117740889900002059", "Z117740889900001905", "Z117740889900002063", "Z117730889900002063", "Z117730830100000000", "Z117710830100000000", "Z1176U0830100000000", "Z1176T0830100000000", "Z1176T0830100002785"]
        };
    },
}
</script>

<style>
@import url('../../assets/css/manager.css');
@import url('../../assets/iconfont/iconfont.css');

.print-code-content{
    display: flex;
    flex-wrap: wrap;
    width: 590pt;
    border: 1px solid #ccc;
}
.code-line-two-part{
    width: 280pt;
    border: blue;
    flex-shrink: 0;
    flex-grow: 0;
    margin-bottom: 10pt;
}
.prt-code-bottom-text {
    letter-spacing: 1.6pt;
    font-size: 12pt;
}

.my-print-code-table td {
    border: 1px solid #333;
}
.barcode-td-part{
    border: 1px solid red;
    width: 200pt;
}
</style>
