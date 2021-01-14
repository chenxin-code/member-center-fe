import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//会员列表
export const getLoginUrl = data => fetchApi(URL.LOGIN_URL, data, 'GET');
export const getClientList = data => fetchApi(URL.CLIENT_LIST, data, 'GET');
export const getMemberList = data => fetchApi(URL.MEMBER_LIST, data, 'GET');
export const getMemberDetail = data => fetchApi(URL.MEMBER_DETAIL, data, 'GET');
export const getUserInfo = data => fetchApi(URL.USER_INFO, data, 'POST');
export const getIntegralRecord = data => fetchApi(URL.INTEGRAL_RECORD, data, 'GET');
export const getGrownLog = data => fetchApi(URL.GROWN_LOG, data, 'GET');
export const getBehaviourList = data => fetchApi(URL.BEHAVIOUR_LIST, data, 'GET');
export const getMemberTongJi = data => fetchApi(URL.MEMBER_TONGJI, data, 'GET');//会员统计
export const getTodayNewNum = data => fetchApi(URL.TODAY_NEWNUM, data, 'GET');//今日新增
export const getQuarterNewNum = data => fetchApi(URL.QUARTER_NEWNUM, data, 'GET');//季度新增
export const getMemberSource = data => fetchApi(URL.MEMBER_SOURCE, data, 'GET');//会员来源
export const getMemberLevel = data => fetchApi(URL.MEMBER_LEVEL, data, 'GET');//会员等级
export const getMemberTongJiDate = data => fetchApi(URL.MEMBER_TONGJI_DATE, data, 'GET');
export const payOrDeductionIntegral = data => fetchApi(URL.INTEGRAL_PAY_DEDUCTION, data, 'POST');
export const getIntegralList = data => fetchApi(URL.INTEGRAL_LIST, data, 'GET');
//卡券
export const getClaimCancel = data => fetchApi(URL.CLAIM_CANCEL, data, 'GET');
