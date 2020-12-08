import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import user from './module/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    paramMap: {}
  },
  getters: {
    username: state => state.user.username,
    useravatar: state => state.user.useravatar
  },
  mutations: {
    REFRESHPARAM(state, paramKV) {
      //mutation，应该能看懂做的操作吧？
      Vue.set(state.paramMap, paramKV.key, paramKV.value);
    }
  },
  actions: {
    // 返回
    FALLBACK() {
      router.go(-1);
    }
  },
  modules: {
    user
  }
});

export default store;
