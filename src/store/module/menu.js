const menu = {
  namespaced: true,
  state: {
    //存储定义的变量
    menuStatus: true //禁用menu为真
  },
  mutations: {
    //改变menu状态
    changeMenuStatus(state, paramState) {
      state.menuStatus = paramState;
    }
  }
};

export default menu;
