<template>
  <div id="propertyNotice">
  <div class="content-header">创建微应用</div>
  <div class="content-main" ref="content_main" style="padding: 20px;">
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
  <!-- 微应用名称 -->
    <a-form-model-item ref="name" label="微应用名称" prop="name">
      <a-input
        v-model="form.name"
        @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
      />
    </a-form-model-item>
    <!-- 上传 -->
    <a-form-model-item label="微应用图标">
      <a-upload
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img v-if="form.imageUrl" :src="form.imageUrl" alt="avatar" class="img" />
        <div v-else class="img-div" style="width: 65px; height: 65px;">
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            上传图片
          </div>
        </div>
      </a-upload>
    </a-form-model-item>
    <!-- 微应用类型 -->
    <a-form-model-item label="微应用类型" prop="region">
      <a-select v-model="form.region" placeholder="请选择">
        <a-select-option value="shanghai">
          Zone one
        </a-select-option>
        <a-select-option value="beijing">
          Zone two
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <!-- 微应用路由 -->
    <a-form-model-item ref="name" label="微应用路由" prop="name">
      <a-input
        v-model="form.name"
        @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
      />
    </a-form-model-item>
    <!-- 微应用类型 -->
    <a-form-model-item label="微应用平台" prop="region">
      <a-select v-model="form.region" placeholder="请选择">
        <a-select-option value="shanghai">
          App-B
        </a-select-option>
        <a-select-option value="beijing">
          App-C
        </a-select-option>
      </a-select>
    </a-form-model-item>
      <!-- 微应用状态 -->
    <a-form-model-item label="微应用状态" prop="type">
      <a-checkbox-group v-model="form.type">
        <a-checkbox value="1" name="type">
          可用
        </a-checkbox>
        <a-checkbox value="2" name="type">
          禁用
        </a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        创建
      </a-button>
    </a-form-model-item>
  </a-form-model>
 </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
        date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        type: [
          {
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: 'Please select activity resource', trigger: 'change' },
        ],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //上传图片
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.form.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>
<style lang="less" scoped>
  #guidePageAppB{
    height: 100%;
  }
  .img-div{
    width: 350px;
    height: 115px;
		margin-left: 10px;
		margin-top: 10px;
  }
  .img{
    width: 350px;
    height: auto;
  }
</style>