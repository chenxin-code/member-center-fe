import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//区域人员配置列表
export const getAreaPersonnel = data => fetchApi(URL.AREA_PERSONNEL, data, "POST");
//新增区域人员
export const addAreaPersonnel = data => fetchApi(URL.AREA_PERSONNEL_ADD, data, "POST");
//编辑区域人员
export const updateAreaPersonnel = data => fetchApi(URL.AREA_PERSONNEL_UPDATE, data, "POST");
//删除区域人员
export const deleteAreaPersonnel = data => fetchApi(URL.AREA_PERSONNEL_DELETE, data, "GET");
//区域人员详情
export const areaPersonnelDetail = data => fetchApi(URL.AREA_PERSONNEL_DETAIL, data, "GET");
//拥有权限的项目
export const  areaPersonnelProject= data => fetchApi(URL.AREA_PERSONNEL_PROJECT, data, "GET");
//区域列表
export const  areaPersonnelArea= data => fetchApi(URL.AREA_PERSONNEL_AREA, data, "GET");
//区域人员配置角色
export const  areaPersonnelRoles= data => fetchApi(URL.AREA_PERSONNEL_ROLE, data, "GET");
//区域人员配置员工列表
export const  areaPersonnelStaff= data => fetchApi(URL.AREA_PERSONNEL_STAFF, data, "GET");
