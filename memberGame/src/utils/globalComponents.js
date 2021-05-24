/******注册全局组件方法 */
// import Vue from 'vue'
import timesNoData from "@/components/times-nodata";
import timesButton from "@/components/times-button";
import timesConfirmButton from "@/components/times-confirm-button"
import showLoading from "@/components/times-loading/loading";
import toast from "@/components/times-toast";
import timesSelector from "@/components/times-selector";
import timesNavBar from "@/components/times-nav-bar";
import timesLuckyDialog from "@/components/times-lucky-dialog";
import showGameLoading from "@/components/times-game-loading/index";

const plugins = {
  //注册
  install(Vue) {
    //第一个参数:组件名称,第二个参数:要注册的组件
    Vue.component("timesNoData", timesNoData);
    Vue.component("timesButton", timesButton);
    Vue.component("timesConfirmButton", timesConfirmButton);
    Vue.component("timesSelector", timesSelector);
    Vue.component("timesNavBar", timesNavBar);
    Vue.component("timesLuckyDialog", timesLuckyDialog);
    Vue.use(showLoading)
    Vue.use(toast);
    Vue.use(showGameLoading)
  }
};

export default plugins;
