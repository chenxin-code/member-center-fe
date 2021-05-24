// import toastComponent from "./index.vue";
import { Toast, Dialog } from "vant";

const toast = {};

// 注册Toast
toast.install = function(Vue) {
  // // 生成一个Vue的子类
  // // 同时这个子类也就是组件
  // const toastConstructor = Vue.extend(toastComponent);
  // // 生成一个该子类的实例
  // const instance = new toastConstructor();

  // // 将这个实例挂载在我创建的div上
  // // 并将此div加入全局挂载点内部
  // instance.$mount(document.createElement("div"));
  // document.body.appendChild(instance.$el);

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$toast = params => {
    return Toast(params);
  };
  Vue.prototype.$dialog = params => {
    return Dialog(params);
  };
  Vue.prototype.$confirm = params => {
    return Dialog.confirm(params);
  };
};
export default toast;
