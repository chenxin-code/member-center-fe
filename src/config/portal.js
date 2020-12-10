export default [
  // 会员管理:目前没用，只是用模拟流程和获取token
  {
    label: '会员管理',
    children: [
      {
        icon: require('@/assets/img/portal/kongjianguanli.png'),
        title: "空间管理",
        route: `/space`,
        authKeys: ["app_space"],
      }
    ]
  }
];
