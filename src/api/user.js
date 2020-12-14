import {fetchApi} from '@/utils/ajax'
import URL from './urlConfig'

export const getClientUser = data => fetchApi(URL.CLIENT_USER_LIST, data, "GET");
export const updateClientUser = data => fetchApi(URL.CLIENT_USER_UPDATE, data, "POST");
export const deleteClientUser = data => fetchApi(URL.CLIENT_USER_DELETE + '?userId=' + data, null, 'POST');
export const updateClientPhone = data => fetchApi(URL.CLIENT_USER_PHONE_UPDATE, data, 'POST');
export const updateClientId = data => fetchApi(URL.CLIENT_USER_ID_UPDATE, data, 'POST');
export const enableClient = data => fetchApi(URL.CLIENT_USER_ENABLE, data, 'POST');
export const disableClient = data => fetchApi(URL.CLIENT_USER_DISABLE, data, 'POST');
export const unbindClient = data => fetchApi(URL.CLIENT_USER_UNBIND, data,'POST');

export const getHcmUser = data => fetchApi(URL.HCM_USER_LIST, data, "GET");
export const deleteHcmUser = data => fetchApi(URL.HCM_USER_DELETE, data, "POST");
export const checkHcmUser = data => fetchApi(URL.HCM_USER_CHECK, data, "GET");
export const addHcmUser = data => fetchApi(URL.HCM_USER_ADD, data, "POST");
export const getUserInfo = data => fetchApi(URL.USER_INFO, data, 'GET');
export const updateUserInfo = data => fetchApi(URL.USER_INFO_UPDATE, data, 'POST');
export const updateUserPhone = data => fetchApi(URL.USER_PHONE_UPDATE, data, 'POST');
export const updateUserAvatar = data => fetchApi(URL.USER_AVATAR_UPDATE, data, 'POST');
export const sendVerification = data => fetchApi(URL.SEND_VERIFICATION, data, 'GET');


export const  getRoles = data => fetchApi(URL.AUTH_OPTIONS, data, 'GET');
export const  getUserDetail = data => fetchApi(URL.USER_DETAIL, data, 'GET');

export const userAuth = data => fetchApi(URL.USER_AUTH, data, 'POST');
export const createUser = data => fetchApi(URL.CREATE_USER, data, 'POST');
//全部项目
export const spaceProject = data =>fetchApi(URL.SPACE_ALL_PROJECT, data, 'GET');
export const getProname = data =>fetchApi(URL.GET_PRO_NAME, data, 'POST');
export const addOrg = data =>fetchApi(URL.ADD_ORG, data, 'POST');
