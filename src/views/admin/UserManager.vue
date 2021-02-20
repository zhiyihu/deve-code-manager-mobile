<template>
<a-layout style="padding: 20px 16px 0px 16px;background:#fff;margin-bottom:14px;">
    <a-layout-content :style="{ background: '#fff', padding: '0px 0px', margin: 0, minHeight: '280px' }">
        <div style="position: relative;">
            <div class="data-table-head">
                <div class="opt-head-part">
                    <span style="margin-left: 16px;">筛选：</span>
                    <a-input placeholder="输入用户名或姓名筛选" allow-clear style="width: 200px;" @change="search" v-model="searchText"></a-input>
                    <a-button type="primary" icon="reload" style="vertical-align: top;margin-left: 12px;" @click="reqData">刷新数据</a-button>
                    <a-button type="primary" icon="plus" style="vertical-align: top;margin-right: 8px;margin-left: 12px;" @click="addItem">添加用户</a-button>
                </div>

            </div>

            <a-table :columns="columns" :data-source="data" :pagination="pagination">
                <span slot="user" slot-scope="user">
                    <span v-if="user == uname" style="font-weight: bolder;color: #1890ff;">{{user}}</span>
                    <span v-else>{{user}}</span>
                </span>
                <span slot="state" slot-scope="state">
                    <a-tag :color="state === '0' ? 'green' : 'red'">
                        {{ ['正常','删除','停用','待改密码'][state || 0] }}
                    </a-tag>
                </span>
                <span slot="regist_max_days" slot-scope="regist_max_days">
                        {{ Number(regist_max_days) > 9999 ? '永久' : regist_max_days + '天'}}

                </span>
                <template v-slot:action="record">
                    <a @click="modify(record);" href="javascript:;">修改</a>
                    <template v-if="record.user != uname && !record.permissions.includes('admin') && record.state != 2">
                        <a-divider type="vertical" />
                        <a @click="stop(record, '0');" href="javascript:;">停用</a>
                    </template>
                    <template v-if="record.user != uname && !record.permissions.includes('admin') && record.state == 2">
                        <a-divider type="vertical" />
                        <a @click="stop(record, '1');" href="javascript:;">激活</a>
                    </template>
                    <template v-if="record.user != uname && !record.permissions.includes('admin')">
                        <a-divider type="vertical" />
                        <a @click="del(record);" href="javascript:;">删除</a>
                    </template>
                    <template v-if="mypermission.includes('admin') && record.user != 'admin'">
                        <a-divider type="vertical" />
                        <a @click="modifyRegistDay(record);" href="javascript:;">修改注册天数</a>
                    </template>                
                </template>
            </a-table>
            <a-modal width="650px" :centered="true" v-model="visible" :title="modalTitle" on-ok="handleOk">
                <template slot="footer">
                    <a-button key="back" @click="handleCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
                </template>
                <div style="max-height: 480px;overflow: auto;">
                    <div class="amodal-edit-line">
                        <span><i>*</i>用户名</span>
                        <a-input style="width: 200px;" :disabled="unameDisabled" v-model="user"></a-input>                    
                        <span><i>*</i>姓名</span>
                        <a-input style="width: 200px;" v-model="real_name"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>电话</span>
                        <a-input style="width: 200px;" v-model="telephone"></a-input>
                        <span><i>*</i>邮箱</span>
                        <a-input style="width: 200px;" v-model="email"></a-input>
                    </div>
                    <div class="amodal-edit-line">
                        <span><i>*</i>所属公司</span>
                        <a-select style="width: 486px;" v-model="companySel" :disabled="!companyCanChange">
                            <a-select-option value="" disabled>请选择</a-select-option>
                            <a-select-option v-for="(item, index) in companys" :key="index" :value="item.company_id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="amodal-edit-line" style="height: 100px;">
                        <span><i>*</i>角色权限</span>
                        <a-tree
                            style="width: 340px;position: relative; bottom: 30px;left: 84px;"
                            v-model="checkedKeys"
                            checkable
                            :expanded-keys="expandedKeys"
                            :auto-expand-parent="autoExpandParent"
                            :selected-keys="selectedKeys"
                            :tree-data="treeData"
                            @expand="onExpand"
                            @select="onSelect"
                        />
                    </div>
                </div>
            </a-modal>

            <a-modal width="450px" :centered="true" v-model="registDayVisible" title="修改注册天数" on-ok="handleRegistDayOk">
                <template slot="footer">
                    <a-button key="back" @click="handleRegistDayCancel">取消</a-button>
                    <a-button key="submit" type="primary" :loading="loading" @click="handleRegistDayOk">提交</a-button>
                </template>
                <div style="max-height: 480px;overflow: auto;">
                    <div style="margin-bottom: 10px;">
                        <span>用户：{{currModifyRegistUser}}</span>
                    </div>
                    <a-input placeholder="请输入天数" v-model="currModifyRegistIpt"></a-input>
                </div>
            </a-modal>
        </div>
    </a-layout-content>
