import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//巡检点
export const getInspectionPointList = data => fetchApi(URL.INSPECTION_POINT_LIST, data, "GET");

export const addInspectionPoint = data => fetchApi(URL.INSPECTION_POINT_ADD, data, "POST");

export const detailInspectionPoint = data => fetchApi(URL.INSPECTION_POINT_GETDETAIL, data, "GET");

export const editInspectionPoint = data => fetchApi(URL.INSPECTION_POINT_UPDATE, data, "POST");

export const deleteInspectionPoint = data => fetchApi(URL.INSPECTION_POINT_REMOVE, data, "GET");

//标准管理
export const getStandardList = data => fetchApi(URL.STANDARD_RECORD_LIST, data, "GET");

export const addStandard = data => fetchApi(URL.STANDARD_ADD, data, "POST");

export const detailStandard = data => fetchApi(URL.STANDARD_GETDETAIL, data, "GET");

export const detailStandardAll = data => fetchApi(URL.STANDARD_GETDETAIL_ALL, data, "GET");

export const editStandard = data => fetchApi(URL.STANDARD_UPDATE, data, "POST");

export const deleteStandard = data => fetchApi(URL.STANDARD_REMOVE, data, "GET");

export const updateStandardStatus = data => fetchApi(URL.STANDARD_UPDATESTATUS, data, "GET");

export const getStandardListIn = data => fetchApi(URL.STANDARD_LIST, data, "GET");

export const getStandardZip = data => fetchApi(URL.GET_ZIPTWO, data, "GET", {} ,'blob');

//装修管理
export const getDecorationinspectionthemeList = data => fetchApi(URL.DECORATE_INSPECTION_THEME_LIST, data, "GET");

export const addDecorationinspectiontheme = data => fetchApi(URL.DECORATE_INSPECTION_THEME_ADD, data, "POST");

export const detailDecorationinspectiontheme = data => fetchApi(URL.DECORATE_INSPECTION_THEME_GETDETAIL, data, "GET");

export const editDecorationinspectiontheme = data => fetchApi(URL.DECORATE_INSPECTION_THEME_UPDATE, data, "POST");

export const deleteDecorationinspectiontheme = data => fetchApi(URL.DECORATE_INSPECTION_THEME_REMOVE, data, "GET");

export const updateDecorationinspectionthemeStatus = data => fetchApi(URL.DECORATE_INSPECTION_THEME_UPDATESTATUS, data, "GET");


//质检管理
export const getQualitycontrolthemeList = data => fetchApi(URL.QUALITYCONTROL_THEME_LIST, data, "GET");

export const addQualitycontroltheme = data => fetchApi(URL.QUALITYCONTROL_THEME_ADD, data, "POST");

export const detailQualitycontroltheme = data => fetchApi(URL.QUALITYCONTROL_THEME_GETDETAIL, data, "GET");

export const editQualitycontroltheme = data => fetchApi(URL.QUALITYCONTROL_THEME_UPDATE, data, "POST");

export const deleteQualitycontroltheme = data => fetchApi(URL.QUALITYCONTROL_THEME_REMOVE, data, "GET");

export const updateQualitycontrolthemeStatus = data => fetchApi(URL.QUALITYCONTROL_THEME_UPDATESTATUS, data, "GET");

export const getSpotCheckList = data => fetchApi(URL.GETSPOTCHECKLIST, data, "GET");

export const addSpotCheckItem = data =>fetchApi(URL.SETSPOTCHECKITEM, data, "POST"); 

export const editSpotCheckItem = data =>fetchApi(URL.UPDATESPOTCHECKITEM, data, "POST"); 

export const getSpotCheckDetail = data =>fetchApi(URL.GETSPOTCHECKDETAIL,data,"GET")

export const checkrecordRegistration = data=>fetchApi(URL.CHECKRECORDREGISTRATION,data,'POST')

export const checktaskDetail = data=>fetchApi(URL.CHECKTASKDETAIL,data,'GET')

export const uploadRectificationrecord = data=>fetchApi(URL.UPLOADRECTIFICATIONRECORD,data,'POST')

export const updateChecktaskStatus =  data=>fetchApi(URL.UPDATECHECKTASKSTATUS,data,'GET')

//专项主题
export const getSpecialCheckList = data => fetchApi(URL.SPECIALCHECK_THEME_LIST, data, "GET");

export const addSpecialChecktheme = data => fetchApi(URL.SPECIALCHECK_THEME_ADD, data, "POST");

