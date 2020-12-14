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

//空间管理
//1.0空间
const Space = () => import('../pages/space/space/space');
const SpaceAdd = () => import('../pages/space/space/addSpace');
const SpaceEdit = () => import('../pages/space/space/editSpace');
const MainSpaceEdit = () => import('../pages/space/space/editMainSpace');
//2.0项目
const Project = () => import('../pages/space/project/project');
const ProjectDetail = () => import('../pages/space/project/detail');
const ProjectInfo = () => import('../pages/space/project/projectInfo');
const ProjectInfoMation = () => import('../pages/space/project/projectnformation');
//3.0标签
const Info = () => import('../pages/space/info/info');
const Detail = () => import('../pages/space/info/detail');

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
    // redirect: '/login',
    redirect: '/portal',
    name: 'home',
    menuKey: 'home',
    component: Home,
    children: [
      {
        path: '/space',
        name: 'space',
        menuKey: 'space',
        meta: {
          menu: '/space',
          keepAlive: true,
          authKeys: ['menu_space'],
          bread: [{ path: '/space', name: '空间列表' }]
        },
        component: Space
      },
      {
        path: '/space/add',
        name: 'spaceAdd',
        menuKey: 'space',
        props: paramsStorage.setPropsStorage,
        meta: {
          menu: '/space',
          authKeys: ['menu_space'],
          bread: [
            { path: '/space', name: '空间列表' },
            { path: '/space/add', name: '添加空间' }
          ]
        },
        component: SpaceAdd
      },
      {
        path: '/space/edit',
        name: 'spaceEdit',
        menuKey: 'space',
        props: paramsStorage.setPropsStorage,
        meta: {
          menu: '/space',
          authKeys: ['menu_space'],
          bread: [
            { path: '/space', name: '空间列表' },
            { path: '/space/edit', name: '编辑空间' }
          ]
        },
        component: SpaceEdit
      },
      {
        path: '/space/mainEdit',
        name: 'mainSpaceEdit',
        menuKey: 'space',
        props: paramsStorage.setPropsStorage,
        meta: {
          menu: '/space',
          authKeys: ['menu_space'],
          bread: [
            { path: '/space', name: '空间列表' },
            { path: '/space/mainEdit', name: '编辑空间' }
          ]
        },
        component: MainSpaceEdit
      },
      {
        path: '/project/second/projectList',
        name: 'projectList',
        menuKey: 'projectList',
        meta: {
          menu: '/project/second/projectList',
          authKeys: [''],
          bread: [{ path: '/project/second/projectList', name: '项目列表' }],
          keepAlive: true
        },
        component: Project
      },
      {
        path: '/project/second/projectDetail',
        name: 'projectDetail',
        props: paramsStorage.setPropsStorage,
        menuKey: 'projectDetail',
        meta: {
          menu: '/project/second/projectList',
          authKeys: [''],
          bread: [
            { path: '/project/second/projectList', name: '项目列表' },
            {
              path: '/project/second/projectDetail',
              name: '项目详情'
            }
          ]
        },
        component: ProjectDetail
      },
      {
        path: '/project/second/projectInfo',
        name: 'projectInfo',
        menuKey: 'projectInfo',
        meta: {
          menu: '/project/second/projectInfo',
          authKeys: [''],
          bread: [{ path: '/project/second/projectInfo', name: '社区信息列表' }]
        },
        component: ProjectInfo
      },
      {
        path: '/project/projectnformation',
        name: 'projectnformation',
        props: paramsStorage.setPropsStorage,
        menuKey: 'projectInfo',
        meta: {
          menu: '/project/second/projectInfo',
          authKeys: [''],
          bread: [
            { path: '/project/second/projectInfo', name: '社区信息列表' },
            { path: '/project/projectnformation', name: '创建社区信息列表' }
          ]
        },
        component: ProjectInfoMation
      },
      {
        path: '/info',
        name: 'info',
        menuKey: 'info',
        meta: {
          menu: '/info',
          authKeys: [''],
          bread: [{ path: '/info', name: '会员信息' }]
        },
        component: Info
      },
      {
        path: '/info/detail',
        name: 'detail',
        menuKey: 'detail',
        meta: {
          menu: '/info',
          authKeys: [''],
          bread: [
            { path: '/info', name: '会员信息' },
            { path: '/info/detail', name: '会员详情' }
          ]
        },
        component: Detail
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
