<template>
<div class="detail">
<div class="detail-header">
      <p class="detail-header-title">{{type === "add" ? '新建任务' : '编辑任务'}}</p>
      <p class="detail-header-btn" @click="goBack()">返回</p>
    </div>
    <div class="detail-main">
      <div class="form-body">
        <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item ref="taskName" label="任务名称" prop="taskName">
            <a-input v-model="form.taskName" />
          </a-form-model-item>
          <a-form-model-item label="有效期" prop="taskDate">
            <a-range-picker v-model="form.taskDate" format="YYYY-MM-DD" style="width: 100%" @change="onChange" />
          </a-form-model-item>
          <a-form-model-item label="任务周期性">
            <a-select v-model="form.isPeriodic" placeholder="请选择">
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
          <a-form-model-item v-if="form.isPeriodic==1" ref="periodic" label="任务周期" prop="periodic">
            <a-input v-model="form.periodic" />
          </a-form-model-item>
          <a-form-model-item v-if="form.isPeriodic==2" ref="executeNum" label="最大执行次数" prop="executeNum">
            <a-input v-model="form.executeNum" />
          </a-form-model-item>
          <a-form-model-item ref="source" label="任务来源" prop="source">
            <a-select v-model="form.sourceName" placeholder="请选择" @change="handleChange">
              <a-select-option v-for="(tsItem,tsIdex) in taskSourceOption" :key="tsIdex" :value="tsItem.appCode" >
                {{tsItem.appName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="任务描述">
            <a-textarea class="tc-textTarea" v-model="form.memo" />
          </a-form-model-item>
          <a-form-model-item label="关联任务">
            <a-input v-model="form.afterTaskName" @click="selectAffair" />
          </a-form-model-item>
          <a-form-model-item label="邦豆成长值奖励" prop="isSystemAward">
            <a-radio-group v-model="form.isSystemAward">
              <a-radio value="1">
                不是
              </a-radio>
              <a-radio value="2">
                是
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2" label="邦豆成长值奖励计算方式" prop="awardType">
            <a-radio-group v-model="form.awardType">
              <a-radio value="1">
                固定值
              </a-radio>
              <a-radio value="2">
                非固定值
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2&&form.awardType==1" ref="awardIntegral" label="邦豆奖励数量" prop="awardIntegral">
            <a-input v-model="form.awardIntegral" />
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2&&form.awardType==1" ref="awardGrow" label="成长值奖励数量" prop="awardGrow">
            <a-input v-model="form.awardGrow" />
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2&&form.awardType==2" ref="awardIntegral" label="邦豆奖励比例" prop="awardIntegral">
            <a-input v-model="form.awardIntegral" />
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2&&form.awardType==2" ref="awardIntegralMax" label="邦豆奖励最大值" prop="awardIntegralMax">
            <a-input v-model="form.awardIntegralMax" />
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2&&form.awardType==2" ref="awardGrow" label="成长值奖励比例" prop="awardGrow">
            <a-input v-model="form.awardGrow" />
          </a-form-model-item>
          <a-form-model-item v-if="form.isSystemAward==2&&form.awardType==2" ref="awardGrowMax" label="成长值奖励最大值" prop="awardGrowMax">
            <a-input v-model="form.awardGrowMax" />
          </a-form-model-item>
          <a-form-model-item label="其他奖励" prop="otherAwardType">
            <a-radio-group v-model="form.otherAwardType">
              <a-radio value="0">
                无
              </a-radio>
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
          <a-form-model-item v-if="form.otherAwardType==1" ref="otherAwardName" label="请选择活动" prop="otherAwardName">
            <a-input v-model="form.otherAwardName" @click="selectActivity" />
          </a-form-model-item>
          <a-form-model-item v-if="form.otherAwardType==2" ref="otherAwardName" label="请选择礼包" prop="otherAwardName">
            <a-input v-model="form.otherAwardName" />
          </a-form-model-item>
          <a-form-model-item v-if="form.otherAwardType==3" ref="otherAwardName" label="请选择游戏" prop="otherAwardName">
            <a-input v-model="form.otherAwardName" @click="fn_selectGame" />
          </a-form-model-item>
          <a-form-model-item v-if="form.otherAwardType==3" ref="gameMaxNumberType" label="抽奖次数计算方式" prop="gameMaxNumberType">
            <a-radio-group v-model="form.gameMaxNumberType">
              <a-radio value="0">
                固定值
              </a-radio>
              <a-radio value="1">
                相对值
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="form.otherAwardType==3 && form.gameMaxNumberType==0" ref="gameMaxNumber" label="固定参与次数" prop="gameMaxNumber">
            <a-input v-model="form.gameMaxNumber" />
          </a-form-model-item>
          <a-form-model-item v-if="form.otherAwardType==3 && form.gameMaxNumberType==1" ref="gameMaxNumberProportion" label="计算比例" prop="gameMaxNumberProportion">
            <a-input v-model="form.gameMaxNumberProportion" />
          </a-form-model-item>

          <a-form-model-item label="任务状态" prop="status">
            <a-radio-group v-model="form.status">
              <a-radio value="1">
                启用
              </a-radio>
              <a-radio value="0">
                禁用
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="初始化任务" prop="isDefault">
            <a-radio-group v-model="form.isDefault">
              <a-radio value="1">
                不是
              </a-radio>
              <a-radio value="2">
                是
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="任务执行方式">
            <a-select v-model="form.executeType" placeholder="请选择">
              <a-select-option value="1">
                提示
              </a-select-option>
              <a-select-option value="2">
                普通链接
              </a-select-option>
              <a-select-option value="3">
                微应用地址
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="jumpPath" v-if="form.executeType!=1" label="任务执行地址" prop="jumpPath">
            <a-input v-model="form.jumpPath" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
            <a-button type="primary" html-type="submit" style="margin-right:10px" @click="goBack">取消</a-button>
            <a-button type="primary" html-type="submit" @click="btnCreateTask" :loading="addLoading">{{type === 'add' ? '创建任务' : '编辑任务'}}</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>

    <!-- 弹框队列开始 -->
      <activity
        :visible.sync="visibleActivity"
        @selectedActive="selectedActivity"
      >
      </activity>
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
import activity from './activity';
import affair from './affair';
import moment from 'moment';
import api from '@/api';
import { getTaskDetail, postAdd, postUpdate } from '@/api/task';
export default {
  components: {
    activity,
    affair
  },
  data() {
    return {
      type: 'add', //add:新增，edit:编辑
      editId: '',
      visibleActivity: false,
      visibleAffair: false,
      selectGame: false,
      addLoading: false,
      form: {
        taskName: '', // 任务名称
        taskDate: [],
        startTime: '', // 任务开始时间
        endTime: '', // 任务结束时间
        isPeriodic: '0', // 任务周期性
        periodic: '', // 任务周期
        executeNum: '', //最大执行次数
        source: '', // 任务来源
        sourceName: '', // 任务来源名称
        memo: '', // 任务描述
        afterTask: '', // 关联任务
        afterTaskName: '', // 关联任务名称
        isSystemAward: '1', // 是否进行邦豆成长值奖励
        awardType: '1', // 邦豆成长值奖励计算方式
        awardIntegral: '', // 邦豆奖励数量=邦豆奖励比例
        awardGrow: '', // 成长值奖励数量=成长值奖励比例
        awardIntegralMax: '', // 邦豆奖励最大值
        awardGrowMax: '', // 成长值奖励最大值
        otherAwardType: '0', // 其他奖励
        otherAwardId: '', // 活动奖励ID
        otherAwardName: '', // 活动名称
        status: '1', // 任务状态
        isDefault: '1', // 初始化任务
        executeType: '1', // 任务执行方式
        jumpPath: '' // 跳转路径
      },
      taskSourceOption: [],
      rules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        periodic: [{ required: true, message: '请输入周期范围', trigger: 'blur' }],
        executeNum: [{ required: true, message: '请输入最大执行次数', trigger: 'blur' }]
        // gameName: [{ required: true, message: '请选择游戏', trigger: 'blur' }],
        // BangDouNumber: [{ required: true, message: '请输入邦豆奖励数量', trigger: 'blur' }],
        // GrowthNumber: [{ required: true, message: '请输入成长值奖励数量', trigger: 'blur' }],
        // BangDouProportion: [{ required: true, message: '请输入邦豆计算比例', trigger: 'blur' }],
        // BangDouMaxNumber: [{ required: true, message: '请输入邦豆奖励最大值', trigger: 'blur' }],
        //ActivityName: [{ required: true, message: '请选择活动', trigger: 'blur' }],
        //giftBagName: [{ required: true, message: '请选择礼包', trigger: 'blur' }],
        //GrowthProportion: [{ required: true, message: '请输入成长值计算比例', trigger: 'blur' }],
        //GrowthMaxNumber: [{ required: true, message: '请输入成长值最大数量', trigger: 'blur' }],
        //gameMaxNumber: [{ required: true, message: '请输入最新数量', trigger: 'blur' }],
        //gameMaxNumberProportion: [{ required: true, message: '请输入计算比例', trigger: 'blur' }]
      }
    };
  },
  watch: {
    'form.otherAwardType'(val) {
      if (val === '0') {
        this.form.otherAwardId = '';
        this.form.otherAwardName = '';
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },

  created() {
    this.getTaskSource();
    this.type = this.$route.query.type;
    if (this.type === 'edit') {
      this.editId = this.$route.query.id;
      this.detial();
    }
  },
  methods: {
    // 打开活动弹窗
    selectActivity() {
      this.visibleActivity = true;
    },
    // 选择活动回调
    selectedActivity(row) {
      this.form.otherAwardId = row[0].id;
      this.form.otherAwardName = row[0].activityName;
    },
    // 打开关联任务
    selectAffair() {
      this.visibleAffair = true;
    },
    // 选择活动回调
    selectedAffair(row) {
      this.form.afterTask = row[0].id;
      this.form.afterTaskName = row[0].taskName;
    },
    // 选择有效期回调
    onChange(time) {
      this.form.startTime = time[0];
      this.form.endTime = time[1];
    },
    // 选择任务来源回调
    handleChange(value) {
      this.form.source = value;
    },
    btnCreateTask(e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const _http = this.type === 'add' ? postAdd : postUpdate;
          this.addLoading = true;
          _http(this.form)
            .then(res => {
              this.$refs.ruleForm.resetFields();
            })
            .finally(i => {
              this.addLoading = false;
            });
        }
      });
    },
    getTaskSource() {
      var self = this;
      let sourceList = [];
      api.getTaskSource().then(res => {
        self.form.source = res.data[0].appCode;
        self.form.sourceName = res.data[0].appName;
        self.taskSourceOption = [].concat(res.data);
      });
    },
    goBack() {
      this.$router.push({ name: 'taskCenter-task' });
    },
    detial() {
      getTaskDetail({ taskId: this.editId }).then(res => {
        // console.log(res);
        this.form = Object.assign(
          res.data,
          {
            taskDate: [moment(res.data.startTime), moment(res.data.endTime)]
          },
          { endTime: moment(res.data.endTime) },
          { startTime: moment(res.data.startTime) },
          { isPeriodic: String(res.data.isPeriodic) },
          { isSystemAward: String(res.data.isSystemAward) },
          { awardType: String(res.data.awardType) },
          { otherAwardType: String(res.data.otherAwardType) },
          { status: String(res.data.status) },
          { isDefault: String(res.data.isDefault) },
          { executeType: String(res.data.executeType) }
          // {
          //   result: `奖励成长值${res.data.awardGrow}, 奖励邦豆: ${Math.floor(res.data.awardIntegral / 100)}邦豆/${
          //     res.data.awardIntegral
          //   }元（向下取整）`
          // }
        );
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
</style>