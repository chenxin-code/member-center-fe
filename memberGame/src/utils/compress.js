/*eslint-disable*/
export default {
  compress: function(base64, callback) {
    var self = this;
    var img = new Image();
    img.src = base64;
    img.onload = function() {
      callback(self.compressTools(img));
    };
  },
  //图片压缩
  compressTools: function(img) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    // 瓦片canvas
    var tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");
    // 等比压缩图片
    var maxWidth = 800;
    var maxHeight = 800;
    var ASwh = this.AutoSize(img, maxWidth, maxHeight);
    var width = ASwh.width;
    var height = ASwh.height;
    // console.log("变小图片:"+width+'...'+height)
    // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = (width * height) / 4000000) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = (width * height) / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
      // 计算每块瓦片的宽和高
      var nw = ~~(width / count);
      var nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(
            img,
            i * nw * ratio,
            j * nh * ratio,
            nw * ratio,
            nh * ratio,
            0,
            0,
            nw,
            nh
          );
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    // 进行最小压缩0.1
    var ndata = canvas.toDataURL("image/jpeg", 0.5);
    //		     console.log('压缩前：' + initSize)
    //		     console.log('压缩后：' + ndata.length)
    //		     console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%")
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
  },
  AutoSize: function(image, maxWidth, maxHeight) {
    // 等比压缩图片
    var retrunData = {
      width: 0,
      height: 0
    };
    // 当图片比图片框小时不做任何改变
    if (image.width < maxWidth && image.height < maxHeight) {
      //原图片宽高比例 大于 图片框宽高比例
      retrunData.width = image.width;
      retrunData.height = image.height;
    } else {
      //原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
      if (maxWidth / maxHeight <= image.width / image.height) {
        retrunData.width = maxWidth; //以框的宽度为标准
        retrunData.height = maxWidth * (image.height / image.width);
      } else {
        retrunData.width = maxHeight * (image.width / image.height);
        retrunData.height = maxHeight; //以框的高度为标准
      }
    }
    return retrunData;
  }
};
