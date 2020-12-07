import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'


export const residentFile = data => fetchApi(URL.RESIDENT_DETAIL_LIST, data, "GET");   // 住房档案

export const onRemoveItem = data => fetchApi(URL.RESIDENT_REMOVE_ITEM, data, "POST");    // 删除非业主
export const residentProjectType = data => fetchApi(URL.RESIDENT_PROJECT_TYPE, data, "GET");  // 住户档案项目类型

export const residentTabBase = data => fetchApi(URL.RESIDENT_DETAIL_BASE, data, "GET");   // 住户档案--基本信息
export const residentTabBaseAdd = data => fetchApi(URL.RESIDENT_DETAIL_BASE_ADD, data, "POST");   // 住户档案--创建基本信息
export const residentTabBaseUpdate = data => fetchApi(URL.RESIDENT_DETAIL_BASE_UPDATE, data, "POST");   // 住户档案--编辑基本信息

export const residentPetQuery = data => fetchApi(URL.RESIDENT_PET_QUERY, data, "GET");    // 住户档案--宠物信息
export const residentPetAdd = data => fetchApi(URL.RESIDENT_PET_ADD, data, "POST");    // 住户档案--添加宠物信息
export const residentPetDel = data => fetchApi(URL.RESIDENT_PET_DEL, data, "POST");     // 住户档案--删除宠物信息
export const residentPetUpdate = data => fetchApi(URL.RESIDENT_PET_UPDATE, data, "POST");    // 住户档案--修改宠物信息

export const residentCard = data => fetchApi(URL.RESIDENT_CARD, data, "GET");    // 住户档案--证件信息

export const residentContactQuery = data => fetchApi(URL.RESIDENT_CONTACT_QUERY, data, "GET");    // 住户档案--联系方式
export const residentCardEdit = data => fetchApi(URL.RESIDENT_CONTACT_EDIT, data, "POST");    // 住户档案--编辑联系方式

export const residentNodeQuery = data => fetchApi(URL.RESIDENT_NOTE_QUERY, data, "GET");    // 住户档案--备注
export const residentNodeEdit = data => fetchApi(URL.RESIDENT_NOTE_EDIT, data, "POST");    // 住户档案--备注编辑



export const residentFamilyQuery = data => fetchApi(URL.RESIDENT_FAMILY_QUERY, data, "GET");    // 住户档案--家庭信息
export const residentFamilyUpdate = data => fetchApi(URL.RESIDENT_FAMILY_UPDATE, data, "POST");    // 住户档案--修改家庭信息

//住户档案标签管理列表
export const  getResidentLabel= data => fetchApi(URL.RESIDENT_FILE_LABEL, data, "GET");
//添加标签
export const  addResidentLabel= data => fetchApi(URL.RESIDENT_FILE_LABEL_ADD, data, "POST");
//编辑标签
export const  updateResidentLabel= data => fetchApi(URL.RESIDENT_FILE_LABEL_UPDATE, data, "POST");
//删除标签
export const  deleteResidentLabel= data => fetchApi(URL.RESIDENT_FILE_LABEL_DELETE, data, "POST");
//添加住户标签
export const  addResidentTag= data => fetchApi(URL.RESIDENT_LABEL_ADD, data, "POST");
//删除住户标签
export const  deleteResidentTag= data => fetchApi(URL.RESIDENT_LABEL_DELETE, data, "POST");

//住户档案通讯信息
export const  getCommunication= data => fetchApi(URL.RESIDENT_COMMUNICATION, data, "GET");
//添加住户档案通讯信息
export const  addCommunication= data => fetchApi(URL.RESIDENT_COMMUNICATION_ADD, data, "POST");
//编辑住户档案通讯信息
export const  updateCommunication= data => fetchApi(URL.RESIDENT_COMMUNICATION_UPDATE, data, "POST");
//删除住户档案通讯信息
export const  deleteCommunication= data => fetchApi(URL.RESIDENT_COMMUNICATION_DELETE, data, "POST");

//住户档案车辆信息
export const  getVehicle= data => fetchApi(URL.RESIDENT_VEHICLE, data, "GET");
//添加住户档案车辆信息
export const  addVehicle= data => fetchApi(URL.RESIDENT_VEHICLE_ADD, data, "POST");
//编辑住户档案车辆信息
export const  updateVehicle= data => fetchApi(URL.RESIDENT_VEHICLE_UPDATE, data, "POST");
//删除住户档案车辆信息
export const  deleteVehicle= data => fetchApi(URL.RESIDENT_VEHICLE_DELETE, data, "POST");

//住户档案房产信息
export const  getHouse= data => fetchApi(URL.RESIDENT_HOUSE_PROPERTY, data, "GET");

//住户档案银行卡信息
export const  getBank= data => fetchApi(URL.RESIDENT_BANK, data, "GET");

//住户档案查询业主增值需求服务
export const  getAddService= data => fetchApi(URL.RESIDENT_ADD_SERVICE_DETAIL, data, "GET");
//住户档案修改业主增值需求服务
export const  updateAddService= data => fetchApi(URL.RESIDENT_ADD_SERVICE_UPDATE, data, "POST");
