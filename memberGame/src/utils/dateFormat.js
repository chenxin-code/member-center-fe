export default {
  /**
   * @desc 返回传入的时间戳
   */
  dateFormatTimestamp(val) {
    const date = new Date(val);
    return date.getTime();
  },
  /**
   * @desc 返回两个时间的时间间隔
   * @param { Object } begin 开始时间
   * @param { Object } end 结束时间
   *
   */
  getBetweenTime(begin, end) {
    const _self = this;
    const beginStamp = _self.dateFormatTimestamp(begin);
    const endStamp = _self.dateFormatTimestamp(end);
    return endStamp - beginStamp;
  },

  /**
   * @desc 返回当前日期时间信息
   */
  getCurrentDate(par) {
    const _self = this;
    let date;
    if (par) {
      date = new Date(par);
    } else {
      date = new Date();
    }
    let opt = {
      yy: _self.getYear(date),
      MM: _self.getMonth(date),
      dd: _self.getDay(date),
      hh: _self.getHours(date),
      mm: _self.getMinutes(date),
      ss: _self.getSeconds(date)
    };
    return opt;
  },
  /**
   * 获取年份
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns
   */
  getYear(obj) {
    return obj.getFullYear() + "";
  },

  /**
   * 获取月份 【01~12】
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns {String}
   */
  getMonth(obj) {
    let month = obj.getMonth() + 1;
    return month > 9 ? "" + month : "0" + month;
  },

  /**
   * 获取天 【01~31】
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns {String}
   */
  getDay(obj) {
    let day = obj.getDate();
    return day > 9 ? "" + day : "0" + day;
  },

  /**
   * 获取小时
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getHours(obj) {
    let hour = obj.getHours();
    return hour > 9 ? "" + hour : "0" + hour;
  },

  /**
   * 获取分钟
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getMinutes(obj) {
    let minutes = obj.getMinutes();
    return minutes > 9 ? "" + minutes : "0" + minutes;
  },

  /**
   * 获取秒钟
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getSeconds(obj) {
    let second = obj.getSeconds();
    return second > 9 ? "" + second : "0" + second;
  }
};
