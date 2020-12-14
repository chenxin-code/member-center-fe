export default [
  {
    title: '空间管理',
    authKeys: ['menu_space'],
    icon: require('@/assets/img/menu/icon_kongjianguanli.png'),
    menuKey: 'space',
    group: 'kjgl',
    path: '/space'
  },
  {
    title: '项目管理',
    authKeys: ['menu_project'],
    icon: require('@/assets/img/menu/icon_xiangmuguanli.png'),
    menuKey: '',
    group: 'kjgl',
    name: 'second',
    hasChild: 'project',
    path: '/project/second',
    children: [
      {
        title: '项目列表',
        authKeys: ['menu_project'],
        icon: require('@/assets/img/menu/icon_xiangmuguanli.png'),
        menuKey: 'project ',
        path: '/project/second/projectList'
      },
      {
        title: '社区信息管理',
        authKeys: ['menu_project'],
        icon: require('@/assets/img/menu/icon_xiangmuguanli.png'),
        menuKey: 'projectInfo ',
        path: '/project/second/projectInfo'
      }
    ]
  },
  {
    title: '标签管理',
    authKeys: ['menu_space_label'],
    icon: require('@/assets/img/menu/icon_biaoqianguanli.png'),
    menuKey: 'label',
    group: 'kjgl',
    path: '/label'
  }
];
