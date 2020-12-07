import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//类型管理列表
export const getType = data => fetchApi(URL.TYPE, data, "GET");
//添加类型
export const addType = data => fetchApi(URL.TYPE_ADD, data, "POST");
//编辑类型
export const editType = data => fetchApi(URL.TYPE_UPDATE, data, "POST");

//删除类型
export const deleteType = data => fetchApi(URL.TYPE_DELETE, data, "POST");
//查询用户项目
export const myProject = data => fetchApi(URL.MY_PROJECT, data, "GET");

// 物业公告列表
export const getPropertyNotice = data => fetchApi(URL.PROPERTY_NOTICE, data, "GET");
// 查询公告类型
export const getPropertyNoticeTypes = () => fetchApi(URL.PROPERTY_NOTICE_TYPES, null, "GET");
// 查询公告详情
export const getPropertyNoticeInfo = data => fetchApi(URL.PROPERTY_NOTICE_INFO, data, "GET");
// 添加公告
export const addPropertyNotice = data => fetchApi(URL.PROPERTY_NOTICE_ADD, data, "POST");
// 编辑公告
export const updatePropertyNotice = data => fetchApi(URL.PROPERTY_NOTICE_UPDATE, data, "POST");
// 上传公告图片
export const uploadPropertyNoticePic = data => fetchApi(URL.IMAGE_UPDATE_MORE, data , "POST");
// 删除图片
export const deleteImage = data => fetchApi(URL.IMAGE_DELETE, data , "POST");
// 删除图片
export const addImage = data => fetchApi(URL.IMAGE_ADD, data , "POST");
// 删除公告
export const deletePropertyNotice = data => fetchApi(URL.PROPERTY_NOTICE_DELETE, data, "POST");
// 撤回公告
export const recallPropertyNotice = data => fetchApi(URL.PROPERTY_NOTICE_RECALL, data, "POST");
// 预览公告
export const addPreviewNotice = data => fetchApi(URL.ADD_PRIVIEW_NOTICE, data, "POST");
export const qrcodeInsert = data => fetchApi(URL.QRCODE_INSERT, data, "POST");
