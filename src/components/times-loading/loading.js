import showLoadingComponent from "./index.vue";

const showLoading = {};

// 注册Toast
showLoading.install = function(Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const showLoadingConstructor = Vue.extend(showLoadingComponent);
  // 生成一个该子类的实例
  const instance = new showLoadingConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement("div"));
  document.body.appendChild(instance.$el);

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$showLoading = () => {
    instance.isShow = true;
  };
  Vue.prototype.$hideLoading = () => {
    instance.isShow = false;
  };
};
export default showLoading;
