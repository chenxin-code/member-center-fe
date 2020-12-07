<template>
  <div id="productPresentation">
    <div class="content-header">产品介绍配置
    </div>
    <div class="content-main">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
              style="height: 100%;overflow: auto;padding-top: 20px">
        <a-form-item label="标题">
          <a-input disabled="disabled"
              v-decorator="['title', { rules: [{ required: true, message: '请输入标题' },{validator: checkTitle,message: '标题最多15个字'}] } ]"
              placeholder="产品介绍"
          />
        </a-form-item>
        <a-form-item label="详细内容">
          <richTextLike
              v-decorator="['richText', { rules: [ { required: true, message: '请填写详细内容' }] }]"
              :urls="{
              picUpload: 'uploadPropertyNoticePic',
              previewQRCode: ''
            }"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" :loading="btnLoading" @click="onSubmit">保存</a-button>
    </div>
  </div>
</template>

<script>
//import api from '@/api';
import { mapActions } from 'vuex';
import richTextLike from '@/components/richTextLike';
//import noticeWay from './noticeWay';

export default {
  name: 'productPresentation',
  components: { richTextLike },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'form' }),
      btnLoading: false
    }
  },
  methods: {
    ...mapActions([
      'FALLBACK'
    ]),
    //测试验证
    checkTitle (rule, value, callback) {
      if (value == undefined || value.length > 15) {
        return false;
      }
      callback();
    },
    onSubmit (e) {
      e.preventDefault();
      const isAdd = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          values = null
        }
        console.log(isAdd);
        console.log(values);
        // api[isAdd ? 'addPropertyNotice' : 'updatePropertyNotice'](values).then(res => {
        //   if (res.code !== 200) {
        //     this.$message.error(res.message);
        //   } else {
        //     this.$message.success((isAdd ? '新增' : '编辑') + '成功');
        //     this.$router.push({ name: 'propertyNotice' });
        //   }
        // });
      })
    }
  }
}
</script>

<style lang="less">
.fallback {
  cursor: pointer;
}

.content-footer {
  text-align: right;
}
</style>

