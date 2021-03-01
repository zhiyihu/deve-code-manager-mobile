import CommonManager from './CommonManager';
const columns = [{
    title: "序号",
    dataIndex: "order",
},
{
    dataIndex: "user",
    title: "用户名",
    scopedSlots: {
        customRender: "user",
    },
},
{
    title: "姓名",
    dataIndex: "real_name",
},
{
    title: "电话",
    dataIndex: "telephone",
},
{
    title: "邮箱",
    dataIndex: "email",
},
{
    title: "所属公司",
    dataIndex: "company",
},
{
    title: "状态",
    dataIndex: "state",
    scopedSlots: {
        customRender: "state",
    },
},
{
    title: "注册天数",
    dataIndex: "regist_max_days",
    scopedSlots: {
        customRender: "regist_max_days",
    },
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
    extends: CommonManager,
    data() {
        return {
            currModifyRegistUser: '',
            currModifyRegistIpt: '',
            registDayVisible: false,
            mypermission: JSON.parse(sessionStorage.getItem("user")).permissions,
            data: [],
            backData: [], //备份供筛选使用
            columns: columns,
            uname: sessionStorage.getItem('username'),
            searchText: '',
            loading: false,
            visible: false,
            modalTitle: '',
            //添加修改用户相关变量
            user: '',
            real_name: '',
            telephone: '',
            email: '',
            company_id: '',
            unameDisabled: false,
            operateType: 'add',
            companySel: '',
            userId: '',

            //公司map，id对应名称
            companyMap: {},
            companys: [],
            companyCanChange: true, //公司是否可变，修改用户不能修改公司
            pagination: {
                total: 0,
                pageSize: 10, //每页中显示10条数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
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
        onPageChange() {
        },
        /**点击添加，打开弹出框，重置所有输入值 */
        addItem() {
            this.user = '';
            this.unameDisabled = false;
            this.operateType = 'add';
            this.companySel = '';
            this.real_name = '';
            this.telephone = '';
            this.email = '';
            this.companyCanChange = true;
           
            this.checkedKeys = [];
            this.permissions = ''; //权限名用逗号连接起来的字符串，如果为admin则不可改
            this.selectedKeys = [];
            this.treeData = [];

            this.showModal('添加用户');
        },
        /**点击修改，打开弹出框，设置表单内容 */
        modify(record) {
            this.user = record.user;
            this.real_name = record.real_name;
            this.telephone = record.telephone;
            this.email = record.email;
            this.permissions = record.permissions; //权限key用逗号连接的字符串
            this.companySel = record.company_id;
            this.userId = record.id;

            this.unameDisabled = true;
            this.operateType = 'modify';
            this.companyCanChange = false;
            this.showModal('修改用户');
            this.checkedKeys = [];
            this.selectedKeys = [];
            this.treeData = [];
            
            this.reqQueryPermissionsTree(record.company_id, ()=>{
                const isMe = this.uname == this.user;
                if (this.permissions == 'admin') {
                    this.checkedKeys = this.calCheckedKeys(Object.keys(this.permissionObj), true);
                    this.setTreeCheckable(false);
                } else {
                    this.checkedKeys = this.calCheckedKeys(this.permissions.split(','), isMe);
                    this.setTreeCheckable(!isMe);
                }
            });
        
        },

        stop(record, type) {
            const self = this;
            const tip = ['停用', '激活'][type];
            this.$confirm({
                title: tip + '提示',
                content: '是否确认' + tip + '【' + record.user + '】',
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.enableReq(record.user, type);
                },
                onCancel() { },
            });
        },
        /**点击删除，弹出确认框*/
        del(record) {
            const self = this;
            this.$confirm({
                title: '删除提示',
                content: '删除操作不可撤销，是否确认删除【' + record.user + '】',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.delReq(record.user);
                },
                onCancel() { },
            });
        },
        /**显示修改/添加弹出框*/
        showModal(title) {
            this.modalTitle = title;
            this.visible = true;
        },
        /**修改/添加弹出框点击提交*/
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

        modifyRegistDay(record) {
            this.registDayVisible = true;
            this.currModifyRegistIpt = record.regist_max_days;
            this.currModifyRegistUser = record.user;
        },

        handleRegistDayOk() {
            const self = this;
            if (!this.currModifyRegistIpt.match(/^[1-9]\d*$/g)) {
                self.$message.error('请输入数字');
                return;
            }
            this.$api.post("/set_user_regist_max_days", {
                user: self.currModifyRegistUser,
                regist_max_days: self.currModifyRegistIpt,
            }).then(res => {
                if (res.err_code == '0') {
                    self.registDayVisible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },

        handleRegistDayCancel() {
            this.registDayVisible = false;
        },
        checkLegalVal() {
            if (!this.$util.checkUsername(this.user)) {
                this.$message.error('用户名由字母或数字组成，长度4~20');
                return false;
            }
            if (!this.$util.checkPhone(this.telephone)) {
                this.$message.error('固话或手机号码格式不对');
                return false;
            }
            if (!this.$util.checkEmail(this.email)) {
                this.$message.error('邮箱格式不对');
                return false;
            }
            return true;
        },
        enableReq(username, type = "0") {
            const self = this;
            this.$api.post("/enable_user", {
                user: username,
                enable: type
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
        addReq() {
            const self = this;
            const permissions = this.getSelectPermissions();
            if (this.$util.checkNull([this.user, this.real_name, this.telephone, this.email, this.companySel, permissions])) {
                this.$message.error('必填项不能为空');
                return;
            }
            if (!this.checkLegalVal()) {
                return;
            }

            this.$api.post("/add_user", {
                user: self.user,
                password: "abc,1234",
                real_name: self.real_name, //真实姓名
                telephone: self.telephone, //电话号码
                email: self.email, //邮箱
                company_id: self.companySel, //公司ID
                permissions: permissions,
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
            if (this.$util.checkNull([this.user, this.real_name, this.telephone, this.email])) {
                this.$message.error('必填项不能为空');
                return;
            }
            if (!this.checkLegalVal()) {
                return;
            }
            const param = {
                user: self.user,
                real_name: self.real_name,
                telephone: self.telephone,
                email: self.email
            };

            if (param.user != 'admin') {
                param.permissions = this.getSelectPermissions();
            }
            this.$api.post("/update_user", param).then(res => {
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('修改成功');
                    self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        },
        delReq(username) {
            const self = this;
            this.$api.post("/del_user", {
                user: username,
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
            this.$api.post("/query_user", {
                type: "2",
            }).then(res => {
                if (res.err_code == '0') {
                    let i = 0;
                    const resData = [];
                    for (let user of res.users) {
                        user.key = user.id;
                        if (user.state != 1 && (user.user == self.uname || user.user != 'admin')) {
                            i += 1;
                            user.order = i;
                            user.company = self.companyMap[user.company_id] || 'Err';
                            resData.push(user);
                        }
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
                    if (item.user.toUpperCase().includes(searchVal) || item.real_name.toUpperCase().includes(searchVal)) {
                        searchData.push(item);
                    }
                });
                this.data = searchData;
                this.current = 1;
            }
        },
        reqCompany(callback) {
            const self = this;
            this.$loading.show();
            this.$api.post("/query_company", {
                type: "1",
            }).then(res => {
                if (res.err_code == '0') {
                    const resData = [];
                    for (let company of res.companies) {
                        if (company.state == 0) {
                            resData.push(company);
                        }
                        self.companyMap[company.company_id] = company.name;
                    }
                    self.companys = resData;
                    if (callback) {
                        callback();
                    }
                } else {
                    self.$loading.hide();
                }
            }).catch(() => {
                self.$loading.hide();
            });
        },

    },
    mounted() {
        this.reqCompany(() => {
            this.reqData();
        });
    }
};