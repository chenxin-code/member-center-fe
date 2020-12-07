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
    <a-form-model-item label="微应用名称" prop="region">
      <a-select v-model="form.region" placeholder="请输入">
        <a-select-option value="shanghai">
          物业通知
        </a-select-option>
        <a-select-option value="beijing">
          人房档案
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <!-- 微应用版本 -->
       <a-form-model-item ref="name" label="微应用版本" prop="name">
         <a-input
           v-model="form.name"
           @blur="
             () => {
               $refs.name.onFieldBlur();
             }
           "
         />
       </a-form-model-item>
  <!-- 资源包 -->
        <a-form-model-item ref="nameof" label="资源包" prop="nameof">
          <a-input
            v-model="form.nameof"
            @blur="
              () => {
                $refs.nameof.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
  <!-- 小区范围 -->
  <a-form-model-item label="小区范围" prop="scope">
    <a-select v-model="form.scope" placeholder="请输入">
      <a-select-option value="shanghai">
        全部
      </a-select-option>
      <a-select-option value="beijing">
        时代外滩
      </a-select-option>
      <a-select-option value="haerbin">
        小区二
      </a-select-option>
      <a-select-option value="guangdong">
        小区三
      </a-select-option>
    </a-select>
  </a-form-model-item>
  
  <!-- App版本 -->
  <a-form-model-item label="App版本" prop="version">
    <a-select v-model="form.version" placeholder="请输入">
      <a-select-option value="liaoning">
        全部
      </a-select-option>
      <a-select-option value="dalian">
        v1.0.0
      </a-select-option>
      <a-select-option value="riben">
        v1.0.0
      </a-select-option>
    </a-select>
  </a-form-model-item>
  <!-- 按钮 -->
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
        nameof: '',
        region: undefined,
        pack: undefined,
        scope: undefined,
        version: undefined,
      },
      rules: {
        name: [
          { required: true, trigger: 'blur' },
          { min: 3, max: 5, trigger: 'blur' },
        ],
        region: [{ required: true, trigger: 'change' }],
        pack: [{ required: true, trigger: 'change' }],
        scope: [{ required: true, trigger: 'change' }],
        version: [{ required: true, trigger: 'change' }],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // alert('submit!');
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
