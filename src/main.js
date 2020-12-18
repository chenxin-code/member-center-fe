import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './assets/css/common.less';
Vue.use(Antd);

import './utils/lazy_use' // use lazy load components
import './utils/filter' // global filter
import './mock'

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
