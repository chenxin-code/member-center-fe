import axios from 'axios';
import NProgress from 'nprogress';
import JSONbig from 'json-bigint';
import message from 'ant-design-vue/es/message';
// import * as api from '@/api/login';
// import QS from 'qs';

let BASEURL = '';
if (process.env.NODE_ENV === 'development') {
  BASEURL = '/';
} else {
  BASEURL = location.origin;
}

const JSONBigString = JSONbig({ storeAsString: true });
export const HTTP = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    // post: {
    //   'Content-Type': 'application/json'
    // }
  },
  transformResponse: [
    function(data) {
      return JSONBigString.parse(data);
    }
  ]
});

//请求拦截
HTTP.interceptors.request.use(async config => {
  NProgress.start();

  console.log('config.url :>> ', config.url);

  if (config.url.indexOf('/times/member-pub-center/integrated') >= 0) {
    let tokenStr = '';
    config.headers.Authorization = tokenStr;
    return config;
  } else {
    // 通过调用ajax拿到存在localStorage里面的token
    // let tokenStr =
    //   'Bearer ' +
    //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJpZCI6MSwiZXhwIjoxNjA4MDY4NzQzLCJhdXRob3JpdGllcyI6WyJhcHBfYWN0aXZpdHlfYWRtaW4iLCJhcHBfcXVhbGl0eV9hZG1pbiIsImFwcF9ob3VzZV9hZG1pbiIsImFwcF92aXNpdG9yX2FkbWluIiwic3lzX2FkbWluIiwiYXBwX2RldmljZV9hZG1pbiIsImFwcF9hZHZlcnRfYWRtaW4iLCJhcHBfbm90aWNlX2FkbWluIiwiYXBwX21pY3JvX2FkbWluIiwiYXBwX2FyZWFfYWRtaW4iLCJhcHBfYWlfYWRtaW4iLCJhcHBfZGVjb3JhdGVfYWRtaW4iLCJhcHBfdmVoaWNsZV9hZG1pbiIsImFwcF9hcmVhX2VtcF9hZG1pbiIsImFwcF9wYXNzYWdlX2FkbWluIiwiYW55dGltZXMiLCJhcHBfdXNlcl9hZG1pbiIsImFwcF9zcGFjZV9hZG1pbiIsImFwcF9vd25lcl9hZG1pbiIsImFwcF9jb21wYW55X2xpYl9hZG1pbiIsImFwcF9hZG1pbiJdLCJqdGkiOiIyNDJjOGNhYS02YmU4LTQ5OWYtYjI5Ny0zMjVhNzEwY2UxZGUiLCJjbGllbnRfaWQiOiJ3ZWJfYiJ9.WgYr5lRJ7-10vuu0iSU5yQr1kbFhVNtmOglMVHCXC2_IyKaWNW8dcUAU7Jr-CKBwkJ97u5x6dyXVzmBKrmP5GAxXplEdLFxbSLE_inyCP_b8UtKj5gwWo3-OXXGQd_az-3gY8UWdjapGwXq3ASxvFoZmEsDXq9IsxRdP2NoL7dx4wpxtQNBNt2VsdYhzGPzxjH82-UqRbZi5l_vKJuqO1jGTLQhNOYFMqkLe7QQgcBqJzgoDoQd_FuLWT_agFxEiOBn92RKaxG9oDJ8EB8lBJB3AhKJBkdoZRvEf5MXCzz8_PF2z4V-e1uePXZF46Pt36596daxP4pAVv9WYdZMxiA';
    let tokenStr = 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN');
    console.log('ajax tokenStr :>> ', tokenStr);
    config.headers.Authorization = tokenStr;
    return config;
  }
});

function handleParams(url, rawData, rawMethod, responseType) {
  const method = rawMethod.toUpperCase();
  let data = {};
  if (method === 'GET') {
    data = { params: rawData };
  }
  switch (method) {
    case 'GET':
      data = { params: rawData };
      break;
    case 'POST':
    case 'PUT':
    case 'PATCH':
    case 'DELETE':
      data = { data: rawData };
      break;
    default:
      data = { params: rawData };
      break;
  }

  return Promise.resolve({
    url,
    method,
    data,
    responseType
  });
}

