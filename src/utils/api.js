import { assign } from 'lodash';
import { extend } from 'umi-request';
import router from '@/router';
import Vue from 'vue';

/**
 * Config
 */
const request = extend({
    prefix: process.env.VUE_APP_API,
    headers: {
        Accept: 'application/vnd.xc.v1+json',
    },
});
/**
 * Request
 */
// request.interceptors.request.use((url, options) => {
//     // 判断是否存在 Token，如果存在，则每个 Request 都加上 Token
//     if (sessionStorage.getItem('token')) {
//         options.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
//     }
//     return { url, options };
// });
/**
 * Response
 */
request.interceptors.response.use((response) => {
    // 状态码 401 时清空 LocalStorage
    if (response.status === 401) {
        sessionStorage.clear();
        router.push({ path: '/' });
    }
    return response;
});

/**
 * 远程接口
 * @author haaid <me@wanghaida.com>
 * @desc 如果需要 url 参数，那么需要传递一个 object，可能是如下的样子：
 * url = {
 *      id: 1,
 *      parent: 1,
 * }
 * 但是更多时候，get 请求需要的是 params 对象，post 请求需要的是 data 对象。
 */
const api = {
    get(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            request.get(url, assign(config, { params })).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    post(url, data, config = {}) {
        data = data || {};
        const token = sessionStorage.getItem('token');
        if (token) {
            data.token = token;
        }
        return new Promise((resolve, reject) => {
            request.post(url, assign(config, { data })).then((response) => {
                //token错误时强制退出
                if(response && response.err_code == '310'){
                    sessionStorage.clear();
                    router.replace({path: '/login'}, () => {},() => {});
                }
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
  
    // 账号密码登录
    login(data) {
        return this.post('/login', data);
    },
    // 退出登录
    logout() {
        return this.post('/logout');
    },
};


export default {
    install() {
      if (!Vue.$api) {
        Vue.$api = api;
      }
      Vue.mixin({
        created() {
          this.$api = Vue.$api;
        }
      });
    }
  };