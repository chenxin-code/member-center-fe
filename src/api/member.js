import { fetchApi } from '@/utils/ajax';
import URL from './urlConfig';

export const updateImage = data => fetchApi(URL.IMAGE_UPDATE, data, 'POST'); //图片上传(单张)
export const deleteImage = data => fetchApi(URL.IMAGE_DELETE, data, 'POST'); //图片上传(单张)

//会员列表
export const getLoginUrl = data => fetchApi(URL.LOGIN_URL, data, 'GET');
export const getClientList = data => fetchApi(URL.CLIENT_LIST, data, 'GET');
export const getMemberList = data => fetchApi(URL.MEMBER_LIST, data, 'GET');
export const getMemberDetail = data => fetchApi(URL.MEMBER_DETAIL, data, 'GET');
export const getUserInfo = data => fetchApi(URL.USER_INFO, data, 'POST');
export const getIntegralRecord = data => fetchApi(URL.INTEGRAL_RECORD, data, 'GET');
export const getGrownLog = data => fetchApi(URL.GROWN_LOG, data, 'GET');
export const getBehaviourList = data => fetchApi(URL.BEHAVIOUR_LIST, data, 'GET');
export const getMemberTongJi = data => fetchApi(URL.MEMBER_TONGJI, data, 'GET'); //会员统计
export const getTodayNewNum = data => fetchApi(URL.TODAY_NEWNUM, data, 'GET'); //今日新增
export const getQuarterNewNum = data => fetchApi(URL.QUARTER_NEWNUM, data, 'GET'); //季度新增
export const getMemberSource = data => fetchApi(URL.MEMBER_SOURCE, data, 'GET'); //会员来源
export const getMemberLevel = data => fetchApi(URL.MEMBER_LEVEL, data, 'GET'); //会员等级
export const getMemberTongJiDate = data => fetchApi(URL.MEMBER_TONGJI_DATE, data, 'GET');
export const payOrDeductionIntegral = data => fetchApi(URL.INTEGRAL_PAY_DEDUCTION, data, 'POST');
export const getIntegralList = data => fetchApi(URL.INTEGRAL_LIST, data, 'GET');
//卡券
export const getCouponsList = data => fetchApi(URL.COUPONS_LIST, data, 'GET');
export const getClaimCancel = data => fetchApi(URL.CLAIM_CANCEL, data, 'GET');
export const getCouponDetail = data => fetchApi(URL.COUPON_DETAIL, data, 'GET');
export const getCouponDetailByCode = data => fetchApi(URL.COUPON_DETAIL_BYCODE, data, 'GET');
export const getCouponCreate = data => fetchApi(URL.COUPON_CREATE, data, 'POST');
export const getCouponUpdate = data => fetchApi(URL.COUPON_UPDATE, data, 'POST');
export const couponOnOrOff = data => fetchApi(URL.COUPON_ONOROFF, data, 'POST');
export const getTplDownload = data => fetchApi(URL.TPL_DOWNLOAD, data, 'GET');
//活动主题
export const getActThemeList = data => fetchApi(URL.ACT_THEME_LIST, data, 'GET');
export const stopTheme = data => fetchApi(URL.STOP_THEME, data, 'POST');
export const delTheme = data => fetchApi(URL.DEL_THEME, data, 'POST');
export const addTheme = data => fetchApi(URL.ADD_THEME, data, 'POST');
export const editTheme = data => fetchApi(URL.EDIT_THEME, data, 'POST');
export const editThemeShowDetail = data => fetchApi(URL.EDIT_THEME_SHOW_DETAIL, data, 'GET');
//任务奖励数量编辑
export const editTaskReward = data => fetchApi(URL.EDIT_TASK_REWARD, data, 'POST');
//活动参与数据
export const getActJoinList = data => fetchApi(URL.ACT_JOIN_LIST, data, 'GET');
//活动管理
export const getActList = data => fetchApi(URL.ACT_LIST, data, 'GET'); //获取活动列表
export const deleteAct = data => fetchApi(URL.DELETE_ACT, data, 'POST'); //删除活动
export const updateActStatus = data => fetchApi(URL.UPDATE_ACT_STATUS, data, 'POST'); //更新活动状态
export const getActDetail = data => fetchApi(URL.ACT_DETAIL, data, 'GET'); //活动详情
export const getActDownload = data => fetchApi(URL.ACT_DOWNLOAD, data, 'GET'); //下载活动中指定会员信息
//修改会员手机号
export const alterMemberPhone = data => fetchApi(URL.ALTER_MEMBER_PHONE, data, 'POST');
//卡券推荐
export const recommendCoupon = data => fetchApi(URL.RECOMMEND_COUPON, data, 'POST');
//系统运行日志
export const systemRecord = data => fetchApi(URL.SYSTEM_RECORD, data, 'GET');
//系统运行日志详情
export const systemRecordDetail = data => fetchApi(URL.SYSTEM_RECORD_DETAIL, data, 'GET');
