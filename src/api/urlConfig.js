export const option = {
  /* ------暂时用不到----- */
  login: '/times/auth', // 登录
  logout: '/times/api-demo/logout', //退出
  pub: '/times/pub-center', //数据字典
  /* ------暂时用不到----- */

  member: '/times/member-center/member',
  client: '/times/member-center/client',
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

  IMAGE_UPDATE: '/times/member-pub-center/file/api/v1/upload', //图片上传(单张)
  IMAGE_DELETE: '/times/member-pub-center/file/api/v1/delete', //图片删除

  //会员中心:庄
  GET_TASKlIST: '/times/member-center/task/api/v1/list', // 获取任务列表
  GET_TASKSOURCE: '/times/member-center/client/api/v1/list', // 获取任务来源
  GET_CARDLIST: '/times/member-center/member-card/api/v1/list', // 获取会员卡列表
  GET_CARDDETAIL: '/times/member-center/member-card/api/v1/detail', // 获取会员卡详情
  GET_CLiENT: '/times/member-center/client/api/v1/list', // 获取第三方来源列表
  GET_CLIENTDETAIL: '/times/member-center/client/api/v1/detail', // 获取第三方来源详情详情
  GET_TASKDETAIL: '/times/member-center/task/api/v1/detail', // 获取任务详情
  GET_DEALINGLIST: '/times/member-center/behaviour/api/v1/behaviour/list', // 获取行为列表
  GET_DEALINGDETAIL: '/times/member-center/behaviour/api/v1/behaviour/detail', // 获取行为详情
  GET_DEALINGLOG: '/times/member-center/behaviour/api/v1/behaviour/log-list', // 获取行为日志
  GET_RELEASELIST: '/times/member-center/coupon/api/v1/distribute/list', // 获取派发列表
  GET_RELEASEDETAIL: '/times/member-center/coupon/api/v1/distribute/detail', // 获取派发详情
  GET_RELEASEMEMBERDOWNLOAD: '/times/member-center/coupon/api/v1/download', // 下载会员信息
  GET_COUPONLIST: '/times/member-center/coupon/api/v1/coupon/list', // 获取卡券列表
  COUPONDISTRIBUTE: '/times/member-center/coupon/api/v1/assgin-member/distribute', // 卡券派发
  GET_MEMBERLEVELLIST: '/times/member-center/member-card/api/v1/level/list', // 会员卡等级
  TPL_DOWNLOAD: '/times/member-center/coupon/api/v1/memberTemplate/download', // 下载卡券模板

  //会员中心:张
  MEMBER_LIST: option.member + '/api/v1/member/list',
  CLIENT_LIST: option.client + '/api/v1/list',
  LOGIN_URL: option.mpc_integrated + '/api/v1/login',
  USER_INFO: option.mc_integrated + '/api/v1/user',
  MEMBER_DETAIL: option.member + '/api/v1/member/detailByMemberId',
  INTEGRAL_RECORD: option.member + '/api/v1/member/integralRecord/list',
  GROWN_LOG: option.member + '/api/v1/member/grown_log/list',
  BEHAVIOUR_LIST: option.member + '/api/v1/member/behaviour/list',
  MEMBER_TONGJI: option.member + '/api/v1/member/statistics', //会员统计
  TODAY_NEWNUM: '/times/member-center/member/api/v1/member/statisticsTodayNewNum', //今日新增
  QUARTER_NEWNUM: '/times/member-center/member/api/v1/member/statisticsQuarterNewNum', //季度新增
  MEMBER_SOURCE: '/times/member-center/member/api/v1/member/statisticsMemberSource', //会员来源
  MEMBER_LEVEL: '/times/member-center/member/api/v1/member/statisticsMemberLevel', //会员等级
  MEMBER_TONGJI_DATE: option.member + '/api/v1/member/num-statistics',
  INTEGRAL_PAY_DEDUCTION: option.member + '/api/v1/member/integralPayOrDeduction',
  INTEGRAL_LIST: '/times/member-center/integral-record/api/v1/integral-record/list',
  //卡券:张
  COUPONS_LIST: '/times/member-center/coupon/api/v1/coupon/list',
  CLAIM_CANCEL: '/times/member-center/coupon/api/v1/coupon/releaseOrOff/list',
  COUPON_DETAIL: '/times/member-center/coupon/api/v1/coupon/detail',
  COUPON_DETAIL_BYCODE: '/times/member-center/coupon/api/v1/coupon/detailByCouTypeCode',
  COUPON_CREATE: '/times/member-center/coupon/api/v1/create',
  COUPON_UPDATE: '/times/member-center/coupon/api/v1/update',
  COUPON_ONOROFF: '/times/member-center/coupon/api/v1/onOrOff',
  DOWNLOAD_CAMILO: '/times/member-center/coupon/api/v1/downloadCamilo',
  DOWNLOAD_CAMILO_EXCEL: '/times/member-center/coupon/api/v1/downloadCamiloExcel',

  //活动主题
  ACT_THEME_LIST: '/times/member-center/themeActivity/api/v1/selectThemeActivity',
  STOP_THEME: '/times/member-center/themeActivity/api/v1/stopThemeActivity',
  DEL_THEME: '/times/member-center/themeActivity/api/v1/deleteThemeActivity',
  ADD_THEME: '/times/member-center/themeActivity/api/v1/createThemeActivity',
  EDIT_THEME: '/times/member-center/themeActivity/api/v1/editThemeActivity',
  EDIT_THEME_SHOW_DETAIL: '/times/member-center/themeActivity/api/v1/selectId',
  //活动参与数据
  ACT_JOIN_LIST: '/times/member-center/themeActivity/api/v1/selectThemeActivityPeople',
  //任务奖励数量编辑
  EDIT_TASK_REWARD: '/times/member-center/task/api/v1/editTask',
  //活动管理
  ACT_LIST: '/times/member-center/activity/api/v1/list', //获取活动列表
  DELETE_ACT: '/times/member-center/activity/api/v1/delete', //删除活动
  UPDATE_ACT_STATUS: '/times/member-center/activity/api/v1/update-status', //更新活动状态
  ACT_DETAIL: '/times/member-center/activity/api/v1/detail', //活动详情
  ACT_DOWNLOAD: '/times/member-center/activity/api/v1/activity-member/download',
  ACT_ADD: '/times/member-center/activity/api/v1/add',
  UPDATE_ADD: '/times/member-center/activity/api/v1/update',
  //修改会员手机号
  ALTER_MEMBER_PHONE: '/times/member-center/member/api/v1/member/alterPhone',
  //卡券推荐
  RECOMMEND_COUPON: '/times/member-center/coupon/api/v1/coupon/recommendCoupon',
  //系统运行日志
  SYSTEM_RECORD: '/times/member-center/record/api/v1/selectRecord',
  //系统运行日志详情
  SYSTEM_RECORD_DETAIL: '/times/member-center/record/api/v1/selectRecordId',
  //卡券派发记录置顶
  RECOMMENDCOUPONACTIVITY: '/times/member-center/coupon/api/v1/coupon/recommendCouponActivity',
  //获取实物券的核销记录
  COUPONEXCHANGE: '/times/member-center/coupon-exchange/api/v1/list',
  //更新成长值
  UPDATE_GROWTH: '/times/member-center/member/api/v1/member/updateGrowth',
  //异常卡卷补发
  REISSUE_COUPON: '/times/member-center/coupon/api/v1/coupon/reissueCoupon',
  //系统异常处理接口修改异常是否处理
  EDIT_RECORD: '/times/member-center/record/api/v1/editRecord',
  //创建行为
  createBehaviour: '/times/member-center/behaviour/api/v1/createBehaviour',
  //编辑行为
  editBehaviour: '/times/member-center/behaviour/api/v1/editBehaviour',
  //查看行为详情
  selectBehaviour: '/times/member-center/behaviour/api/v1/selectBehaviour',
  //礼包列表
  selectGiftBagList: '/times/member-center/giftBag/api/v1/selectGiftBagList',
  //启用禁用礼包
  changeGiftBag: '/times/member-center/giftBag/api/v1/changeGiftBag',
  //创建礼包
  createGiftBag: '/times/member-center/giftBag/api/v1/createGiftBag',
  //删除卡卷
  delCoupon: '/times/member-center/giftBag/api/v1/delCoupon',
  //编辑礼包
  editGiftBag: '/times/member-center/giftBag/api/v1/editGiftBag',
  //添加卡券
  giftBagManagement: '/times/member-center/giftBag/api/v1/giftBagManagement',
  //礼包卡卷列表
  selectCoupon: '/times/member-center/giftBag/api/v1/selectCoupon',
  //礼包详情
  selectGiftBag: '/times/member-center/giftBag/api/v1/selectGiftBag',
  //节日礼包列表
  selectGiftBagHoliday: '/times/member-center/giftBagHoliday/api/v1/selectGiftBagHoliday',
  //创建节日礼包
  createGiftBagHoliday: '/times/member-center/giftBagHoliday/api/v1/createGiftBagHoliday',
  //编辑节日礼包
  updateGiftBagHoliday: '/times/member-center/giftBagHoliday/api/v1/updateGiftBagHoliday',
  //直接派发节日礼包
  directGiftBagHoliday: '/times/member-center/giftBagHoliday/api/v1/directGiftBagHoliday',
  //节日礼包详情
  selectGiftBagHolidayId: '/times/member-center/giftBagHoliday/api/v1/selectGiftBagHolidayId',

  GAME_LIST: '/times/member-game-center/admin/api/v1/game/activitygameList', // 获取活动游戏列表
  GANE_TAKEPARTINLIST: '/times/member-game-center/admin/api/v1/game/activitygameMemberList', // 获取游戏人员管理列表
  GANE_PRIZE_MANAGE_LIST: '/times/member-game-center/admin/api/v1/game/activitygamePrizeList', // 获取活动奖品管理列表
  GANE_DEL_PRIZE_PEOPLE: '/times/member-game-center/admin/api/v1/game/delActivityPerson', // 删除指定中奖人
  GANE_DETAIL: '/times/member-game-center/admin/api/v1/game/getActivityGameInfo', // 获取活动游戏详情
  GANE_CHECK_RESULT: '/times/member-game-center/admin/api/v1/game/getMemberLotteryResult', // 查看中奖结果
  GANE_MANAGE_GAME:  '/times/member-game-center/admin/api/v1/game/manageActivityGame', // 管理活动游戏(启用、禁用、删除)
  GANE_SAVE_GAME: '/times/member-game-center/admin/api/v1/game/saveOrUpdate', // 保存活动游戏
  GANE_UPDATE_PRIZE: '/times/member-game-center/admin/api/v1/game/updateActivityPrize', // 更新活动游戏奖品
  GANE_MANAGE_TIMES: '/times/member-game-center/admin/api/v1/game/updateDrawLotteryNum', // 管理抽奖次数
  GANE_UPLOAD_PEOPLE: '/times/member-game-center/admin/api/v1/game/uploadActivityPerson', // 上传指定中奖人
  PRIZE_NAME_LIST: '/times/member-game-center/admin/api/v1/game/queryPrizeNameList', // 活动奖品名称列表

  GAME_UPLOAD_IMG: '/times/member-game-center/oss/file/upload'
};
