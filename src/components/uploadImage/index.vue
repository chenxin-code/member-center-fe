<template>
  <div class="upload-area">
    <div class="upload-wrapper" v-if="fileList.length < maxSize">
      <div class="up-body">
        <a-icon
          type="cloud-upload"
          :style="{ fontSize: '50px', color: '#1890ff' }"
        />
        <a-input v-model="fileArray" type="file" multiple class="file-body" @change="uploadFile" />
      </div>
      <div style="color: #999" class="up-des">
        图片要求：建议上传尺寸为：230*460，格式为jpg、png、大小不超过5MB。
      </div>
    </div>
    <div>
      <div v-for="(item, index) in fileList" :key="index">
        {{ item.fileName }}
        <a-icon
          type="delete"
          @click="remove(index)"
          style="font-size: 22px"
          title="删除"
        />
        <a-icon
          title="查看"
          type="eye"
          @click="preview(item)"
          style="font-size: 22px; margin-left: 5px"
        />
      </div>
    </div>
    <a-modal
      :title="activeFile.fileName"
      :visible="visible"
      @ok="visible = false"
      @cancel="visible = false"
      :footer="null"
    >
      <p>
        <img :src="activeFile.url" alt="" />
      </p>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api";
export default {
  props: {
    maxSize: {
      type: Number,
      default: () => {
        return 9;
      },
    },
  },
  data() {
    return {
      full: false,
      fileList: [],
      visible: false,
      activeFile: "",
      fileArray: ""
    };
  },
  methods: {
    verificationPicFile(file) {
      var fileSize = 0;
      var fileMaxSize = 1024; //1M
      var filePath = file.value;
      if (filePath) {
        fileSize = file.files[0].size;
        var size = fileSize / 1024;
        if (size > fileMaxSize) {
          alert("文件大小不能大于1M！");
          file.value = "";
          return false;
        } else if (size <= 0) {
          alert("文件大小不能为0M！");
          file.value = "";
          return false;
        }
      } else {
        return false;
      }
    },
    preview(item) {
      this.activeFile = item;
      this.visible = true;
    },
    verificationPicFileWH(file) {
      var filePath = file.value;
      if (filePath) {
        //读取图片数据
        var filePic = file.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          //加载图片获取图片真实宽度和高度
          var image = new Image();
          image.onload = function () {
            var width = image.width;
            var height = image.height;
            if ((width == 720) | (height == 1280)) {
              alert("文件尺寸符合！");
            } else {
              alert("文件尺寸应为：720*1280！");
              file.value = "";
              return false;
            }
          };
          image.src = data;
        };
        reader.readAsDataURL(filePic);
      } else {
        return false;
      }
    },
    remove(index) {
      this.fileList.splice(index, 1);
    },

    uploadFile(e) {
      for (var i = 0; i < e.target.files.length; i++) {
        if (parseInt(e.target.files[i].size / 1024 / 1024) > 5) {
          this.$message.warning("上传文件大小不能超过5M");
          continue;
        }
        if (
          !["image/png", "image/jpeg"].includes(
            e.target.files[i].type.toLocaleLowerCase()
          )
        ) {
          this.$message.warning("只能上传PNG或JPG文件");
          continue;
        }
        this.loading = true;
        const formData = new FormData();
        formData.append("file", e.target.files[i]);
        console.log("exec");
        api
          .uploadRectificationrecord(formData)
          .then((res) => {
            this.loading = false;
            if (this.fileList.length >= 9) {
              this.$message.warning("上传图片不能超过九张");
            } else {
              this.fileList.push({
                fileName: res.data.fileName,
                fileSize: res.data.fileSize,
                documentId: res.data.documentId,
                fileExt: res.data.fileExt,
                url: res.data.url ? res.data.url : "",
                fileId: res.data.fileId,
              });
              this.$emit("confirmPic", this.fileList);
              this.fileArray = "";
            }
          })
          .catch(() => {
            this.loading = false;
            this.$message.warning("服务异常，请稍后重试");
          });
      }
    },
  },
};
</script>
<style lang="less">
.upload-area {
  width: 100%;
  height: auto;
  .upload-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .up-body {
    height: 100px;
    width: 100%;
    border: 2px dashed #909399;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .file-body {
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .up-body:hover {
    border: 2px dashed #1890ff;
  }
}
</style>