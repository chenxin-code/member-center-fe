import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//项目管理列表
export const getProject = data => fetchApi(URL.PROJECT, data, "GET");
//项目详情
export const getProjectDetail = data => fetchApi(URL.PROJECT_DETAIL, data, "GET");

//标签管理列表
export const getLabel = data => fetchApi(URL.LABEL_LIST, data, "GET");
//编辑标签
export const updateLabel = data => fetchApi(URL.LABEL_UPDATE, data, "POST");
//删除标签
export const deleteLabel = data => fetchApi(URL.LABEL_DELETE, data, "POST");
//添加标签
export const addLabel = data => fetchApi(URL.LABEL_ADD, data, "POST");


//空间管理项目列表(左侧)
export const getSpaceProject = data => fetchApi(URL.SPACE_PROJECT, data, "GET");
//根据项目获取空间树
export const getSpaceTree = data => fetchApi(URL.SPACE_TREE, data, "GET");
//空间管理列表
export const getSpace = data => fetchApi(URL.SPACE_CHILDREN_LIST, data, "GET");
//空间详情
export const spaceDetail = data => fetchApi(URL.SPACE_DETAIL, data, "GET");
//添加空间
export const addSpace = data => fetchApi(URL.SPACE_ADD, data, "POST");
//编辑空间
export const editSpace = data => fetchApi(URL.SPACE_UPDATE, data, "POST");
//删除空间
export const delSpace = data => fetchApi(URL.SPACE_DELETE, data, "POST");
//主项目层级
export const spaceLevel = data => fetchApi(URL.SPACE_LEVEL, data, "GET");
//获取子行政列表
export const childlist = data => fetchApi(URL.GET_CHILD_LIST, data, "GET");

//项目信息管理
//社区信息管理分页以及查询
export const projectInfo = data => fetchApi(URL.PROJECT_INFO, data, "GET");
//删除社区信息
export const deleteProjectInfo = data => fetchApi(URL.PROJECT_INFO_DELETE, data, "POST");
//添加社区信息
export const addProjectInfo = data => fetchApi(URL.PROJECT_INFO_ADD, data, "POST");
//小区名称列表
export const projectInfoList = data => fetchApi(URL.PROJECT_INFO_LIST, data, "GET");
//修改社区信息
export const editProjectInfo = data => fetchApi(URL.PROJECT_INFO_UPDATE, data, "POST");
//是否启用禁用
export const projectInfoStatus = data => fetchApi(URL.PROJECT_INFO_STATUS, data, "POST");
