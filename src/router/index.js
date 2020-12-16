import Vue from 'vue';
import VueRouter from 'vue-router';
import paramsStorage from './ParamsStorage.js';
import store from '@/store';

Vue.use(VueRouter);

const Home = () => import('@/components/home');

//登录
const Login = () => import('@/pages/login/login');
//portal
const Portal = () => import('@/pages/portal/portal');

//会员信息
const Dashboard = () => import('@/pages/dashboard');
const MemberInfo = () => import('@/pages/member/info/list');
const MemberInfoDetail = () => import('@/pages/member/info/detail');

/* 路由login和portal打开，并且路由home redirect到login，可以获取token */
const routes = [
  {
    path: '/login',
    name: 'login',
    menuKey: 'login',
    meta: { menu: '/login', bread: [{ path: '/login', name: '登录' }] },
    component: Login
  },
  {
    path: '/portal',
    name: 'portal',
    menuKey: 'portal',
    meta: { menu: '/portal', bread: [{ path: '/portal', name: 'portal' }] },
    component: Portal
  },
  {
    path: '/',
    redirect: '/dashboard',
    name: 'home',
    menuKey: 'home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        menuKey: 'dashboard',
        meta: {
          menu: '/dashboard',
          authKeys: [''],
          bread: [{ path: '/dashboard', name: '看板' }]
        },
        component: Dashboard
      },
      {
        path: '/memberInfo',
        name: 'memberInfo',
        menuKey: 'memberInfo',
        meta: {
          menu: '/memberInfo',
          authKeys: [''],
          bread: [{ path: '/memberInfo', name: '会员信息' }]
        },
        component: MemberInfo
      },
      {
        path: '/memberInfo/detail',
        name: 'memberInfoDetail',
        menuKey: 'memberInfo',
        meta: {
          menu: '/memberInfo',
          authKeys: [''],
          bread: [
            { path: '/memberInfo', name: '会员信息' },
            { path: '/memberInfo/detail', name: '会员详情' }
          ]
        },
        component: MemberInfoDetail
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/pages/exception/404')
  },
  {
    path: '/403',
    component: () => import('@/pages/exception/403')
  },
  {
    path: '/500',
    component: () => import('@/pages/exception/500')
  },
  {
    path: '*',
    redirect: '/404'
  }
];

const router = new VueRouter({
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  routes
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
