/*
 * 大转盘
 */

//利用圆心求坐标
/**
 * @description: 
 * @param {type} 
    圆心坐标(a,b),半径r的圆的参数方程（根据三角比的定义可以得出）为：(以y轴正方向为0度,设 t 为圆上某一点的度数)
    x = a + r*sin t
    y = b + r*cos t
    所以圆上任一一点的坐标为 P(a + r*sin t,b + r*cos t),（其中 t 为圆上某一点的度数）
    x1   =   x0   +   r   *   cos(ao   *   3.14   /180   ) 
    y1   =   y0   +   r   *   sin(ao   *   3.14   /180   )
    sa 开始绘制的角度 默认为 360/4 = 90 
 * @return {type} 
 */
export const mathPI = ({ x0 = 0, y0 = 0, r = 0, a = 0, sa = 90 }) => {
  const pi = Math.PI;
  const x1 = x0 + r * Math.cos(((a - sa) * pi) / 180);
  const y1 = y0 + r * Math.sin(((a - sa) * pi) / 180);
  console.log("mathPI------->", {
    x1: x1 + r,
    y1: y1 - r
  });
  //x-150 y+150
  let xx = parseInt(x1 + r);
  let yy = parseInt(y1 - r);
  let aa = parseInt(a);
  return {
    x1: xx,
    y1: yy,
    a: aa,
    style: `transform:translateX(${xx}rpx) translateY(${yy}rpx) rotate(${aa}deg)`
  };
};

//预加载图片函数
export function loadImage(src) {
  let p = new Promise(function(resolve, reject) {
    let img = new Image();
    img.onload = function() {
      //加载时执行resolve函数
      resolve(img);
    };
    img.onerror = function() {
      reject(src);
    };
    img.src = src;
  });
  return p;
}

//图片挂载
export async function loadImageList(imgList) {
  let arr = [];
  for (const item of imgList) {
    await loadImage(item).then(img => {
      arr.push(img);
    });
  }
  return Promise.resolve(arr);
}
