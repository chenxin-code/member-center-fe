import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

//广告管理列表
export const getAdvertise = data => fetchApi(URL.ADVERTISE, data, "POST");
//广告禁用启用
export const getAdvertiseStatus = data => fetchApi(URL.ADVERTISE_STATUS, data, "GET");
//广告详情
export const getAdvertiseDetail = data => fetchApi(URL.ADVERTISE_DETAIL, data, "GET");
//新增广告
export const addAdvertise = data => fetchApi(URL.ADVERTISE_ADD, data, "POST");
//编辑广告
export const updateAdvertise = data => fetchApi(URL.ADVERTISE_UPDATE, data, "POST");
//删除广告
export const deleteAdvertises = data => fetchApi(URL.ADVERTISE_DELETE, data, "GET");
//模块(微应用C)
export const advertiseModel = data => fetchApi(URL.ADVERTISE_MODEL_C, data, "GET");
//模块(微应用B)
export const advertiseModelB = data => fetchApi(URL.ADVERTISE_MODEL_B, data, "GET");
//所拥有权限的项目
export const advertiseProject = data => fetchApi(URL.ADVERTISE_PROJECT, data, "GET");
//获取用户标签
export const advertiseUserLabel = data => fetchApi(URL.ADVERTISE_USER_LABEL, data, "GET");
//广告推送
export const advertisePush = data => fetchApi(URL.ADVERTISE_PUSH, data, "POST");
//图片上传
export const updateImage = data => fetchApi(URL.IMAGE_UPDATE, data, "POST");
