<template>
  <div style="height: 100%;">
    <div class="content-header">
      创建资源包
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="height: 100%;overflow: auto;" autoComplete="off">
        <a-form-item label="资源包名称" style="margin-top:16px;">
          <a-input
              v-decorator="['name', { rules: [{ required: true, message: '资源包名称不能为空' },{ message: '资源包名称最长20个字',max: 20 },{whitespace: true,
              message: '资源包名称不能为空'}],getValueFromEvent: (event) => {return event.target.value.replace(/[\u4E00-\u9FA5]/g,'')} } ]"
              placeholder="请输入资源包名称"
          />
        </a-form-item>

        <a-form-item label="资源包版本" style="margin-top:16px;">
          <a-input
              v-decorator="['version', { rules: [{ required: true, message: '资源包版本不能为空' },{whitespace: true,
              message: '资源包版本不能为空'}],getValueFromEvent: (event) => {return event.target.value.replace(/[\D]/g,'')} } ]"
              placeholder="请输入资源包版本"
          />
        </a-form-item>
        <a-form-item label="微应用">
          <a-select
              v-decorator="['micro']"
              placeholder="请选择微应用"
              :disabled=selectDisabled
          >
            <a-select-option v-for="item in microData" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="下载地址" style="margin-top:16px;">
          <a-input
              v-decorator="['url', { rules: [{ required: true, message: '下载地址不能为空' },{ message: '下载地址最长255个字',max: 256 },{whitespace: true, message: '下载地址不能为空'},{ validator: checkData, trigger: 'blur'}] } ]"
              placeholder="请输入下载地址"
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
import api from '@/api';
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'addResourcePackage',
  components: {},
  props: {
    projectId: {
      type: Number,
      default: () => ({})
    },
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'form' }),
      microData: [],
      btnLoading: false,
      defaultProjectId: null,
      selectDisabled: false
    }
  },
  computed: {},
  created () {

  },
  mounted () {
    this.getMicroList();
    this.defaultProjectId = this.projectId === undefined ? null : this.projectId;
    this.selectDisabled = this.defaultProjectId == null ? false : true;
  },
  methods: {
    moment,
    ...mapActions([
      'FALLBACK'
    ]),
    //获取微应用
    getMicroList () {
      api.allMicro().then(res => {
        if (res.code === 200) {
          this.microData = res.data;
          if (this.defaultProjectId == null) {
            this.form.setFieldsValue({
              micro: this.microData[0].id
            });
          } else {
            var arrarIndex = 0;
            for (let i = 0; i < this.microData.length; i++) {
              const node = this.microData[i];
              if (node.id == this.defaultProjectId) {
                arrarIndex = i;
                break;
              }
            }
            this.form.setFieldsValue({
              micro: this.microData[arrarIndex].id
            });
          }
        }
      });
    },
    //正则表达式不能输入汉字
    checkData (rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('请输入url格式的下载地址'));
        } else {
          callback();
        }
      }
      callback();
    },
    //保存
    onSubmit () {
      // console.log(111)
      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnLoading = true;
          // console.log(222)
          values = {
            programId: values.micro,
            resourceName: values.name,
            resourceVersion: values.version,
            url: values.url
          };
          // console.log("资源包版本",resourceVersion)
          api['addResourcePackage'](values).then(res => {
            if (res.code !== 200) {
            } else {
              this.$message.success('新增成功');
               this.$router.go(-1)
              // this.$router.push({ name: 'resourcePackage' });
            }
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      });
    },
  }
}
</script>

<style lang="less">
.content-footer {
  display: flex;
  justify-content: center;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
</style>
