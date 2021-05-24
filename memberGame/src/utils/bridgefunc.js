/*
 * 与原生交互的js类
 */
import store from "../store";
import router from "../router";
import util from "./util"
import wxfunc from './wxfunc'
import alipayfunc from './alipayfunc'
import http from './http'
import StorageQueue from './StorageQueue'
import Toast from "../components/Vendor/toast";
import logCenter from "./logCenter";
import MD5 from './md5'
import {cloneDeep} from './util'
import jsonp from 'jsonp'
import Config from '@/api/config'
import tools from "./tools";

const dev = process.env.NODE_ENV !== 'production'
var bridgefunc = {
  /**
   * h5调用客户端协议
   * @param bridgeOpStr  方法名称匹配  固定传phonebridge
   * @param paras 调用协议的参数
   * @param callback  客户端回调方法
   */
  callBridge: function (bridgeOpStr, paras, callback) {
    if (store.state.webtype != '1') {
      return
    }
    console.log(bridgeOpStr)
    this.setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(bridgeOpStr, paras, function responseCallback(response) {
        if (callback) {
          callback(response);
        }
      })
    })
  },
  /**
   *客户端调h5
   * @param bridgeOpStr   协议方法名
   * @param callback    回调方法
   */
  registeBridge: function (bridgeOpStr, callback) {
    if (store.state.webtype != '1') {
      return
    }
    this.setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(bridgeOpStr, function (data, responseCallback) {
        if (callback) {
          callback(data, responseCallback);
        }
      })
    })
  },
  setupWebViewJavascriptBridge: function (callback) {
    try {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
      }, 0)
    } catch (e) {
      // console.log(e)
    }
  },
  /**
   * 重要的协议，获取协议版本，很多协议需要根据版本做不同处理，
   * 初始版本为2.0
   */
  getAppProtocolVersion: function () {
    // 因为不可预测性，做一个延迟处理
    setTimeout(() => {
      let jsonData = {};
      jsonData.type = 'getappprotocolversion';
      bridgefunc.callBridge('phonebridge', jsonData, (result) => {
        // console.log('getAppProtocolVersion', result)
        store.state.protocolVersion = result
        bridgefunc.vuexStorage()
      })
    }, 100)
  },
  // 尊重原数据结构，push
  customPush: function (pushData, isNeedToken = true, isztRedirect = false) {
    let webtype = store.state.webtype;
    let toPath = pushData.path
    if (toPath.indexOf("?") != -1) {
      toPath = toPath + '&'
    } else {
      toPath = toPath + '?'
    }
    let query = pushData.query
    for (let key in query) {
      let value = query[key]
      toPath += key + '=' + value + '&';
    }
    if (pushData.authorizationType === '0') {
      // 不给任何权限
    } else {
      let token = isNeedToken ? store.state.login.token : '';
      let cityId = store.state.indexData.cityId;
      let cityName = store.state.indexData.city;
      let stationCode = store.state.indexData.station.stationCode;
      if (!stationCode) {
        stationCode = store.state.refuelStation.stationCode
      }
      if (token) {
        toPath += 'token' + '=' + token + '&wxmpToken' + '=' + token + '&cityId=' + cityId + '&cityName=' + encodeURIComponent(cityName) + '&stationCode=' + stationCode + '&lng=' + store.state.currentLocation.posx + '&lat=' + store.state.currentLocation.posy + '&pickupId=' + store.state.mall2.zitiAddress.id + '&webtype=' + store.state.webtype + '&userID=' + store.state.userInfo.userId + '&';
      }
    }
    toPath = toPath.substr(0, toPath.length - 1)
    if (webtype == '1') {
      delete pushData.path
      delete pushData.query
      pushData.weburl = toPath
      // 零时解决方案
      // pushData.isnativetop = 0
      bridgefunc.newPage(pushData)

    } else if (0 && webtype == '3') {
      // 暂时去掉，小程序相关处理
      if (isztRedirect) {
        wx.miniProgram.redirectTo({
          url: `/pages/web-view/common?path=${toPath}`
        })
      } else {
        wx.miniProgram.navigateTo({
          url: `/pages/web-view/common?path=${toPath}`
        })
      }
    } else {
      if (toPath.indexOf("http") == 0) {
        if (isztRedirect) {
          window.location.replace(toPath)
        } else {
          window.location.href = toPath
        }
      } else {
        router.push(pushData)
      }
    }

  },
  //新创建页面 jsonData里面包含跳转地址weburl、isnativetop（是否是原生上导航，不传默认是网页导航）
  newPage: function (jsonData) {
    let webtype = store.state.webtype;
    let weburl = jsonData.weburl
    if (typeof (weburl) == undefined) {
      // console.log('传参有误')
      return
    } else if (weburl.indexOf("http") != 0) {
      weburl = window.location.href.split('#')[0] + '#' + weburl
    }
    // if (webtype != '1') {
    //   window.location.href = weburl
    //   return
    // }
    jsonData.weburl = weburl
    jsonData.type = 'newpage'
    if (jsonData.isnativetop && jsonData.isnativetop == '1') {
      jsonData.isnativetop = '1'
    } else {
      jsonData.isnativetop = '0';
    }

    if (jsonData.isVuePage == '0' || jsonData.isVuePage == false) {
      // 使用老协议
      jsonData.isVuePage = false;
    } else {
      jsonData.isVuePage = true;
    }

    if (weburl.indexOf('qf.ahsy.com.cn') != -1) {
      bridgefunc.customSetCookies((result) => {
        bridgefunc.callBridge('phonebridge', jsonData)
      }, weburl)
    } else if (weburl.indexOf('uhuitong.com') != -1) {
      let cookies = {
        phone: store.state.login.phone ? store.state.login.phone : '',
        token: store.state.login.token ? store.state.login.token : '',
        username: store.state.login.phone ? store.state.login.phone : '',
        longitude: store.state.currentLocation.posx,
        latitude: store.state.currentLocation.posy
      }
      let jsonData1 = {};
      jsonData1.type = 'expandcookies';
      jsonData1.cookies = encodeURIComponent(JSON.stringify(cookies));
      jsonData1.url = weburl;
      bridgefunc.callBridge('phonebridge', jsonData1, (result) => {
        bridgefunc.callBridge('phonebridge', jsonData)
      })
    } else {
      // let logBody = 'newpage 相关参数：' + JSON.stringify(jsonData) + '<br/>';
      // logCenter.addLog(logBody)
      bridgefunc.callBridge('phonebridge', jsonData)
    }
  },
  resetPage: function (jsonData) {
    let webtype = store.state.webtype;
    let weburl = jsonData.weburl
    if (typeof (weburl) == undefined) {
      // console.log('传参有误')
      return
    } else if (weburl.indexOf("http") != 0) {
      if (webtype != '1') {
        router.replace({
          path: weburl
        })
        return
      }
      weburl = window.location.href.split('#')[0] + '#' + weburl
    }
    if (webtype != '1') {
      window.location.href = weburl
      return
    }
    // console.log('weburl', weburl)
    jsonData.weburl = weburl
    jsonData.type = 'resetpage'
    jsonData.isnativetop = '0'
    bridgefunc.callBridge('phonebridge', jsonData)
  },
  // 尊重原数据结构，返回
  customGo: function (n) {
    let webtype = store.state.webtype;
    if (webtype != '1') {
      router.go(n)
      return
    }
    bridgefunc.turnBack(n)
  },
  // scangoods 参数 title居中标题、rightbtn右按钮标题、count 数量、detailurl商品详情url、checkouturl结算界面url
  scanGoods: function (title, rightbtn, count, detailurl, checkouturl, storeoucode) {
    let webtype = store.state.webtype;

    if (webtype != 1) {
      return
    }
    let jsonData = {};
    jsonData.type = 'scangoods';
    jsonData.title = title;
    jsonData.rightbtn = rightbtn;
    jsonData.count = count;
    jsonData.detailurl = detailurl;
    jsonData.checkouturl = checkouturl;
    bridgefunc.callBridge('phonebridge', jsonData, function () {
    })
  },
  // scancode
  scanCode: function (callback) {
    let webtype = store.state.webtype;

    if (webtype == '1') {
      //  app里面访问
      let jsonData = {};
      jsonData.type = 'qrscan';
      bridgefunc.callBridge('phonebridge', jsonData, function (dic) {
        /**
         * 如果需要做特定事件处理，请拦截好返回，如果是单一逻辑，请在单一地方处理
         */
        let code = decodeURIComponent(dic.code);
        if (code && code.indexOf('http') > -1) { // 兼容微信扫码我的二维码跳转到下载地址
          if (code.indexOf('empid') > -1) {
            code = util.getUrlParam(code, 'empid')
          } else if (code.indexOf('qrCode') > -1) {
            code = util.getUrlParam(code, 'qrCode')
          }
        }
        dic.code = code;
        callback(dic);
      })
    } else if (webtype == '2' || webtype == '3') {
      //  微信里面
      wxfunc.getWechatSignature(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            callback({
              code: result
            });
          }
        });
      })
    } else if (webtype == '7') {
      // 掌厅扫码
      window.location.href = "sinopecapp://loadNative('qrcode')"
      window.revNativeValue = (value) => {
        // Toast(value)
        console.log('掌厅扫码返回：', value)
        if (value) {
          // 因为掌厅扫码json返回结果错误必须这样处理
          if (value.indexOf('"code":"0"') > 0) {
            let reg = /\{(.+)\}/g;
            let nextValue = value
            while (nextValue.length) {
              let array = nextValue.match(reg)
              if (array && array.length) {
                let v1 = array[0]
                nextValue = v1.substring(1, v1.length-1)
                if (nextValue.indexOf('"text":"') === 0) {
                  nextValue = nextValue.substring(8, nextValue.length-1)
                  break ;
                }
              } else {
                break ;
              }
            }
            callback({
              code: nextValue
            })
          } else {
            Toast('扫码失败！')
          }
        } else {
          Toast('扫码失败！')
        }
      }
    } else {
      callback({
        code: 'http://gzapptest.deepermobile.com.cn/app-vue/app/index.html#/usercenter/downloadshare?qrCode=2020071507536677079',
        // code: '2020031425135289947',
        msg: '这是浏览器端返回的'
      })
    }
  },
  //pop到第几层 如果n为0 或 不传则默认pop到上一层
  turnBack: function (n) {
    let webtype = store.state.webtype;
    let jsonData = {};
    if (n && typeof n === 'number') {
      if (webtype == '4') {
        hybrid_app.back()
        return
      } else if (webtype != '1') {
        // console.log(n)
        window.history.go(n)
        return
      }
      jsonData.type = 'turnback'
      jsonData.index = n + ''
      bridgefunc.callBridge('phonebridge', jsonData)
    } else {
      if (webtype == '4') {
        hybrid_app.back()
        return
      } else if (webtype != '1') {
        window.history.go(-1)
        return
      }
      jsonData.type = 'turnback'
      bridgefunc.callBridge('phonebridge', jsonData)
    }
  },
  backIndex: function (n) {
    let jsonData = {};
    jsonData.type = 'backindex'
    //转字符串
    jsonData.index = n + ''
    bridgefunc.callBridge('phonebridge', jsonData)
  },
  // app 跳转小程序
  navigateToMiniProgram: function (originalId, path) {
    let jsonData = {};
    jsonData.type = 'miniprogram'
    jsonData.originalId = originalId
    jsonData.path = path
    bridgefunc.callBridge('phonebridge', jsonData)
  },
  //支付宝授权 授权回调
  aliAuth: function (infoStr, callback) {
    let jsonData = {};
    jsonData.type = 'aliauth'
    jsonData.infoStr = infoStr;
    bridgefunc.callBridge('phonebridge', jsonData, callback)
  },
  /**
   * 拍照
   * @param phototype 1 是相册 2 是拍照 3 自定义相机拍证件
   * @param callback
   */
  getPhoto: function (phototype, callback, cameraDevice = '0', unclip = '1') {
    let webtype = store.state.webtype;

    if (webtype == '1') {
      let jsonData = {};
      jsonData.type = 'getphoto'
      jsonData.phototype = phototype
      jsonData.cameraDevice = cameraDevice;
      jsonData.unclip = unclip;
      bridgefunc.callBridge('phonebridge', jsonData, callback)
    } else if (webtype == '2' || webtype == '3') {
      wxfunc.getWechatSignature((isSignature) => {
        //签名成功
        if (isSignature) {
          wxfunc.wxChooseImage(phototype, (imgInfo) => {
            if (imgInfo.data) {
              let arr = imgInfo.data.split(',');
              callback(arr.length > 1 ? arr[1] : arr[0]);
            } else if (imgInfo.mediaid) {
              callback(imgInfo.mediaid, 'mediaid');
            } else {
              //  选择空
            }
          });
        } else {
          Toast('签名失败');
        }
      });
    } else if (webtype == 6) {
      alipayfunc.chooseImage().then(res => {
        callback(res.split(',')[1])
      })
    } else {
      // 原电脑截图 （测试）
      callback('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PY0tMkDFCFGTjjnH60AAjjBBCgEdOKPLjxjaMA56d6rCKbP3j27+hH/1/rUZguCgG7kHrk+1FwLpjjOcqPm68dfrQEQNuCjPriq7RS7sqeMjueP8+lNEMuXOcbge/fORRcC7TWRG+8oP1FVPKmxhvm+bPX2Pr+FPaOUxIFOGC4PPtQBOY4ySSo+brx1o8uP+6OBjp29Kr+XPhOeR7/5zU0KyImJDk5Jz9aLgOEcYxhRxyOOlHlR4I2jBOTx3p9FO4DPLjOSVHzdeOtOAAGBwBS0UgCiiigAooooAKKKKACm7l9RQ4YoQpwccGubS0lBX9wwI2857g8mqjG4mzpqKKKkZ/9T06iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//1fTqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//W9OooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9f06iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0PTqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//R9OooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9L06iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0/TqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//U9OooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9X06iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//1vTqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//X9OooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9D06iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0fTqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//S9OooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9P06im7h70bh70AOopu4e9G4e9ADqKbuHvRuHvQA6im7h70bh70AOopu4e9G4e9ADqKbuHvRuHvQA6im7h70bh70AOopu4e9G4e9ADqKbuHvRuHvQA6im7h70bh70AOopu4e9G4e9ADqKbuHvRuHvQA6im7h70bh70Af//U9Ko4HU0dxUEkbOxx0yOTz/nFAE/40uPeqzo27oSPb6dv8atUAJj3ox70tFACY96Me9LRQAmPejHvS0UAJj3ox70tFACY96Me9LRQAmPejHvS0UAJj3ox70tFACY96Me9LRQAmPekp1J3NADCxzhRn1o3EHDDGe4rNv5nt1SUQmXY5bgkYPY8dRg0yyuXujJIYDFu28knkj0BHYUAbFFFFAH/1fSqXJoooAMmjJoooAMmjJoooAMmjJoooAMmjJoooAMmjJoooAMmjJoooAMmjJoooAMmjJoooAMmjJoooAMmkpaKAGlQeT19RQFAOep9TzTqKACiiigD/9k=');
    }
  },

  //建行龙支付，支付回调
  jhLongPay: function (info, callback) {
    let jsonData = {};
    jsonData.type = 'ccbnetpay'
    jsonData.ccbpayinfo = encodeURIComponent(info)
    bridgefunc.callBridge('phonebridge', jsonData, callback)
  }, //微信支付，支付回调
  //支付宝支付，支付回调
  aliPay: function (info, callback) {
    let jsonData = {};
    jsonData.type = 'alipay'
    jsonData.aliPreapy = info
    bridgefunc.callBridge('phonebridge', jsonData, callback)
  },
  //微信支付，支付回调
  wxPay: function (info, callback) {
    if (store.state.webtype == '6') {
      let d = {
        sign: info.sign,
        timestamp: info.timestamp,
        noncestr: info.noncestr,
        partnerid: info.partnerid,
        prepayid: info.prepayid,
        package: info.package,
        packageValue: info.package,
        appid: info.appid,
      }
      // 兼容老协议
      let str = '{"type":"payViaWeChat","para":' + JSON.stringify(d) + '}'
      str = encodeURIComponent(str)
      str = 'http://forapp?appprotocol=' + str
      window.location.href = str
      window.weChatPaiedCallBack = (res) => {
        callback(res)
      }
      return;
    }

    let jsonData = {};
    jsonData.type = 'wechatpay'
    jsonData.payinfo = info
    bridgefunc.callBridge('phonebridge', jsonData, callback)
  },
  //微信H5支付
  wxH5Pay: function (info) {
    let jsonData = {};
    jsonData.type = 'wechath5pay'
    jsonData.payh5info = info
    jsonData.isnativetop = true
    bridgefunc.callBridge('phonebridge', jsonData)
  },
  //获取定位位置
  getLocation: function (callback) {
    // console.log('----getLocation----start------')
    // console.log('----getLocation----callback------', callback)
    let jsonData = {};
    jsonData.type = 'locationinfo'
    let webtype = store.state.webtype;
    const defaultLocationInfo = JSON.parse(JSON.stringify(store.state.globalConfig))

    let result = localStorage.getItem('user_privacy_ask_flag')
    // 任务 3777 河南APP首次登陆注册获取定位信息加入客户信息中
    if (result == 'false') {
      callback(defaultLocationInfo, false)
      return;
    }

    // 河北环境&公众号环境
    // if (webtype == 2 && store.state.deployType == 2) {
    //   callback(defaultLocationInfo, false)
    //   return
    // }

    // console.log('----getLocation----user_privacy_ask_flag---result------', result)

    if (webtype == '1') { // app
      bridgefunc.callBridge('phonebridge', jsonData, function (json) {
        if (json.result == 1) {
          // 当省份和城市相同的时候   将区域付给城市
          if (json.province == json.city) {
            json.city = json.district;
            json.district = '';
          }
          // 当省份为空 依次向前赋值
          if (!json.province || json.province == '') {
            json.province = json.city;
            json.city = json.district;
            json.district = '';
          }
          // 当市为空 依次向前赋值
          if (!json.city || json.city == '') {
            json.city = json.district;
            json.district = '';
          }
          if (json.city == '' || json.province == '') {
            // 优先默认上一次定位
            bridgefunc.getLastLocation((local) => {
              if (local) {
                json = local
              } else {
                json = defaultLocationInfo
              }
              callback(json);
            })
          } else {
            bridgefunc.saveLastLocation(json, () => {
            })
            callback(json, true);
          }
        }
        //定位失败的情况 附一个默认值  目前取的南昌市政府的经纬度
        else if (json.result == 0) {
          bridgefunc.getLastLocation((local) => {
            if (local) {
              json = local
            } else {
              json = defaultLocationInfo
            }
            callback(json);
          })
        }
      })
    } else if (webtype == '2' || webtype == '3') { // 微信
      // console.log('----getLocation--------进入微信')

      // 去掉微信定位，某客户提的需求
      if (store.state.globalConfig.wx_location_disabled != 1) {
        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          // console.log('----isSignature--------进去签名', isSignature)

          if (isSignature) {
            wxfunc.wxGetLocation((location) => {
              console.log('----wxGetLocation--------获取成功', location)
              if (!location) {
                callback(defaultLocationInfo, false)
              } else {
                location.result = 1;
                // console.log('----wxGetLocation--------callback--------', callback)
                callback(location, true)
              }
            });
          } else {
            callback(defaultLocationInfo, false)
          }
        });
      } else {
        callback(defaultLocationInfo, false)
      }

    } else if (webtype == '4') {
      // 工银e生活
      hybrid_app.openGPS()
      hybrid_app.getMyLocation('icbc_locationBack')
      window.icbc_locationBack = (locatiion) => {
        console.log('工银返回：', locatiion)
        this.geocoder(locatiion, callback)
      }
    } else if (webtype == '6') {
      alipayfunc.getLocation().then(res => {
        callback(res, true)
        console.log('支付宝定位', res)
      }, () => {
        callback(defaultLocationInfo, false)
      })
    } else if (webtype == '7') {
      // 掌厅定位
      // {"code":"0","type":"gps","value":{"country":"国家","province":"省份","city":"城市","district":"区/县","address":"街道、小区、楼号等详细地址","latitude":经度,"longitude":纬度}}
      window.location.href = "sinopecapp://loadNative('gps')"
      window.revNativeValue = (value) => {
        console.log('掌厅定位返回：', value)
        if (value) {
          let jsonData = JSON.parse(value)
          if (jsonData.code == 0) {
            callback(jsonData.value, true)
          } else {
            callback(defaultLocationInfo, false)
          }
        } else {
          callback(defaultLocationInfo, false)
        }
      }
    } else {
      callback(defaultLocationInfo, false)
    }
  },
  geocoder: function (location, callback) {
    let url = 'https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + location.latitude + ',' + location.longitude + '&output=json&pois=0&ak=' + Config.mapak;

    jsonp(url, null, (err, data) => {

      if (err) {
        callback(null);
      } else {
        let json = data.result.addressComponent;
        //当省份和城市相同的时候   将区域付给城市
        if (json.province == json.city) {
          json.city = json.district;
          json.district = '';
        }
        json.longitude = location.longitude;
        json.latitude = location.latitude
        console.log('----jsonp----json----执行', json)

        callback(json);
      }
    })
  },
  //调起原生客服
  chatservice: function (callback) {
    let jsonData = {};
    jsonData.type = 'chatservice'
    jsonData.userId = store.state.userInfo.userId
    bridgefunc.callBridge('phonebridge', jsonData, function () {
      if (callback) {
        callback();
      }
    });
  },
  toYJQF: function (callback) {
    let jsonData = {};
    jsonData.type = 'toYJQF'
    let qfd = {
      weburl: 'QFPage',
      code: '100031',
      phone: store.state.login.phone,
      userid: store.state.userInfo.userId ? 'AHSY0' + store.state.userInfo.userId : '',
      title: '易捷汽服'
    }
    let logBody = '易捷汽服数据：' + JSON.stringify(qfd) + '<br/>';
    logCenter.addLog(logBody)
    jsonData.yjqf = encodeURIComponent(JSON.stringify(qfd))
    bridgefunc.callBridge('phonebridge', jsonData, function () {
      if (callback) {
        callback();
      }
    });
  },
  // 一键加油
  toYJJY: function (pushData, callback) {

    let jsonData = {};
    jsonData.type = 'sinopecwallet'
    let sinopeinfo = {
      source: pushData.args.source,
      phone: store.state.login.phone,
      userid: store.state.userInfo.userId,
      title: '一键加油',
      name: store.state.userInfo.realName || '',
      idCardNo: store.state.userInfo.idNumber || ''
    }
    // 弥补后台缺陷
    if (util.checkMobile(sinopeinfo.name)) {
      sinopeinfo.name = ''
    }
    // let logBody = '：' + JSON.stringify(sinopeinfo) + '<br/>';
    // logCenter.addLog(logBody)
    jsonData.sinopeinfo = encodeURIComponent(JSON.stringify(sinopeinfo))
    bridgefunc.callBridge('phonebridge', jsonData, function () {
      if (callback) {
        callback();
      }
    });
  },
  saveLastLocation: function (location, callback) {
    let jsonString = encodeURIComponent(JSON.stringify(location))
    // setItem:function (key,value,callback)
    bridgefunc.setItem('lastLocation', jsonString, callback)
  },
  getLastLocation: function (callback) {
    bridgefunc.getItem('lastLocation', function (result) {
      if (!result || result == '' || result == 'null' || result == undefined) {
        if (callback) {
          callback(null)
        }
        return;
      }
      let jsonData = JSON.parse(decodeURIComponent(result))
      if (callback) {
        callback(jsonData)
      }
    })
  },
  getBarHeight: function (callback) {
    let jsonData = {};
    jsonData.type = 'barheight'

    let webtype = store.state.webtype;
    if (webtype == '1') {
      bridgefunc.callBridge('phonebridge', jsonData, function (height) {
        let heightStr = height + ''
        callback(parseInt(heightStr));
      });
    } else if (webtype == '7') {
      callback(0)
    } else if (webtype == '0') {
      callback(20)
    } else {
      callback(0)
    }
  },
  //百度导航  传入起始点startlong startlat 和终点的经纬度 endlong  endlat
  baiduNav: function (jsonData) {
    if (!jsonData || !jsonData.startlong || !jsonData.startlat || !jsonData.endlong || !jsonData.endlat) {
      console.log('传参有误')
      return;
    }
    if (store.state.webtype == 1) {

      jsonData.type = 'nav'
      bridgefunc.callBridge('phonebridge', jsonData)
    } else if (store.state.webtype == '2' || store.state.webtype == '3') {

      wxfunc.getWechatSignature((isSignature) => {
        //签名成功
        if (isSignature) {
          wxfunc.openLocation(jsonData);
        } else {
          Toast('获取签名失败');
        }
      });
    } else {
      Toast('暂不支持导航功能');
    }

  },
  //页面展示
  registePageShow: function (callback) {
    bridgefunc.registeBridge('pagewillshow', function () {
      callback()
    })
  },
  //从后台进前台的协议
  enterForegroundCallBack: function (callback) {
    bridgefunc.registeBridge('enterForegroundCallBack', function () {
      callback()
    })
  },
  //存item
  setItem: function (key, value, callback) {
    StorageQueue.setItem(key, value, callback);
  },

  removeItem: function (key, callback) {
    let webtype = store.state.webtype;
    if (webtype != '1') {
      window.localStorage.removeItem(key);
      if (callback) {
        callback();
      }
      return
    } else {
      let jsonData = {};
      jsonData.type = 'removeitem'
      jsonData.key = key;
      bridgefunc.callBridge('phonebridge', jsonData, callback)
    }
  },
  getItem: function (key, callback) {
    StorageQueue.getItem(key, callback);
  },
  getItemPromise: function (key) {
    return new Promise((resolve) => {
      this.getItem(key, result => {
        resolve(result);
      })
    })
  },


  // getItems: function (keys, callback) {
  //   let webtype = store.state.webtype;
  //   if (webtype != '1') {
  //     if (callback) {
  //       let result = {};
  //       for (let i = 0; i < keys.length; i++) {
  //         let key = keys[i];
  //         result[key] = window.localStorage.getItem(key);
  //       }
  //       callback(result);
  //     }
  //     return
  //   } else {
  //     let jsonData = {};
  //     jsonData.type = 'getitems'
  //     jsonData.keys = keys;
  //     bridgefunc.callBridge('phonebridge', jsonData, callback);
  //   }
  // },

  vuexSaveTimer: null,
  vuexStorage: function (callback, immediately=false) {
    if (immediately == true) {
      this.doVuexSave(callback)
      clearTimeout(this.vuexSaveTimer)
      this.vuexSaveTimer = null
      return ;
    }
    if (this.vuexSaveTimer) {
      if (callback) {
        callback()
      }
      return ;
    }
    this.vuexSaveTimer = setTimeout(() => {
      this.doVuexSave(callback)
      this.vuexSaveTimer = null
    }, 500)
  },
  doVuexSave: function (callback) {
    // let logBody = 'vuexStorage：' + JSON.stringify(store.state) + '<br/>';
    // logCenter.addLog('vuexStorage', logBody)
    let storeData = cloneDeep(store.state)
    // storeData.microSho.carts = []
    // storeData.microSho.screenType = null
    storeData.microSho = {}
    storeData.recommendationSku.skuList = []
    let jsonString = encodeURIComponent(JSON.stringify(storeData))
    // setItem:function (key,value,callback)
    bridgefunc.setItem('vuex', jsonString, callback)
  },
  vuexLoaded: false,
  vuexRead: function (callback) {

    if (this.vuexLoaded) {
      if (callback) {
        callback(store.state)
      }
    } else {
      this.doVuexRead(callback)
      this.vuexLoaded = true
    }
    // let logBody = 'vuexRead：' + JSON.stringify(store.state) + '<br/>';
    // logCenter.addLog('vuexRead', logBody)
  },
  doVuexRead: function (callback) {
    bridgefunc.getItem('vuex', (result) => {
      let webtype = store.state.webtype;

      if (!result || result == '' || result == 'null' || result == undefined) {
        if (callback) {
          callback()
        }
        return;
      }

      let jsonString = result;
      let jsonData = JSON.parse(decodeURIComponent(jsonString))

      if (jsonData) {
        bridgefunc.loopState(jsonData, store.state, true);
      } else {
        bridgefunc.vuexStorage(() => {}, true)
      }
      if (callback) {
        if (webtype == 2) {
          //微信端处理token
          let token = sessionStorage.getItem('mall2token');
          if (token && token.length) {
            store.state.login.token = token;
          } else {
            store.state.login.token = '';
          }
        }
        callback(store.state)
      }
    })
  },
  routerToNeed: function (callBack) {
    bridgefunc.getBarHeight(function (barHeight) {
      store.state.barHeight = barHeight
    })
    bridgefunc.getCommonArgs(() => {
      bridgefunc.vuexStorage(() => {
        callBack();
        // 获取协议版本
        bridgefunc.getAppProtocolVersion();
      })
    })
  },
  loopState: function (jsonData, toData, isFrist) {
    let excludeStore = ['webtype']
    for (let key in jsonData) {
      // toData[key] = jsonData[key];
      if (toData.hasOwnProperty(key) || !isFrist) {
        if (typeof jsonData[key] != 'object' || !toData[key]) {
          if (!excludeStore.includes(key)) {
            toData[key] = jsonData[key];
          }
        } else {
          bridgefunc.loopState(jsonData[key], toData[key]);
        }
      }
    }

  },

  //微信分享 title标题 sharetext副标题 imageurl图标url   detailurl链接url
  wechatShare: function (jsonData, callBack) {
    jsonData.type = 'wechatshare';
    // bridgefunc.callBridge('phonebridge', jsonData, callBack);
    bridgefunc.callBridge('phonebridge', jsonData, callBack)
  },

  // 河北油滴分享方法
  _appShare(title, link, imgUrl, desc) {
    // title标题, link链接地址, imgUrl图片地址, desc描述
    let params = {
      type: 'share',
      para: {
        title: title,
        sharetext: desc,
        imageurl: imgUrl,
        detailurl: link
      }
    }
    location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
  },
  // 河北油滴分享方法跳转油滴页面
  /**
   * @param p 原生传入code码， 非原生界面传入weburl
   * @param isnative 是否是原生界面 默认false
   */
  openNewPage(p, isnative = false) {
    let params = {
      type: 'newpage', // 跳转原生新窗口
      para: {
        isnative: isnative,
        islogin: true,
        isnativetop: true,
        isopen: true
      }
    }
    if (isnative) {
      params.para.code = p
    } else {
      params.para.weburl = p
    }
    location.href = location.origin + '?appprotocol=' + encodeURIComponent(JSON.stringify(params))
  },
  //title标题 sharetext副标题 imageurl图标url   detailurl链接url
  // shareplatform  0 微信 1 朋友圈 2 QQ好友 3QQ空间
  share: function (jsonData) {
    let shareplatform = store.state.globalConfig.sharePlatform
    if (!jsonData.shareplatform) {
      if (shareplatform) {
        let sharePlatformArray = shareplatform.split(',')
        jsonData.shareplatform = sharePlatformArray
      }
    }
    jsonData.type = 'share';
    bridgefunc.callBridge('phonebridge', jsonData);
  },
  //url为下载地址，postfix为文件后缀
  download: function (url, postfix) {
    let jsonData = {};
    jsonData.type = 'download';
    jsonData.downloadurl = url;
    jsonData.postfix = postfix;
    bridgefunc.callBridge('phonebridge', jsonData);
  },
  reloadWeb: function () {
    let jsonData = {};
    jsonData.type = 'reloadweb';
    bridgefunc.callBridge('phonebridge', jsonData);
  },
  cleanCache: function (callBack) {
    let jsonData = {};
    jsonData.type = 'cleancache';
    bridgefunc.callBridge('phonebridge', jsonData, callBack);
  },
  downloadZip: function (jsonData, callBack) {
    jsonData.type = 'downloadZip';
    bridgefunc.callBridge('phonebridge', jsonData, callBack);
  },
  getPageHeight: function (jsonData, callBack) {
    jsonData.type = 'getPageHeight';
    bridgefunc.callBridge('phonebridge', jsonData, callBack);

  },
  wxAuth: function (callback) {
    let jsonData = {};
    jsonData.type = 'wechatauth'
    bridgefunc.callBridge('phonebridge', jsonData, callback)
  },
  // 登陆成功，之后，给客户端传UserId
  loginfinish: function () {
    let jsonData = {};
    jsonData.type = 'loginfinish';
    if (store.state.deployType == '2') {
      jsonData.userId = store.state.userInfo.thirdId || 'PleaseUseToken'
    } else {
      jsonData.userId = store.state.userInfo.userId
    }
    jsonData.token = store.state.login.token || ''
    bridgefunc.callBridge('phonebridge', jsonData);
  },
  // 获取公共参数，返回值，公共参数对象
  getCommonArgs: function (callback) {
    // 判断情况去获取公共参数
    let reGet = true
    let nTV = (new Date()).getTime()
    let webtype = store.state.webtype;

    if (store.state.commonArgs != undefined && store.state.commonArgs.saveTime != undefined && store.state.commonArgs.saveTime != '' && store.state.commonArgs.data != undefined && Object.keys(store.state.commonArgs.data).length != 0) {
      let time = store.state.commonArgs.saveTime;
      // 距离上一次 获取 大于5分钟，获取公共参数
      if (nTV < time + 5 * 60 * 1000) {
        let ipAddress = webtype != 3 ? tools.getRemoteIP() : ''
        store.state.commonArgs.data.ipAddress = ipAddress
        if (store.state.channel) {
          store.state.commonArgs.data.channel = store.state.channel
        }
        callback(store.state.commonArgs.data);
        return;
      }
    }
    if (webtype == '1') {
      let jsonData = {};
      jsonData.type = 'commonargs'
      bridgefunc.callBridge('phonebridge', jsonData, (dataStr) => {
        bridgefunc.saveCoordinate();
        let jsonData = JSON.parse(decodeURIComponent(dataStr));
        saveCommonArgs(jsonData);
      });
    } else if (webtype == '2') {
      saveCommonArgs({deviceId: store.state.login.thirdUserId});
    } else {
      saveCommonArgs(undefined);
    }

    function saveCommonArgs(jsonData) {
      if (!jsonData) {
        jsonData = {};
      }
      //设备号  如果vuex里面有则取上一次没有的话就生成一个随机数存起来
      if (!jsonData.deviceId) {
        if(store.state.commonArgs && store.state.commonArgs.data && store.state.commonArgs.data.deviceId && store.state.commonArgs.data.deviceId.length) {
          jsonData.deviceId = store.state.commonArgs.data.deviceId
        } else if (store.state.login.phone) {
          jsonData.deviceId = store.state.login.phone
        } else {
          jsonData.deviceId = util.randomString().replace('-', '')
        }
      }
      //deviceId和deviceName可能有特殊字符 所以需要编码一下
      jsonData.deviceId = MD5(jsonData.deviceId);
      jsonData.deviceName = MD5(jsonData.deviceName);

      store.state.commonArgs = {
        saveTime: nTV,
        data: jsonData
      }

      jsonData.city = store.state.indexData.city ? store.state.indexData.city : ''
      jsonData.province = store.state.indexData.province ? store.state.indexData.province : ''
      if (store.state.channel) {
        jsonData.channel = store.state.channel
      }

      let ipAddress = webtype != 3 ? tools.getRemoteIP() : ''
      jsonData.ipAddress = ipAddress

      // 开发模式下登录禁用加密方法，禁止修改到生产模式
      if (dev) {
        jsonData.discardEncryption = 'NV6Tp3FgZ3C7sbhXlIsDUzWVkp4IAq8i'
      }
      callback(jsonData);
      bridgefunc.vuexStorage()
    }
  },
  getArgsWithPromise: function (callback) {
    return new Promise((resolve, reject) => {
      bridgefunc.getCommonArgs(() => {
        resolve(store.state.commonArgs.data);
      });
    });

  },

  //获取一下当前的坐标 保存一下
  saveCoordinate: function (callback) {
    bridgefunc.getLocation((locationinfo) => {
      //城市不为空的情况下
      if (locationinfo && locationinfo.city && locationinfo.city != '') {
        // let tempLocDic = util.bd_decrypt(locationinfo.longitude, locationinfo.latitude);
        store.state.currentLocation.posx = locationinfo.longitude;
        store.state.currentLocation.posy = locationinfo.latitude;

        bridgefunc.vuexStorage(function () {
        });
        callback && callback(true)
      } else {
        callback && callback(false)
      }
    });
  },
  // 保存图片到相册，这里需要传入base64的图片，base64 前面一截格式标识不需要
  savePhoto: function (base64Pic, callBack) {
    let jsonData = {
      photodata: base64Pic
    };
    jsonData.type = 'savephoto';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      callBack(result)
    })
  },
  // 权限获取
  // 0为定位权限 1为拍照权限 2为写入权限 3为读取权限
  // 已获取权限返回true，未获取返回false
  checkPermission: function (type, callBack) { // todo 兼容微信
    let jsonData = {
      permission: type
    };
    jsonData.type = 'checkPermission';
    if (store.state.webtype == 1) {
      bridgefunc.callBridge('phonebridge', jsonData, (result) => {
        if (typeof result === 'string') {
          result = Number(result)
        }
        result = !!result
        callBack(result)
      })
    } else {
      callBack(true)
    }

  },
  // 打开授权列表
  requestPermissions: function () {
    let jsonData = {};
    jsonData.type = 'requestPermissions';
    bridgefunc.callBridge('phonebridge', jsonData)
  },
  /**
   * 检查定位是否开启，并监听页面转前台。开启则返回定位经纬度
   * @param callback 待监听函数
   * @returns {Promise<any>}
   */
  checkLocationAuth(callback) { // todo 兼容微信
    if (store.state.webtype == 1) {
      bridgefunc.enterForegroundCallBack(callback)
    }
    return new Promise((resolve, reject) => {
      bridgefunc.checkPermission(0, (result) => {
        if (result) {
          bridgefunc.getLocation(resolve)
        } else {
          reject()
        }
      })
    })
  },
  // 设置cookies
  customSetCookies: function (callBack, url) {
    bridgefunc.getCommonArgs((nArgs) => {
      let cookies = {
        phone: store.state.login.phone ? store.state.login.phone : '',
        jfuserid: store.state.userInfo.userId ? store.state.userInfo.userId : '',
        token: store.state.login.token ? store.state.login.token : '',
        deviceid: nArgs.deviceId ? nArgs.deviceId : '',
        longitude: store.state.currentLocation.posx,
        latitude: store.state.currentLocation.posy
      }
      let jsonData = {};
      jsonData.type = 'expandcookies';
      jsonData.cookies = encodeURIComponent(JSON.stringify(cookies));
      jsonData.url = url;
      bridgefunc.callBridge('phonebridge', jsonData, (result) => {
        callBack(result)
      })
    })
  },
  // 设置原生cookie
  setCookies: function (cookiesDic, callBack) {
    let jsonData = {};
    jsonData.type = 'expandcookies';
    jsonData.cookies = encodeURIComponent(JSON.stringify(cookiesDic));
    jsonData.url = '';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      if (callBack) {
        callBack(result)
      }
    })
  },
  // 销毁上一级页面
  destroyPreviousController: function (callBack) {
    let jsonData = {};
    jsonData.type = 'destroyprecontrol';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      callBack(result)
    })
  },
  //获取设备支持识别的类型
  getSupportType: function (callBack) {
    let jsonData = {};
    jsonData.type = 'supporttype';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      callBack(result)
    })
  },
  //面部开始识别
  faceIDRe: function (callBack) {
    let jsonData = {};
    jsonData.type = 'faceID';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      callBack(result)
    })
  },
  //指纹开始识别
  fingerPrintRe: function (callBack) {
    let jsonData = {};
    jsonData.type = 'fingerprint';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      callBack(result)
    })
  },
  //vue加载成功
  vueLoaded: function (callBack) {
    let jsonData = {};
    jsonData.type = 'isVueLoaded';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
      callBack(result)
    })
  },
  //写入日志
  writeLog: function (log) {
    return new Promise((resolve) => {
      let jsonData = {};
      jsonData.type = 'writeLog';
      jsonData.log = log;
      bridgefunc.callBridge('phonebridge', jsonData, (result) => {
        resolve(result)
      })
    })
  },
  //读取日志
  readLog: function () {
    return new Promise((resolve) => {
      let webtype = store.state.webtype;
      if (webtype == '1') {
        let jsonData = {};
        jsonData.type = 'readLog';
        bridgefunc.callBridge('phonebridge', jsonData, (result) => {
          resolve(result)
        })
      } else {
        resolve('{}')
      }
    })
  },
  //开屏广告
  advertisepage: function (dic) {
    let jsonData = {};
    jsonData.type = 'advertisepage';
    jsonData.showTime = dic['showTime'] || '';
    // 过几天需要撤销代码
    jsonData.adImgUrl = dic['imageUrl'] || store.state.globalConfig.logoUrl;
    jsonData.isSkip = dic['isSkip'] || '';
    jsonData.isOpen = dic['isOpen'] || 0;
    jsonData.weburl = dic['linkUrl'] || '';
    jsonData.isnativetop = dic['isnativetop'] || '';
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
    })
  },
  readFileUseOs: function (fileUrl, fileType) {
    let jsonData = {};
    jsonData.type = 'lookfile';
    jsonData.fileurl = fileUrl;
    jsonData.filetype = fileType;
    bridgefunc.callBridge('phonebridge', jsonData, (result) => {
    })
  },
  brightness: function (value, isauto, callback) {
    // 这个协议2.1 版本才有的
    if (store.state.protocolVersion > 2.0 && store.state.webtype && store.state.globalConfig.brightnessEnalbed == 1) { // 很多地方需要去掉这个功能，暂时这样处理
      let jsonData = {};
      jsonData.type = 'brightness';
      jsonData.value = value;
      jsonData.isauto = isauto;
      bridgefunc.callBridge('phonebridge', jsonData, callback)
    } else {
      // console.log('协议版本过低！暂无 brightness 协议！')
    }
  },

  //安卓物理键栈添加 backfunckstr为页面uuid
  andriodaddback: function (backfunckstr, callback) {
    let jsonData = {};
    jsonData.type = 'andriodaddback'
    jsonData.backfunckstr = backfunckstr
    let webtype = store.state.webtype;
    if (webtype == '1') {
      bridgefunc.callBridge('phonebridge', jsonData, callback);
    } else {
      callback(1)
    }
  },
  //安卓物理键栈删除  backfunckstr为页面uuid
  delandriodback: function (backfunckstr, callback, isClear = 0) {
    let jsonData = {};
    jsonData.type = 'delandriodback'
    jsonData.backfunckstr = backfunckstr
    jsonData.isClear = isClear;
    let webtype = store.state.webtype;
    if (webtype == '1') {
      bridgefunc.callBridge('phonebridge', jsonData, callback);
    } else {
      callback(1)
    }
  },
  // 加密协议 2.4 之后才有此协议
  sunboxencode: function (originalinfo, iscompress, callback) {
    let jsonData = {};
    jsonData.type = 'sunboxencode'
    jsonData.originalinfo = encodeURIComponent(originalinfo)
    jsonData.iscompress = iscompress;
    let webtype = store.state.webtype;
    // console.log('webtype:', webtype, ', protocolVersion:', store.state.protocolVersion)
    if (webtype == '1' && store.state.protocolVersion > 2.3) {
      bridgefunc.callBridge('phonebridge', jsonData, (resultStr) => {
        callback(1, resultStr);
      });
    } else {
      callback(0, '')
    }
  },
  // 微信面密签约 2.4 之后才有此协议
  wxFreePay: function (freepayinfo, callback) {
    let jsonData = {};
    jsonData.type = 'wxfreepay'
    jsonData.freepayinfo = encodeURIComponent(freepayinfo)
    let webtype = store.state.webtype;
    // console.log('webtype:', webtype, ', protocolVersion:', store.state.protocolVersion)
    if (webtype == '1' && store.state.protocolVersion > 2.3) {
      bridgefunc.callBridge('phonebridge', jsonData, (resultStr) => {
        if (resultStr == '1') {
          callback('1');
        } else {
          callback('0');
        }
      });
    } else {
      callback('0')
    }
  },
  // 闪验 初始化 2.4 之后才有此协议
  shanyanInit: function (initInfo, callback) {
    let jsonData = {};
    jsonData.type = 'shanyaninit'
    jsonData.initinfo = encodeURIComponent(JSON.stringify(initInfo))
    let webtype = store.state.webtype;
    // console.log('webtype:', webtype, ', protocolVersion:', store.state.protocolVersion)
    if (webtype == '1' && store.state.protocolVersion > 2.3) {
      bridgefunc.callBridge('phonebridge', jsonData, (resultStr) => {
        if (resultStr == '1') {
          callback('1');
        } else {
          callback('0');
        }
      });
    } else {
      callback('0')
    }
  },
  // 闪验 初始化 2.4 之后才有此协议
  shanyanLogin: function (callback) {
    let jsonData = {};
    jsonData.type = 'shanyanlogin'
    let webtype = store.state.webtype;
    // console.log('webtype:', webtype, ', protocolVersion:', store.state.protocolVersion)
    if (webtype == '1' && store.state.protocolVersion > 2.3) {
      bridgefunc.callBridge('phonebridge', jsonData, callback);
    } else {
      callback({
        result: '0'
      })
    }
  },
  // 易盾初始化
  yidunInit: function (initInfo, callback) {
    let jsonData = {};
    jsonData.type = 'yiduninit'
    jsonData.initinfo = encodeURIComponent(JSON.stringify(initInfo))
    bridgefunc.callBridge('phonebridge', jsonData, (resultStr) => {
      if (resultStr == '1') {
        callback('1');
      } else {
        callback('0');
      }
    });
  },
  // 易盾一键登录
  yidunLogin: function (callback) {
    let jsonData = {};
    jsonData.type = 'yidunlogin'
    bridgefunc.callBridge('phonebridge', jsonData, callback);
  },
  // 油惠通登录
  yhtToLogin: function () {
    let jsonData = {};
    jsonData.type = 'login'
    let webtype = store.state.webtype;
    if (webtype == '1') {
      bridgefunc.callBridge('phonebridge', jsonData);
    } else {

    }
  },
  // 获取app使用的相关协议 2.5 之后才有此协议
  getPermissions: function (callback) {
    let jsonData = {};
    jsonData.type = 'getpermissions'
    let webtype = store.state.webtype;
    if (webtype == '1' && store.state.protocolVersion > 2.4) {
      bridgefunc.callBridge('phonebridge', jsonData, callback);
    } else {
      callback([])
    }
  },
  // 获取app使用的相关协议 2.5 之后才有此协议
  openPermissions: function (code) {
    let jsonData = {};
    jsonData.type = 'openpermissions'
    jsonData.code = code
    let webtype = store.state.webtype;
    if (webtype == '1' && store.state.protocolVersion > 2.4) {
      bridgefunc.callBridge('phonebridge', jsonData);
    }
  },
  // 油惠通跳转原生功能
  yhdClientFunc: function (code) {
    let jsonData = {
      type: 'newpage',
      isVuePage: false,
      code: code
    }
    bridgefunc.callBridge('phonebridge', jsonData)
  },
  // 油惠通跳转原生功能
  jumpAPPFunc: function (appurl, callback) {
    let jsonData = {
      type: 'jumpApp',
      appurl: appurl
    }
    bridgefunc.callBridge('phonebridge', jsonData, callback)
  },
  // 调用手机浏览器打开URL
  openMobileBrowsers: function (url) {
    if (store.state.webtype == 1) {
      let jsonData = {
        type: 'mobileBrowsers',
        weburl: url
      }
      bridgefunc.callBridge('phonebridge', jsonData)
    }
  },
  // 银联支付
  cuppay: function (info, callback) {
    if (store.state.webtype == 1) {
      let jsonData = {
        payinfo: {
          tn: info,
          mode: "01"
        },
        type: "cuppay"
      }
      bridgefunc.callBridge('phonebridge', jsonData, callback)
    }
  },
  // // 获取缓存信息
  // getCacheInfo: function (callBack) {
  //   let jsonData = {
  //     type: 'getcacheinfo'
  //   };
  //   bridgefunc.callBridge('phonebridge', jsonData, (result) => {
  //     callBack(result)
  //   })
  // }
}

export default bridgefunc
