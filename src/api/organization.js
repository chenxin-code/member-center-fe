import {fetchApi} from '@/utils/ajax';
import URL from './urlConfig';

export const getOrganizationTree = data => fetchApi(URL.ORGANIZATION_TREE, data, "GET");

//HCM公司列表
export const getQueryHcm = data => fetchApi(URL.HCM_COMPANY_LIST, data, "GET");
export const getQueryNotHcm = data => fetchApi(URL.NOT_HCM_COMPANY_LIST, data, "GET");
export const addQueryNotHcm = data => fetchApi(URL.ADD_NOT_HCM, data, "POST");
export const deleQueryNotHcm = data => fetchApi(URL.DELETE_NOT_HCM, data, "POST");
export const updateQueryNotHcm = data => fetchApi(URL.UPDATE_NOT_HCM, data, "POST");
