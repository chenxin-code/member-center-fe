import Vue from 'vue';
import VueRouter from 'vue-router';
import paramsStorage from './ParamsStorage.js';
import store from '@/store';
import api from '@/api';

Vue.use(VueRouter);

const Home = () => import('@/components/home');

//会员信息
const Dashboard = () => import('@/pages/member/dashboard');
const MemberInfo = () => import('@/pages/member/info/list');
const MemberInfoDetail = () => import('@/pages/member/info/detail');
const IntegralManage = () => import('@/pages/member/integral/list');

const TaskManager = () => import('@/pages/taskManager/index');

const TaskDetail = () => import('@/pages/taskManager/detail');

const Card = () => import('@/pages/card/index');

const CardDetail = () => import('@/pages/card/detail');

const Dealing = () => import('@/pages/dealingManager/index');

const DealingDetail = () => import('@/pages/dealingManager/detail');

const AccessManager = () => import('@/pages/accessManager/index');

const DccessDetail = () => import('@/pages/accessManager/detail');

// 卡券
const CouponsClaim = () => import('@/pages/coupons/claim/list');
const CouponsCancel = () => import('@/pages/coupons/cancel/list');
const CouponsManage = () => import('@/pages/coupons/manage/list');
const CouponsManageEdit = () => import('@/pages/coupons/manage/edit');
const CouponsManageCopy = () => import('@/pages/coupons/manage/copy');
const CouponsManageNew = () => import('@/pages/coupons/manage/new');
const CouponsManageDetail = () => import('@/pages/coupons/manage/detail');
const CouponsRelease = () => import('@/pages/coupons/release/index');
const CouponsReleaseDetail = () => import('@/pages/coupons/release/detail');
const CouponsReleaseCreate = () => import('@/pages/coupons/release/create');
const CouponsReleaseStatus = () => import('@/pages/coupons/release/status');