export const detailSpecialChecktheme = data => fetchApi(URL.SPECIALCHECK_THEME_GETDETAIL, data, "GET");

export const editSpecialChecktheme  = data => fetchApi(URL.SPECIALCHECK_THEME_UPDATE, data, "POST");

export const deleteSpecialChecktheme  = data => fetchApi(URL.SPECIALCHECK_THEME_REMOVE, data, "GET");

export const updateSpecialCheckthemeStatus = data => fetchApi(URL.SPECIALCHECK_THEME_UPDATESTATUS, data, "GET");

//巡检主题
export const getInspectionthemeList = data => fetchApi(URL.INSPECTION_THEME_LIST, data, "GET");

export const addInspectiontheme = data => fetchApi(URL.INSPECTION_THEME_ADD, data, "POST");

export const detailInspectiontheme = data => fetchApi(URL.INSPECTION_THEME_GETDETAIL, data, "GET");

export const editInspectiontheme = data => fetchApi(URL.INSPECTION_THEME_UPDATE, data, "POST");

export const deleteInspectiontheme = data => fetchApi(URL.INSPECTION_THEME_REMOVE, data, "GET");

export const updateInspectionthemeStatus = data => fetchApi(URL.INSPECTION_THEME_UPDATESTATUS, data, "GET");

//
export const getProjectListQ = data => fetchApi(URL.PROJECTQ_LIST, data, "GET");

export const getAreaListQ = data => fetchApi(URL.GET_AREA_LIST, data, "GET");

export const getInspectionUnitListQ = data => fetchApi(URL.GET_UNIT_LIST, data, "GET");

export const getChildrenListQ = data => fetchApi(URL.PROJECT_CHILDREN_LIST, data, "GET");

export const getRoleListQ = data => fetchApi(URL.GET_ROLE_LIST, data, "GET");

export const getQuCommonCodeList = data => fetchApi(URL.COMMON_CODE_LIST_Q, data, "GET");

//根据项目id等到区域列表
export const getQualityAreaList = data => fetchApi(URL.GET_AREALIST, data, "GET");

//巡检任务
export const getInspectiontaskList = data => fetchApi(URL.INSPECTIONTASK_LIST, data, "GET");

export const detailInspectiontask = data => fetchApi(URL.INSPECTIONTASK_DETAIL_INFO, data, "GET");

export const detailInspectiontaskrecord = data => fetchApi(URL.INSPECTIONTASKRECORD_DETAIL_INFO, data, "GET");

export const getRectificationRecordList = data => fetchApi(URL.RECTIFICATIONRECORD_, data, "POST");


export const getInRectificationRecord = data =>fetchApi(URL.GETINRECTIFICATIONRECORD,data,"GET")

export const getChRectificationRecord = data =>fetchApi(URL.GETCHRECTIFICATIONRECORD,data,"GET")

export const updateRectificationRecord = data =>fetchApi(URL.UPDATERECTIFICATIONRECORD,data,"POST")

//专项管理
export const getListBySpecialList = data =>fetchApi(URL.GETLISTBYSPECIALIST, data, "GET");
export const deleteListBySpecialItem = data =>fetchApi(URL.DELETELISTBYSPECIAITEM,data,"GET")
export const getrectification = data =>fetchApi(URL.GETRECTIFICATION,data,"GET")

//装修巡查管理
export const getInspectionlist = data => fetchApi(URL.GETINSPECTIONLIST, data, "GET");
export const getDecorationinspectiontaskDetail = data =>fetchApi(URL.GETDECORATIONINSPECTIONTASKDETAIL,data,'GET')
export const getDecorationinspectionChecKRecordDetail = data =>fetchApi(URL.GETDECORATIONINSPECTIONCHECKRECORDDETAIL,data,'GET')

export const getQrCodeZip = data => fetchApi(URL.GET_ZIP, data, "GET");
export const getExcel = data => fetchApi(URL.GET_ZIPTWO, data, "GET");

// 导入表格
export const uploadEx = data => fetchApi(URL.uploadEx, data, "POST");
export const uploadEx2 = data => fetchApi(URL.uploadEx2, data, "POST");

// 查询城市公司 GetCityCom
export const getCityList = data => fetchApi(URL.PROJECT, data, "GET");

// 查询项目和城市公司
export const getProjectCity = data => fetchApi(URL.GET_ProjectCity, data, "GET");

export const qualityPersonProject = data => fetchApi(URL.QUALITY_PERSONPROJECT_LIST, data, "GET");
