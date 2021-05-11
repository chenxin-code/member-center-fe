import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'
const API = '/times/member-center/task/api/v1'
const API_DIST = '/times/member-center/task-dist/api/v1'


export const getTaskSource = () => fetchApi(URL.GET_TASKSOURCE, {}, 'GET')

/**
 * 获取任务列表
 * @param {object} params 入参 参数名称 参数说明 请求类型 是否必须 数据类型
 * @param {object} params.createTimeEnd	结束时间	query	true	string
 * @param {object} params.createTimeStart	开始时间	query	true	string
 * @param {object} params.pageIndex	当前页面索引	query	true	ref
 * @param {object} params.pageSize	页面数据大小	query	true	ref
 * @param {object} params.status	任务状态（空：全部，0：禁用，1启用）	query	true	ref
 * @param {object} params.taskKey	任务Key	query	true	string
 * @param {object} params.taskName	任务名称	query	true	string
 * @param {object} params.taskSource	任务来源	query	true	string
*/
export const getTaskList = data => fetchApi(`${API}/list`, data, "GET")

/**
 * 任务详情
 * @param {object} params 入参 参数名称 参数说明 请求类型 是否必须 数据类型
 * @param {number} params.taskId 任务id
*/
export const getTaskDetail = data => fetchApi(`${API}/detail`, data, 'GET')

/**
 * 启用禁用任务
 * @param {object} params 入参 参数名称 参数说明 请求类型 是否必须 数据类型
 * @param {number} params.id 任务id
 * @param {number} params.status 任务状态  0=禁用  1=启用
 * 
*/
export const postUpdateStatus = data => fetchApi(`${API}/update-status`, data, 'POST')

/**
 * 新建/修改任务
 * @param {object} params  入参 参数名称 参数说明 请求类型 是否必须 数据类型
 * @param {integer} params.id 任务ID  true  编辑必填，新建不需要填写
 * @param {integer} params.afterTask	后置任务		false	integer(int64)
 * @param {integer} params.attendFixedNum	抽奖固定参与次数		false	integer(int32)
 * @param {string} params.attendRatio	抽奖参与次数比例		false	string
 * @param {integer} params.awardGrow	任务奖励成长值		false	string
 * @param {integer} params.awardGrowMax	任务奖励成长值最大值		false	integer(int32)
 * @param {string} params.awardIntegral	任务奖励邦豆		false	string
 * @param {integer} params.awardIntegralMax	任务奖励邦豆最大值		false	integer(int32)
 * @param {integer} params.awardType	赠送类型（1:固定 2:比例 3:累计）		false	integer(int32)
 * @param {integer} params.beforeTask	前置任务		false	integer(int64)
 * @param {string} params.createTime			false	string(date-time)
 * @param {integer} params.createUser			false	integer(int64)
 * @param {string} params.createUserName			false	string
 * @param {string} params.endTime	任务结束时间		false	string(date-time)
 * @param {integer} params.executeNum	执行次数		false	integer(int32)
 * @param {integer} params.executeType	执行方式 1提示；2网页跳转；3微应用跳转		false	integer(int32)
 * @param {integer} params.id	id		false	integer(int64)
 * @param {integer} params.isDefault	是否初始化 0否1是		false	integer(int32)
 * @param {integer} params.isDeleted			false	integer(int32)
 * @param {integer} params.isPeriodic	是否周期性,0:一次性；1:是；2：重复性		false	integer(int32)
 * @param {integer} params.isShow	是否显示		false	integer(int32)
 * @param {integer} params.isSystemAward	是否进行邦豆成长值奖励 0否1是		false	integer(int32)
 * @param {string} params.jumpPath	跳转路径		false	string
 * @param {integer} params.maxLevel	需求最大会员等级		false	integer(int64)
 * @param {string} params.memo	备注		false	string
 * @param {integer} params.minLevel	需求最小会员等级		false	integer(int64)
 * @param {integer} params.otherAwardId	其他奖励ID		false	integer(int64)
 * @param {integer} params.otherAwardType	其他奖励类型 1活动；2抽奖；3礼包		false	integer(int32)
 * @param {string} params.periodic	周期		false	string
 * @param {string} params.source	任务来源		false	string
 * @param {string} params.sourceName	任务来源名称		false	string
 * @param {string} params.startTime	任务开始时间		false	string(date-time)
 * @param {integer} params.status	任务状态：0：禁用；1：启用		false	integer(int32)
 * @param {string} params.taskCondition	任务条件		false	string
 * @param {string} params.taskImage	图片		false	string
 * @param {string} params.taskKey	任务键值		false	string
 * @param {string} params.taskName	名称		false	string
 * @param {string} params.updateTime			false	string(date-time)
 * @param {integer} params.updateUser			false	integer(int64)
 * @param {string} params.updateUserName			false	string
 * @param {integer} params.validity	任务领取后的有效期		false	integer(int32)
*/
export const postAdd = data => fetchApi(`${API}/add`, data, 'POST')
export const postUpdate = data => fetchApi(`${API}/update`, data, 'POST')


/**
 * 任务派发列表
 * @param {object} params 入参 参数名称 参数说明 请求类型 是否必须 数据类型
 * @param {number} params.pageIndex	起始页	query	true	ref
 * @param {number} params.pageSize	每页展示条数	query	true	ref
 * @param {number} params.distType	派发类型（空：全部；0：自动；1：手动）	query	false	ref
 * @param {string} params.endTime	结束时间	query	false	string
 * @param {string} params.startTime	开始时间	query	false	string
 * @param {string} params.taskName	任务名称	query	false	string
*/
export const getDistList = param => fetchApi(`${API_DIST}/dist-list`, param, 'get')

/**
 * 任务派发新增
 * @param {object} params 入参 参数名称 参数说明 请求类型 是否必须 数据类型
 * @param {string} params.clientId	来源code	query	false	string
 * @param {string} params.createTime		query	false	string(date-time)
 * @param {number} params.createUser		query	false	integer(int64)
 * @param {string} params.createUserName		query	false	string
 * @param {number} params.endLevelId	结束会员等级	query	false	integer(int64)
 * @param {object} params.file	会员文件	formData	false	ref
 * @param {number} params.id	ID	query	false	integer(int64)
 * @param {number} params.isDeleted		query	false	integer(int32)
 * @param {number} params.scopeType	指定类型 0不指定，1指定	query	false	integer(int32)
 * @param {number} params.startLevelId	开始会员等级	query	false	integer(int64)
 * @param {number} params.status	保存状态 0保存草稿，1提交保存	query	false	integer(int32)
 * @param {number} params.taskId	任务ID	query	false	integer(int64)
 * @param {string} params.updateTime		query	false	string(date-time)
 * @param {number} params.updateUser		query	false	integer(int64)
 * @param {string} params.updateUserName		query	false	string
*/
export const getAddDist = data => fetchApi(`${API_DIST}/add-dist`, data, 'post', {
  'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
})