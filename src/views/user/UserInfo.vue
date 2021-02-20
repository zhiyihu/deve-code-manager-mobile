<template>
<div class="user-main">
    <div class="user-title">个人信息</div>
    <div class="user-content">
        <div class="face-head">
            <div class="face-head-photo">
                <img src="../../assets/head.png"/>
            </div>
            <div class="face-head-greet">Hi,&nbsp;{{realName}}</div>
        </div>
        <div class="user-base-info">
            <div class="submit-modify">
                <a-button type="link" @click="reqModifyUserInfo">提交修改</a-button>
            </div>
            <div class="base-info-title">用户名</div>
            <div class="base-info-value">{{user}}</div>
            <div class="base-info-title">姓名</div>
            <div class="base-info-value">
                <input v-model="realName"/>
                <img src="../../assets/edit.png"/>
            </div>
            <div class="base-info-title">电话</div>
            <div class="base-info-value">
                <input v-model="telephone"/>
                <img src="../../assets/edit.png"/>
            </div>
            <div class="base-info-title">邮箱</div>
            <div class="base-info-value">
                <input v-model="email"/>
                <img src="../../assets/edit.png"/>
            </div>
            <div class="base-info-title">所属公司</div>
            <div class="base-info-value">{{companyName}}</div>
            <div class="base-info-title">最大注册天数</div>
            <div class="base-info-value">{{maxActDay}}</div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data (){
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
        reqCompany(callback){
            const self = this;
            this.$api.post("/query_company", {
                type: "0",
            }).then(res=>{
                if(res.err_code == '0'){
                    const company = res.companies[0];
                    self.companyObj[company.company_id] = company.name;
                    if(callback){
                        callback();
                    }
                }else{
                    self.$message.error(res.err_msg);
                }
            }).catch((err)=>{
                console.error(err);
            });
        },

        //请求用户
        reqUser() {
            const self = this;
            this.$api.post("/query_user", {
                type: "0",
            }).then(res=>{
                if(res.err_code == '0'){ 
                    const user = res.users[0];
                    self.user = user.user;
                    self.email = user.email;
                    self.realName = user.real_name;
                    self.telephone = user.telephone;
                    self.permissions = user.permissions;
                    self.maxActDay = user.regist_max_days > 9999 ? '永久' : user.regist_max_days + '天';
                    self.companyName = self.companyObj[user.company_id];
                }else{
                    self.$message.error(res.err_msg);
                }
            }).catch((err)=>{
                console.error(err);
            });
        },

        //提交修改用户信息
        reqModifyUserInfo(){
            const self = this;
            if(!this.$util.checkPhone(this.telephone)){
                this.$message.error('固话或手机号码格式不对');
                return;
            }
            if(!this.$util.checkEmail(this.email)){
                this.$message.error('邮箱格式不对');
                return;
            }
            this.$api.post("/update_user", {
                user: self.user,
                real_name : self.realName ,
                telephone : self.telephone ,
                email : self.email,
                // permissions: self.permissions
            }).then(res=>{
                if(res.err_code == '0'){
                    self.visible = false;
                    self.$message.success('修改成功');
                    // self.reqData();
                }else{
                    self.$message.error(res.err_msg);
                }
            });
        }
    },
    mounted (){
        this.reqCompany(()=>{
            this.reqUser();
        });

    }
}
</script>>

<style scoped>
.user-main {
    height: 100%;
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    padding-left: 6px;
}

.user-title {
    font-size: 20px;
    height: 40px;
    flex-grow: 0;
}

.user-content{
    flex-grow: 1;
    display: flex;
}
.face-head {
    width: 300px;
    height: 300px;
    background: white;
    flex-grow: 0;
    text-align: center;
    padding-top: 40px;
}

.user-base-info{
    background: white;
    flex-grow: 1;
    margin-left: 20px;
    margin-right: 4px;
    padding: 4px 48px;
    position: relative;
}
.submit-modify{
    position: absolute;
    right: 20px;
    top: 14px;
}

.face-head-photo{
    width: 160px;
    height: 160px;
    border-radius: 50%;
    margin: auto;
}
.face-head-photo>img{
    width: 160px;
    height: 160px;
    border-radius: 50%;
}
.face-head-greet{
    font-size: 26px;
    margin-top: 24px;
}
.base-info-title{
    height: 30px;
    margin-top: 28px;
    font-size: 16px;
}
.base-info-value{
    font-size: 16px;
    height: 32px;
    margin-top: 6px;
    border-bottom: 1px solid #eee;
    position: relative;
}
.base-info-value>input{
    width: 400px;
    height: 28px;
    border: none;
    outline: none;
    position: relative;
    right: 4px;
}
.base-info-value>img{
    width: 24px;
    height: 24px;
    position: absolute;
    right: 10px;
}
.edit-ipt{
    border: none;
    outline: none;
    width: 500px;
}
</style>
