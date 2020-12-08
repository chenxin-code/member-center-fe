export let option = {
  login: '/times/auth', // 登录
  logout: '/times/api-demo/logout', //退出
  pub: '/times/pub-center', //数据字典

  user_c: '/times/c-user-center/user', // c端用户管理
  user_c_label: '/times/c-user-center/user/label', // c端用户管理(住户档案标签管理)

  residentProject: '/times/customer-room-service/custroom', // 住户档案
  residentPet: '/times/customer-room-service/customer/pet', //住户档案--宠物
  residentFamily: '/times/customer-room-service/customer/family', // 住户档案--家庭信息
  residentService: '/times/customer-room-service/customer/add-service', // 住户档案--家庭信息
  residentHouse: '/times/customer-room-service/real' // 住户档案--房产信息
};

// 请求地址
export default {
  LOGIN: option.login + '/oauth/token', //登录
  LOGOUT: option.logout + '/logout', //退出登录
  SEND_CODE: option.pub + '/verifycode/api/v1/send', //发送验证码
  PERMISSION: '/times/user-center/permission/api/v2/permissions/get', //获取权限信息portal

  RESIDENT_DETAIL_LIST: option.residentProject + '/api/v1/customer-room/query', // 住户档案

  RESIDENT_DETAIL_BASE: option.residentProject + '/api/v1/customer-info/query', // 住户档案--基本信息
  RESIDENT_DETAIL_BASE_ADD: option.residentProject + '/api/v1/customer-info/add', // 住户档案--创建基本信息
  RESIDENT_DETAIL_BASE_UPDATE: option.residentProject + '/api/v1/customer-info/update', // 住户档案--编辑基本信息

  RESIDENT_REMOVE_ITEM: option.user_c + '/api/v1/customer/delCustomerRoomById', // 删除非业主模块
  RESIDENT_PROJECT_TYPE: option.residentProject + '/api/v1/project-info/list', // 住户档案项目类型

  RESIDENT_PET_QUERY: option.residentPet + '/api/v1/pet/query', // 住户档案--宠物信息
  RESIDENT_PET_ADD: option.residentPet + '/api/v1/pet/add', // 添加宠物信息
  RESIDENT_PET_DEL: option.residentPet + '/api/v1/pet/del', // 住户档案--删除宠物信息
  RESIDENT_PET_UPDATE: option.residentPet + '/api/v1/pet/update', // 住户档案--修改宠物信息

  RESIDENT_CARD: option.user_c + '/api/v1/customer/card/query', // 住户档案--证件信息

  RESIDENT_FAMILY_QUERY: option.residentFamily + '/api/v1/family/query', // 住户档案--家庭信息
  RESIDENT_FAMILY_UPDATE: option.residentFamily + '/api/v1/family/update', // 住户档案--修改家庭信息

  RESIDENT_CONTACT_QUERY: option.residentProject + '/api/v1/customerCommuin-info/query', // 住户档案--联系方式
  RESIDENT_CONTACT_EDIT: option.residentProject + '/api/v1/customerCommuin-info/addOrUpdate', // 住户档案--编辑联系方式

  RESIDENT_NOTE_QUERY: option.residentProject + '/api/v1/customer-remark/query', // 住户档案--备注
  RESIDENT_NOTE_EDIT: option.residentProject + '/api/v1/customer-remark/addOrUpdate', // 住户档案--备注编辑

  RESIDENT_COMMUNICATION: option.residentProject + '/api/v1/communicate-info/query', // 住户档案(通讯信息列表)
  RESIDENT_COMMUNICATION_ADD: option.residentProject + '/api/v1/communicate-info/add', // 新增住户档案(通讯信息列表)
  RESIDENT_COMMUNICATION_UPDATE: option.residentProject + '/api/v1/communicate-info/update', // 编辑住户档案(通讯信息列表)
  RESIDENT_COMMUNICATION_DELETE: option.residentProject + '/api/v1/communicate-info/del', // 删除住户档案(通讯信息列表)

  RESIDENT_VEHICLE: option.residentProject + '/api/v1/vehicle-info/query', // 住户档案(车辆信息列表)
  RESIDENT_VEHICLE_ADD: option.residentProject + '/api/v1/vehicle-info/add', // 新增住户档案(车辆信息列表)
  RESIDENT_VEHICLE_UPDATE: option.residentProject + '/api/v1/vehicle-info/update', // 编辑住户档案(车辆信息列表)
  RESIDENT_VEHICLE_DELETE: option.residentProject + '/api/v1/vehicle-info/del', // 删除住户档案(车辆信息列表)

  RESIDENT_HOUSE_PROPERTY: option.user_c + '/api/v1/cust/room/list', // 住户档案(房产信息列表)

  RESIDENT_BANK: option.residentProject + '/api/v1/bankcard-info/query', // 住户档案(银行卡信息)

  RESIDENT_ADD_SERVICE_DETAIL: option.residentService + '/api/v1/addService/query', // 住户档案(查询业主增值需求服务)
  RESIDENT_ADD_SERVICE_UPDATE: option.residentService + '/api/v1/addService/update', // 住户档案(修改业主增值需求服务)

  RESIDENT_FILE_LABEL: option.user_c_label + '/api/v1/user-label-dir/query', // 住户档案标签管理
  RESIDENT_FILE_LABEL_ADD: option.user_c_label + '/api/v1/user-label-dir/add', // 添加住户档案标签管理
  RESIDENT_FILE_LABEL_UPDATE: option.user_c_label + '/api/v1/user-label-dir/update', // 编辑住户档案标签管理
  RESIDENT_FILE_LABEL_DELETE: option.user_c_label + '/api/v1/user-label-dir/del', // 删除住户档案标签管理
  RESIDENT_LABEL_ADD: option.user_c_label + '/api/v1/user-label/add', // 住户档案添加住户标签
  RESIDENT_LABEL_DELETE: option.user_c_label + '/api/v1/user-label/del' // 住户档案删除住户标签
};
