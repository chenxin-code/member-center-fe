export default [
  {
    title: '会员看板',
    authKeys: [''],
    icon: require('@/assets/img/menu/kanban_show.png'),
    iconHide: require('@/assets/img/menu/kanban_hide.png'),
    menuKey: 'dashboard',
    group: 'hygl',
    path: '/dashboard'
  },
  {
    title: '会员信息',
    authKeys: [''],
    icon: require('@/assets/img/menu/xinxi_show.png'),
    iconHide: require('@/assets/img/menu/xinxi_hide.png'),
    menuKey: 'memberInfo',
    group: 'hygl',
    path: '/memberInfo'
  },
  {
    title: '会员卡管理',
    authKeys: [''],
    icon: require('@/assets/img/menu/card_show.png'),
    iconHide: require('@/assets/img/menu/card_hide.png'),
    menuKey: 'card',
    group: 'hygl',
    path: '/card'
  },
  {
    title: '任务管理',
    authKeys: [''],
    icon: require('@/assets/img/menu/task_show.png'),
    iconHide: require('@/assets/img/menu/task_hide.png'),
    menuKey: 'task-manager',
    group: 'hygl',
    path: '/task-manager'
  },
  {
    title: '接入平台管理',
    authKeys: [''],
    icon: require('@/assets/img/menu/client_show.png'),
    iconHide: require('@/assets/img/menu/client_hide.png'),
    menuKey: 'access-manager',
    group: 'hygl',
    path: '/access-manager'
  }
];
