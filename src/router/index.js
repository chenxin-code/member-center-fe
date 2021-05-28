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

// 游戏
const gameManage = () => import('@/pages/game/index');
const addGame = () => import('@/pages/game/addGame');
const prizeManage = () => import('@/pages/game/prizeManage'); //奖品管理
const peopleManage = () => import('@/pages/game/peopleManageList'); //奖品管理

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

      // 游戏管理
      {
        path: '/gameManage',
        name: 'gameManage',
        menuKey: 'gameManage',
        meta: {
          menu: '/gameManage',
          authKeys: [''],
          bread: [{ path: '/gameManage', name: '游戏管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: gameManage
      },
      {
        path: '/gameManage/addGame',
        name: 'addGame',
        menuKey: 'addGame',
        meta: {
          menu: '/gameManage',
          authKeys: [''],
          bread: [{ path: '/gameManage', name: '游戏管理' }],
          isUseCache: false,
        },
        component: addGame
      },
      {
        path: '/gameManage/prizeManage',
        name: 'prizeManage',
        menuKey: 'prizeManage',
        meta: {
          menu: '/gameManage',
          authKeys: [''],
          bread: [{ path: '/gameManage', name: '游戏管理' }],
          isUseCache: false,
        },
        component: prizeManage
      },
      {
        path: '/gameManage/peopleManage',
        name: 'peopleManage',
        menuKey: 'peopleManage',
        meta: {
          menu: '/gameManage',
          authKeys: [''],
          bread: [{ path: '/gameManage', name: '游戏管理' }],
          isUseCache: false,
        },
        component: peopleManage
      },

      //// 活动管理 start
      {
        path: '/actManage',
        name: 'actManage',
        menuKey: 'actManage',
        meta: {
          menu: '/actManage',
          authKeys: [''],
          bread: [{ path: '/actManage', name: '活动管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/actManage/list')
      },
      {
        path: '/actManage/new',
        name: 'actManageNew',
        menuKey: 'actManage',
        meta: {
          menu: '/actManage',
          authKeys: [''],
          bread: [
            { path: '/actManage', name: '活动管理' },
            { path: '/actManage/new', name: '新建活动' }
          ]
        },
        component: () => import('@/pages/actManage/new')
      },
      {
        path: '/actManage/edit',
        name: 'actManageEdit',
        menuKey: 'actManage',
        meta: {
          menu: '/actManage',
          authKeys: [''],
          bread: [
            { path: '/actManage', name: '活动管理' },
            { path: '/actManage/edit', name: '编辑活动' }
          ]
        },
        component: () => import('@/pages/actManage/edit')
      },
      {
        path: '/actManage/detail',
        name: 'actManageDetail',
        menuKey: 'actManage',
        meta: {
          menu: '/actManage',
          authKeys: [''],
          bread: [
            { path: '/actManage', name: '活动管理' },
            { path: '/actManage/detail', name: '查看活动' }
          ]
        },
        component: () => import('@/pages/actManage/detail')
      },
      //// 活动管理 end
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
        path: '/vopCertificates',
        name: 'vopCertificates',
        menuKey: 'vopCertificates',
        meta: {
          menu: '/vopCertificates',
          authKeys: [''],
          bread: [{ path: '/vopCertificates', name: '实物券核销记录' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/coupons/cancel/vopCertificates.vue')
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
        path: '/taskCenter-task',
        name: 'taskCenter-task',
        menuKey: 'taskCenter-task',
        meta: {
          menu: '/taskCenter-task',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-task',
              name: '任务管理'
            }
          ],
          isUseCache: false,
          keepAlive: false
        },
        component: () => import('@/pages/taskCenter/task/index.vue')
      },
      {
        path: '/taskCenter-distribute',
        name: 'taskCenter-distribute',
        menuKey: 'taskCenter-distribute',
        meta: {
          menu: '/taskCenter-distribute',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-distribute',
              name: '任务派发'
            }
          ],
          isUseCache: false,
          keepAlive: false
        },
        component: () => import('@/pages/taskCenter/distribute/index.vue')
      },
      {
        path: '/taskCenter-distribute/create',
        name: 'taskCenter-distribute-create',
        menuKey: 'taskCenter-distribute-create',
        meta: {
          menu: '/taskCenter-distribute',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-distribute',
              name: '任务派发'
            }
          ],
          isUseCache: false,
          keepAlive: false
        },
        component: () => import('@/pages/taskCenter/distribute/create.vue')
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
        component: () => import('@/pages/taskManager/index.vue')
      },
      {
        path: '/taskCenter-task',
        name: 'taskCenter-task',
        menuKey: 'taskCenter-task',
        meta: {
          menu: '/taskCenter-task',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-task',
              name: '任务管理'
            }
          ],
          isUseCache: false,
          keepAlive: false
        },
        component: () => import('@/pages/taskCenter/task/index.vue')
      },
      {
        path: '/taskCenter-task/detial',
        name: 'taskCenter-task-detial',
        menuKey: 'taskCenter-task-detial',
        meta: {
          menu: '/taskCenter-task-detial',
          authKeys: [''],
          bread: [
            {
              path: '/task-manager',
              name: '任务管理'
            },
            {
              path: '/taskCenter-task-detial',
              name: '任务管理详情'
            }
          ],
          isUseCache: false,
          keepAlive: false
        },
        component: () => import('@/pages/taskCenter/task/detial.vue')
      },
      {
        path: '/taskCenter-task/create',
        name: 'taskCenter-task-create',
        menuKey: 'taskCenter-task-create',
        meta: {
          menu: '/taskCenter-task-create',
          authKeys: [''],
          bread: [
            {
              path: '/task-manager',
              name: '任务管理'
            },
            {
              path: '/taskCenter-task-create',
              name: '新建任务'
            }
          ],
          isUseCache: false,
          keepAlive: false
        },
        component: () => import('@/pages/taskCenter/task/create.vue')
      },
      {
        path: '/taskCenter-behavior',
        name: 'taskCenter-behavior',
        menuKey: 'taskCenter-behavior',
        meta: {
          menu: '/taskCenter-behavior',
          authKeys: [''],
          bread: [
            {
              path: '/task-manager',
              name: '行为管理'
            }
          ],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/taskCenter/behavior/list.vue')
      },
      {
        path: '/taskCenter-behavior/add',
        name: 'taskCenter-behavior-add-edit',
        menuKey: 'taskCenter-behavior-add-edit',
        meta: {
          menu: '/taskCenter-behavior-add-edit',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-behavior',
              name: '行为管理'
            },
            {
              path: '/taskCenter-behavior/add',
              name: '创建行为'
            }
          ]
        },
        component: () => import('@/pages/taskCenter/behavior/add-edit.vue')
      },
      {
        path: '/taskCenter-behavior/edit',
        name: 'taskCenter-behavior-add-edit',
        menuKey: 'taskCenter-behavior-add-edit',
        meta: {
          menu: '/taskCenter-behavior-add-edit',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-behavior',
              name: '行为管理'
            },
            {
              path: '/taskCenter-behavior/edit',
              name: '编辑行为'
            }
          ]
        },
        component: () => import('@/pages/taskCenter/behavior/add-edit.vue')
      },
      {
        path: '/taskCenter-behavior/detial',
        name: 'taskCenter-behavior-detial',
        menuKey: 'taskCenter-behavior-detial',
        meta: {
          menu: '/taskCenter-behavior-detial',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-behavior',
              name: '行为管理'
            },
            {
              path: '/taskCenter-behavior/detial',
              name: '行为详情'
            }
          ]
        },
        component: () => import('@/pages/taskCenter/behavior/detial.vue')
      },
      {
        path: '/taskCenter-behavior/journal',
        name: 'taskCenter-behavior-journal',
        menuKey: 'taskCenter-behavior-journal',
        meta: {
          menu: '/taskCenter-behavior-journal',
          authKeys: [''],
          bread: [
            {
              path: '/taskCenter-behavior',
              name: '行为管理'
            },
            {
              path: '/taskCenter-behavior/journal',
              name: '行为日志'
            }
          ]
        },
        component: () => import('@/pages/taskCenter/behavior/journal.vue')
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
      },
      {
        path: '/actTheme',
        name: 'actTheme',
        menuKey: 'actTheme',
        meta: {
          menu: '/actTheme',
          authKeys: [''],
          bread: [{ path: '/actTheme', name: '活动主题管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/actTheme/list')
      },
      {
        path: '/actTheme/add',
        name: 'actThemeAddEdit',
        menuKey: 'actTheme',
        meta: {
          menu: '/actTheme',
          authKeys: [''],
          bread: [
            { path: '/actTheme', name: '活动主题管理' },
            { path: '/actTheme/add', name: '新建活动主题' }
          ]
        },
        component: () => import('@/pages/actTheme/add-edit')
      },
      {
        path: '/actTheme/edit',
        name: 'actThemeAddEdit',
        menuKey: 'actTheme',
        meta: {
          menu: '/actTheme',
          authKeys: [''],
          bread: [
            { path: '/actTheme', name: '活动主题管理' },
            { path: '/actTheme/edit', name: '编辑活动主题' }
          ]
        },
        component: () => import('@/pages/actTheme/add-edit')
      },
      {
        path: '/actJoin',
        name: 'actJoin',
        menuKey: 'actJoin',
        meta: {
          menu: '/actJoin',
          authKeys: [''],
          bread: [{ path: '/actJoin', name: '活动参与数据' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/actJoin/list')
      },
      {
        path: '/systemRecord',
        name: 'systemRecord',
        menuKey: 'systemRecord',
        meta: {
          menu: '/systemRecord',
          authKeys: [''],
          bread: [{ path: '/systemRecord', name: '系统运行日志' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/systemRecord/list')
      },
      {
        path: '/systemRecord/detail',
        name: 'systemRecordDetail',
        menuKey: 'systemRecord',
        meta: {
          menu: '/systemRecord',
          authKeys: [''],
          bread: [
            { path: '/systemRecord', name: '系统运行日志' },
            { path: '/systemRecord/detail', name: '日志详情' }
          ]
        },
        component: () => import('@/pages/systemRecord/detail')
      },
      {
        path: '/gift',
        name: 'gift',
        menuKey: 'gift',
        meta: {
          menu: '/gift',
          authKeys: [''],
          bread: [{ path: '/gift', name: '礼包管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/gift/list')
      },
      {
        path: '/gift/add',
        name: 'giftAddEdit',
        menuKey: 'gift',
        meta: {
          menu: '/gift',
          authKeys: [''],
          bread: [
            { path: '/gift', name: '礼包管理' },
            { path: '/gift/add', name: '新建礼包' }
          ]
        },
        component: () => import('@/pages/gift/add-edit')
      },
      {
        path: '/gift/edit',
        name: 'giftAddEdit',
        menuKey: 'gift',
        meta: {
          menu: '/gift',
          authKeys: [''],
          bread: [
            { path: '/gift', name: '礼包管理' },
            { path: '/gift/edit', name: '编辑礼包' }
          ]
        },
        component: () => import('@/pages/gift/add-edit')
      },
      {
        path: '/gift/detail',
        name: 'giftDetail',
        menuKey: 'gift',
        meta: {
          menu: '/gift',
          authKeys: [''],
          bread: [
            { path: '/gift', name: '礼包管理' },
            { path: '/gift/detail', name: '礼包详情' }
          ]
        },
        component: () => import('@/pages/gift/detail')
      },
      {
        path: '/gift/content',
        name: 'giftContent',
        menuKey: 'gift',
        meta: {
          menu: '/gift',
          authKeys: [''],
          bread: [
            { path: '/gift', name: '礼包管理' },
            { path: '/gift/content', name: '礼包内容管理' }
          ]
        },
        component: () => import('@/pages/gift/content')
      },
      {
        path: '/giftH',
        name: 'giftH',
        menuKey: 'giftH',
        meta: {
          menu: '/giftH',
          authKeys: [''],
          bread: [{ path: '/giftH', name: '节日礼包管理' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/giftH/list')
      },
      {
        path: '/giftH/add',
        name: 'giftHAddEdit',
        menuKey: 'giftH',
        meta: {
          menu: '/giftH',
          authKeys: [''],
          bread: [
            { path: '/giftH', name: '节日礼包管理' },
            { path: '/giftH/add', name: '新建节日礼包' }
          ]
        },
        component: () => import('@/pages/giftH/add-edit')
      },
      {
        path: '/giftH/edit',
        name: 'giftHAddEdit',
        menuKey: 'giftH',
        meta: {
          menu: '/giftH',
          authKeys: [''],
          bread: [
            { path: '/giftH', name: '节日礼包管理' },
            { path: '/giftH/edit', name: '编辑节日礼包' }
          ]
        },
        component: () => import('@/pages/giftH/add-edit')
      },
      {
        path: '/giftH/detail',
        name: 'giftHDetail',
        menuKey: 'giftH',
        meta: {
          menu: '/giftH',
          authKeys: [''],
          bread: [
            { path: '/giftH', name: '节日礼包管理' },
            { path: '/giftH/detail', name: '节日礼包详情' }
          ]
        },
        component: () => import('@/pages/giftH/detail')
      },
      {
        path: '/giftDist',
        name: 'giftDist',
        menuKey: 'giftDist',
        meta: {
          menu: '/giftDist',
          authKeys: [''],
          bread: [{ path: '/giftDist', name: '礼包派发' }],
          isUseCache: false,
          keepAlive: true
        },
        component: () => import('@/pages/giftDist/list')
      },
      {
        path: '/giftDist/add',
        name: 'giftDistAdd',
        menuKey: 'giftDist',
        meta: {
          menu: '/giftDist',
          authKeys: [''],
          bread: [
            { path: '/giftDist', name: '礼包派发' },
            { path: '/giftDist/add', name: '新建派发' }
          ]
        },
        component: () => import('@/pages/giftDist/add')
      },
      {
        path: '/giftDist/detail',
        name: 'giftDistDetail',
        menuKey: 'giftDist',
        meta: {
          menu: '/giftDist',
          authKeys: [''],
          bread: [
            { path: '/giftDist', name: '礼包派发' },
            { path: '/giftDist/detail', name: '派发详情' }
          ]
        },
        component: () => import('@/pages/giftDist/detail')
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
  // console.log('router beforeEach 全局守卫执行了: ', to.path);
  // console.log('beforeEach to :>> ', to);
  // store.commit('menu/changeMenuStatus', true); //禁止menu
  await api
    .getLoginUrl()
    .finally(() => {
      //测试异步用
      // setTimeout(() => {
      //   // console.log('beforeEach store :>> ', store);
      //   // console.log('beforeEach setTimeout...');
      //   store.commit('menu/changeMenuStatus', false); //解禁menu
      // }, 3000);
      // console.log('beforeEach setTimeout...');
      // store.commit('menu/changeMenuStatus', false); //解禁menu
    })
    .then(res => {
      // console.log('beforeEach getLoginUrl res :>> ', res);
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
    // console.log(error);
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
