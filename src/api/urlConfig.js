export const option = {
    login: '/times/auth', // 登录
    logout: '/times/api-demo/logout', //退出
    pub: '/times/pub-center', //数据字典

    space: '/times/space-center/space', //空间管理模块
    label: '/times/space-center/space/dir', //标签管理
    dictionary: '/times/pub-center/dictionary', //获取子行政列表
};

// 请求地址
export default {
    GET_TASKlIST: '/times/member-center/task/api/v1/list', // 获取任务列表
    GET_TASKSOURCE: '/times/member-center/client/api/v1/list', // 获取任务来源
    GET_CARDLIST: '/times/member-center/member-card/api/v1/list', // 获取会员卡列表
    GET_CARDDETAIL: '/times/member-center/member-card/api/v1/detail', // 获取会员卡详情
    GET_CLiENT: '/times/member-center/client/api/v1/list', // 获取第三方来源列表
    GET_TASKDETAIL: '/times/member-center/task/api/v1/detail', // 获取任务详情
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
};