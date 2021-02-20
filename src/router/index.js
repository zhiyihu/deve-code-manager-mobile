import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'


Vue.use(Router);
const router = new Router({
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: '/',
                    component: () => import('../views/user/UserInfo.vue'),
                },
                {
                    path: 'personal',
                    name: 'personal',
                    component: () => import('../views/user/UserInfo.vue'),
                },
                {
                    path: 'userlist',
                    name: 'userlist',
                    component: () => import('../views/admin/UserManager.vue'),
                    meta: {
                        roles: 'user-add,user-del,user-query'
                    }
                },
                {
                    path: 'loglist',
                    name: 'loglist',
                    component: () => import('../views/logs/LogList.vue'),
                    meta: {
                        roles: 'log-query',
                    }
                },
                {
                    path: 'companylist',
                    name: 'companylist',
                    component: () => import('../views/admin/CompanyManager.vue'),
                    meta: {
                        roles: 'company-add,company-del,company-query',
                    }
                },
                {
                    path: 'devicelist',
                    name: 'devicelist',
                    component: () => import('../views/admin/DeviceManager.vue'),
                    meta: {
                        roles: 'device-add,device-regist,device-query',
                    }
                },
                {
                    path: 'codelist',
                    name: 'codelist',
                    component: () => import('../views/admin/CodeManager.vue'),
                    meta: {
                        roles: 'device-add,device-regist,device-query',
                    }
                },
                {
                    path: 'coderegist',
                    name: 'coderegist',
                    component: () => import('../views/admin/CodeRegist.vue'),
                    meta: {
                        roles: 'device-regist',
                    }
                }
            ],
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
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
            next()
        } else {
            next({ path: '/personal' })
        }
    }

});
export default router;