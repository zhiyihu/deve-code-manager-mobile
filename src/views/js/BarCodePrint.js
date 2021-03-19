import Vue from "vue";
import Print from "vue-print-nb";
import jsbarcode from "jsbarcode";
import DeveCodeCommon from './DeveCodeCommon';
import CompanyIconsArr from '../json/company-icons.json';
import materials from "../json/materials.json";
Vue.use(Print);
export default {
    extends: DeveCodeCommon,
    data() {
        return {
            bdtitle: CompanyIconsArr[0].imgBase64,
            extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style> #printMe { height: auto !important; } <style>',
            codeArr: [],
            codeStr: '',
            cardCodeStr: '',
            productCodeTitle: '产品编号',
            productCodeVal: '1011014600107',
            productNameTitle: '产品名称',
            productNameVal: '全系统全频点GNSS高精度基准站接收机',
            productTypeTitle: '产品型号',
            productTypeVal: 'UR4B0-D',
            productNumTitle: '数量',
            productNumVal: '1 套',
            productCheckTitle: '校验',
            productCheckVal: '',
            remarksText: '备注：',
            companyTitle: '',
            isDontUseCompanyIcon: false,
            companyIconsSelectArr: CompanyIconsArr,
            printType: '0', // 0外箱标签，1板卡编码
            aPageNum: 10,
            cardNum: '',
            cardBeginOrder: '',
            isNotUseSN: false,
            boxDetailTableData: [
               
            ],
            today: "",
            materials: [],
            materialsSelArr: [],
            timeout: null,
            materialSelVal: '',
        };
    },
    computed: {
    },
    methods: {
        filterOption(input, option) {
            return (
              option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        applyMaterial(){
            let currMaterial = null;
            for(let i = 0; i < this.materials.length; i++){
                let item = this.materials[i];
                if(item.materials_order == this.materialSelVal){
                    currMaterial = item;
                    break;
                }
            }
            if(currMaterial){
                this.boxDetailTableData.push(["",currMaterial.materials_order,currMaterial.newest_name,currMaterial.supplier_newest_type,"1","",""]);
                this.materialSelVal = "";
            }
            
        },
        handleSearch(value) {
            if(this.timeout){
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            let matchVal = value.toUpperCase();
            this.timeout = setTimeout(()=>{
                // console.log(value);
                this.materialsSelArr = this.materials.filter(item=>{return (item.materials_order.includes(matchVal)||item.newest_name.toUpperCase().includes(matchVal));});
               // this.materialsSelArr = this.materials.slice(0, 5);
            }, 500);
            
        },
        createCardListNum(){
            let cardNum = this.cardNum - 0;
            let cardBeginOrder = this.cardBeginOrder - 0;
            if(isNaN(cardNum) || isNaN(cardBeginOrder) || cardNum < 1 ||  cardNum > 999 || cardBeginOrder < 1000000000){
                this.$message.warn('请输入10位数字板卡号，个数1~999');
                return;
            }
            let cardVal = '';
            for(let i = 0; i < cardNum; i++){
                cardVal += cardBeginOrder + i + '\r\n';
            }
            this.cardCodeStr = cardVal;
            this.onCodesTextsChange();
        },
        onCompanySelectChange(val){
            if(val + '' == ''){
                return;
            }
            let index = val;
            this.bdtitle = this.companyIconsSelectArr[index].imgBase64;
        },
        onUseCompanyIconChange(e){
            this.isDontUseCompanyIcon = e.target.checked;
        },
        onUseSNChange(){
          this.onCodesTextsChange();  
        },
        onFileChange(e){
            const self = this;
            let files = e.target.files;
            if(files && files.length){
                var reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = function () {
                    var base = reader.result;
                    self.bdtitle = base;
                }
        
            }
        },

        selectIconImg(){
            document.querySelector("#my-input-file").click();
        },
        getMachineType(code) {
            let snFlag = this.$util.getSnFlag(code);
            const deviceType = this.deviceType;
            return deviceType[snFlag];
        },
        onPrintTypeChange(){
            this.codeArr = [];
            this.codeStr = '';
            this.cardCodeStr = '';
            this.aPageNum = [10, 84, 1][this.printType];
            this.cardBeginOrder = '';
            this.cardNum = '';
            if(this.printType == 2){
                this.codeArr = [""];
            }
        },
        onCodesTextsChange(){
            const self = this;
            let codeArr;
            if(this.printType == '0'){
                let codeStr = this.codeStr;
                if(!this.isNotUseSN){
                    const reg = new RegExp('([A-Z]1[0-9]{2}[1-9ABC][A-Z0-9]{14})|([A-Z]2[0-9]{2}[A-Z0-9]{10})|([A-Z]3[0-9][A-Z0-9]{12})', 'g');
                    codeArr = [...new Set(codeStr.match(reg) || [])].filter(item => {
                        return self.getMachineType(item);
                    });
                }else{
                    let codeNum = Number(codeStr);
                    codeArr = [];
                    if(!isNaN(codeNum) && codeNum > 0 && codeNum < 201){
                        codeArr = new Array(codeNum).fill(" ");
                    }
                }
                
            }else if(this.printType == '1'){
                let codeStr = this.cardCodeStr;
                const reg = new RegExp('([0-9]{10})', 'g');
                codeArr = [...new Set(codeStr.match(reg) || [])];
            }
            if(this.codeArr.join(',') == codeArr.join(',')){
                return;
            }else{
                this.codeArr = codeArr;
                const self = this;
                this.$nextTick(()=>{
                    self.createBarcode();
                });
            }
            
        },

        createBarcode(){
            if(this.isNotUseSN && this.printType == 0){
                return;
            }
            const width = this.getBarCodeWidth(this.printType);
            for (let i = 0; i < this.codeArr.length; i++) {
                jsbarcode("#barcode" + i, this.codeArr[i], {
                    displayValue: false,
                    marginBottom: 0,
                    width: width,
                });
            }
        },
        //根据打印类型获取条形码宽度
        getBarCodeWidth(printType){
            let widthObj = {
                0: 8,
                1: 6
            };
            return widthObj[printType] || 8;
        },
        printPage() {
            this.$print(this.$refs.print, {
                "no-print": ".no-print",
            });
        },
    },
    mounted() {
        this.reqQueryDeviceType();
        this.today = this.$util.getFmtDateStr(new Date());
        this.materials = materials;
    },
};