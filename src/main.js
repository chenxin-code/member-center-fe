import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import './assets/css/common.less'
import router from './router'
import store from './store'
import Vuex from "vuex"
Vue.use(Vuex)

Vue.config.productionTip = false
Vue.use(Antd);

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')