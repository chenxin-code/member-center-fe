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
export const getMemberTongJi = data => fetchApi(URL.MEMBER_TONGJI, data, 'GET');
export const getMemberTongJiDate = data => fetchApi(URL.MEMBER_TONGJI_DATE, data, 'GET');
export const payOrDeductionIntegral = data => fetchApi(URL.INTEGRAL_PAY_DEDUCTION, data, 'POST');
export const getIntegralList = data => fetchApi(URL.INTEGRAL_LIST, data, 'GET');
