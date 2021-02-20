const menus = [{
    title: '个人中心',
    key: 'person',
    icon: 'icon-geren',
    menus: [{
        title: '个人信息',
        key: 'personal',
        link: '/personal',
    },]
},
{
    title: '综合管理',
    key: 'manager',
    icon: 'icon-zongheguanli',
    menus: [
        {
            title: '用户管理',
            key: 'userlist',
            link: '/userlist',
            roles: 'user-add,user-del,user-query'
        },
        {
            title: '公司管理',
            key: 'companylist',
            link: '/companylist',
            roles: 'company-add,company-del,company-query',
        },
    ],
},
{
    title: '操作及日志',
    key: 'logs',
    icon: 'icon-rizhi',
    menus: [
        {
            title: '日志列表',
            key: 'loglist',
            link: '/loglist',
            roles: 'log-query',
        }

    ],
},
{
    title: '主机管理',
    key: 'device',
    icon: 'icon-shebei',
    menus: [
        {
            title: '主机管理',
            key: 'devicelist',
            link: '/devicelist',
            roles: 'device-add,device-regist,device-query',
        },
        {
            title: '注册码管理',
            key: 'codelist',
            link: '/codelist',
            roles: 'device-add,device-regist,device-query',
        },
        {
            title: '主机注册',
            key: 'coderegist',
            link: '/coderegist',
            roles: 'device-regist',
        }

    ],
}
];

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

export function getMenus(permissions) {
    let resMenus = [];
    for(const menu of menus){
        let secondMenus = [];
        for(const m of menu.menus){
            if(hasRole(permissions, m.roles)){
                secondMenus.push(m);
            }
        }
        if(secondMenus.length > 0){
            resMenus.push({...menu, ...{menus: secondMenus}});
        }
    }
    return resMenus;
} 