async function handleFail(option) {
  console.log(option);
  const { error, reject } = option;
  const { response } = error;
  if (response) {
    switch (response.status) {
      case 400:
        message.error('请求失败');
        break;
      case 401:
        break;
      case 403:
        break;
      case 404:
        message.error('请求失败');
        break;
      case 500:
        message.error('请求失败');
        break;
      default:
        message.error('请求失败');
        break;
    }
  } else {
    var originalRequest = error.config;
    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {
      originalRequest._retry = true;
      message.error('请求超时');
    }
  }
  reject(error);
}

let defaultHeader = {
  timezoneoffset: Math.abs(new Date().getTimezoneOffset() / 60),
  locale: 'zh_CN',
  get: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

let isRefresh = false;
async function refreshToken() {
  isRefresh = true;
  window.location.href = localStorage.getItem('SD_LOGIN_URL');

  // const para = QS.stringify({
  //   grant_type: 'refresh_token',
  //   client_id: 'web_b',
  //   client_secret: 'times',
  //   username: window.localStorage.getItem('SD_LOGIN_NAME'),
  //   password: '',
  //   scope: 'all',
  //   refresh_token: window.localStorage.getItem('SD_ACCESS_REFRESHTOKEN')
  // });
  // api
  //   .toLogin(para)
  //   .then(res => {
  //     if (res.code === 200) {
  //       window.localStorage.setItem('SD_ACCESS_TOKEN', res.data.token);
  //       window.localStorage.setItem('SD_ACCESS_REFRESHTOKEN', res.data.refreshToken);
  //       location.reload();
  //     }
  //   })
  //   .finally(() => {});
}

export const fetchApi = (api, rawData = {}, method = 'GET', headers = {}, responseType = 'json', url = BASEURL) => {
  return handleParams(api, rawData, method, headers, responseType).then(options => {
    return new Promise((resolve, reject) => {
      if (responseType == 'blob') {
        let tokenStr = 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN');
        axios({
          url: options.url,
          method: options.method,
          headers: {
            Authorization: tokenStr,
            'Content-Type': 'application/json'
          },
          data: { ...options.data },
          responseType: 'blob' // 设置服务器响应的数据类型（必选）
        }).then(resp => {
          const res = resp.data;
          console.log(resp);
          // 下载正常处理
          let fileName = resp.headers['content-disposition'];
          console.log(fileName);
          // 获取文件名
          if (fileName && fileName.length >= 2) {
            fileName = fileName.split('=')[1];
          }
          fileName = decodeURI(escape(fileName));
          console.log(fileName);
          // 兼容ie11
          if (window.navigator.msSaveOrOpenBlob) {
            try {
              window.navigator.msSaveOrOpenBlob(new Blob([res]), fileName);
            } catch (e) {
              console.log(e);
            }
            return;
          }
          // a标签实现下载
          let url = window.URL.createObjectURL(new Blob([res]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
        });
      } else {
        console.log('api ----', {...defaultHeader, ...headers})
        HTTP({
          baseURL: url,
          withCredentials: true,
          url: options.url,
          method: options.method,
          headers: { ...defaultHeader, ...headers },
          ...options.data
        }).then(
          resp => {
            NProgress.done();
            const res = resp.data;
            if (res.code === 0) {
              resolve(res);
            } else {
              if (res.code === 401) {
                if (isRefresh) {
                  message.error(res.message);
                  resolve(res);
                } else {
                  message.error(res.message);
                  refreshToken(); //刷新token
                  resolve(res);
                }
              } else if (res.code !== 200) {
                message.error(res.message);
                resolve(res);
              } else {
                resolve(res);
              }
            }
          },
          error => {
            NProgress.done();
            handleFail({
              error,
              reject,
              options
            });

            throw error;
          }
        );
      }
    });
  });
};

export default {
  downLoad(url, data) {
    return axios({
      method: 'get',
      url,
      params: data,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN')
      },
      responseType: 'blob'
    });
  }
};
