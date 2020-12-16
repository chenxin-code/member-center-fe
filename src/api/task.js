import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

export const getTaskList = data => fetchApi(URL.GET_TASKlIST, data, "GET")

export const getTaskSource = () => fetchApi(URL.GET_TASKSOURCE, {}, 'GET')