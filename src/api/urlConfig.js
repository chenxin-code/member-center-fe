export const option = {
  /* ------暂时用不到----- */
  login: '/times/auth', // 登录
  logout: '/times/api-demo/logout', //退出
  pub: '/times/pub-center', //数据字典
  /* ------暂时用不到----- */

  member: '/times/member-center/member',
  client: '/times/member-center/client',
  behaviour: '/times/member-center/behaviour',
  mpc_integrated: '/times/member-pub-center/integrated', //无需做token验证(token传空)
  mc_integrated: '/times/member-center/integrated'
};

// 请求地址
export default {
  /* ------暂时用不到----- */
  LOGIN: option.login + '/oauth/token', //登录
  LOGOUT: option.logout + '/logout', //退出登录
  SEND_CODE: option.pub + '/verifycode/api/v1/send', //发送验证码
  PERMISSION: '/times/user-center/permission/api/v2/permissions/get', //获取权限信息
  /* ------暂时用不到----- */

  //会员中心:庄
  GET_TASKlIST: '/times/member-center/task/api/v1/list', // 获取任务列表
  GET_TASKSOURCE: '/times/member-center/client/api/v1/list', // 获取任务来源
  GET_CARDLIST: '/times/member-center/member-card/api/v1/list', // 获取会员卡列表
  GET_CARDDETAIL: '/times/member-center/member-card/api/v1/detail', // 获取会员卡详情
  GET_CLiENT: '/times/member-center/client/api/v1/list', // 获取第三方来源列表
  GET_TASKDETAIL: '/times/member-center/task/api/v1/detail', // 获取任务详情
  //会员中心:张
  MEMBER_LIST: option.member + '/api/v1/member/list',
  CLIENT_LIST: option.client + '/api/v1/list',
  LOGIN_URL: option.mpc_integrated + '/api/v1/login',
  USER_INFO: option.mc_integrated + '/api/v1/user',
  MEMBER_DETAIL: option.member + '/api/v1/member/detailByMemberId',
  INTEGRAL_RECORD: option.member + '/api/v1/member/integralRecord/list',
  GROWN_LOG: option.member + '/api/v1/member/grown_log/list',
  BEHAVIOUR_LIST: option.behaviour + '/api/v1/behaviour/list',
  MEMBER_TONGJI:'/times/member-center/member/api/v1/member/statistics',
  MEMBER_TONGJI_DATE:'/times/member-center/member/api/v1/member/num-statistics'
};
