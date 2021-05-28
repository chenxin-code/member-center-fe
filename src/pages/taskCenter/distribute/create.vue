<template>
<div class="detail">
<div class="detail-header">
      <p class="detail-header-title">新建任务派发</p>
      <p class="detail-header-btn" @click="goBack()">返回</p>
    </div>
    <div class="detail-main">
      <div class="form-body">
        <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="任务名称" prop="taskName">
            <a-input v-model="form.taskName" @click="selectAffair" />
          </a-form-model-item>

          <a-radio-group v-model="form.scopeType" class="scopeTypeData">
            <a-radio :style="radioStyle" :value="0">
              <div class="scopeTypeRadio">
              <span style="padding-right:40px; line-height:40px;">选择来源</span>
              <div>
                  <!-- 会员来源 -->
                  <a-form-model-item label="会员来源" prop="clientId">
                    <a-checkbox-group
                      v-model="form.clientId"
                      :options="clientIds"
                      @change="(value) => {form.clientId = value}"
                      class="scopeGroup"
                    />
                  </a-form-model-item>
                  <!-- 会员等级 -->
                  <a-form-model-item label="会员等级" prop="startLevelId">
                    <div class="scopeGroup">
                      <a-select
                        style="width:150px;"
                        v-model="form.startLevelId"
                        @change="startLevelIdSelect"
                      >
                        <a-select-option :value="item.value" v-for="(item, index) in startLevelIds" :key="index">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    <span style="padding: 0 20px;color:#ccc;">------</span>
                      <a-select
                        style="width:150px;"
                        v-model="form.endLevelId"
                        @change="endLevelIdSelect"
                      >
                        <a-select-option :value="item.value" v-for="(item, index) in startLevelIds" :key="index">
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </div>
                  </a-form-model-item>
                  </div>
              </div>
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              <span style="padding-right:40px;">指定会员</span>
              <!-- { required: true, message: '请选择文件上传!' }, -->
              <!-- 上传指定会员 -->
              <a-form-model-item style="display:inline-block;width:100%;" prop="file">
                <a-upload
                  v-model="form.file"
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
import {
  couponsCenterList,
  bangdouList,
  cardList,
  level,
  typeList,
  activityList
} from '@/pages/coupons/release/createForms';
import affair from '@/components/affair';
import moment from 'moment';
import api from '@/api';
import { getAddDist } from '@/api/task';
export default {
  components: {
    affair
  },
  data() {
    let validator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      loadingUrl: false,
      type: 'add', //add:新增，edit:编辑
      editId: '',
      visibleActivity: false,
      visibleAffair: false,
      selectGame: false,
      addLoading: false,
      form: {
        taskId: '', // 关联任务
        taskName: '', // 关联任务名称
        scopeType: 0,
        clientId: ['sys_dichan'],
        startLevelId: 1,
        endLevelId: 1,
        file: null,
        status: 1
      },
      taskSourceOption: [],
      rules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
        clientId: [{ required: true, message: '请选择会员来源', trigger: 'change' }]
      },
      radioStyle: {
        display: 'block',
        height: '130px'
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
    },
    'form.startLevelId': {
      handler(newVal) {
        // console.log('watch startLevelId newVal :>> ', newVal);
        if (this.form.startLevelId > this.form.endLevelId) {
          this.$set(this.form, 'endLevelId', this.form.startLevelId);
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    'form.endLevelId': {
      handler(newVal) {
        // console.log('watch endLevelId newVal :>> ', newVal);
        if (this.form.endLevelId < this.form.startLevelId) {
          this.$set(this.form, 'startLevelId', this.form.endLevelId);
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    'form.scopeType'(val) {
      this.$refs.ruleForm.clearValidate();
      if (val) {
        this.rules = { ...this.rules, file: [{ required: true, message: '请选择会员来源', trigger: 'change' }] };
      } else {
        const { taskName, clientId } = this.rules;
        this.rules = { taskName, clientId };
      }
    }
  },
  created() {
    this.type = this.$route.query.type;
  },
  methods: {
    init() {
      this.form = {
        taskId: '', // 关联任务
        taskName: '', // 关联任务名称
        scopeType: 0,
        clientId: ['sys_dichan'],
        startLevelId: 1,
        endLevelId: 1,
        file: null,
        status: 1
      };
    },
    validator(rule, value, callback, message) {
      console.log(value);
      if (!value) {
        callback(message);
      } else {
        if (value.fileList.length === 0) {
          callback(message);
        } else {
          callback();
        }
      }
    },
    // 打开关联任务
    selectAffair() {
      this.visibleAffair = true;
    },
    // 选择活动回调
    selectedAffair(row) {
      this.form.taskId = row[0].id;
      this.form.taskName = row[0].taskName;
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
      this.form.file = null;
      // console.log('newFileList :>> ', newFileList);
      // console.log('this.file :>> ', this.file);
    },
    btnCreateTask(e) {
      const data = JSON.parse(JSON.stringify(this.form));
      Object.assign(data, {
        clientId: data.clientId.join(),
        file: this.form.file
      });
      const paramFormData = Object.keys(data).reduce((pre, key) => {
        pre.append([key], data[key]);
        return pre;
      }, new FormData());

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addLoading = true;
          getAddDist(paramFormData)
            .then(res => {
              if (res.code === 200) {
                this.$refs.ruleForm.resetFields();
                this.init();
                this.$message.success('提交成功');
                this.goBack();
              }
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
          if (res.code === 200) {
            window.open(res.data);
          }
        })
        .finally(() => {
          this.loadingUrl = false;
        });
    },
    startLevelIdSelect(value) {
      // console.log('startLevelIdSelect value :>> ', value);
      this.form.startLevelId = value;
    },
    endLevelIdSelect(value) {
      // console.log('endLevelIdSelect value :>> ', value);
      this.form.endLevelId = value;
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
.scopeTypeData {
  padding-left: calc(16.66666667% - 90px);
}
.scopeTypeRadio {
  display: inline-flex;
}
.scopeGroup {
  margin-left: 15px;
}
</style>
