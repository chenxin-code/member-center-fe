import { fetchApi } from '@/utils/ajax'
import URL from './urlConfig'

export const getCardList = data => fetchApi(URL.GET_CARDLIST, data, 'GET');

export const getCardDetail = data => fetchApi(URL.GET_CARDDETAIL, data, 'GET');