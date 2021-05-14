import moment from "moment";
import XLSX from "xlsx";

export default {
    data() {
        return {
            data: [],
            dateRange: [],
            SaleFreqContactsResult: [],
            SaleFreqContactsName: '',
            SaleFreqContactsCustomerName: '',
            SaleFreqContactsAddr: '',
            SaleFreqContactsContacts: '',
            SaleFreqContactsPhone: '',
            FreqContactsOptType: 'add',

            SaleFreqMaterialResult: [],

            visible: false,
            modalTitle: '增加套装',
            freqMaterialName: '',
            freqMaterialObjText: '',
            freaMaterialOptType: 'add',
            cBillTbArr: [],
        };
    },
    methods: {
        addFreqMaterial(){
            this.freqMaterialName = '';
            this.freqMaterialObjText = '';
            this.visible = true;
            this.freaMaterialOptType = 'add';
            this.modalTitle = '增加套装';
        },
        handleOk(){
            if(this.freaMaterialOptType == 'add'){
                this.addFreqMaterialReq();
            }else{
                this.updateFreqMaterialReq();
            }
        },
        handleCancel(){
            this.visible = false;
        },

        addFreqMaterialReq(){
            const self = this;
            if(this.$util.checkNull([this.freqMaterialName, this.freqMaterialObjText])){
                this.$message.error('必填项不能为空');
                return;
            }
            let lines = this.freqMaterialObjText.match(/.+/g) || [];
            let tbArr = [];
            if(lines.length){
                for(let line of lines){
                    let tr = ["", "", "", "", "", ""];
                    let i = 0;
                    for(let item of line.split(/\s/)){
                        if(i < tr.length){
                            tr[i++] = item;
                        }
                    }
                    tbArr.push(tr);
                }
            }else{
                this.$message.error('格式不正确');
                return;
            }
            
            let param = {
                name: this.freqMaterialName,
                materials_obj: JSON.stringify(tbArr)
            };
            let data = JSON.stringify(param);
            this.$api.req('/add_freq_material', data).then(res=>{
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqFreqMaterials();
                    self.visible = false;
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err);
            });
        },

        updateFreqMaterialReq(){
            const self = this;
            if(this.$util.checkNull([this.freqMaterialName, this.freqMaterialObjText])){
                this.$message.error('必填项不能为空');
                return;
            }
            let lines = this.freqMaterialObjText.match(/.+/g) || [];
            let tbArr = [];
            if(lines.length){
                for(let line of lines){
                    let tr = ["", "", "", "", "", ""];
                    let i = 0;
                    for(let item of line.split(/\s/)){
                        if(i < tr.length){
                            tr[i++] = item;
                        }
                    }
                    tbArr.push(tr);
                }
            }else{
                this.$message.error('格式不正确');
                return;
            }
            
            let param = {
                name: this.freqMaterialName,
                materials_obj: JSON.stringify(tbArr)
            };
            let data = JSON.stringify(param);
            this.$api.req('/update_freq_material', data).then(res=>{
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqFreqMaterials();
                    self.visible = false;
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err);
            });
        },

        addFreqContactReq(){
            const self = this;
            if(this.$util.checkNull([this.SaleFreqContactsName, this.SaleFreqContactsCustomerName, this.SaleFreqContactsAddr, this.SaleFreqContactsContacts, this.SaleFreqContactsPhone])){
                this.$message.error('必填项不能为空');
                return;
            }
            
            let param = {
                name: this.SaleFreqContactsName,
                customer_name: this.SaleFreqContactsCustomerName,
                address: this.SaleFreqContactsAddr,
                contacts: this.SaleFreqContactsContacts,
                phone: this.SaleFreqContactsPhone
            };
            let data = JSON.stringify(param);
            this.$api.req('/add_freq_contacts', data).then(res=>{
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqFreqContacts();
                    self.clearFreqIpt();
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err);
            });
            
        },

        delFreqContactReq(name) {
            const self = this;
            const data = JSON.stringify({
                name: name
            });
            this.$api.req("/del_freq_contacts", data).then(res => {
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqFreqContacts();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },

        delFreqContact(record) {
            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '删除操作不可撤销，是否确认删除【' + record.name + '】',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.delFreqContactReq(record.name);
                },
                onCancel() { },
            });
        },

        updateFreqContact(record){
            this.SaleFreqContactsName = record.name;
            this.SaleFreqContactsCustomerName = record.customer_name;
            this.SaleFreqContactsAddr = record.address;
            this.SaleFreqContactsContacts = record.contacts;
            this.SaleFreqContactsPhone = record.phone;
            this.FreqContactsOptType = 'modify';
        },

        updateFreqContactReq(){
            const self = this;
            if(this.$util.checkNull([this.SaleFreqContactsName, this.SaleFreqContactsCustomerName, this.SaleFreqContactsAddr, this.SaleFreqContactsContacts, this.SaleFreqContactsPhone])){
                this.$message.error('必填项不能为空');
                return;
            }
            
            let param = {
                name: this.SaleFreqContactsName,
                customer_name: this.SaleFreqContactsCustomerName,
                address: this.SaleFreqContactsAddr,
                contacts: this.SaleFreqContactsContacts,
                phone: this.SaleFreqContactsPhone
            };
            let data = JSON.stringify(param);
            this.$api.req('/update_freq_contacts', data).then(res=>{
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqFreqContacts();
                    self.cancelUpdateFreqContact();
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err);
            });
        },


        cancelUpdateFreqContact(){
            this.FreqContactsOptType = 'add';
            this.clearFreqIpt();
        },

        clearFreqIpt(){
            this.SaleFreqContactsName = '';
            this.SaleFreqContactsCustomerName = '';
            this.SaleFreqContactsAddr = '';
            this.SaleFreqContactsContacts = '';
            this.SaleFreqContactsPhone = '';
        },

        reqFreqContacts(){
            this.$api.req('/query_freq_contacts','{}').then(res=>{
                if(res.err_code == 0){
                    this.SaleFreqContactsResult = res.result;
                }else{
                    console.error(res.err_msg);
                }
                
            }).catch(err=>{
                console.error(err);
            });
        },

        reqFreqMaterials(){
            this.$api.req('/query_freq_materials','{}').then(res=>{
                if(res.err_code == 0){
                    for(let item of res.result){
                        item.tbitem = JSON.parse(item.materials_obj);
                    }
                    this.SaleFreqMaterialResult = res.result;
                }else{
                    console.error(res.err_msg);
                }
                
            }).catch(err=>{
                console.error(err);
            });
        },

        updateFreqMaterial(record){
            console.log(record);
            var arr = record.tbitem;
            var tbArr = [];
            for(let item of arr){
                tbArr.push(item.join("\t"));
            }
            this.freqMaterialName = record.name;
            this.freqMaterialObjText = tbArr.join("\n");
            this.visible = true;
            this.freaMaterialOptType = 'modify';
            this.modalTitle = '修改套装';
        },

        delFreqMaterial(record){
            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '删除操作不可撤销，是否确认删除【' + record.name + '】',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.delFreqMaterialReq(record.name);
                },
                onCancel() { },
            });
        },

        delFreqMaterialReq(name){
            const self = this;
            const data = JSON.stringify({
                name: name
            });
            this.$api.req("/del_freq_material", data).then(res => {
                if (res.err_code == '0') {
                    self.$message.success('操作成功');
                    self.reqFreqMaterials();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },

        exportFreMaterialTable(){
            const tableArr = [];
            
            for (let item of this.SaleFreqMaterialResult){
                tableArr.push([item.name]);
                tableArr.push(["序号","产品料号","名称","规格","数量", "单位", "备注"]);
                let i = 0;
                for(let tr of item.tbitem){
                    tableArr.push([
                        ++i,
                        tr[0],
                        tr[1],
                        tr[2],
                        tr[3],
                        tr[4],
                        tr[5]
                    ]);
                }
                tableArr.push([""]);
            }
            this.exportExcelByArr(tableArr, '常用套装');
        },

        exportFreContactsTable(){
            const tableArr = [["序号","名称","客户名称","送货地址","联系人", "电话"]];
            let i = 0;
            for (let item of this.SaleFreqContactsResult){
                item.order = ++i;
                tableArr.push([
                    i,
                    item.name,
                    item.customer_name,
                    item.address,
                    item.contacts,
                    item.phone,
                ]);
            }
            this.exportExcelByArr(tableArr, '常用联系人');
        },
        exportExcelByArr(exportArray, filename = "导出表格") {
            let tSheet = XLSX.utils.aoa_to_sheet(exportArray);  
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, tSheet, "Sheet1");
            XLSX.writeFile(wb, filename + ".xls", {cellStyles: true});
        },

        setDateRange() {
            const nowDate = new Date();
            const today = this.$util.getFmtDateStr(nowDate);
            const lastWeek = this.$util.calDateStrByGap(nowDate, -6);
            this.dateRange = [moment(lastWeek, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')];
        },

        initCbillArr(){
            let arr = [];
            for(let i = 0; i < 12; i++){
                let tr = [];
                for(let j = 0; j < 7; j++){
                    tr.push("");
                }
                arr.push(tr);
            }
            this.cBillTbArr = arr;
        }

    },
    mounted() {
        this.setDateRange();
        this.reqFreqContacts();
        this.reqFreqMaterials();
        this.initCbillArr();
    }
};