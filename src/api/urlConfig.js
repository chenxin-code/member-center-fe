export let option = {
  login: '/times/auth', // 登录

  logout: '/times/api-demo/logout', //退出

  space: '/times/space-center/space', //空间管理模块

  label: '/times/space-center/space/dir', //标签管理

  pub: '/times/pub-center', //数据字典

  user_c: '/times/c-user-center/user', // c端用户管理
  user_c_label: '/times/c-user-center/user/label', // c端用户管理(住户档案标签管理)

  organization: '/times/user-center/organization', // 组织架构

  user_b: '/times/user-center/b', //B端用户

  notice: '/times/notice-service/notice', //物业公告

  project: '/times/user-center/project', //项目

  advertiseAdvert: '/times/advert-service/advert', //广告
  advertiseRemote: '/times/advert-service/remote', //广告
  advertisePush: '/times/advert-service/push', //广告

  residentProject: '/times/customer-room-service/custroom', // 住户档案
  residentPet: '/times/customer-room-service/customer/pet', //住户档案--宠物
  residentFamily: '/times/customer-room-service/customer/family', // 住户档案--家庭信息
  residentService: '/times/customer-room-service/customer/add-service', // 住户档案--家庭信息
  residentHouse: '/times/customer-room-service/real', // 住户档案--房产信息

  micro: '/times/micro-app-service', //微应用管理  版本管理

  areaPersonnelManage: '/times/area-emp-service/manage', //区域人员配置
  areaPersonnelRemote: '/times/area-emp-service/remote', //区域人员配置
  areaPersonnelRole: '/times/area-emp-service/expose', //区域人员配置

  commonCodeAPI: '/times/decorate-service/commoncode', //
  commonCodeAPI_Q: '/times/quality-service/commoncode', //
  decorateAppManage: '/times/decorate-service/decorateAppManage', //装修申请
  decorateAppRecord: '/times/decorate-service/decorateAppRecord', //装修履历
  qualityManage: '/times/quality-service/qualityManager', //品质管理
  decorateProjectInterface: '/times/decorate-service/projectInterface',
  decorateProjectInterfaceQ: '/times/quality-service/projectInterface',
  decorateSpaceInterface: '/times/decorate-service/spaceInterface',
  dictionary: '/times/pub-center/dictionary', //获取子行政列表

  file: '/times/pub-center/file' //文件
};

