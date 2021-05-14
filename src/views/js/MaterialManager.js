let columns = [{
    title: "序号",
    dataIndex: "order",
},
{
    title: "物料编号",
    dataIndex: "materials_order",
},
{
    title: "原名称",
    dataIndex: "origin_name",
},
{
    title: "最新名称",
    dataIndex: "newest_name",
},
{
    title: "供应商型号",
    dataIndex: "supplier_type",
},
{
    title: "最新型号",
    dataIndex: "supplier_newest_type",
},
{
    title: "所属机型",
    dataIndex: "belong_type",
},
{
    title: "物料全名",
    dataIndex: "material_fullname",
},
{
    title: "操作",
    key: "action",
    scopedSlots: {
        customRender: "action",
    },
},
];

export default {
    data() {
        return {
            data: [],
            tbDatas: [],
            columns: columns,
            reqParam: {
                page_num: "1",
                per_page_max_record_count: "10",
            },
            pagination: {
                total: 0,
                pageSize: 10, //每页中显示10条数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            pageSizeOptions: ["10", "20", "50", "100"],
            tableStyle: {
                maxHeight: Math.floor(document.body.clientHeight - 250) + "px",
            },
            tableScroll: {
                y: Math.floor(document.body.clientHeight - 320),
            },
            searchKeyword: "", //搜索机号
            title: "",
            visible: false,
            materialsOrder:'',
            originName: '',
            newestName: '',
            supplierType: '',
            supplierNewestType: '',
            belongType: '',
            materialFullname: '',
            remarks: '',
            optType: 'add',
            orderDisabled: false,
        };
    },
    watch: {
        /*
        data(){
            let tbDatas = new Array();
            if(!this.searchKeyword.trim()){
                this.tbDatas = this.data;
                return;
            }
            for(let item of this.data){
                if(Object.values(item).join("#").toUpperCase().includes(this.searchKeyword.trim().toUpperCase())){
                    tbDatas.push(item);
                }
            }
            this.tbDatas = tbDatas;
        },*/
        searchKeyword(){
            let tbDatas = new Array();
            if(!this.searchKeyword.trim()){
                this.tbDatas = this.data;
                return;
            }
            for(let item of this.data){
                if(Object.values(item).join("#").toUpperCase().includes(this.searchKeyword.trim().toUpperCase())){
                    tbDatas.push(item);
                }
            }
            this.tbDatas = tbDatas;
        }
    },
    computed: {

    },
    methods: {
        addItem() {
            this.materialsOrder = '';
            this.originName = '';
            this.newestName = '';
            this.supplierType = '';
            this.supplierNewestType = '';
            this.belongType = '';
            this.materialFullname = '';
            this.remarks = '';
            this.optType = 'add';
            this.orderDisabled = false;
            this.showModal('添加物料');
        },
        modify(record){
            this.materialsOrder = record.materials_order;
            this.originName = record.origin_name;
            this.newestName = record.newest_name;
            this.supplierType = record.supplier_type;
            this.supplierNewestType = record.supplier_newest_type;
            this.belongType = record.belong_type;
            this.materialFullname = record.material_fullname;
            this.remarks = record.remarks;
            this.optType = 'modify';
            this.orderDisabled = true;
            this.showModal('修改物料');
        },
        del(record) {
            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '删除操作不可撤销，是否确认删除【' + record.materials_order + '】',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.delReq(record.materials_order);
                },
                onCancel() { },
            });
        },
        showModal(title){
            this.title = title;
            this.visible = true;
        },
        handleCancel(){
            this.visible = false;
        },
        handleOk(){
            if(this.optType == 'add'){
                this.addReq();
            }else{
                this.modifyReq();
            }
        },

        addReq(){
            const self = this;
            if(this.$util.checkNull([this.materialsOrder, this.originName, this.newestName])){
                this.$message.error('必填项不能为空');
                return;
            }
            let reg = new RegExp('\\d{2}.\\d{2}.\\d{7}');
            if(!reg.test(this.materialsOrder)){
                this.$message.error('物料编号格式为：xx.xx.xxxxxxx');
                return;
            }
            let param = {
                materials_order: this.materialsOrder,
                origin_name: this.originName,
                newest_name: this.newestName,
                supplier_type: this.supplierType,
                supplier_newest_type: this.supplierNewestType,
                belong_type: this.belongType,
                material_fullname: this.materialFullname,
                remarks: this.remarks,
            };
            let data = JSON.stringify(param);
            this.$api.req('/add_material', data).then(res=>{
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err);
            });
            
        },

        modifyReq(){
            const self = this;
            if(this.$util.checkNull([this.materialsOrder, this.originName, this.newestName])){
                this.$message.error('必填项不能为空');
                return;
            }
            let param = {
                materials_order: this.materialsOrder,
                origin_name: this.originName,
                newest_name: this.newestName,
                supplier_type: this.supplierType,
                supplier_newest_type: this.supplierNewestType,
                belong_type: this.belongType,
                material_fullname: this.materialFullname,
                remarks: this.remarks,
            };
            let data = JSON.stringify(param);
            this.$api.req('/update_material', data).then(res=>{
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch(err=>{
                console.error(err);
            });
        },

        delReq(materialsOrder) {
            const self = this;
            const data = JSON.stringify({
                materials_order: materialsOrder
            });
            this.$api.req("/del_material", data).then(res => {
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },

        reqData() {
            this.$api.req('/query_material', "").then(res=>{
            if(res.err_code == 0){
                let tbDatas = new Array();
                let index = 0;
                for(let item of res.materials){
                    item.order = index + 1
                    item.key = index + 1;
                    index ++;
                    tbDatas.push(item);
                }
                this.data = tbDatas;
                this.tbDatas = this.data;
                this.searchKeyword = "";
            }else{
                this.$message.error(res.err_msg);
            }
            }).catch(err=>{
            console.error(err);
            });
        },

    },
    mounted() {
        this.reqData();
    },
};