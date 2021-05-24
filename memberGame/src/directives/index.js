//引入
import clickOutside from "./src/clickOutside";
import infiniteScroll from "./src/infiniteScroll";

// 自定义指令集合
const directives = {
  clickOutside,
  infiniteScroll
};

/**
 * 这种写法可以批量注册指令
 * 写法1: 如果插件是一个对象，必须提供install方法
 */
const directivesPlugin = {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key]);
    });
  }
};

/**
 * 这种写法可以批量注册指令
 * 写法2: 如果插件是一个函数，它会被作为install方法
 */
// const directivesPlugin = function(Vue) {
//   Object.keys(directives).forEach(key => {
//     Vue.directive(key, directives[key]);
//   });
// };

export default directivesPlugin;
