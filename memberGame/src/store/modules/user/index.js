import { getUrlQueryParams, storages } from "@/utils/util";
const storage = storages(0);
const sessionStorge = storages(1);
const store = sessionStorge.get("store") || {};
const userInfo = {
  namespaced: true, //命名空间开启
  state: store.user || {
    //电商内部token
    token: storage.get("token") || "",
    //中科服务商token
    zktoken: storage.get("zktoken") || ""
  },
  mutations: {
    //处理token方法
    SET_TOKEN(state, provider) {
      const getQuery = getUrlQueryParams() || {};
      const token = provider || getQuery["Authorization"] || getQuery["token"];
      if (token) {
        state.token = token;
        storage.set("token", token);
      }
    },
    //设置SET_ZK_TOKEN方法
    SET_ZK_TOKEN(state, provider) {
      const getQuery = getUrlQueryParams() || {};
      const token = provider || getQuery["Authorization"] || getQuery["token"];
      if (token) {
        state.zktoken = token;
        storage.set("zktoken", token);
      }
    }
  },
  actions: {
    //设置token
    setToken({ commit, dispatch, state }, params) {
      commit("SET_TOKEN", params);
    },
    //设置zkToken
    setZkToken({ commit, dispatch, state }, params) {
      commit("SET_ZK_TOKEN", params);
    }
  },
  getters: {
    token: state => {
      return state.token;
    }
  }
};

export default userInfo;
