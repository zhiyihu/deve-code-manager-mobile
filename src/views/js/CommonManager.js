//分离查询权限的公共代码
export default {
    data() {
        return {
            //权限树相关变量
            treeData: [], //权限树
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            permissionObj: {},
            permissions: '',
            myCompanyId: JSON.parse(sessionStorage.getItem("user")).company_id,
        };
    },
    methods: {
        filterOption(input, option) {
            return (
              option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        }, 
        calCheckedKeys(keys, isdisable) {
            const set = new Set();
            for (let key of keys) {
                set.add(key);
                if (isdisable) {
                    set.add(this.permissionObj[key] || key);
                }
            }
            return [...set.values()];
        },
        getSelectPermissions() {
            let permissionsArr = [];
            for (const key of this.checkedKeys) {
                if (this.permissionObj[key]) {
                    permissionsArr.push(key);
                }
            }
            return permissionsArr.join(',');
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },

        onCheck(checkedKeys) {
            this.checkedKeys = checkedKeys;
        },
        onSelect(selectedKeys) {
            this.selectedKeys = selectedKeys;
        },

        //查询权限树结构数据
        reqQueryPermissionsTree(companyId, callback) {
            const self = this;
            const param = {
                company_id: companyId
            };
            self.$loading.show();
            this.$api.post("/query_permissions", param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    const pNameObj = {
                        'company': '公司权限',
                        'user': '用户权限',
                        'log': '日志权限',
                        'device': '设备权限'
                    };
                    const pObj = new Object();
                    const permissionObj = new Object();
                    const expandedKeys = new Array();
                    for (let permission of res.permissions) {
                        const group = permission.group;
                        const name = permission.name;
                        const name_cn = permission.name_cn;
                        if (!pObj[group]) {
                            pObj[group] = {
                                title: pNameObj[group] || '未命名权限',
                                key: group,
                                children: [],
                            };
                            expandedKeys.push(group);
                        }

                        pObj[group].children.push({
                            title: name_cn,
                            key: name
                        });

                        permissionObj[name] = group;

                    }
                    const treeData = [];
                    for (let key in pObj) {
                        treeData.push(pObj[key]);
                    }
                    self.permissionObj = permissionObj;
                    //设置权限树
                    self.treeData = treeData;
                    //全部展开
                    self.expandedKeys = expandedKeys;
                }
                if(callback){
                    callback();
                }
            }).catch(() => { });
        },

        //根据公司id查询权限
        reqPermissionsByCompanyId(parentId, callback){
            const self = this;
            const param = {
                company_id: parentId
            };
            self.$loading.show();
            this.$api.post("/query_permissions", param).then(res => {
                self.$loading.hide();
                if (res.err_code == '0') {
                    const permissionArr = [];
                    for (let permission of res.permissions) {
                        permissionArr.push(permission.name);
                    }
                    self.permissions = permissionArr.join(',');
                    if(callback){
                        callback();
                    }
                }
            }).catch(() => { });
        },
        onParentCompanySelectChange(val){
            const self = this;
            self.checkedKeys = [];
            self.reqQueryPermissionsTree(val);
            // this.reqPermissionsByCompanyId(val, ()=>{
            //     let keys = self.permissions ? self.permissions.split(',') : [];
            //     self.setTreeCheckableByPermission(keys);
            //     self.checkedKeys = [];
            // });
        },
        setTreeCheckable(flag) {
            for (let tree of this.treeData) {
                tree.disableCheckbox = !flag;
                for (let t of tree.children) {
                    t.disableCheckbox = !flag;
                }
            }
        },
        setTreeCheckableByPermission(permissions){
            for (let tree of this.treeData) {
                let disabled = false;
                for (let t of tree.children) {
                    let isChildrenDisabled = !(permissions||[]).includes(t.key);
                    t.disableCheckbox = isChildrenDisabled;
                    if(isChildrenDisabled){
                        disabled = true;
                    }
                }
                tree.disableCheckbox = disabled;
            }
        },

    }
};