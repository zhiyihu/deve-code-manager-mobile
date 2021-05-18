module.exports = {
    css: ".zx-prts table{border-left:1px solid black;border-top:1px solid black;border-spacing:0px;max-width:560pt !important;}.zx-prts td{border-bottom:1px solid black;border-right:1px solid black;padding-left:4pt;word-break:break-all !important;}.zx-prts{font-size:9pt;margin-left:12px;}.xinfos{display:flex;margin-bottom:2pt;}.xinfos>div:nth-of-type(1){width:46pt;}.xinfos>div:nth-of-type(2){width:300pt;}.xinfos-r{display:flex;margin-bottom:2pt;}.xinfos-r>div:nth-of-type(1){width:46pt;}.xinfos-r>div:nth-of-type(2){width:150pt;}.xinfos-sp{display:flex;}.xinfos-sp>div{display:flex;}.single-prt-part{border:1px solid #aaa;margin-bottom:4pt;position:relative;height:390pt;}@media print{.noprint{display:none;}.zx-prts{font-size:9pt;margin:0 0 0 10mm !important;}select,button,input{display:none !important;}.nplace{display:block !important;}.single-prt-part{border:none !important;}}.nplace{display:none;}.filter-res-part{font-size:14px;margin-bottom:10px;max-height:200px;min-height:100px;overflow:auto;width:600px;border:1px solid #ccc;padding-left:14px;margin-top:12px;}.filter-res-part>div{min-height:36px;display:flex;align-items:center;}.filter-column1{width:100pt;}.filter-column2{width:180pt;}.filter-column3{width:100pt;}.filter-column4{width:120pt;}.filter-column4 a{text-decoration:none;color:#1890ff;margin-left:6px;}select{height:18px;}.mx-search{position:absolute;top:0px;left:0px;width:595pt;height:140pt;background:#fff;border:1px solid #ccc;}.opt-div{border:1px solid #bbb;position:fixed;left:610pt;top:12px;padding:12px;height:680px;}.zbtn{background:#1890ff;width:80px;height:28px;color:white;outline:none;border:none;border-radius:4px;cursor:pointer;vertical-align:top;}.global-data-bill-part>div{margin-bottom:10px;}.global-data-bill-part>div>span{display:inline-block;width:100px;text-align:right;}.global-data-bill-part input[type='text']{border:none;outline:none;border-bottom:1px solid #aaa;}",
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>销售出库单</title></head><body style="padding: 0px;margin: 0px;"><style>#STYLE#</style><div class="noprint" style="margin: 10px 12px"><button onclick="window.print();" class="zbtn">打印</button></div><div style="width: 595pt;position: relative;" class="zx-prts" id="zx-prts">#HTML#</div></body></html>`,
    sgHtml: `
    <div class="single-prt-part">
    <span style="position: absolute;top:10px;left: 10px;" class="noprint">#NO#</span>
    <div style="text-align: center;font-size:15pt;padding-top: 30pt;">广州展讯信息科技有限公司--销售出库清单</div>
    <div style="display: flex; width: 550pt;margin:16pt auto 4pt auto;">
        <div style="width: 350pt;">
            <div class="xinfos">
                <div>类别：</div>
                <div style="width: 150pt;" class="head-data-1">#TYPE#</div>
            </div>
            <div class="xinfos">
                <div>销售代表：</div>
                <div style="width: 150pt;" class="head-data-2">#SALEMAN#</div>
            </div>
            <div class="xinfos">
                <div>客户名称：</div>
                <div class="head-data-3">#CUSTOMER#</div>
            </div>
            <div class="xinfos">
                <div>送货地址：</div>
                <div class="head-data-4">#ADDR#</div>
            </div>
            <div class="xinfos-sp">
                <div style="margin-right: 8pt;">
                    <span style="width: 46pt;">联系人：</span>
                    <span style="width: 80pt;" class="head-data-5">#CONTACTS#</span>
                </div>
                <div>
                    <span>电话：</span>
                    <span style="width: 120pt;" class="head-data-6">#PHONE#</span>
                </div>
            </div>
        </div>
        <div style="width: 200pt;">
            <div>&nbsp;</div>
            <div class="xinfos-r">
                <div>订单编号：</div>
                <div class="head-data-7">#SALEORDER#</div>
            </div>
            <div class="xinfos-r">
                <div>出货编号：</div>
                <div class="head-data-8">#OUTORDER#</div>
            </div>
            <div class="xinfos-r">
                <div>运输方式：</div>
                <div class="head-data-9">#TRANSPORT#</div>
            </div>
            <div class="xinfos-r">
                <div>快递单号：</div>
                <div class="head-data-10">#TRANSPORTORDER#</div>
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
            #TRTD#
        </tbody>
    </table>
    <div style="text-align: center;margin-top: 2pt;">签收时请确认外包装是否破损等表面质量问题，否则视为包装完好无损！（以下为空）</div>
    <div style="text-align: center;margin-top: 2pt;">注：第一联：存根（白）、第二联：财务（红）、第三联：回执（蓝）、第四联：客户（绿）、第五联：业务（黄）</div>
    <div style="display: flex;justify-content: center;margin-top: 3pt;">
        <div style="width: 120pt;">
            <span>制单人：</span>
            <span style="display: inline-block;width:70pt;" class="head-data-20">#CREATEMAN#</span>
        </div>
        <div style="width: 120pt;">
            <span>审核人：</span>
            <span style="display: inline-block;width:70pt;"></span>
        </div>
        <div style="width: 110pt;">
            <span>仓管：</span>
            <span style="display: inline-block;width:70pt;"></span>
        </div>
        <div style="width: 130pt;">
            <span>客户签收/日期：</span>
            <span style="display: inline-block;width:60pt;"></span>
        </div>
    </div>
</div>
    `,
    exportHtml(salebillRecords){
        let resHtml = '';
        let i = 0;
        for(let item of salebillRecords){
            let sgHtml = this.sgHtml;
            sgHtml = sgHtml.replace("#NO#", "No."+ (i + 1) + " " + item.createTime);
            sgHtml = sgHtml.replace("#TYPE#", item.sale_type);
            sgHtml = sgHtml.replace("#SALEMAN#", item.sale_man);
            sgHtml = sgHtml.replace("#CUSTOMER#", item.customer_name);
            sgHtml = sgHtml.replace("#ADDR#", item.address);
            sgHtml = sgHtml.replace("#CONTACTS#", item.contacts);
            sgHtml = sgHtml.replace("#PHONE#", item.phone);
            sgHtml = sgHtml.replace("#SALEORDER#", item.sale_order);
            sgHtml = sgHtml.replace("#OUTORDER#", item.out_order);
            sgHtml = sgHtml.replace("#TRANSPORT#", item.transport_type);
            sgHtml = sgHtml.replace("#TRANSPORTORDER#", item.transport_order);
            sgHtml = sgHtml.replace("#CREATEMAN#", item.create_man);
            
            let tableHtml = "";
            let tbArr = item.tbArr;
            for(let j = 0; j < 12; j++){
                if(j < tbArr.length){
                    tableHtml += '<tr>';
                    tableHtml += '<td>'+(j + 1)+'</td>';
                    tableHtml += '<td>'+tbArr[j][1]+'</td>';
                    tableHtml += '<td>'+tbArr[j][2]+'</td>';
                    tableHtml += '<td>'+tbArr[j][3]+'</td>';
                    tableHtml += '<td>'+tbArr[j][4]+'</td>';
                    tableHtml += '<td>'+tbArr[j][5]+'</td>';
                    tableHtml += '<td>'+tbArr[j][6]+'</td>';
                    tableHtml += '</tr>'
                }else{
                    tableHtml += '<tr>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '<td>&nbsp;</td>';
                    tableHtml += '</tr>'
                }

            }
            sgHtml = sgHtml.replace("#TRTD#", tableHtml);
            resHtml += sgHtml;
            i++;
        }
        let text = this.html.replace("#STYLE#", this.css);
        text = text.replace("#HTML#", resHtml);
        this.downloadTextFile("bill.html", text);
    },

    downloadBuffFile (fileName, buffArr) {
		var bf = new Uint8Array(buffArr);
		var data = new Blob([bf],{type:"application/octet-stream"});
		var downloadUrl = window.URL.createObjectURL(data);
		var anchor = document.createElement("a");
		anchor.href = downloadUrl;
		anchor.download = fileName;
		anchor.click();
		window.URL.revokeObjectURL(data);
    },
	
	downloadTextFile(fileName, text) {
		var buffArr = [0xff, 0xfe];
		for(var ch of text){
			var ucode = ch.codePointAt(0);
			buffArr.push(ucode % 0x100);
			buffArr.push(Math.floor(ucode / 0x100) % 0x100);
		}
		this.downloadBuffFile(fileName, buffArr);
    }
}