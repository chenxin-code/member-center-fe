/* ytt版本 */
// function fontSizeInit() {
//   const doc = document.documentElement;
//   let clw = doc.clientWidth;
//   let clh = doc.clientHeight;
//   if (clw < clh) {
//     if (clw < 750) {
//       clw = clw / 7.5;
//     } else {
//       clw = 100;
//     }
//   } else {
//     if (clh < 750) {
//       clw = clh / 7.5;
//     } else {
//       clw = 100;
//     }
//   }
//   doc.style.fontSize = clw + 'px';
// }
// fontSizeInit();
// document.body.onresize = fontSizeInit;

/* zjh版本 */
// 基准大小
// const baseSize = 100;
const baseSize = 50;
// 设置 rem 函数
const setRem = function() {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const clw = document.documentElement.clientWidth; //宽度
  const clh = document.documentElement.clientHeight; //高度
  const width = clw < clh ? clw : clh;
  // const scale = width / 750;
  const scale = width / 375;
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + "px";
};
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
document.body.onresize = setRem;
document.documentElement.onresize = setRem;
