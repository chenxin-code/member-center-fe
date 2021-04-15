<template>
  <div class="form-body">
    <a-form :form="formBasic" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="游戏主题">
            <a-input v-decorator="rules.theme"/>
        </a-form-item>
        <a-form-item label="是否可用">
          <a-radio-group v-decorator="rules.available">
            <a-radio value="1">
                启用
            </a-radio>
            <a-radio value="2">
                禁用
            </a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="有效期">
            <a-range-picker style="width: 100%" v-decorator="rules.valid" />
        </a-form-item>
        <a-form-item label="最多参与人数">
            <a-input v-decorator="rules.people"/>
        </a-form-item>
        <a-form-item label="抽奖描述">
          <a-textarea placeholder="抽奖描述限制250个字" v-decorator="rules.describe" :maxLength="250" :rows="4" />
        </a-form-item>
        <a-form-item label='上传抽奖活动背景'>
            <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload"
                @change="handleChange"
                v-decorator="rules.file"
            >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                    Upload
                </div>
                </div>
            </a-upload>
        </a-form-item>
        <a-form-item label='通知方式'>
            <a-select v-decorator="rules.notice" placeholder="请选择">
                <a-select-option value="0">
                消息推送
                </a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label='开奖方式'>
            <a-select v-decorator="rules.prize" placeholder="请选择" @change="changePrize">
            <a-select-option value="0">
              立即开奖
            </a-select-option>
            <a-select-option value="1">
              非立即开奖
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='开奖时间' v-if="prizeKey == 1">
            <a-range-picker style="width: 100%" v-decorator="rules.prizeDate" />
        </a-form-item>
        <a-form-item label='活动参与人数' v-if="prizeKey == 1">
            <a-input v-decorator="rules.partake"/>
        </a-form-item>
        <a-form-item label='活动方式'>
            <a-select v-decorator="rules.activity" placeholder="请选择">
            <a-select-option value="0">
              幸运转盘
            </a-select-option>
             <a-select-option value="1">
              砸金蛋
            </a-select-option>
             <a-select-option value="2">
              九宫格
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
            <a-button type="primary" html-type="submit" style="margin-right:10px">取消</a-button>
            <a-button type="primary" html-type="submit" @click="btnCreateTask">创建游戏</a-button>
        </a-form-item>
    </a-form>
  </div>
</template>
<script>
import api from '@/api';
import moment from 'moment';
export default {
  data() {
    return {
      //表单
      formBasic: this.$form.createForm(this, { name: "formBasic" }),
      rules: {
          theme:[
              'theme',{
              rules:[{ required: true, message: '请输入游戏主题' }]
          }],
          available:[
              'available',{
              rules:[{ required: true, message: '请选择是否可用' }]
          }],
          valid:[
              'valid',{
              rules:[{ required: true, message: '请选择有效期' }]
          }],
          people:[
              'people',{
              rules:[{ required: true, message: '请输入最多参与人数' }]
          }],
          describe:[
              'describe',{
              rules:[{ required: true, message: '请选择行为状态', }]
          }],
          file:[
            'file',{
            valuePropName: 'fileList', getValueFromEvent: this.normFile,
            rules:[{ required: true, message: '请上传抽奖活动背景', }]
          }],
          notice:[
              'notice',{
              rules:[{ required: true, message: '请选择通知方式', }]
          }],
          prize:[
              'prize',{
              rules:[{ required: true, message: '请选择开奖方式', }]
          }],
          prizeDate:[
              'prizeDate',{
              rules:[{ required: true, message: '请选择开奖方式', }]
          }],
          partake:[
              'partake',{
              rules:[{ required: true, message: '请选择开奖方式', }]
          }],
          activity:[
              'activity',{
              rules:[{ required: true, message: '请选择活动方式', }]
          }],
      },
      prizeKey:'',
      imageUrl:'',
      loading:false,
    }
  },
  created(){
    this.formBasic.resetFields();
    this.$nextTick(()=>{
      if(this.$route.query.id){
        //数据查询
        //this.initData(this.$route.query.id);
      }
    })
  },
  methods:{
    changePrize(key){
      this.prizeKey = key;
    },
    //图片上传
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    normFile(e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    /****************数据请求********************/
    initData(){
      this.formBasic.setFieldsValue({

      })
    },
    btnCreateTask(){
      this.formBasic.validateFields((err, values) => {
        if (err) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style lang="less">
.form-body {
  padding: 20px 0px;
}
</style>