export default [
  // 会员管理:目前没用，只是用模拟流程和获取token
  {
    label: '会员管理',
    children: [
      {
        icon: 'zhuhudangan.png',
        title: '会员中心',
        route: `/resident`,
        authKeys: ['app_owner_archive']
      }
    ]
  }
];
