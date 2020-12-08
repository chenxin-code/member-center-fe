// 获取前后五年的年份
export function getFiveYears(all) {
  let yearArr = all ? ['全部'] : [];
  let nowYear = new Date().getFullYear();
  let afterYear = nowYear + 9;
  for (let i = nowYear; i <= afterYear; i++) {
    yearArr.push(i);
  }
  return yearArr;
}

// 获取带id的前后五年的年份
export function getObjYears() {
  let FiveYears = getFiveYears();
  let newArr = [{ id: '', name: '全部' }];
  FiveYears.forEach(e => {
    newArr.push({ id: e, name: e });
  });
  return newArr;
}

Date.prototype.format = function() {
  var s = '';
  var mouth = this.getMonth() + 1 >= 10 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1);
  var day = this.getDate() >= 10 ? this.getDate() : '0' + this.getDate();
  s += this.getFullYear() + '-'; // 获取年份。
  s += mouth + '-'; // 获取月份。
  s += day; // 获取日。
  return s; // 返回日期。
};

// 获取某天到某天的所有日期
export function getDateAll(begin, end) {
  // 开始日期和结束日期
  console.log(begin, end);
  var arr = [];
  var ab = begin.split('-');
  var ae = end.split('-');
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
  var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
  for (var k = unixDb; k <= unixDe; ) {
    k = k + 24 * 60 * 60 * 1000;
    arr.push(new Date(parseInt(k)).format());
  }
  return arr;
}

export function formatDateTime() {
  var myDate = new Date();
  var year = addZero(myDate.getFullYear()); //获取当前年
  var mon = addZero(myDate.getMonth() + 1); //获取当前月
  var date = addZero(myDate.getDate()); //获取当前日
  var hours = addZero(myDate.getHours()); //获取当前小时
  var minutes = addZero(myDate.getMinutes()); //获取当前分钟
  var seconds = addZero(myDate.getSeconds()); //获取当前秒
  var now = `${year}${mon}${date}${hours}${minutes}${seconds}`;
  return now;
}

// 时间格式转换  (2020-04-20T16:00:00.000+0000 转 yyyy-mm-dd)
function addZero(num) {
  return num < 10 ? '0' + num : num;
}
/**
 * 文件或blob转base64
 * @param blob
 * @param callback
 */
export function file2DataURL(blob, callback) {
  let reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(blob);
}

/**
 * base64转file
 * @param dataUrl
 * @param filename
 * @returns {File}
 */
export function dataURLtoFile(dataUrl, filename) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/***
 * Image转base64
 * @param imgUrl
 * @param callback
 */
export function getBase64Img(imgUrl, callback) {
  console.log(imgUrl);
  window.URL = window.URL || window.webkitURL;
  var xhr = new XMLHttpRequest();
  xhr.open('get', imgUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (this.status === 200) {
      //得到一个blob对象
      const blob = this.response;

      let oFileReader = new FileReader();
      oFileReader.onloadend = function(e) {
        let base64 = e.target.result;
        callback && callback(base64);
      };
      oFileReader.readAsDataURL(blob);
    }
  };
  xhr.send();
}

/***
 * 防抖
 */
let timer = null;

export function debounce(fn, delay = 100) {
  if (typeof fn !== 'function') {
    throw new Error('必须传入函数');
  }
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(function() {
    fn();
    clearTimeout(timer);
    timer = null;
  }, delay);
}

export function isTruePhone(areaCode, phone) {
  if (areaCode == '86') {
    // /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/
    // /^[1][3-8]\d{9}$/
    if (!/^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  } else if (areaCode == '886') {
    if (!/^[0][9]\d{8}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  } else if (areaCode == '852') {
    if (!/^([6|9])\d{7}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  } else if (areaCode == '853') {
    if (!/^[6]([8|6])\d{5}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  }
}
