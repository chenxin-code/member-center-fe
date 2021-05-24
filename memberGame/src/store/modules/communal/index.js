import { storages } from "@/utils/util";
const sessionStorge = storages(1);
const store = sessionStorge.get("store") || {};

const userInfo = {
  namespaced: true, //命名空间开启
  state: store.communal || {
    //默认地址小区
    defaultAreaCity: {
      cityName: ""
    },
    //选择城市
    selectCity: {
      cityName: ""
    },
    //选择小区
    selectArea: {
      areaName: ""
    },
    //上一页路由
    preRouterPage: "",
    //地址栏参数
    query: {}
  },
  mutations: {
    //设置为默认城市
    SET_DEFAULT_CITY(state, provider) {
      state.defaultAreaCity = provider;
    },
    //设置选择城市
    SET_SELECT_CITY(state, provider) {
      state.selectCity = provider;
    },
    //设置选择小区
    SET_SELECT_AREA(state, provider) {
      state.selectArea = provider;
    },
    //保存当前页面路由
    SET_PRE_ROUTER_PAGE(state, provider) {
      if (provider && provider.indexOf("login") > -1) {
        return;
      }
      state.preRouterPage = provider || "/pages/index/index";
    },
    //设置地址栏参数
    SET_ROUTER_QUERY(state, provider) {
      // const option = getHasParams(provider)
      state.query = {
        ...state.query,
        ...provider
      };
    }
  },
  actions: {
    //默认城市和地区
    setdefaultAreaCity({ commit, dispatch, state }, params) {
      commit("SET_DEFAULT_CITY", params);
    },
    //选择城市
    setSelectCity({ commit, dispatch, state }, params) {
      commit("SET_SELECT_CITY", params);
    },
    //选择小区
    setSelectArea({ commit, dispatch, state }, params) {
      commit("SET_SELECT_AREA", params);
    },
    //选择上一个路由页面
    async setPreRouterPage({ commit, dispatch, state }, params) {
      commit("SET_PRE_ROUTER_PAGE", params);
    },
    //存储地址栏参数一致不变
    setRouterQuery({ commit, dispatch, state }, params) {
      commit("SET_ROUTER_QUERY", params);
    }
  },
  getters: {}
};

export default userInfo;
