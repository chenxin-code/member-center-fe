import Vue from 'vue';
import VueRouter from 'vue-router';
import paramsStorage from './ParamsStorage.js';
import store from '@/store';

Vue.use(VueRouter);

const Home = () => import('@/components/home');

//登录
const Login = () => import('@/pages/login/login');
//获取token
// const Token = () => import('@/pages/login/index');
//portal
const Portal = () => import('@/pages/portal/portal');

//住户档案
const ResidentFile = () => import('@/pages/residentFile/residentFile/residentFile');
const ResidentDetail = () => import('@/pages/residentFile/residentDetail/residentDetail');
const ResidentLabel = () => import('@/pages/residentFile/label/label');

let router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      menuKey: 'login',
      meta: { menu: '/login', bread: [{ path: '/login', name: '登录' }] },
      component: Login
    },
    //获取token使用
    // {
    //   path: '/token',
    //   name: 'token',
    //   menuKey: '',
    //   meta: { menu: '/token', bread: [{ path: '/token', name: '获取token' }] },
    //   component: Token
    // },
    {
      path: '/portal',
      name: 'portal',
      menuKey: 'portal',
      meta: { menu: '/portal', bread: [{ path: '/portal', name: 'portal' }] },
      component: Portal
    },
    {
      path: '/',
      redirect: { name: 'login' },
      name: 'home',
      menuKey: 'home',
      component: Home,
      children: [
        {
          path: '/resident',
          name: 'resident',
          menuKey: 'resident',
          meta: {
            menu: '/resident',
            authKeys: [''],
            bread: [{ path: '/resident', name: '住户档案' }],
            keepAlive: true
          },
          component: ResidentFile
        },
        {
          path: '/resident/detail',
          name: 'detail',
          props: paramsStorage.setPropsStorage,
          menuKey: 'resident',
          meta: {
            menu: '/resident',
            authKeys: [''],
            bread: [
              { path: '/resident', name: '住户档案' },
              { path: '/resident/detail', name: '住户详情' }
            ]
          },
          component: ResidentDetail
        },
        {
          path: '/residentLabel',
          name: 'residentLabel',
          menuKey: 'detail',
          meta: {
            menu: '/residentLabel',
            authKeys: [''],
            bread: [{ path: '/residentLabel', name: '标签管理' }]
          },
          component: ResidentLabel
        }
      ]
    },
    {
      path: '/404',
      component: () => import('../pages/exception/404')
    },
    {
      path: '/403',
      component: () => import('../pages/exception/403')
    },
    {
      path: '/500',
      component: () => import('../pages/exception/500')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});

router.beforeEach((to, from, next) => {
  paramsStorage.clearPropsStorage(to, from);

  if (to.matched.length === 0) {
    from.name
      ? next({
          name: from.name
        })
      : next('/404');
  } else {
    if (sessionStorage.getItem('refreshflag') == '1' && sessionStorage.getItem('store')) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))));
      sessionStorage.setItem('refreshflag', '0');
    }
    if (Object.keys(to.params).length === 0) {
      // 从store中取出付给params，此处注意路径未必完全吻合，以你的为准
      Object.assign(to.params, store.state.paramMap[to.name] || {});
    }
    // 存储一下params备用
    store.commit('REFRESHPARAM', { key: to.name, value: to.params });
    next();
  }
});

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error);
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
