<template>
  <div class="editor" :style="`width:${editorWidth};${contenteditable ? '' : 'background:#f5f7fa;'}`">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text" :style="`height: ${contentHeight};`"></div>
    <!-- <p v-if="isShowNum" class="limitNum align-right font12 cor-6">
      <span>{{ spanInfo }}</span>
      /{{ maxNum }}
    </p> -->
  </div>
</template>
<script>
import wangeDitor from 'wangeditor';
// import { richUploadFile } from '@/api/base.js';
export default {
  name: 'editor_component',
  components: {},
  data() {
    return {
      editor: null,
      spanInfo: 0
    };
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    filterText: {
      type: Boolean,
      default: false
    },
    isShowNum: {
      type: Boolean,
      default: false
    },
    maxNum: {
      type: Number,
      default: 500
    },
    index: {
      type: Number,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    contenteditable: {
      type: [String, Boolean],
      default: true
    },
    contentHeight: {
      type: [String, Number],
      default: '600px'
    },
    editorWidth: {
      type: [String, Number],
      default: '600px'
    }
  },
  mixins: [],
  filters: {},
  computed: {},
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value, e) {
      try {
        if (value !== this.editor.txt.html()) {
          this.checkContentLength(value);
          this.editor.txt.html(this.value);
        }
      } catch (error) {
        console.log(error);
      }
    },
    contenteditable: {
      handler(newVal, oldVal) {
        this.canEdit();
      },
      deep: true
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  methods: {
    isTrue(val) {
      if (val === '' || val === null || val === undefined || val == 'undefined' || val == 'null') {
        return false;
      } else {
        return true;
      }
    },
    getParams(obj) {
      const params = new FormData();
      console.log(obj);
      for (let key in obj) {
        if (this.isTrue(obj[key])) {
          params.append(key, obj[key]);
        } else {
          params.append(key, '');
        }
      }
      return params;
    },
    async uploadImg(item) {
      try {
        console.log('uploadImg---->', item);
        const params = this.getParams({
          file: item,
          fileName: item.name,
          isVideo: 0
        });
        // const res = await richUploadFile(params);
        console.log('uploadFile--->', res);
        this.imageUrl = res.filePath;
        return this.imageUrl;
      } catch (error) {
        const msg = error && error.msg;
        this.$toast(msg || '上传失败');
      }
    },
    checkContentLength(value) {
      //获取纯文字 在获取img 相加就可以了
      var temp = value.replace(/<\/?.+?>/g, '');
      var result = temp.replace(/ /g, ''); //result为获取冲文字得到后的内容
      result = result.replace(/(\r|\n|\\s|&nbsp;)/g, ''); //result为获取冲文字得到后的内容
      //获取img标签
      var re = /<img[^>]+>/g;
      var ImgA = value.match(re);
      let imgLen;
      if (ImgA) {
        imgLen = ImgA.length;
      } else {
        imgLen = 0;
      }
      this.spanInfo = imgLen + result.length;
      if (this.isShowNum) {
        if (this.spanInfo > this.maxNum) {
          this.$emit('isBeyond', true);
        } else {
          this.$emit('isBeyond', false);
        }
      }
    },
    seteditor() {
      this.editor = new wangeDitor(this.$refs.toolbar, this.$refs.editor);
      // 自定义菜单配置
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'undo', // 撤销
        'redo' // 重复
      ];
      // 配置 onchange 回调函数
      this.editor.config.onchange = newHtml => {
        console.log('change 之后最新的 html', newHtml);
        // newHtml = newHtml.replace(
        //     /\<img/gi,
        //     '<img style="max-width:100%;height:auto" '
        // );
        this.$emit('changeValue', {
          content: newHtml
        });
      };
      //上传图片
      this.editor.config.uploadImgShowBase64 = true;
      // 设置编辑区域高度为 500px
      this.editor.config.height = 500;
      // 配置触发 onchange 的时间频率，默认为 200ms
      this.editor.config.onchangeTimeout = 500; // 修改为 500ms
      this.editor.create();
      //实现自定义上传图片
      this.editor.config.customUploadImg = async function(resultFiles, insertImgFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const imageUrl = await this.uploadImg(resultFiles[0]);
        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(imageUrl);
      }.bind(this);
      // this.editor.customConfig.onchangeTimeout = 100;
      // this.editor.customConfig.onchange = html => {
      //   console.log(html)
      //   this.checkContentLength(html);
      //   this.$emit("changeValue", {
      //     content: html,
      //     index: this.index
      //   });
      // };
      // // this.editor.customConfig.pasteFilterStyle = false;
      // this.editor.customConfig.pasteIgnoreImg = true
      // let that = this
      // this.editor.customConfig.pasteTextHandle = function (content) {
      //     // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      //     if(that.filterText){
      //       content = content.replace(/<\/?.+?>/g, "");
      //     }
      //     return content
      // }
      // this.editor.customConfig.zIndex = 1;
      // this.editor.customConfig.colors = [
      //   "#000000",
      //   "#eeece0",
      //   "#1c487f",
      //   "#4d80bf",
      //   "#c24f4a",
      //   "#8baa4a",
      //   "#7b5ba1",
      //   "#46acc8",
      //   "#f9963b",
      //   "#ffffff"
      // ];
      // this.editor.create();
    },
    canEdit() {
      try {
        this.$nextTick(() => {
          this.editor.$textElem.attr('contenteditable', this.contenteditable);
          console.log('contenteditable----------------------->', this.contenteditable);
        });
      } catch (error) {
        console.log('contenteditable----------------------->', error);
      }
    }
  },
  mounted() {
    this.seteditor();
    this.checkContentLength(this.value);
    this.editor.txt.html(this.value);
    this.canEdit();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.w-e-toolbar {
  position: relative;
  z-index: 2;
}
.w-e-toolbar .w-e-menu {
  z-index: auto !important;
}
.w-e-toolbar .w-e-droplist {
  z-index: 1;
}
.w-e-text p,
.w-e-text h1,
.w-e-text h2,
.w-e-text h3,
.w-e-text h4,
.w-e-text h5,
.w-e-text table,
.w-e-text pre {
  margin: 0 !important;
}
.editor {
  position: relative;
  margin: 0 auto;
  position: relative;
  border: 1px solid #ccc;
  line-height: 25px;
  padding-bottom: 22px;
  .limitNum {
    position: absolute;
    bottom: 0;
    left: 0;
    // width: 100%;
    height: 11px;
    // line-height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    // background: #f5f7fa;
  }
  .toolbar {
    background: #fff;
    width: 100%;
    border-bottom: 1px solid #ccc;
  }
  .w-e-toolbar .w-e-menu {
    padding: 0 10px;
  }
  .text {
    z-index: auto !important;
    .w-e-panel-container {
      z-index: 99999999;
      left: -1px;
      top: 100%;
      width: 70% !important;
      margin-left: 0 !important;
    }
    .w-e-text {
      overflow-y: auto;
    }
  }
}

.w-e-text-container {
  height: 600px !important;
}
</style>
