import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

export const getDealingList = data => fetchApi(URL.GET_DEALINGLIST, data, 'GET');

export const getDealingDetail = data => fetchApi(URL.GET_DEALINGLIST, data, 'GET');