const columns = [{
    title: '序号',
    dataIndex: 'order',
},
{
    dataIndex: 'name',
    title: '公司名称',
    scopedSlots: {
        customRender: 'name'
    },
},
{
    title: '地址',
    dataIndex: 'address',
},
{
    title: '电话',
    dataIndex: 'telephone',
},
{
    title: '类型',
    dataIndex: 'type',
    scopedSlots: {
        customRender: 'type'
    },
},
{
    title: '父公司',
    dataIndex: 'parent_id',
    scopedSlots: {
        customRender: 'parent_id'
    },
},

{
    title: '操作',
    key: 'action',
    scopedSlots: {
        customRender: 'action'
    },
},
];
export default {
    data() {
        return {
            data: [],
            backData: [], //备份供筛选使用
            columns: columns,
            searchText: '',
            loading: false,
            visible: false,
            modalTitle: '',
            companyName: '', //弹出框，公司名称
            address: '', //弹出框，公司地址
            telephone: '', //弹出框，电话号码
            companyType: '0', //弹出框，公司类型
            companyParentSel: '', //弹出框，父公司下拉选项
            companyId: '',

            myCompany: '', //操作者的公司id，不可删除
            myCompanyName: '',//操作者公司名称
            parentCanChange: true, //父公司下拉列表是否可改，如果是最自己公司或根公司，不可改
            unameDisabled: false,
            operateType: 'add',
            companyMap: {
                0: '无'
            },
            pagination: {
                total: 0,
                pageSize: 10,
                showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            pageSize: 10,
            current: 1,
        };
    },
    computed: {
        total() {
            return this.data.length;
        }
    },
    methods: {
        onPageChange() {},
        //打开添加公司弹出框时置空所有输入框，并设置标题
        addItem() {
            this.telephone = '';
            this.companyType = '0';
            this.companyName = '';
            this.address = '';
            this.companyParentSel = '';
            this.parentCanChange = true;

            this.unameDisabled = false;
            this.operateType = 'add';
            this.showModal('添加公司');
        },
        modify(record) {
            this.telephone = record.telephone;
            this.companyName = record.name;
            this.address = record.address;
            this.companyType = record.type;
            this.companyParentSel = record.parent_id;
            this.companyId = record.company_id;
            //父公司不可修改
            this.parentCanChange = false;

            this.unameDisabled = true;
            this.operateType = 'modify';
            this.showModal('修改公司');
        },
        del(record) {
            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '删除操作不可撤销，是否确认删除【' + record.name + '】',
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.delReq(record.company_id);
                },
                onCancel() {},
            });
        },
        showModal(title) {
            this.modalTitle = title;
            this.visible = true;
        },
        handleOk() {
            if (this.operateType == 'add') {
                this.addReq();
            } else if (this.operateType == 'modify') {
                this.modifyReq();
            }
        },
        handleCancel() {
            this.visible = false;
        },
        checkLegalVal() {
            if (!this.$util.checkPhone(this.telephone)) {
                this.$message.error('固话或手机号码格式不对');
                return false;
            }
            return true;
        },
        addReq() {
            const self = this;
            if (this.$util.checkNull([this.companyName, this.companyType, this.telephone, this.address, this.companyParentSel])) {
                this.$message.error('必填项不能为空');
                return;
            }
            if (!this.checkLegalVal()) {
                return;
            }

            this.$api.post("/add_company", {
                name: self.companyName, //公司名称
                telephone: self.telephone, //公司电话
                address: self.address, //公司地址
                type: self.companyType, //公司类型（0通用，1代理商，2驾校）
                parent_id: self.companyParentSel, //父公司
            }).then(res => {
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('添加成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });

        },
        modifyReq() {
            const self = this;
            if (this.$util.checkNull([this.companyName, this.telephone, this.address, this.companyParentSel])) {
                this.$message.error('必填项不能为空');
                return;
            }
            if (!this.checkLegalVal()) {
                return;
            }

            this.$api.post("/update_company", {
                company_id: self.companyId,
                name: self.companyName, //公司名称
                telephone: self.telephone, //公司电话
                address: self.address, //公司地址
                type: self.companyType, //公司类型（0通用，1代理商，2驾校）
                parent_id: self.companyParentSel, //父公司
            }).then(res => {
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('修改成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },
        delReq(company_id) {
            const self = this;
            this.$api.post("/del_company", {
                company_id: company_id,
            }).then(res => {
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },
        //请求数据
        reqData() {
            const self = this;
            self.$loading.show();
            this.$api.post("/query_company", {
                type: "1",
            }).then(res => {
                if (res.err_code == '0') {
                    let i = 0;
                    const resData = [];
                    for (let company of res.companies) {
                        company.key = company.company_id;
                        if (company.state != 1) {
                            i += 1;
                            company.order = i;
                            resData.push(company);
                        }
                        self.companyMap[company.company_id] = company.name;
                    }
                    self.data = resData;
                    self.backData = resData;
                    self.current = 1;
                }
                self.searchText = '';
                self.$loading.hide();
            }).catch(() => {
                self.$loading.hide();
            });
        },
        search(e) {
            let searchVal = e.target.value;
            if (!searchVal) {
                this.data = this.backData;
                this.current = 1;
            } else {
                const searchData = [];
                searchVal = searchVal.toUpperCase();
                this.backData.forEach((item) => {
                    if (item.name.toUpperCase().includes(searchVal)) {
                        searchData.push(item);
                    }
                });
                this.data = searchData;
                this.current = 1;
            }
        },

    },
    mounted() {
        const userJSON = sessionStorage.getItem("user");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            this.myCompany = user.company_id;
            this.myCompanyName = user.company_name;
        }
        this.reqData();
    }
};