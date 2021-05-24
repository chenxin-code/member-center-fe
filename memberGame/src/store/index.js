import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user/index";
import communal from "./modules/communal/index";
Vue.use(Vuex);
const store = new Vuex.Store({
  //严格模式控制
  // strict: process.env.NODE_ENV !== 'production', //开发环境true;生产环境false;
  strict: true, //严格模式一直开启
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    communal
  }
});

export default store;
