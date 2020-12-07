import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//
export const getDecorateAppleList = data => fetchApi(URL.DECORATE_APPLE_LIST, data, "GET");

export const addDecorateApply = data => fetchApi(URL.DECORATE_APPLE_ADD, data, "POST");

export const editDecorateApply = data => fetchApi(URL.DECORATE_APPLE_EDIT, data, "POST");

export const deleteDecorateApply = data => fetchApi(URL.DECORATE_APPLE_DELETE, data, "GET");

export const commitAddDecorateApply = data => fetchApi(URL.DECORATE_APPLE_ADD_COMMIT, data, "POST");

export const commitUpdateDecorateApply = data => fetchApi(URL.DECORATE_APPLE_UPDATE_COMMIT, data, "POST");

export const getDecorateApplyDetail = data => fetchApi(URL.DECORATE_APPLE_GETDETAIL, data, "GET");

export const auditPassAppManage = data => fetchApi(URL.DECORATE_APPLE_AUDITPASS, data, "GET");

export const auditRejectedAppManage = data => fetchApi(URL.DECORATE_APPLE_AUDITREJECTRED, data, "GET");

export const closeDecorateAppManage = data => fetchApi(URL.DECORATE_APPLE_CLOSE, data, "GET");

export const getDecorateRecordList = data => fetchApi(URL.DECORATE_RECORD_LIST, data, "GET");

export const getDeCommonCodeList = data => fetchApi(URL.COMMON_CODE_LIST, data, "GET");

// 上传图片
export const uploadDecorateImagePic = data => fetchApi(URL.DECORATE_PIC_UPLOAD, data , "POST");
//所拥有权限的项目
export const decorationPersonProject = data => fetchApi(URL.DECORATE_PERSONPROJECT_LIST, data, "GET");

export const decorationProject = data => fetchApi(URL.SPACE_PROJECT, data, "GET");

export const decorationChildrenProject = data => fetchApi(URL.DECORATE_PROJECT_CHILDREN, data, "GET");

//
export const getDecorationPeriodList = data => fetchApi(URL.DECORATE_SPACET_PERIOD, data, "GET");

export const getDecorationBuildingList = data => fetchApi(URL.DECORATE_SPACE_BUILDING, data, "GET");

export const getDecorationSpaceingList = data => fetchApi(URL.DECORATE_PROJECT_SPACE_LIST, data, "GET");

//房屋接口
export const getDecorationSpaceingHouseList = data => fetchApi(URL.DECORATE_PROJECT_SPACE_HOUSE_LIST, data, "GET");

export const getDecorationOwnInfoList = data => fetchApi(URL.DECORATE_OWNINFO_LIST, data, "GET");

export const getDecorationRecordDetail = data => fetchApi(URL.DECORATE_RECORD_DETAIL, data, "GET");


