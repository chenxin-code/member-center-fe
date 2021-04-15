const menu = {
  namespaced: true,
  state: {
    //存储定义的变量
    menuStatus: false //是否禁用menu
  },
  mutations: {
    //改变menu状态
    changeMenuStatus(state, paramState) {
      state.menuStatus = paramState;
    }
  }
};

export default menu;
