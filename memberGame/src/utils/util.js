/**
 * 验证车牌号(新能源+非新能源)
 * @param { string } value
 */
export const isLicensePlateNumber = value =>
  /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/g.test(
    value
  );

/**
 * 去除空格
 * @param { string } str 待处理字符串
 * @param  { number } type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
 */
export function trim(str, type = 1) {
  if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4) return;
  switch (type) {
    case 1:
      return str.replace(/\s/g, "");
    case 2:
      return str.replace(/(^\s)|(\s*$)/g, "");
    case 3:
      return str.replace(/(^\s)/g, "");
    case 4:
      return str.replace(/(\s$)/g, "");
    default:
      return str;
  }
}

/**
 * 大小写转换
 * @param { string } str 待转换的字符串
 * @param { number } type 1-全大写 2-全小写 3-首字母大写 其他-不转换
 */
export function turnCase(str, type) {
  switch (type) {
    case 1:
      return str.toUpperCase();
    case 2:
      return str.toLowerCase();
    case 3:
      return str[0].toUpperCase() + str.substr(1).toLowerCase();
    default:
      return str;
  }
}

/**
 * 字符串真实长度
 * @param { string } str 待计算长度字符串
 * @result 返回值是字符串真实长度(能够正确是被四个字节的 Unicode字符)
 */
export function strLen(param) {
  return [...param].length;
}

/**
 * @param {*} date 具体日期变量
 * @param {string} dateType 需要返回类型
 * @return {string} dateText 返回为指定格式的日期字符串
 */
export function getFormatDate(date, dateType) {
  let dateObj = new Date(date);
  let month = dateObj.getMonth() + 1;
  let strDate = dateObj.getDate();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  let seconds = dateObj.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }

  let dateText =
    dateObj.getFullYear() +
    "年" +
    (dateObj.getMonth() + 1) +
    "月" +
    dateObj.getDate() +
    "日";
  if (dateType == "yyyy-mm-dd") {
    dateText =
      dateObj.getFullYear() +
      "-" +
      (dateObj.getMonth() + 1) +
      "-" +
      dateObj.getDate();
  }
  if (dateType == "yyyy.mm.dd") {
    dateText =
      dateObj.getFullYear() +
      "." +
      (dateObj.getMonth() + 1) +
      "." +
      dateObj.getDate();
  }
  if (dateType == "yyyy-mm-dd MM:mm:ss") {
    dateText =
      dateObj.getFullYear() +
      "-" +
      month +
      "-" +
      strDate +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  }
  if (dateType == "mm-dd MM:mm:ss") {
    dateText =
      month + "-" + strDate + " " + hours + ":" + minutes + ":" + seconds;
  }
  if (dateType == "yyyy年mm月dd日 MM:mm:ss") {
    dateText =
      dateObj.getFullYear() +
      "年" +
      month +
      "月" +
      strDate +
      "日" +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  }
  return dateText;
}

/**
 * 数字金额格式化，常用场景在过滤器中
 * @param {String|Number} 金额数字，字符串或者数字类型
 * @param {String}        货币符号，默认¥
 * @param {Number}        小数点后精确的位数，默认2
 * @return {String}       加上了,逗号分隔符和小数点.后的字符串
 */
export function currencyFormat(value = "", currencySign = "", decimals = 2) {
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return "";
  const stringified = Math.abs(value).toFixed(decimals);
  const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = _int.length % 3;
  const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
  const _float = decimals ? stringified.slice(-1 - decimals) : "";
  const sign = value < 0 ? "-" : "";
  const digitsRE = /(\d{3})(?=\d)/g;
  return (
    sign + currencySign + head + _int.slice(i).replace(digitsRE, "$1,") + _float
  );
}

/**
 * @desc 金额转换成大写
 * @param {Number} n 需要转换成大写的金额
 * @return {String} 转换后的大写中文金额
 * @example changeAmt('123') =>'壹百贰拾叁元整'
 */