// 请求地址
export default {
  LOGIN: option.login + '/oauth/token', //登录
  LOGOUT: option.logout + '/logout', //退出登录
  SEND_CODE: option.pub + '/verifycode/api/v1/send', //发送验证码

  PERMISSION: '/times/user-center/permission/api/v2/permissions/get', //获取权限信息
  // PORTAL: option.

  PROJECT: option.space + '/api/v1/project/list', //项目列表
  PROJECT_DETAIL: option.space + '/api/v1/space-project/block/info', // 项目详情
  LABEL_LIST: option.label + '/api/v1/space-label-dir/query', //标签列表
  LABEL_UPDATE: option.label + '/api/v1/space-label-dir/update', //编辑标签
  LABEL_DELETE: option.label + '/api/v1/space-label-dir/del', //删除标签
  LABEL_ADD: option.label + '/api/v1/space-label-dir/add', //添加标签
  SPACE_PROJECT: option.space + '/api/v1/space-project/list', //空间列表=>项目列表
  SPACE_TREE: option.space + '/api/v1/space/project/tree', //空间树
  SPACE_CHILDREN_LIST: option.space + '/api/v1/space-children/list', //子空间列表
  SPACE_DETAIL: option.space + '/api/v1/space/info', //空间详情
  SPACE_ADD: option.space + '/api/v1/space/add', //添加空间
  SPACE_UPDATE: option.space + '/api/v1/space/edit', //编辑空间
  SPACE_DELETE: option.space + '/api/v1/space/delete', //删除空间
  SPACE_LEVEL: option.label + '/api/v1/space-level/query', //空间层级
  SPACE_ALL_PROJECT: option.space + '/api/v1/space-project/list', //获取全部项目
  GET_PRO_NAME: option.space + '/api/v1/space/getSpaceByIds', //获取项目名称
  GET_CHILD_LIST: option.dictionary + '/api/v1/city-child/list', //获取子行政列表

  PROJECT_BLOCk: option.space + '/api/v1/space/proj-block/tree', //项目分期树
  AREA: option.space + '/api/v1/space-area/getPage', //区域列表
  AREA_ADD: option.space + '/api/v1/space-area/add', //添加区域
  AREA_RELATE_SPACE: option.space + '/api/v1/space-area/relateSpace', //区域关联空间
  AREA_CITE: option.space + '/api/v1/space-area/getAreaBuildingUse', //区域引用空间情况
  AREA_DELETE: option.space + '/api/v1/space-area/del', //删除区域
  AREA_UPDATE: option.space + '/api/v1/space-area/update', //编辑区域
  AREA_TOWER: option.space + '/api/v1/space-area/getNoRelateSpaceByBlockId', //关联空间的楼栋列表

  //项目信息管理
  PROJECT_INFO: option.space + '/api/v1/community-project/queryCommunityProjects', //社区信息管理分页以及查询
  PROJECT_INFO_DELETE: option.space + '/api/v1/community-project/delCommunityProject', //删除社区信息
  PROJECT_INFO_ADD: option.space + '/api/v1/community-project/addCommunityProject', //添加社区信息
  PROJECT_INFO_LIST: option.space + '/api/v1/community-project/queryProjects', //小区名称列表
  PROJECT_INFO_UPDATE: option.space + '/api/v1/community-project/updateCommunityProject', //修改社区信息
  PROJECT_INFO_STATUS: option.space + '/api/v1/community-project/usingAndForbiddenCProject', //是否启用禁用

  HCM_COMPANY_LIST: option.organization + '/api/v1/enterprise/queryHcm', //HCM内部公司列表
  NOT_HCM_COMPANY_LIST: option.organization + '/api/v1/enterprise/queryNotHcm', //非HCM公司列表
  ADD_NOT_HCM: option.organization + '/api/v1/enterprise/add', //添加非HCM公司
  UPDATE_NOT_HCM: option.organization + '/api/v1/enterprise/update', //修改非HCM公司
  DELETE_NOT_HCM: option.organization + '/api/v1/enterprise/delete', //删除非HCM公司

  CLIENT_USER_LIST: option.user_c + '/api/v1/user-c/list', // 用户列表
  CLIENT_USER_UPDATE: option.user_c + '/api/v1/update', // 编辑用户
  CLIENT_USER_DELETE: option.user_c + '/api/v1/del', // 删除用户
  CLIENT_USER_PHONE_UPDATE: option.user_c + '/api/v1/user/phone/update', // 更新用户手机号
  CLIENT_USER_ID_UPDATE: option.user_c + '/api/v1/user/card/update', // 更新用户id
  CLIENT_USER_ENABLE: option.user_c + '/api/v1/user/start', // 启用账号
  CLIENT_USER_DISABLE: option.user_c + '/api/v1/user/stop', // 停用账号
  CLIENT_USER_UNBIND: option.user_c + '/api/v1/user-c/unbinding', // 用户解绑

  HCM_USER_LIST: option.user_b + '/api/v1/list-employee/query', // hcm用户列表
  HCM_USER_DELETE: option.user_b + '/api/v1/user/delete', // 删除hcm用户
  HCM_USER_CHECK: option.user_b + '/api/v1/user/phone/status', //查看用户状态
  HCM_USER_ADD: option.user + '', // 添加非hcm用户
  AUTH_OPTIONS: option.user_b + '/api/v1/user/get_auth_options', //添加用户查用户角色
  USER_DETAIL: option.user_b + '/api/v1/user/detail', //查用户详细信息
  USER_AUTH: option.user_b + '/api/v1/user/auth', //用户授权
  CREATE_USER: option.user_b + '/api/v1/user/create', //创建用户
  ADD_ORG: option.user_b + '/api/v1/user/add_org', //给用户增加组织机构

  ORGANIZATION_TREE: option.organization + '/api/v1/organization/getTree', // 组织列表

  USER_INFO: option.user_b + '/api/v1/my/info', // 用户个人信息
  USER_INFO_UPDATE: option.user_b + '/api/v1/user-name/update', // 用户信息更新
  USER_PHONE_UPDATE: option.user_b + '/api/v1/user-phone/update', // 用户手机号更新
  USER_AVATAR_UPDATE: option.user_b + '/api/v1/user-image/update', // 用户头像更新

  TYPE: option.notice + '/api/v1/queryNoticeTypes', // 类型管理列表
  TYPE_ADD: option.notice + '/api/v1/addNoticeType', // 添加类型
  TYPE_UPDATE: option.notice + '/api/v1/updateNoticeType', // 编辑类型
  TYPE_DELETE: option.notice + '/api/v1/delNoticeType', // 删除类型

  PROPERTY_NOTICE_ADD: option.notice + '/api/v1/addNotice', // 新增公告
  PROPERTY_NOTICE_UPDATE: option.notice + '/api/v1/updateNotice', // 编辑公告
  PROPERTY_NOTICE_INFO: option.notice + '/api/v1/queryNoticeById', // 查询公告详情
  PROPERTY_NOTICE_TYPES: option.notice + '/api/v1/queryAllNoticeType', // 全部公告类型
  ADD_PRIVIEW_NOTICE: option.notice + '/api/v1/addPreviewNotice', // 预览公告
  QRCODE_INSERT: option.notice + '/api/v1/insertQrCode', // 记录路有信息

  IMAGE_UPDATE: option.file + '/api/v1/upload', // 图片上传(单张)
  IMAGE_UPDATE_MORE: option.file + '/api/v1/webUploadFiles', // 图片上传(多张)
  IMAGE_DELETE: option.file + '/api/v1/delete', // 删除图片
  IMAGE_ADD: option.file + '/api/v1/uploadFileBase64', // 上传图片（base64）

  MY_PROJECT: option.notice + '/api/v1/queryProjectsByUser', //当前登录用户拥有权限的项目
  PROPERTY_NOTICE: option.notice + '/api/v1/queryNoticeByProID', // 物业公告列表
  PROPERTY_NOTICE_DELETE: option.notice + '/api/v1/delNotice', // 删除物业公告
  PROPERTY_NOTICE_RECALL: option.notice + '/api/v1/updateRecallNotice', // 撤回物业公告

  ADVERTISE: option.advertiseAdvert + '/api/v1/list', // 广告列表
  ADVERTISE_STATUS: option.advertiseAdvert + '/api/v1/changeStatus', // 广告禁用启用
  ADVERTISE_DETAIL: option.advertiseAdvert + '/api/v1/get', // 广告详情
  ADVERTISE_ADD: option.advertiseAdvert + '/api/v1/add', // 新增广告
  ADVERTISE_UPDATE: option.advertiseAdvert + '/api/v1/edit', // 编辑广告
  ADVERTISE_DELETE: option.advertiseAdvert + '/api/v1/delete', // 删除广告
  ADVERTISE_MODEL_C: option.advertiseRemote + '/api/v1/getProgram', // 模块选项（微应用C端）
  ADVERTISE_MODEL_B: option.advertiseRemote + '/api/v1/getProgramB', // 模块选项（微应用B端）
  ADVERTISE_PROJECT: option.advertiseRemote + '/api/v1/getProjectList', // 所拥有权限的项目
  ADVERTISE_USER_LABEL: option.advertisePush + '/api/v1/getLabel', // 获取用户标签
  ADVERTISE_PUSH: option.advertisePush + '/api/v1/pushAdvert', // 广告推送

  MICRO_APPLICATION: option.micro + '/api/program/v1/page', //微应用列表
  MICRO_APPLICATION_DETAIL: option.micro + '/api/program/v1/detail', //微应用详情
  MICRO_APPLICATION_VERSION: option.micro + '/api/program_version/v1/list', //微应用版本列表
  MICRO_VERSION_RELEASE: option.micro + '/api/program_version/v1/publish', //微应用版本发布
  MICRO_ALL_PROJECT: option.micro + '/api/program/v1/project/list', //全部项目
  RESOURCE_PACKAGE: option.micro + '/api/resource/v1/list', //资源包列表
  RESOURCE_PACKAGE_NO_PAGE: option.micro + '/api/resource/v1/list_of_program', //资源包列表不分页
  RESOURCE_PACKAGE_ADD: option.micro + '/api/resource/v1/create', //创建资源包
  MICRO_ALL: option.micro + '/api/program/v1/system/program/list', //全部微应用
  VERSION_ALL: option.micro + '/api/app_version/v1/app/list', //APP版本列表不分页
  PLOT_LIST: option.micro + '/api/program/v1/project_page', //小区分布列表

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

  VERSION_ADD: option.micro + '/api/app_version/v1/publish', // APP版本发布
  VERSION: option.micro + '/api/app_version/v1/list', // APP版本列表

  AREA_PERSONNEL: option.areaPersonnelManage + '/api/v1/list', // 区域人员配置列表
  AREA_PERSONNEL_ADD: option.areaPersonnelManage + '/api/v1/add', //新增区域人员
  AREA_PERSONNEL_UPDATE: option.areaPersonnelManage + '/api/v1/edit', //编辑区域人员
  AREA_PERSONNEL_DELETE: option.areaPersonnelManage + '/api/v1/delete', //删除区域人员
  AREA_PERSONNEL_DETAIL: option.areaPersonnelManage + '/api/v1/get', //区域人员详情
  AREA_PERSONNEL_PROJECT: option.areaPersonnelRemote + '/api/v1/getProjectList', //区域人员配置所拥有权限的项目
  AREA_PERSONNEL_AREA: option.areaPersonnelRemote + '/api/v1/getRegionList', //区域人员配置区域列表
  AREA_PERSONNEL_ROLE: option.areaPersonnelRemote + '/api/v1/getRoles', //区域人员配置角色
  AREA_PERSONNEL_STAFF: option.areaPersonnelRemote + '/api/v1/getUsers', //区域人员配置员工列表

  RESIDENT_FILE_LABEL: option.user_c_label + '/api/v1/user-label-dir/query', // 住户档案标签管理
  RESIDENT_FILE_LABEL_ADD: option.user_c_label + '/api/v1/user-label-dir/add', // 添加住户档案标签管理
  RESIDENT_FILE_LABEL_UPDATE: option.user_c_label + '/api/v1/user-label-dir/update', // 编辑住户档案标签管理
  RESIDENT_FILE_LABEL_DELETE: option.user_c_label + '/api/v1/user-label-dir/del', // 删除住户档案标签管理
  RESIDENT_LABEL_ADD: option.user_c_label + '/api/v1/user-label/add', // 住户档案添加住户标签
  RESIDENT_LABEL_DELETE: option.user_c_label + '/api/v1/user-label/del', // 住户档案删除住户标签

  //装修
  DECORATE_APPLE_LIST: option.decorateAppManage + '/api/v1/decorate-apply/getList', // 装修申请
  DECORATE_APPLE_ADD: option.decorateAppManage + '/api/v1/decorate-apply/addApply',
  DECORATE_APPLE_EDIT: option.decorateAppManage + '/api/v1/decorate-apply/updateApply',
  DECORATE_APPLE_DELETE: option.decorateAppManage + '/api/v1/decorate-apply/deleteApply', // 删除
  DECORATE_APPLE_ADD_COMMIT: option.decorateAppManage + '/api/v1/decorate-apply/commitAddApply', // 装修申请
  DECORATE_APPLE_UPDATE_COMMIT: option.decorateAppManage + '/api/v1/decorate-apply/commitUpdateApply', // 装修申请
  DECORATE_APPLE_GETDETAIL: option.decorateAppManage + '/api/v1/decorate-apply/getDetail', // 装修申请
  DECORATE_APPLE_AUDITPASS: option.decorateAppManage + '/api/v1/decorate-apply/auditPass', // 装修申请
  DECORATE_APPLE_AUDITREJECTRED: option.decorateAppManage + '/api/v1/decorate-apply/auditRejected', // 装修申请
  DECORATE_APPLE_CLOSE: option.decorateAppManage + '/api/v1/decorate-apply/closeAppManage', // 装修申请

  DECORATE_RECORD_LIST: option.decorateAppRecord + '/api/v1/decorateapp-record/getList', // 装修申请

  COMMON_CODE_LIST: option.commonCodeAPI + '/codelist',

  COMMON_CODE_LIST_Q: option.commonCodeAPI_Q + '/codelist',

  DECORATE_PIC_UPLOAD: option.decorateAppManage + '/api/v1/decorate-appC/uploadFile',

  DECORATE_RECORD_DETAIL: option.decorateAppRecord + '/api/v1/decorateapp-record/getDetail',

  DECORATE_PROJECT_LIST: option.decorateProjectInterface + '/api/v1/project/getList',
  DECORATE_PROJECT_CHILDREN: option.decorateProjectInterface + '/api/v1/space/getChildrenList',

  DECORATE_SPACE_HOUSE: option.decorateSpaceInterface + '/api/v1/space/getHouseList',

  DECORATE_SPACET_PERIOD: option.decorateSpaceInterface + '/api/v1/space/getPeriodList',

  DECORATE_SPACE_BUILDING: option.decorateSpaceInterface + '/api/v1/space/getBuildingList',

  DECORATE_PROJECT_SPACE_LIST: option.decorateSpaceInterface + '/api/v1/space/getSpaceList',

  DECORATE_PROJECT_SPACE_HOUSE_LIST: option.decorateProjectInterface + '/api/v1/space/getChildrenList',

  DECORATE_OWNINFO_LIST: option.user_c + '/api/v1/room/customer/list',

  DECORATE_PERSONPROJECT_LIST: option.decorateProjectInterface + '/api/v1/project/getProjectList',

  QUALITY_PERSONPROJECT_LIST: option.decorateProjectInterfaceQ + '/api/v1/project/getProjectList',
  //装修共通code

  //品质主题
  DECORATE_INSPECTION_THEME_LIST: option.qualityManage + '/api/v1/decorationinspectiontheme/getList',
  DECORATE_INSPECTION_THEME_ADD:
    option.qualityManage + '/api/v1/decorationinspectiontheme/saveDecorationInspectionTheme',
  DECORATE_INSPECTION_THEME_UPDATE:
    option.qualityManage + '/api/v1/decorationinspectiontheme/updateDecorationInspectionTheme',
  DECORATE_INSPECTION_THEME_GETDETAIL: option.qualityManage + '/api/v1/decorationinspectiontheme/detail',
  DECORATE_INSPECTION_THEME_REMOVE: option.qualityManage + '/api/v1/decorationinspectiontheme/remove',
  DECORATE_INSPECTION_THEME_UPDATESTATUS: option.qualityManage + '/api/v1/decorationinspectiontheme/updateStatus',

  //巡检点管理
  INSPECTION_POINT_LIST: option.qualityManage + '/api/v1/inspection-point/getList',
  INSPECTION_POINT_ADD: option.qualityManage + '/api/v1/inspection-point/save',
  INSPECTION_POINT_UPDATE: option.qualityManage + '/api/v1/inspection-point/edit',
  INSPECTION_POINT_GETDETAIL: option.qualityManage + '/api/v1/inspection-point/detail',
  INSPECTION_POINT_REMOVE: option.qualityManage + '/api/v1/inspection-point/remove',
  INSPECTION_POINT_UPDATESTATUS: option.qualityManage + '/api/v1/inspection-point/updateStatus',

  INSPECTION_THEME_LIST: option.qualityManage + '/api/v1/inspectiontheme/getInspectionthemeList',
  INSPECTION_THEME_ADD: option.qualityManage + '/api/v1/inspectiontheme/saveInspectiontheme',
  INSPECTION_THEME_UPDATE: option.qualityManage + '/api/v1/inspectiontheme/upateInspectiontheme',
  INSPECTION_THEME_GETDETAIL: option.qualityManage + '/api/v1/inspectiontheme/detail',
  INSPECTION_THEME_REMOVE: option.qualityManage + '/api/v1/inspectiontheme/remove',
  INSPECTION_THEME_UPDATESTATUS: option.qualityManage + '/api/v1/inspectiontheme/updateStatus',

  QUALITYCONTROL_THEME_LIST: option.qualityManage + '/api/v1/qualitycontroltheme/getQualityControlThemeList',
  QUALITYCONTROL_THEME_ADD: option.qualityManage + '/api/v1/qualitycontroltheme/saveQualityControlTheme',
  QUALITYCONTROL_THEME_UPDATE: option.qualityManage + '/api/v1/qualitycontroltheme/updateQualityControlTheme',
  QUALITYCONTROL_THEME_GETDETAIL: option.qualityManage + '/api/v1/qualitycontroltheme/detail',
  QUALITYCONTROL_THEME_REMOVE: option.qualityManage + '/api/v1/qualitycontroltheme/remove',
  QUALITYCONTROL_THEME_UPDATESTATUS: option.qualityManage + '/api/v1/qualitycontroltheme/updateStatus',

  SPECIALCHECK_THEME_LIST: option.qualityManage + '/api/v1/specialchecktheme/getSpecialCheckThemeList',
  SPECIALCHECK_THEME_ADD: option.qualityManage + '/api/v1/specialchecktheme/saveSpecialCheckTheme',
  SPECIALCHECK_THEME_UPDATE: option.qualityManage + '/api/v1/specialchecktheme/updateSpecialCheckTheme',
  SPECIALCHECK_THEME_GETDETAIL: option.qualityManage + '/api/v1/specialchecktheme/detail',
  SPECIALCHECK_THEME_REMOVE: option.qualityManage + '/api/v1/specialchecktheme/remove',
  SPECIALCHECK_THEME_UPDATESTATUS: option.qualityManage + '/api/v1/specialchecktheme/updateStatus',

  STANDARD_LIST: option.qualityManage + '/api/v1/standard/getList',
  STANDARD_RECORD_LIST: option.qualityManage + '/api/v1/standard/getRecordList',
  STANDARD_ADD: option.qualityManage + '/api/v1/standard/save',
  STANDARD_UPDATE: option.qualityManage + '/api/v1/standard/edit',
  STANDARD_GETDETAIL: option.qualityManage + '/api/v1/standard/detail',
  STANDARD_GETDETAIL_ALL: option.qualityManage + '/api/v1/standard/detailAll',
  STANDARD_REMOVE: option.qualityManage + '/api/v1/standard/remove',
  STANDARD_UPDATESTATUS: option.qualityManage + '/api/v1/standard/updateStatus',

  PROJECT_LIST: option.projectInterface + '/api/v1/project/getList',
  GETHOUSELIST: option.projectInterface + '/api/v1/space/getHouseList',
  GETPERIODLIST: option.projectInterface + '/api/v1/space/getPeriodList',
  PROJECT_BUILDING_LIST: option.projectInterface + '/api/v1/space/getBuildingList',
  PROJECT_SPACE_LIST: option.projectInterface + '/api/v1/space/getSpaceList',

  PROJECTQ_LIST: option.projectInterfaceQ + '/api/v1/project/getList',
  GET_AREA_LIST: option.projectInterfaceQ + '/api/v1/space/getAreaList',
  GET_UNIT_LIST: option.projectInterfaceQ + '/api/v1/space/getInspectionUnitList',
  PROJECT_CHILDREN_LIST: option.projectInterfaceQ + '/api/v1/space/getChildrenList',
  GET_ROLE_LIST: option.projectInterfaceQ + '/api/v1/space/getRoleList',

  GET_ZIP: option.qualityManage + '/api/v1/inspection-point/exportQrCode',
  GET_ZIPTWO: option.qualityManage + '/api/v1/standard/export',

  //巡检任务
  INSPECTIONTASK_LIST: option.qualityManage + '/api/v1/inspectiontask/getInspectiontaskList',
  INSPECTIONTASK_DETAIL_INFO: option.qualityManage + '/api/v1/inspectiontask/detail',
  INSPECTIONTASKRECORD_DETAIL_INFO: option.qualityManage + '/api/v1/inspectionrecord/detail',
  RECTIFICATIONRECORD_: option.qualityManage + '/api/v1/rectificationrecord/save',
  //质检
  GETSPOTCHECKLIST: option.qualityManage + '/api/v1/checktask/getlistByQuality',
  SETSPOTCHECKITEM: option.qualityManage + '/api/v1/checktask/saveChecktask',
  UPDATESPOTCHECKITEM: option.qualityManage + '/api/v1/checktask/updateChecktask',
  GETSPOTCHECKDETAIL: option.qualityManage + '/api/v1/checktask/detail',
  CHECKRECORDREGISTRATION: option.qualityManage + '/api/v1/checkrecord/updateSpecial',
  CHECKTASKDETAIL: option.qualityManage + '/api/v1/checktask/getDetail',
  UPLOADRECTIFICATIONRECORD: option.qualityManage + '/api/v1/rectificationrecord/uploadFile',
  UPDATECHECKTASKSTATUS: option.qualityManage + '/api/v1/checktask/updateStatus',
  GETINRECTIFICATIONRECORD: option.qualityManage + '/api/v1/rectificationrecord/inRectificationRecord',
  GETCHRECTIFICATIONRECORD: option.qualityManage + '/api/v1/rectificationrecord/chRectificationRecord',
  UPDATERECTIFICATIONRECORD: option.qualityManage + '/api/v1/rectificationrecord/saveRectificationRecord',
  //专项
  GETLISTBYSPECIALIST: option.qualityManage + '/api/v1/checktask/getlistBySpecial',
  DELETELISTBYSPECIAITEM: option.qualityManage + '/api/v1/checktask/remove',
  GETRECTIFICATION: option.qualityManage + '/api/v1/rectificationRecordLog/getTaskId',
  //装修巡查管理
  GETINSPECTIONLIST: option.qualityManage + '/api/v1/decorationinspectiontask/getInspectionlist',
  GETDECORATIONINSPECTIONTASKDETAIL: option.qualityManage + '/api/v1/decorationinspectiontask/detail',
  GETDECORATIONINSPECTIONCHECKRECORDDETAIL: option.qualityManage + '/api/v1/checkrecord/checkRecordDetail',

  //导入表格
  uploadEx: '/times/quality-service/qualityManager/api/v1/inspection-point/import',
  uploadEx2: '/times/quality-service/qualityManager/api/v1/standard/import',
  //区域列表
  GET_AREALIST: option.decorateProjectInterfaceQ + '/api/v1/project/getSpaceAreaList',
  // 查询项目和城市公司
  GET_ProjectCity: option.decorateProjectInterfaceQ + '/api/v1/project/getChooseProjectList'
};
