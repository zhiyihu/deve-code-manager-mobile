import Vue from 'vue'
import Router from 'vue-router'




Vue.use(Router);
let device = 'pc';
if(navigator && navigator.userAgent && (/Android|iPhone|iPad|Windows Phone/).test(navigator.userAgent)){
    device = 'mobile';
}
const getSrc = (name) =>{return ()=>import('../views/' + device + '/' + name + '.vue')};
const router = new Router({
    routes: [
        {
            path: '/',
            component: getSrc('Home'),
            children: [
                {
                    path: '/',
                    component: getSrc('UserInfo')
                },
                {
                    path: 'personal',
                    name: 'personal',
                    component: getSrc('UserInfo'),
                    meta:{
                        title: '个人信息'
                    }
                },
                {
                    path: 'userlist',
                    name: 'userlist',
                    component: getSrc('UserManager'),
                    meta: {
                        roles: 'user-add,user-del,user-query',
                        title: '用户管理'
                    }
                },
                {
                    path: 'loglist',
                    name: 'loglist',
                    component: getSrc('LogList'),
                    meta: {
                        roles: 'log-query',
                        title: '日志列表',
                    }
                },
                {
                    path: 'companylist',
                    name: 'companylist',
                    component: getSrc('CompanyManager'),
                    meta: {
                        roles: 'company-add,company-del,company-query',
                        title: '公司管理',
                    }
                },
                {
                    path: 'devicelist',
                    name: 'devicelist',
                    component: getSrc('DeviceManager'),
                    meta: {
                        roles: 'device-regist,device-query',
                        title: '设备管理'
                    }
                },
                {
                    path: 'codelist',
                    name: 'codelist',
                    component: getSrc('CodeManager'),
                    meta: {
                        roles: 'device-regist',
                        title: '注册码管理'
                    }
                },
                {
                    path: 'coderegist',
                    name: 'coderegist',
                    component: getSrc('CodeRegist'),
                    meta: {
                        roles: 'device-regist',
                        title: '主机注册'
                    }
                },
                {
                    path: 'devicechange',
                    name: 'devicechange',
                    component: getSrc('DeviceCompanyChange'),
                    meta: {
                        roles: 'device-query,device-update',
                        title: '变更主机所属公司'
                    }
                },
                {
                    path: 'emailconfig',
                    name: 'emailconfig',
                    component: getSrc('EmailConfig'),
                    meta: {
                        roles: 'admin',
                        title: '邮件服务器配置'
                    }
                },
                {
                    path: 'wxminiconfig',
                    name: 'wxminiconfig',
                    component: getSrc('WxMiniProgramConfig'),
                    meta: {
                        roles: 'admin',
                        title: '注册码小程序配置'
                    }
                },
                {
                    path: 'wxpublicconfig',
                    name: 'wxpublicconfig',
                    component: getSrc('WxPublicConfig'),
                    meta: {
                        roles: 'admin',
                        title: '微信公众号配置'
                    }
                },
                {
                    path: 'devicetypeconfig',
                    name: 'devicetypeconfig',
                    component: getSrc('DeviceTypeConfig'),
                    meta: {
                        roles: 'admin',
                        title: '生产入库做码配置'
                    }
                },
                {
                    path: 'deviceimgconfig',
                    name: 'deviceimgconfig',
                    component: getSrc('DeviceImgConfig'),
                    meta: {
                        roles: 'admin',
                        title: '设备图片配置'
                    }
                },
                {
                    path: 'devicefuncconfig',
                    name: 'devicefuncconfig',
                    component: getSrc('DeviceFuncConfig'),
                    meta: {
                        roles: 'admin',
                        title: '设备功能码配置'
                    }
                }
            ],
        },
        {
            path: '/login',
            name: 'Login',
            component: getSrc('Login')
        }
    ],
});
const matchPermission = (permissions, roles)=>{
    for(let item of roles.split(',')){
        if(!permissions.includes(item)){
            return false;
        }
    }
    return true;
}
const hasRole = (permissions, roles)=>{
    return !roles || permissions == 'admin' || matchPermission(permissions, roles);
}

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    document.title = '注册码管理系统';
    const user = JSON.parse(sessionStorage.getItem("user"));
    const permissions = ((user|| {}).permissions || "");
    if (to.name !== 'Login' && !sessionStorage.getItem('token')) {
        next({ name: 'Login' });
    } else {
        if (to.matched.length !== 0 && hasRole(permissions, to.meta.roles)){
            next();
            if(to.meta && to.meta.title){
                document.title = '注册码管理系统-' + to.meta.title;
            }
        } else {
            next({ path: '/personal' })
        }
    }
    

});
export default router;