export function toChinese(n) {
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];

  n = Math.abs(n);

  let s = "";

  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, "");
  }

  s = s || "整";

  n = Math.floor(n);

  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = "";
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return s
    .replace(/(零.)*零元/, "元")
    .replace(/(零.)+/g, "零")
    .replace(/^整$/, "零元整");
}

// 当t为0时候，启用localStorage存储，其他时候，为sessionStorage存储，有存储、提取、移除方法
export function storages(t) {
  var type = t === 0 ? "localStorage" : "sessionStorage";
  return {
    set: function(key, value) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      window[type].setItem(key, value);
    },
    get: function(key) {
      const value = window[type].getItem(key) || "";
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    remove: function(key) {
      window[type].removeItem(key);
    }
  };
}

//js判断获取元素是否在可视区域
//执行var ab = $(".nav_dh")[0]; isElementInViewport(ab)
export function isElementInViewport(el) {
  //获取元素是否在可视区域
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/*
    延迟方法 ——
        参数 ——
            idle: 延迟时间
            action: callback 回调函数
        返回 ——
            执行action函数

    使用方式 —— 
        delayBounceAction(300,callback)
*/
let delayBounceContainer;
export const delayBounceAction = function(idle, action) {
  function delayBounces() {
    let ctx = this,
      args = arguments;
    clearTimeout(delayBounceContainer);
    delayBounceContainer = setTimeout(function() {
      action.apply(ctx, args);
    }, idle);
  }
  return delayBounces();
};

/**
 * @description [throttle 节流函数]
 * @author shanshuizinong
 * @param {Function} fn 延时调用函数
 * @param {Number} delay 延迟多长时间
 * @param {Number} atleast 至少多长时间触发一次
 * @return {Function} 延迟执行的方法
 */
export function throttle(fn, delay, atleast) {
  let timer = null;
  let previous = null;
  return function() {
    let now = +new Date();
    if (!previous) previous = now;
    if (atleast && now - previous > atleast) {
      fn();
      previous = now;
      clearTimeout(timer);
    } else {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn();
        previous = null;
      }, delay);
    }
  };
}

/**
 * @description: 判断字符串是否为空
 * @param {obj} 传入该需要做判断的字符串
 * @return {arr} 返回判断之后的boolean的值
 */
export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

