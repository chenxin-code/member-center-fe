import {fetchApi} from '@/utils/ajax'
import URL from './urlConfig'

export const getUserInfo = data => fetchApi(URL.USER_INFO, data, 'GET');
