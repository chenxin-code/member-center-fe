<style>
.form-body {
  padding: 20px 0px;
}
.tc-textTarea {
  height: 200px;
  width: 100%;
  resize: none;
}
</style>
<template>
  <div class="form-body">
    <a-form-model ref="ruleForm" :rules="rules" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <a-form-model-item ref="taskName" label="任务名称" prop="taskName">
        <a-input v-model="form.taskName" />
      </a-form-model-item>
      <a-form-model-item label="有效期">
        <a-range-picker style="width: 100%" @change="onChange" />
      </a-form-model-item>
      <a-form-model-item label="任务描述">
        <a-textarea class="tc-textTarea" />
      </a-form-model-item>
      <a-form-model-item label="任务周期性">
        <a-select v-decorator="[
          'select',
          { rules: [{ required: true, message: '请选择任务性质' }] },
        ]" placeholder="请选择">
          <a-select-option value="0">
            一次性任务
          </a-select-option>
          <a-select-option value="1">
            周期性任务
          </a-select-option>
          <a-select-option value="2">
            重复性任务
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="cycleRange" label="任务名称" prop="cycleRange">
        <a-input v-model="form.cycleRange" />
      </a-form-model-item>
      <a-form-model-item ref="taskMaxNum" label="最大执行次数" prop="taskMaxNum">
        <a-input v-model="form.taskMaxNum" />
      </a-form-model-item>
      <a-form-model-item ref="taskSource" label="任务来源" prop="taskSource">
        <a-select v-model="form.taskSource" placeholder="请选择">
          <a-select-option v-for="(tsItem,tsIdex) in taskSourceOption" :key="tsIdex" :value="tsItem.appName">
            {{tsItem.appName}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="任务状态" prop="taskState">
        <a-radio-group v-model="form.taskState">
          <a-radio value="1">
            启用
          </a-radio>
          <a-radio value="2">
            禁用
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="任务执行方式">
        <a-select placeholder="请选择">
          <a-select-option value="0">
            提示
          </a-select-option>
          <a-select-option value="1">
            普通链接
          </a-select-option>
          <a-select-option value="2">
            微应用地址
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="taskUrl" label="任务执行地址" prop="taskUrl">
        <a-input v-model="form.taskUrl" />
      </a-form-model-item>
      <a-form-model-item label="是否是初始化任务" prop="taskInitialization">
        <a-radio-group v-model="form.taskInitialization">
          <a-radio value="1">
            是
          </a-radio>
          <a-radio value="2">
            不是
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="是否进行邦豆成长值奖励" prop="isTaskIntegral">
        <a-radio-group v-model="form.isTaskIntegral">
          <a-radio value="1">
            是
          </a-radio>
          <a-radio value="2">
            不是
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="邦豆成长值奖励计算方式" prop="TaskIntegralType">
        <a-radio-group v-model="form.TaskIntegralType">
          <a-radio value="1">
            固定值
          </a-radio>
          <a-radio value="2">
            非固定值
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item ref="BangDouNumber" label="邦豆奖励数量" prop="BangDouNumber">
        <a-input v-model="form.BangDouNumber" />
      </a-form-model-item>
      <a-form-model-item ref="GrowthNumber" label="成长值奖励数量" prop="GrowthNumber">
        <a-input v-model="form.GrowthNumber" />
      </a-form-model-item>
      <a-form-model-item ref="BangDouProportion" label="邦豆奖励比例" prop="BangDouProportion">
        <a-input v-model="form.BangDouProportion" />
      </a-form-model-item>
      <a-form-model-item ref="BangDouMaxNumber" label="邦豆奖励最大值" prop="BangDouMaxNumber">
        <a-input v-model="form.BangDouMaxNumber" />
      </a-form-model-item>
      <a-form-model-item ref="GrowthProportion" label="成长值奖励比例" prop="GrowthProportion">
        <a-input v-model="form.GrowthProportion" />
      </a-form-model-item>
      <a-form-model-item ref="GrowthMaxNumber" label="成长值奖励最大值" prop="GrowthMaxNumber">
        <a-input v-model="form.GrowthMaxNumber" />
      </a-form-model-item>
      <a-form-model-item label="是否选择其他类型奖励" prop="TaskIntegralType">
        <a-radio-group v-model="form.TaskIntegralType">
          <a-radio value="1">
            活动奖励
          </a-radio>
          <a-radio value="2">
            礼包券
          </a-radio>
          <a-radio value="3">
            抽奖
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item ref="ActivityName" label="请选择活动" prop="ActivityName">
        <a-input v-model="form.ActivityName" />
      </a-form-model-item>
      <a-form-model-item ref="giftBagName" label="请选择礼包" prop="giftBagName">
        <a-input v-model="form.giftBagName" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" style="margin-right:10px">取消</a-button>
        <a-button type="primary" html-type="submit">创建任务</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api';
export default {
  data() {
    return {
      form: {
        taskName: "",
        taskValidityDate: "",
        taskValidityStart: "",
        taskValidityEnd: "",
        taskDescribe: "",
        cycleRange: "",//周期范围
        taskMaxNum: "",//最大执行次数
        taskSource: "",
        taskState: "1",
        taskExecutionMode: "",
        taskUrl: "",
        taskInitialization: "2",
        isTaskIntegral: "2",
        TaskIntegralType: "1",
        BangDouNumber: "",
        GrowthNumber: "",
        BangDouProportion: "",
        BangDouMaxNumber: "",
        GrowthProportion: "",
        GrowthMaxNumber: "",
        ActivityName: "",
        ActivityID: "",
        giftBagName: "",
        giftBagID: ""
      },
      taskSourceOption: [],
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        cycleRange: [
          { required: true, message: '请输入周期范围', trigger: 'blur' }
        ],
        taskMaxNum: [
          { required: true, message: '请输入最大执行次数', trigger: 'blur' }
        ],
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },
  created() {
    this.getTaskSource();
  },
  methods: {
    onChange(time) {
      console.log(time);
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    getTaskSource() {
      var self = this;
      let sourceList = [];
      api
        .getTaskSource()
        .then(res => {
          self.form.taskSource = res.data[0].appName;
          self.taskSourceOption = [].concat(res.data)
        })
      // .then(() => {
      //   this.taskSourceOption = [].concat({ id: '', name: '全部' }, sourceList)
      // });
    }
  },
};
</script>