import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//区域管理列表
export const getArea = data => fetchApi(URL.AREA, data, "GET");
//添加区域
export const addArea = data => fetchApi(URL.AREA_ADD, data, "POST");
//区域关联空间
export const relateArea = data => fetchApi(URL.AREA_RELATE_SPACE, data, "POST");
//区域引用情况
export const citeArea = data => fetchApi(URL.AREA_CITE, data, "GET");
//编辑区域
export const updateArea = data => fetchApi(URL.AREA_UPDATE, data, "POST");
//删除区域
export const delArea = data => fetchApi(URL.AREA_DELETE, data, "POST");
//项目分期树
export const projectBlock = data => fetchApi(URL.PROJECT_BLOCk, data, "GET");
//楼栋列表
export const tower = data => fetchApi(URL.AREA_TOWER, data, "GET");
