import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

let mapArr = require.context("./map", true, /\.js$/);

let routerList = [];
mapArr.keys().forEach(item => {
  routerList.push(...mapArr(item).default);
});

const routes = [...routerList];

const router = new VueRouter({
  mode: "hash",
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
