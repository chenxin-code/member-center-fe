<template>
  <div style="height: 100%">
    <div class="content-header">
      App版本发布
      <span class="fallback" @click="FALLBACK" style="cursor: pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px)">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="height: 100%; overflow: auto" autoComplete="off">
        <a-form-item label="版本名称" style="margin-top: 16px">
          <a-input v-decorator="[
              'name',
              {
                rules: [
                  { required: true, message: '版本名称不能为空' },
                  { validator: checkName },
                ],
              },
            ]" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="版本号" style="margin-top: 16px">
          <a-input v-decorator="[
              'appVersion',
              { rules: [{ required: true, message: '版本号不能为空' },{ validator: checkAppVersion }] },
            ]" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="是否强更">
          <a-radio-group v-decorator="['forceUpdate', { initialValue: 1 }]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="平台">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="[
              'appCode',
              { initialValue: 'app-b' },
              { rules: [{ required: true, message: '平台不能为空' }] },
            ]" placeholder="请选择平台">
            <a-select-option v-for="item in appCode" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="系统">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="[
              'os',
              { initialValue: 1 },
              { rules: [{ required: true, message: '系统不能为空' }] },
            ]" placeholder="请选择系统">
            <a-select-option v-for="item in os" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="更新日志">
          <a-textarea placeholder="请输入" :rows="8" v-decorator="[
              'memo',
              {
                rules: [
                  { required: true, message: '更新日志不能为空' },
                  { validator: checkMemo }
                ],
              },
            ]" />
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px" :loading="btnLoading" @click="onSubmit">发布</a-button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex"
import moment from "moment"
import AFormItem from "ant-design-vue/es/form/FormItem";
import * as util from '../../utils/util'
export default {
  name: "addVersion",
  components: { AFormItem },
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      appCode: [
        {
          id: "app-b",
          name: "APPB"
        },
        {
          id: "app-c",
          name: "APPC"
        },
      ],
      os: [
        {
          id: 1,
          name: "安卓"
        },
        {
          id: 2,
          name: "IOS"
        },
      ],
      btnLoading: false
    }
  },
  computed: {},
  created() {

  },
  mounted() {

  },
  methods: {
    moment,
    ...mapActions([
      "FALLBACK"
    ]),
    checkName(rule, value, callback) {
      if (value == undefined) {
        callback();
        return;
      }
      if (value.trim().length > 20) {
        callback('版本名称最多20');
      }
      callback();
    },
    checkAppVersion(rule, value, callback) {
        if (/^([0-9]\d{0,3}|[0-9]\d{0,3})(\.([0-9]\d{0,3}|\d)){2}$/.test(value)==false) {
          callback('版本格式应为数字，长度为0~9999');
        }
      if (value == undefined) {
        callback();
        return;
      }
      callback();
    },
    checkMemo(rule, value, callback) {
      if (value == undefined) {
        callback();
        return;
      }
      if (value.trim().length > 100) {
        callback('更新日志最大100');
      }
      callback();
    },
    //保存
    onSubmit(e) {
      util.debounce(() => {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          this.btnLoading = false;
          if (!err) {
            values = {
              name: values.name,//版本名称
              appVersion: values.appVersion,//版本号
              forceUpdate: values.forceUpdate,//是否强制更新
              appCode: values.appCode,//平台
              os: values.os,//系统
              memo: values.memo//更新日志
            };
            api["addVersion"](values).then(res => {
              if (res.code === 200) {
                this.$message.success("新增成功");
                this.$router.push({ name: "version" });
              }
            }).finally(() => {
              this.btnLoading = false;
            });
          }
        });
      })
    },
  }
}
</script>

<style lang="less">
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
.imgDiv {
  width: 335px;
  height: auto;
}
.ant-upload.ant-upload-select-picture-card {
  display: table;
  float: left;
  width: 335px;
  height: 115px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}
.ant-upload-list-picture-card-container {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
  /*text-align: center;*/
}
.ant-upload-list-picture-card .ant-upload-list-item {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
}
.ant-modal-close-x {
  display: block;
  width: 30px;
  height: 30px;
  font-size: 16px;
  font-style: normal;
  line-height: 30px;
  text-align: center;
  text-transform: none;
  text-rendering: auto;
}
</style>

