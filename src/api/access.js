import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

export const getClientList = data => fetchApi(URL.GET_CLiENT, data, 'GET');
