<template>
<div class="detail">
<div class="detail-header">
      <p class="detail-header-title">新建任务派发</p>
      <p class="detail-header-btn" @click="goBack()">返回</p>
    </div>
    <div class="detail-main">
      <div class="form-body">
        <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="任务名称" prop="afterTaskName">
            <a-input v-model="form.afterTaskName" @click="selectAffair" />
          </a-form-model-item>
          
          <a-radio-group v-model="form.scopeType" style="padding-left: 50px;">
            <a-radio :style="radioStyle" :value="0">
              <span style="padding-right:40px;">选择来源</span>
              <div style="margin:25px 0">
                  <!-- 会员来源 -->
                  <a-form-model-item label="会员来源" prop="clientId">
                    <a-checkbox-group
                      v-model="form.clientId"
                      :options="clientIds"
                      @change="(value) => {form.clientId = value}"
                    />
                  </a-form-model-item>
                  <!-- 会员等级 -->
                  <a-form-model-item label="会员等级" prop="startLevelId">
                    <a-checkbox-group
                      v-model="form.startLevelId"
                      :options="startLevelIds"
                      @change="(value) => {form.startLevelId = value}"
                    />
                  </a-form-model-item>
              </div>
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              <span style="padding-right:40px;">上传指定会员</span>
              <!-- { required: true, message: '请选择文件上传!' }, -->
              <!-- 上传指定会员 -->
              <a-form-model-item style="display:inline-block;width:100%;">
                <a-upload
                  v-decorator="[
                    'form.file',
                    {
                      initialValue: form.file,
                      rules: [
                        {
                          validator: (rule, value, callback) =>
                            validatorFn1(rule, value, callback, '请选择文件上传!')
                        }
                      ]
                    }
                  ]"
                  :file-list="fileList1"
                  :remove="handleRemove1"
                  name="file"
                  accept=".xls,.xlsx"
                  :before-upload="uploadBefor"
                >
                  <a-button>
                    <a-icon type="upload" />
                    上传文件
                  </a-button>
                </a-upload>
              </a-form-model-item>
              <div style="padding:40px 0 0 148px;">
                <p style="font-size: 12px;color: #c1c1c1;">
                  支持扩展名：.xlsx，支持批量上传会员手机号或会员UUID，重复会员计算一次
                </p>
                <p>
                  <a-button type="link" :loading="loadingUrl" @click="getTplDownload">下载会员信息模板</a-button>
                </p>
              </div>
            </a-radio>
            
          </a-radio-group>

          
          
          <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
            <a-button type="primary" html-type="submit" style="margin-right:10px" @click="goBack">取消</a-button>
            <a-button type="primary" html-type="submit" @click="btnCreateTask" :loading="addLoading">派发任务</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>

    <!-- 弹框队列开始 -->
      <affair
        :visible.sync="visibleAffair"
        @selectedActive="selectedAffair"
      >
      </affair>
    <!-- 弹框队列结束 -->
  </div>
</template>

<script>
const validatorFn1 = (rule, value, callback, message) => {
  // // console.log('validatorFn1 value :>> ', value);
  if (!value) {
    callback(message);
  } else {
    if (value.fileList.length === 0) {
      callback(message);
    } else {
      callback();
    }
  }
};
import {
  couponsCenterList,
  bangdouList,
  cardList,
  level,
  typeList,
  activityList
} from '@/pages/coupons/release/createForms';
import affair from './affair';
import moment from 'moment';
import api from '@/api';
import { getAddDist } from '@/api/task';
export default {
  components: {
    affair
  },
  data() {
    return {
      loadingUrl: false,
      type: 'add', //add:新增，edit:编辑
      editId: '',
      visibleActivity: false,
      visibleAffair: false,
      selectGame: false,
      addLoading: false,
      form: {
        afterTask: '', // 关联任务
        afterTaskName: '', // 关联任务名称
        scopeType: 0,
        clientId: ['sys_dichan'],
        startLevelId: [],
        file: ''
      },
      taskSourceOption: [],
      rules: {
        afterTaskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        clientId: [{ required: true, message: '请选择会员来源', trigger: 'blur' }]
      },
      radioStyle: {
        display: 'block',
        height: '200px'
      },
      clientIds: [{ label: '地产Pro', value: 'sys_dichan' }, { label: '邻里邦Pro', value: 'sys_linlibang' }],
      startLevelIds: [
        { label: '邻里会员V1', value: 1 },
        { label: '邻里会员V2', value: 2 },
        { label: '邻里会员V3', value: 3 },
        { label: '邻里会员V4', value: 4 },
        { label: '邻里会员V5', value: 5 }
      ],
      fileList1: []
    };
  },
  watch: {
    'form.otherAwardType'(val) {
      if (val === '0') {
        this.form.otherAwardId = '';
        this.form.otherAwardName = '';
      }
    },
    fileList1: {
      handler(newVal) {
        // console.log('watch fileList1 newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },

  created() {
    this.type = this.$route.query.type;
  },
  methods: {
    validatorFn1,
    // 打开关联任务
    selectAffair() {
      this.visibleAffair = true;
    },
    // 选择活动回调
    selectedAffair(row) {
      this.form.afterTask = row[0].id;
      this.form.afterTaskName = row[0].taskName;
    },
    // 选择任务来源回调
    handleChange(value) {
      this.form.source = value;
    },
    uploadBefor(file) {
      this.form.file = file;
      this.$set(this.fileList1, 0, file);
      // this.fileList1[0] = file;
      return false;
    },
    handleRemove1(file) {
      // console.log('file :>> ', file);
      // return;
      const index = this.fileList1.indexOf(file);
      const newFileList = this.fileList1.slice();
      newFileList.splice(index, 1);
      this.fileList1 = newFileList;
      this.file = null;
      // console.log('newFileList :>> ', newFileList);
      // console.log('this.file :>> ', this.file);
    },
    btnCreateTask(e) {
      console.log(this.form);
      const data = JSON.parse(JSON.stringify());
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addLoading = true;
          getAddDist(this.form)
            .then(res => {
              this.$refs.ruleForm.resetFields();
            })
            .finally(i => {
              this.addLoading = false;
            });
        }
      });
    },
    goBack() {
      this.$router.push({ name: 'taskCenter-distribute' });
    },
    // 获取下载模版
    getTplDownload() {
      this.loadingUrl = true;
      api
        .getTplDownload()
        .then(res => {
          // console.log('getTplDownload res :>> ', res);
          window.open(res.data);
        })
        .finally(() => {
          this.loadingUrl = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.form-body {
  padding: 20px 0px;
}
.tc-textTarea {
  height: 200px;
  width: 100%;
  resize: none;
}
.detail {
  height: 100%;
  &-header {
    display: flex;
    justify-content: space-between;
    line-height: 56px;
    border-bottom: 2px solid #dadada;
    &-title,
    &-btn {
      margin: 0;
      padding: 0 40px;
    }
    &-btn {
      color: #4c79fa;
      cursor: pointer;
    }
  }
  &-main {
    height: calc(100% - 58px);
    overflow: auto;
    padding: 20px;
    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 35px;
      line-height: 50px;
      margin: 0;
    }
    &-items {
      color: #666;
      margin-bottom: 20px;
      &-label {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #333;
      }
    }
  }
}
.createflex {
  display: flex;
  align-items: center;
}
</style>