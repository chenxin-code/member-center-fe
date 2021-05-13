import { fetchApi } from '@/utils/ajax';
import URL from './urlConfig';

export const updateImage = data => fetchApi(URL.IMAGE_UPDATE, data, 'POST'); //图片上传(单张)
export const deleteImage = data => fetchApi(URL.IMAGE_DELETE, data, 'POST'); //图片上传(单张)

//会员列表
export const GAME_LIST = data => fetchApi(URL.GAME_LIST, data, 'POST');
export const GANE_TAKEPARTINLIST = data => fetchApi(URL.GANE_TAKEPARTINLIST, data, 'POST');
export const GANE_PRIZE_MANAGE_LIST = data => fetchApi(URL.GANE_PRIZE_MANAGE_LIST, data, 'POST');
export const GANE_DEL_PRIZE_PEOPLE = data => fetchApi(URL.GANE_DEL_PRIZE_PEOPLE, data, 'POST');
export const GANE_DETAIL = data => fetchApi(URL.GANE_DETAIL, data, 'POST');
export const GANE_CHECK_RESULT = data => fetchApi(URL.GANE_CHECK_RESULT, data, 'POST');
export const GANE_MANAGE_GAME = data => fetchApi(URL.GANE_MANAGE_GAME, data, 'POST');
export const GANE_SAVE_GAME = data => fetchApi(URL.GANE_SAVE_GAME, data, 'POST');
export const GANE_UPDATE_PRIZE = data => fetchApi(URL.GANE_UPDATE_PRIZE, data, 'POST');
export const GANE_MANAGE_TIMES = data => fetchApi(URL.GANE_MANAGE_TIMES, data, 'POST');
export const GANE_UPLOAD_PEOPLE = data => fetchApi(URL.GANE_UPLOAD_PEOPLE, data, 'POST');