</a-layout>
</template>

<script>
const columns = [{
        title: '序号',
        dataIndex: 'order',
    },
    {
        dataIndex: 'user',
        title: '用户名',
        scopedSlots: {
            customRender: 'user'
        },
    },
    {
        title: '姓名',
        dataIndex: 'real_name',
    },
    {
        title: '电话',
        dataIndex: 'telephone',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
    },
     {
        title: '所属公司',
        dataIndex: 'company',
    },
    {
        title: '状态',
        dataIndex: 'state',
        scopedSlots: {
            customRender: 'state'
        },
    },
    {
        title: '注册天数',
        dataIndex: 'regist_max_days',
        scopedSlots: {
            customRender: 'regist_max_days'
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
            currModifyRegistUser: '',
            currModifyRegistIpt: '',
            registDayVisible: false,
            mypermission: JSON.parse(sessionStorage.getItem("user")).permissions,
            data: [],
            backData: [], //备份供筛选使用
            columns,
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
            permissions: '',
            unameDisabled: false,
            operateType: 'add',
            companySel: '',
            userId: '',
            //权限树相关变量
            treeData: [],  //权限树
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            permissionObj: {},
            
            //公司map，id对应名称
            companyMap: {},
            companys: [],
            companyCanChange: true, //公司是否可变，修改用户不能修改公司
            pagination: {
                total: 0,
                pageSize: Math.floor((document.body.clientHeight - 280) / 55), //每页中显示10条数据
                showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
            },
        };
    },
    methods: {
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
            this.permissions = '';   //权限名用逗号连接起来的字符串，如果为admin则不可改
            
            this.selectedKeys = [];
            this.setTreeCheckable(true);

            this.showModal('添加用户');
        },
        /**点击修改，打开弹出框，设置表单内容 */
        modify(record) {
            this.user = record.user;
            this.real_name = record.real_name;
            this.telephone = record.telephone;
            this.email = record.email;
            this.permissions = record.permissions;  //权限key用逗号连接的字符串
            this.companySel = record.company_id;
            this.userId = record.id;

            this.selectedKeys = [];
            this.unameDisabled = true;
            this.operateType = 'modify';
            this.companyCanChange = false;
            this.showModal('修改用户');
            const isMe = this.uname == this.user;
            if(this.permissions == 'admin'){
                this.checkedKeys = this.calCheckedKeys(Object.keys(this.permissionObj), true);
                this.setTreeCheckable(false);
            }else{
                this.checkedKeys = this.calCheckedKeys(this.permissions.split(','), isMe);
                this.setTreeCheckable(!isMe);
            }
        },
        calCheckedKeys(keys, isdisable){
            const set = new Set();
            for(let key of keys){
                set.add(key);
                if(isdisable){
                    set.add(this.permissionObj[key] || key);
                }
            }
            return [...set.values()];
        },
        setTreeCheckable(flag){
            for(let tree of this.treeData){
                tree.disabled = !flag;
                for(let t of tree.children){
                    t.disabled = !flag;
                }
            }
        },
        stop(record, type){
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
                onCancel() {},
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
                onCancel() {},
            });
        },
        /**显示修改/添加弹出框*/
        showModal(title) {
            this.modalTitle = title;
            this.visible = true;
        },
        /**修改/添加弹出框点击提交*/
        handleOk() {
            if(this.operateType == 'add'){
                this.addReq();
            }else if(this.operateType == 'modify'){
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

        handleRegistDayOk(){
            const self = this;
            if(!this.currModifyRegistIpt.match(/^[1-9]\d*$/g)){
                self.$message.error('请输入数字');
                return;
            }
            this.$api.post("/set_user_regist_max_days", {
                user: self.currModifyRegistUser,
                regist_max_days: self.currModifyRegistIpt,	
            }).then(res=>{
                if(res.err_code == '0'){
                    self.registDayVisible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                }else{
                    self.$message.error(res.err_msg);
                }
            });
        },

        handleRegistDayCancel(){
            this.registDayVisible = false;
        },
        checkLegalVal(){
            if(!this.$util.checkUsername(this.user)){
                this.$message.error('用户名由字母或数字组成，长度4~20');
                return false;
            }
            if(!this.$util.checkPhone(this.telephone)){
                this.$message.error('固话或手机号码格式不对');
                return false;
            }
            if(!this.$util.checkEmail(this.email)){
                this.$message.error('邮箱格式不对');
                return false;
            }
            return true;
        },
        enableReq(username, type = "0"){
             const self = this;
            this.$api.post("/enable_user", {
                user: username,
                enable : type	
            }).then(res=>{
                if(res.err_code == '0'){
                    self.visible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                }else{
                    self.$message.error(res.err_msg);
                }
            });
        },
        addReq() {
            const self = this;
            const permissions = this.getSelectPermissions();
            if(this.$util.checkNull([this.user, this.real_name, this.telephone, this.email, this.companySel, permissions])){
                this.$message.error('必填项不能为空');
                return;
            }
            if(!this.checkLegalVal()){
                return;
            }
           
            this.$api.post("/add_user", {
                user: self.user,
                password :"abc,1234",
                real_name : self.real_name ,//真实姓名
                telephone : self.telephone ,//电话号码
                email : self.email ,//邮箱
                company_id : self.companySel ,//公司ID
                permissions : permissions,
            }).then(res=>{
                if(res.err_code == '0'){
                    self.visible = false;
                    self.$message.success('添加成功');
                    self.reqData();
                }else{
                    self.$message.error(res.err_msg);
                }
            });

        },
        modifyReq() {
            const self = this;
            if(this.$util.checkNull([this.user, this.real_name, this.telephone, this.email])){
                this.$message.error('必填项不能为空');
                return;
            }
            if(!this.checkLegalVal()){
                return;
            }
            const param = {
                user: self.user,
                real_name : self.real_name ,
                telephone : self.telephone ,
                email : self.email
            };

            if(param.user != 'admin'){
                param.permissions = this.getSelectPermissions();
            }
            this.$api.post("/update_user", param).then(res=>{
                if(res.err_code == '0'){
                    self.visible = false;
                    self.$message.success('修改成功');
                    self.reqData();
                }else{
                    self.$message.error(res.err_msg);
                }
            });
        },
        delReq(username){
            const self = this;
            this.$api.post("/del_user", {
                user: username,
            }).then(res=>{
                if(res.err_code == '0'){
                    self.visible = false;
                    self.$message.success('操作成功');
                    self.reqData();
                }else{
                    self.$message.error(res.err_msg);
                }
            });
        },
        //请求数据
        reqData() {
            const self = this;
            this.$api.post("/query_user", {
                type: "2",
            }).then(res=>{
                if(res.err_code == '0'){
                    let i = 0;
                    const resData = [];
                    for(let user of res.users){
                        user.key = user.id;
                        if(user.state != 1 && (user.user == self.uname || user.user !='admin')){
                            i += 1;
                            user.order = i;
                            user.company = self.companyMap[user.company_id] || 'Err';
                            resData.push(user);
                        }
                    }
                    self.data = resData;
                    self.backData = resData;
                }
                self.searchText = '';
                self.$loading.hide();
            }).catch(()=>{
                self.$loading.hide();
            });
        },
        search(e) {
            let searchVal = e.target.value;
            if (!searchVal) {
                this.data = this.backData;
            } else {
                const searchData = [];
                searchVal = searchVal.toUpperCase();
                this.backData.forEach((item) => {
                    if (item.user.toUpperCase().includes(searchVal) || item.real_name.toUpperCase().includes(searchVal)) {
                        searchData.push(item);
                    }
                });
                this.data = searchData;
            }
        },
        reqCompany(callback){
            const self = this;
            this.$loading.show();
            this.$api.post("/query_company", {
                type: "1",
            }).then(res=>{
                if(res.err_code == '0'){
                    const resData = [];
                    for(let company of res.companies){
                        if(company.state == 0){
                            resData.push(company);
                        }
                        self.companyMap[company.company_id] = company.name;
                    }
                    self.companys = resData;
                    if(callback){
                        callback();
                    }
                }else{
                    self.$loading.hide();
                }
            }).catch(()=>{
                self.$loading.hide();
            });
        },
        getSelectPermissions(){
            let permissionsArr = [];
            for(const key of this.checkedKeys){
                if(this.permissionObj[key]){
                    permissionsArr.push(key);
                }
            }
            return permissionsArr.join(',');
        },
        reqPermissions(){
            const self = this;
            this.$api.post("/query_perimissions").then(res=>{
                if(res.err_code == '0'){
                    const pNameObj = {'company':'公司权限','user':'用户权限','log':'日志权限', 'device': '设备权限'};
                    const pObj = new Object();
                    const permissionObj = new Object();
                    const expandedKeys = new Array();
                    for(let permission of res.permissions){
                        const group = permission.group;
                        const name = permission.name;
                        const name_cn = permission.name_cn;
                        if(!pObj[group]){
                            pObj[group] =  {
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
                    for(let key in pObj){
                        treeData.push(pObj[key]);
                    }
                    self.permissionObj = permissionObj;
                    //设置权限树
                    self.treeData = treeData;
                    //全部展开
                    self.expandedKeys = expandedKeys;
                }
            }).catch(()=>{
            });
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

    },
    mounted() {
        this.reqCompany(()=>{
            this.reqData();
        });
        this.reqPermissions();
    }
};
</script>

<style>
@import url('../../assets/css/manager.css');

</style>