const routes = [
  //首页:home
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
          bread: [{ path: '/dashboard', name: '会员看板' }]
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
          bread: [{ path: '/memberInfo', name: '会员信息' }],
          isUseCache: false,
          keepAlive: true
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
      },
      {
        path: '/integralManage',
        name: 'integralManage',
        menuKey: 'integralManage',
        meta: {
          menu: '/integralManage',
          authKeys: [''],
          bread: [{ path: '/integralManage', name: '积分管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: IntegralManage
      },
      {
        path: '/couponsManage',
        name: 'couponsManage',
        menuKey: 'couponsManage',
        meta: {
          menu: '/couponsManage',
          authKeys: [''],
          bread: [{ path: '/couponsManage', name: '卡券管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: CouponsManage
      },
      {
        path: '/couponsManage/new',
        name: 'couponsManageNew',
        menuKey: 'couponsManage',
        meta: {
          menu: '/couponsManage',
          authKeys: [''],
          bread: [
            { path: '/couponsManage', name: '卡券管理' },
            { path: '/couponsManage/new', name: '卡券创建' }
          ]
        },
        component: CouponsManageNew
      },
      {
        path: '/couponsManage/edit',
        name: 'couponsManageEdit',
        menuKey: 'couponsManage',
        meta: {
          menu: '/couponsManage',
          authKeys: [''],
          bread: [
            { path: '/couponsManage', name: '卡券管理' },
            { path: '/couponsManage/edit', name: '卡券创建' }
          ]
        },
        component: CouponsManageEdit
      },
      {
        path: '/couponsManage/copy',
        name: 'couponsManageCopy',
        menuKey: 'couponsManage',
        meta: {
          menu: '/couponsManage',
          authKeys: [''],
          bread: [
            { path: '/couponsManage', name: '卡券管理' },
            { path: '/couponsManage/copy', name: '卡券创建' }
          ]
        },
        component: CouponsManageCopy
      },
      {
        path: '/couponsManage/detail',
        name: 'couponsManageDetail',
        menuKey: 'couponsManage',
        meta: {
          menu: '/couponsManage',
          authKeys: [''],
          bread: [
            { path: '/couponsManage', name: '卡券管理' },
            { path: '/couponsManage/detail', name: '卡券查看' }
          ]
        },
        component: CouponsManageDetail
      },
      {
        path: '/couponsClaim',
        name: 'couponsClaim',
        menuKey: 'couponsClaim',
        meta: {
          menu: '/couponsClaim',
          authKeys: [''],
          bread: [{ path: '/couponsClaim', name: '卡券领取记录' }],
          isUseCache: false,
          keepAlive: true
        },
        component: CouponsClaim
      },
      {
        path: '/couponsCancel',
        name: 'couponsCancel',
        menuKey: 'couponsCancel',
        meta: {
          menu: '/couponsCancel',
          authKeys: [''],
          bread: [{ path: '/couponsCancel', name: '卡券核销记录' }],
          isUseCache: false,
          keepAlive: true
        },
        component: CouponsCancel
      },
      {
        path: '/card',
        name: 'card',
        menuKey: 'card',
        meta: {
          menu: '/card',
          authKeys: [''],
          bread: [
            {
              path: '/card',
              name: '会员卡列表'
            }
          ]
        },
        component: Card
      },
      {
        path: '/card/detail',
        name: 'card_detail',
        menuKey: 'card',
        meta: {
          menu: '/card',
          authKeys: [''],
          bread: [
            { path: '/card', name: '会员卡列表' },
            { path: '/card/detail', name: '会员卡详情' }
          ]
        },
        component: CardDetail
      },
      {
        path: '/task-manager',
        name: 'task-manager',
        menuKey: 'task-manager',
        meta: {
          menu: '/task-manager',
          authKeys: [''],
          bread: [
            {
              path: '/task-manager',
              name: '任务管理'
            }
          ],
          isUseCache: false,
          keepAlive: true
        },
        component: TaskManager
      },
      {
        path: '/task-manager/detail',
        name: 'task_detail',
        menuKey: 'task-manager',
        meta: {
          menu: '/task-manager',
          authKeys: [''],
          bread: [
            { path: '/task-manager', name: '任务管理' },
            { path: '/task-manager/detail', name: '任务详情' }
          ]
        },
        component: TaskDetail
      },
      {
        path: '/access-manager',
        name: 'access',
        menuKey: 'access-manager',
        meta: {
          menu: '/access-manager',
          authKeys: [''],
          bread: [
            {
              path: '/access-manager',
              name: '接入系统管理'
            }
          ]
        },
        component: AccessManager
      },
      {
        path: '/access-manager/detail',
        name: 'access_detail',
        menuKey: 'access-manager',
        meta: {
          menu: '/access-manager',
          authKeys: [''],
          bread: [
            { path: '/access-manager', name: '接入系统管理' },
            { path: '/access-manager/detail', name: '接入系统管理详情' }
          ]
        },
        component: DccessDetail
      },
      {
        path: '/dealing',
        name: 'dealing',
        menuKey: 'dealing',
        meta: {
          menu: '/dealing',
          authKeys: [''],
          bread: [{ path: '/dealing', name: '行为管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: Dealing
      },
      {
        path: '/dealing/detail',
        name: 'dealing_detail',
        menuKey: 'dealing',
        meta: {
          menu: '/dealing',
          authKeys: [''],
          bread: [
            { path: '/dealing', name: '行为管理' },
            { path: '/dealing/detail', name: '行为日志' }
          ]
        },
        component: DealingDetail
      },
      {
        path: '/couponsRelease',
        name: 'release',
        menuKey: 'couponsRelease',
        meta: {
          menu: '/couponsRelease',
          authKeys: [''],
          bread: [{ path: '/couponsRelease', name: '卡券派发' }],
          isUseCache: false,
          keepAlive: true
        },
        component: CouponsRelease
      },
      {
        path: '/couponsRelease/detail',
        name: 'release_detail',
        menuKey: 'couponsRelease',
        meta: {
          menu: '/couponsRelease',
          authKeys: [''],
          bread: [
            { path: '/couponsRelease', name: '卡券派发' },
            { path: '/couponsRelease/detail', name: '派发详情' }
          ]
        },
        component: CouponsReleaseDetail
      },
      {
        path: '/couponsRelease/create',
        name: 'release_create',
        menuKey: 'couponsRelease',
        meta: {
          menu: '/couponsRelease',
          authKeys: [''],
          bread: [
            { path: '/couponsRelease', name: '卡券派发' },
            { path: '/couponsRelease/create', name: '新建派发' }
          ]
        },
        component: CouponsReleaseCreate
      },
      {
        path: '/couponsRelease/status',
        name: 'release_status',
        menuKey: 'couponsRelease',
        meta: {
          menu: '/couponsRelease',
          authKeys: [''],
          bread: [
            { path: '/couponsRelease', name: '卡券派发' },
            { path: '/couponsRelease/status', name: '卡券发放完成' }
          ]
        },
        component: CouponsReleaseStatus
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

router.beforeEach(async (to, from, next) => {
  console.log('router beforeEach 全局守卫执行了: ', to.path);
  console.log('beforeEach to :>> ', to);
  // store.commit('menu/changeMenuStatus', true); //禁止menu
  await api
    .getLoginUrl()
    .finally(() => {
      //测试异步用
      // setTimeout(() => {
      //   console.log('beforeEach store :>> ', store);
      //   console.log('beforeEach setTimeout...');
      //   store.commit('menu/changeMenuStatus', false); //解禁menu
      // }, 3000);
      console.log('beforeEach setTimeout...');
      // store.commit('menu/changeMenuStatus', false); //解禁menu
    })
    .then(res => {
      console.log('beforeEach getLoginUrl res :>> ', res);
      if (res.code === 200) {
        window.localStorage.setItem('SD_LOGIN_URL', res.data);
      }
    });

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
