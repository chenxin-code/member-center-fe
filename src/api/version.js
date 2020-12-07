import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

// APP版本列表
export const getVersionList = data => fetchApi(URL.VERSION, data, "GET");
// APP版本发布
export const addVersion = data => fetchApi(URL.VERSION_ADD, data, "POST");
