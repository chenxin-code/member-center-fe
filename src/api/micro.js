import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//微应用列表
export const getMicroApplication = data => fetchApi(URL.MICRO_APPLICATION, data, 'GET');
//微应用版本列表
export const getMicroApplicationVersion = data => fetchApi(URL.MICRO_APPLICATION_VERSION, data, 'GET');
//微应用版本发布
export const microVersionRelease = data => fetchApi(URL.MICRO_VERSION_RELEASE, data, 'POST');
//微应用详情
export const microApplicationDetail = data => fetchApi(URL.MICRO_APPLICATION_DETAIL, data, 'GET');
//全部项目
export const microProject = data => fetchApi(URL.MICRO_ALL_PROJECT, data, 'GET');
//资源包列表
export const getResourcePackage = data => fetchApi(URL.RESOURCE_PACKAGE, data, 'GET');
//查询资源包列表不分页
export const getResourcePackageNoPaging = data=>fetchApi(URL.RESOURCE_PACKAGE_NO_PAGE,data,'GET');
//创建资源包
export const addResourcePackage = data => fetchApi(URL.RESOURCE_PACKAGE_ADD, data, 'POST');
//全部微应用
export const allMicro = data => fetchApi(URL.MICRO_ALL, data, 'GET');
//获取App版本列表
export const getAllAppVersion = data => fetchApi(URL.VERSION_ALL, data, 'GET');
//获取小区分布范围
export const getAllPlot = data => fetchApi(URL.PLOT_LIST, data, 'GET');
