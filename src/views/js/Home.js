import {getMenus} from '../../utils/menus';
export default {
    methods: {
        loginout() {
            const self = this;
            this.$api.logout().then(() => {
                sessionStorage.clear();
                self.$router.replace({
                    path: '/login'
                });
            }).catch(() => {
                sessionStorage.clear();
                self.$router.replace({
                    path: '/login'
                });
            });
        },

        toPersonal(){
            this.$router.replace({
                path: '/personal'
            });
        },

        modifyPwd(){
            this.visible = true;
            this.oldPwd = '';
            this.newPwd = '';
            this.confirmPwd = '';
        },
        handleOk() {
            const self = this;
            if(!this.$util.checkPwd(this.newPwd)){
                this.$message.error('密码必须有字母、数字、符号，长度8~20');
                return;
            }
            if(this.newPwd != this.confirmPwd){
                this.$message.error('两次输入密码不一致');
                return;
            }
            this.$api.post('/change_password',{
                user: self.loginName,
                old_password: self.oldPwd,
                new_password: self.newPwd
            }).then(res => {
                if(res.err_code == '0'){
                    self.$message.success('密码修改成功');
                }else{
                    self.$message.error(res.err_msg);
                }
                self.visible = false;
            });
        },
        handleCancel() {
            this.visible = false;
        },
        changeSelectKey(key) {
            this.selectKey = [key];
            this.hideMenuSlide();
        },
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find(
                (key) => this.openKeys.indexOf(key) === -1
            );
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys;
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        },

        reqUserInfo() {
            const self = this;
            this.$loading.show();
            this.$api.post("/query_user", {
                type: "0",
            }).then(res=>{
                if(res.err_code == '0'){
                    const user = res.users[0];
                    sessionStorage.setItem('user', JSON.stringify(user));
                    self.menuList = getMenus(user.permissions);
                    self.initMenuStatus();
                    self.realName = user.real_name;
                }
                self.$loading.hide();
            }).catch(()=>{
                self.$loading.hide();
            });
        },
        initMenuStatus(){
            //刷新的时候根据当前路由来匹配选中菜单
            const path = this.$route.path;
            const key = path.replace(/\//g, '') || 'personal';
            this.changeSelectKey(key);
            for (let item of this.menuList) {
                for (let menu of item.menus) {
                    if (menu.key == key) {
                        this.openKeys = [item.key];
                    }
                }
            }
        },
        showMenuSlide(){
            this.menuStyle.flexBasis = '200px';
            this.menuStyle.width = '200px';
            this.menuBtnStyle.display = 'none';
            this.closeBtnStyle.display = 'block';
            this.userHeadStyle.display = 'none';
         
        },

        hideMenuSlide(){
            this.menuStyle.flexBasis = '0px';
            this.menuStyle.width = '0px';
            this.menuBtnStyle.display = 'block';
            this.closeBtnStyle.display = 'none';
            this.userHeadStyle.display = 'block';
            

        }
    },
    data() {
        return {
            userHeadStyle: {},
            menuBtnStyle:{zIndex:99},
            closeBtnStyle:{display:'none'},
            menuStyle:{overflowX: 'hidden',overflowY: 'auto', width: '0px',minWidth:'0px',flexBasis: '0px'},
            asideMenuStyle: {},
            visible: false,
            realName: '',
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
            contentStyle: {
                background: "#fff",
                height: document.body.clientHeight - 100 + "px",
            },
            rootSubmenuKeys: ["person", "manager", "logs"],
            openKeys: ["person"],
            selectKey: ["personal"],
            loginName: sessionStorage.getItem("username"),
            menuList: [],
        }
    },
    watch:{
        $route(to){
            if("/" + this.selectKey[0] != to.path){
                this.initMenuStatus();
            }
        }
    },
    mounted() {
        const self = this;
        window.onresize = () => {
            self.contentStyle.height = document.body.clientHeight - 100 + "px";
        };
        this.reqUserInfo();
    },
};