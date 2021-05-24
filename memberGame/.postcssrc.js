/*
 * @Description: 这是***页面
 * @Date: 2021-01-13 19:14:22
 * @LastEditTime: 2021-01-14 18:06:38
 */
module.exports = {
  plugins: {
    // 转rem
    "postcss-pxtorem": {
      rootValue: 50,
      minPixelValue: 2,
      propWhiteList: []
    },
    // 添加浏览器前缀
    autoprefixer: {}
  }
}
