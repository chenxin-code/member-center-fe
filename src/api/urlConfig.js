export const option = {
  login: '/times/auth', // 登录
  logout: '/times/api-demo/logout', //退出
  pub: '/times/pub-center', //数据字典

  space: '/times/space-center/space', //空间管理模块
  label: '/times/space-center/space/dir', //标签管理
  dictionary: '/times/pub-center/dictionary', //获取子行政列表
  micro: '/times/micro-app-service', //微应用管理  版本管理
  member: '/times/member-center/member',
  client: '/times/member-center/client',
  mpc_integrated:'/times/member-pub-center/integrated',
  mc_integrated:'/times/member-center/integrated',
};

// 请求地址
export default {
  LOGIN: option.login + '/oauth/token', //登录
  LOGOUT: option.logout + '/logout', //退出登录
  SEND_CODE: option.pub + '/verifycode/api/v1/send', //发送验证码
  PERMISSION: '/times/user-center/permission/api/v2/permissions/get', //获取权限信息portal

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
  VERSION_ADD: option.micro + '/api/app_version/v1/publish', // APP版本发布
  VERSION: option.micro + '/api/app_version/v1/list', // APP版本列表

  //会员中心
  MEMBER_LIST: option.member + '/api/v1/member/list',
  CLIENT_LIST: option.client + '/api/v1/list',
  LOGIN_URL: option.mpc_integrated + '/api/v1/login',
  USER_INFO: option.mc_integrated + '/api/v1/user',
  MEMBER_DETAIL: option.member + '/api/v1/member/detailByMemberId'
};
