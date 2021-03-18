import { fetchApi, download } from '@/utils/ajax';
import URL from './urlConfig';
let tokenStr = 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN');
console.log('tokenStr 666:>> ', tokenStr);

export const getReleaseList = data => fetchApi(URL.GET_RELEASELIST, data, 'GET');
export const getReleaseDetail = data => fetchApi(URL.GET_RELEASEDETAIL, data, 'GET');
export const getCouponList = data => fetchApi(URL.GET_COUPONLIST, data, 'GET');
// export const couponDistribute = data => fetchApi(URL.COUPONDISTRIBUTE, data, 'POST');//好像默认'Content-Type': 'application/json' 也会自动转成 'Content-Type': 'multipart/form-data
export const couponDistribute = data =>
  fetchApi(URL.COUPONDISTRIBUTE, data, 'POST', {
    Authorization: tokenStr,
    'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
  });
export const getMemberLevelList = data => fetchApi(URL.GET_MEMBERLEVELLIST, data, 'GET');
// export const getActCreate = data =>
//   fetchApi(URL.ACT_ADD, data, 'POST', {
//     Authorization: tokenStr,
//     'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
//   });
export const getActCreate = data => fetchApi(URL.ACT_ADD, data, 'POST');
