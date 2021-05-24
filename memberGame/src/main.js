/*
 * @Description: 这是***页面
 * @Date: 2021-01-13 19:14:22
 * @LastEditTime: 2021-01-18 11:49:08
 */
//依赖引入
import Vue from "vue";
import axios from "axios";

//入口和js文件引入
import App from "./App.vue";
import router from "./router";
import store from "./store";
import directives from "./directives";
import * as util from "./utils/util";
import "@/assets/css/common.less"; //全局通用样式
import "./utils/rem.js"; //rem配置文件
import * as filters from "./utils/filters"; // global filters
//注册全局过滤器方法
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

//注册全局组件
import GL_Component from "@/utils/globalComponents";
Vue.use(GL_Component);

//添加全局自定义指令
Vue.use(directives); //自定义指令

/* 路由发生变化修改页面title */
router.beforeEach((to, from, next) => {
  console.log("to----->", to);
  // console.log("from----->", from);
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
  store.dispatch("user/setToken");
  store.dispatch("communal/setRouterQuery", to.query || {});
});

//添加axios到全局
Vue.prototype.$axios = axios;
//添加全局方法
Vue.prototype.$util = util; //全局工具函数

//isDebug全局变量
// Vue.prototype.$isDebug = isDebug;

//引入vant
import Vant from "vant";
import "vant/lib/index.css";
import "vant/lib/icon/local.css";
Vue.use(Vant);

Vue.config.productionTip = false;

Vue.mixin({
  beforeRouteLeave: function(to, from, next) {
    if (
      from &&
      from.meta.rank &&
      to.meta.rank &&
      from.meta.rank > to.meta.rank
    ) {
      //如果返回上一层，则摧毁本层缓存。
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (
          this.$vnode.parent &&
          this.$vnode.parent.componentInstance &&
          this.$vnode.parent.componentInstance.cache
        ) {
          if (this.$vnode.componentOptions) {
            var key =
              this.$vnode.key == null
                ? this.$vnode.componentOptions.Ctor.cid +
                  (this.$vnode.componentOptions.tag
                    ? `::${this.$vnode.componentOptions.tag}`
                    : "")
                : this.$vnode.key;
            var cache = this.$vnode.parent.componentInstance.cache;
            var keys = this.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
      this.$destroy();
    }
    next();
  }
});

//创建根实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
