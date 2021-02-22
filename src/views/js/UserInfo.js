export default {
    data() {
        return {
            user: '',
            realName: '',
            telephone: '',
            address: '',
            email: '',
            companyName: '',
            permissions: '',
            companyObj: {},
            maxActDay: '',
        }
    },
    methods: {
        reqCompany(callback) {
            const self = this;
            this.$api.post("/query_company", {
                type: "0",
            }).then(res => {
                if (res.err_code == '0') {
                    const company = res.companies[0];
                    self.companyObj[company.company_id] = company.name;
                    if (callback) {
                        callback();
                    }
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        //请求用户
        reqUser() {
            const self = this;
            this.$api.post("/query_user", {
                type: "0",
            }).then(res => {
                if (res.err_code == '0') {
                    const user = res.users[0];
                    self.user = user.user;
                    self.email = user.email;
                    self.realName = user.real_name;
                    self.telephone = user.telephone;
                    self.permissions = user.permissions;
                    self.maxActDay = user.regist_max_days > 9999 ? '永久' : user.regist_max_days + '天';
                    self.companyName = self.companyObj[user.company_id];
                } else {
                    self.$message.error(res.err_msg);
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        bindModifyUserInfo() {
            const self = this;
            this.$confirm({
                title: '提示',
                content: '确认个人信息无误，提交修改？',
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk() {
                    self.reqModifyUserInfo();
                },
                onCancel() {},
            });
        },

        //提交修改用户信息
        reqModifyUserInfo() {
            const self = this;
            if (!this.$util.checkPhone(this.telephone)) {
                this.$message.error('固话或手机号码格式不对');
                return;
            }
            if (!this.$util.checkEmail(this.email)) {
                this.$message.error('邮箱格式不对');
                return;
            }
            this.$api.post("/update_user", {
                user: self.user,
                real_name: self.realName,
                telephone: self.telephone,
                email: self.email,
                // permissions: self.permissions
            }).then(res => {
                if (res.err_code == '0') {
                    self.visible = false;
                    self.$message.success('修改成功');
                    // self.reqData();
                } else {
                    self.$message.error(res.err_msg);
                }
            });
        }
    },
    mounted() {
        this.reqCompany(() => {
            this.reqUser();
        });

    }
}