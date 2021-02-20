import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Antd from 'ant-design-vue'// 引入Ant Design Vue组件
import 'ant-design-vue/dist/antd.css' // 引入Ant Design Vue样式
import loading from './components/loading/Loading.js';
import api from './utils/api.js';
import util from './utils/util.js';


Vue.config.productionTip = false

Vue.use(Antd);
Vue.use(loading);
Vue.use(api);
Vue.use(util);


new Vue({
  router:router,
  render: h => h(App),
}).$mount('#app');
