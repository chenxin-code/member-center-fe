import axios from "axios";
import QS from "qs";
import { Toast } from "vant";
import { storages } from "@/utils/util";
import store from "@/store";

console.log("VUE_APP_BASE_API--->", process.env.VUE_APP_BASE_API);
const VUE_APP_BASE_API = process.env.VUE_APP_BASE_API;
//axios.defaults.baseURL = "http://10.71.12.187:8200/times-center-trade/v2/api-docs";
//uat环境：http://mall-uat-api-linli.timesgroup.cn
//dev环境：http://39.105.84.126:28816
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "/";
} else {
  axios.defaults.baseURL = VUE_APP_BASE_API;
}

export const HTTP = axios.create({
  withCredentials: false,
  timeout: 20000,
  headers: {}
});

//请求拦截
HTTP.interceptors.request.use(async config => {
  config.headers.access_channel = "mall";
  const token = store.state.user.token;
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

//处理参数
function handleParams(url, rawData, rawMethod) {
  const method = rawMethod.toUpperCase();
  let data = {};
  if (method === "GET") {
    data = {
      params: rawData
    };
  }
  switch (method) {
    case "GET":
      data = {
        params: rawData
      };
      break;
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE":
      data = {
        data: rawData
      };
      break;
    default:
      data = {
        params: rawData
      };
      break;
  }
  return Promise.resolve({
    url,
    method,
    data
  });
}

//处理失败
async function handleFail(option) {
  console.log(option);
  const { error, reject } = option;
  const { response } = error;
  if (response) {
    Toast("请求失败");
  } else {
    var originalRequest = error.config;
    if (
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      Toast("请求超时");
    }
  }
  reject(error);
}

//默认header
let defaultHeader = {
  timezoneoffset: Math.abs(new Date().getTimezoneOffset() / 60),
  locale: "zh_CN",
  get: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

let refresh = false;

// async function refreshToken() {
//   refresh = true;
//   const para = QS.stringify({
//     grant_type: "refresh_token",
//     client_id: "app_c",
//     client_secret: "times",
//     scope: "all",
//     refresh_token: REFRESH
//   });
//   api
//     .toLogin(para)
//     .then(res => {
//       if (res.code === 200) {
//         localstorage.set({
//           key: "LLBToken",
//           value: res.data.token,
//           isPublic: false
//         });
//         location.reload();
//       }
//     })
//     .finally(() => {});
// }

//定义白名单
var WXList = ["/oauth2/accessToken", "/api/wechat/js_sdk_signature"];
var baseurl;

export const fetchMethod = async (
  method = "GET",
  api,
  rawData = {},
  headers = {}
) => {
  Toast.loading({
    message: "加载中...",
    duration: "toast",
    forbidClick: true
  });
  return handleParams(api, rawData, method, headers).then(options => {
    return new Promise((resolve, reject) => {
      HTTP({
        baseURL: baseurl,
        withCredentials: false,
        url: options.url,
        method: options.method,
        headers: {
          ...defaultHeader,
          ...headers
        },
        ...options.data
      }).then(
        resp => {
          console.log("HTTP--->", resp);
          Toast.clear();
          const res = resp.data;
          //如果接口返回了token就设置vuex
          const Authorization = res.Authorization;
          if (Authorization) {
            store.dispatch("user/setToken", Authorization);
          }
          //处理特殊接口（无返回code时）
          var isWX = false;
          for (let i = 0; i < WXList.length; i++) {
            var node = WXList[i];
            if (node == api) {
              isWX = true;
              break;
            }
          }

          if (isWX == true) {
            resolve(res);
            return false;
          }

          if (res.code === 0) {
            resolve(res);
          } else {
            if (res.code === 401) {
              if (refresh) {
                resolve(res);
              } else {
                // refreshToken();
                resolve(res);
              }
            } else if (res.code !== 200) {
              if (res.message) {
                Toast({
                  message: res.message,
                  forbidClick: true
                });
              }
              resolve(res);
            } else {
              resolve(res);
            }
          }
        },
        error => {
          // NProgress.done()
          handleFail({
            error,
            reject,
            options
          });

          throw error;
        }
      );
    });
  });
};