//获取地址栏参数
// 用途为 替换地址栏的参数比如token参数替换
export const changeURLArg = (_url, arg = "token", arg_val) => {
  var pattern = arg + "=([^&]*)";
  var replaceText = arg + "=" + arg_val;
  var url = _url;
  try {
    if (url.match(pattern)) {
      var tmp = "/(" + arg + "=)([^&]*)/gi";
      console.log(tmp);
      //动态正则匹配
      var _tmp = new RegExp(arg + "=([^&]*)", "ig");
      // var _tmp = eval(tmp)
      tmp = url.replace(_tmp, replaceText);
      return tmp;
    } else {
      if (url.match("[?]")) {
        return url + "&" + replaceText;
      } else {
        return url + "?" + replaceText;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return url + "\n" + arg + "\n" + arg_val;
};

//获取地址栏参数
//获取地址栏参数token
//示例: getUrlQuery('token')
export function getUrlQuery(variable) {
  var w = location.hash.indexOf("?");
  var hashQuery = location.hash.substring(w + 1);
  var searchQuery = window.location.search.substring(1);
  var query = searchQuery || hashQuery;
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

//获取完整地址栏参数对象
//示例: getUrlQueryParams()
export function getUrlQueryParams() {
  var w = location.hash.indexOf("?");
  var hashQuery = location.hash.substring(w + 1);
  var searchQuery = window.location.search.substring(1);
  var query = searchQuery || hashQuery;
  var vars = query.split("&");
  var obj = {};
  for (let i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    obj[pair[0]] = pair[1];
    console.log("pair--->", pair);
  }
  return obj;
}

// 移动手机号码校验
export function checkInvoiceMobile(receiver_mobile) {
  var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
  if (!isMobile.exec(receiver_mobile) && receiver_mobile.length != 11) {
    return false;
  }
  return true;
}

// 邮箱校验
export function checkInvoiceMail(mail) {
  var reg = new RegExp(
    "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
  );
  if (!reg.test(mail)) {
    return false;
  }
  return true;
}

//获取状态栏目类型名称
export function getSelectTypeName(value, list, type = "value", kind = "label") {
  // console.log("getSelectTypeName--->", value, list, type, kind);
  let itrem = list.find(item => {
    return item[type] == value;
  });
  return itrem && itrem[kind];
}

//深拷贝对象
export function cloneDeep(obj) {
  // 只拷贝对象
  if (typeof obj !== "object") return;
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] =
        typeof obj[key] === "object" ? cloneDeep(obj[key]) : obj[key];
    }
  }
  return newObj;
}

//去重
export const unqiArray = (arr, type = "time") => {
  var hash = {};
  arr = arr.reduce(function(item, next) {
    hash[next[type]] ? "" : (hash[next[type]] = true && item.push(next));
    return item;
  }, []);
  return arr;
};

//判断微信在浏览器
export const isWeiXin = function() {
  let ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == "micromessenger";
};

//判断获取标签列表
export const getTagList = function(str, ast = "/") {
  if (str) {
    return String(str).split(ast);
  } else {
    return str;
  }
};

//如果对象key对应value为空字符串，那么删除这个key的键值对
export const removeRepeat = function(params) {
  for (var key in params) {
    isEmpty(params[key]) ? delete params[key] : "";
  }
};

//将字符串年月日时间格式，转化为星期的形式
export const exchangDateStyle = function(date) {
  var weekDay = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  var myDate = new Date(Date.parse(date.replace(/-/g, "/")));
  return weekDay[myDate.getDay()];
};

/*
    格式化时间,时间戳转化为时间格式 ——
        参数 ——
            value： 时间戳10位
            type:   为需要的时间格式 'yyyy-MM-dd hh:mm:ss'
        返回 ——
            格式化后的字符串

    使用方式 ——
        {{data | format_time type}}
*/
export const format_time = (value, type) => {
  if (!value) return null;
  let time;
  if (value.constructor === Date) {
    time = value;
  } else {
    time =
      value.toString().length > 10
        ? new Date(parseInt(value))
        : new Date(parseInt(value) * 1000);
  }
  let formatTime = type ? type : "yyyy-MM-dd hh:mm:ss";
  let date = {
    "M+": time.getMonth() + 1,
    "d+": time.getDate(),
    "h+": time.getHours(),
    "m+": time.getMinutes(),
    "s+": time.getSeconds(),
    "q+": Math.floor((time.getMonth() + 3) / 3),
    "S+": time.getMilliseconds()
  };
  if (/(y+)/i.test(formatTime)) {
    formatTime = formatTime.replace(
      RegExp.$1,
      (time.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in date) {
    if (new RegExp("(" + k + ")").test(formatTime)) {
      formatTime = formatTime.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[k]
          : ("00" + date[k]).substr(("" + date[k]).length)
      );
    }
  }
  return formatTime;
};

//过滤空对象
export const getHasParams = param => {
  try {
    // console.log('************getParams*******', param);
    let obj = {};
    for (let [key, value] of Object.entries(param)) {
      if (!isEmpty(value) && value != 0) {
        obj[key] = value;
      }
    }
    return obj;
  } catch (error) {
    console.log(error);
  }
};

//设置标题
export const setDomTitle = title => {
  document.title = title;
};

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
export function formatRichText(html) {
  let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
    match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
    match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
    match = match
      .replace(/height="[^"]+"/gi, "")
      .replace(/height='[^']+'/gi, "");
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
    match = match
      .replace(/width:[^;]+;/gi, "max-width:100%;")
      .replace(/width:[^;]+;/gi, "max-width:100%;");
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, "");
  newContent = newContent.replace(
    /\<img/gi,
    '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
  );
  return newContent;
}
