<template>
  <div class="form-body">
    <a-form :form="formBasic" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="任务名称">
        <a-input v-decorator="rules.taskName" />
      </a-form-item>
      <a-form-item label="有效期">
        <a-range-picker style="width: 100%" v-decorator="rules.taskValidityDate" />
      </a-form-item>
      <a-form-item label="任务描述">
        <a-textarea class="tc-textTarea" v-decorator="rules.memo" />
      </a-form-item>
      <a-form-item label="任务周期性">
        <a-select v-decorator="rules.taskCycleType" placeholder="请选择" @change="changeTaskCycleType">
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
      </a-form-item>
      <a-form-item v-if="formBasic.taskCycleType==1" label="任务周期(天)">
        <a-input v-decorator="rules.cycleRange" />
      </a-form-item>
      <a-form-item v-if="taskCycleType==2" label="最大执行次数">
        <a-input v-decorator="rules.taskMaxNum" />
      </a-form-item>
      <a-form-item label="任务来源">
        <a-select v-decorator="rules.taskSource" placeholder="请选择">
          <a-select-option v-for="(tsItem,tsIdex) in taskSourceOption" :key="tsIdex" :value="tsItem.appName">
            {{tsItem.appName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="任务状态">
        <a-radio-group v-decorator="rules.taskState">
          <a-radio value="1">
            启用
          </a-radio>
          <a-radio value="2">
            禁用
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="任务执行方式">
        <a-select v-decorator="rules.taskExecutionMode" placeholder="请选择" @change="changeTaskExecutionMode">
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
      </a-form-item>
      <a-form-item v-if="taskExecutionMode!=0" label="任务执行地址">
        <a-input v-decorator="rules.taskUrl" />
      </a-form-item>
      <a-form-item label="是否是初始化任务">
        <a-radio-group v-decorator="rules.taskInitialization">
          <a-radio value="1">
            不是
          </a-radio>
          <a-radio value="2">
            是
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="是否进行邦豆成长值奖励">
        <a-radio-group v-decorator="rules.isTaskIntegral" @change="changeIsTaskIntegral">
          <a-radio value="1">
            不是
          </a-radio>
          <a-radio value="2">
            是
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2" label="邦豆成长值奖励计算方式">
        <a-radio-group v-decorator="rules.TaskIntegralType" @change="changeTaskIntegralType">
          <a-radio value="1">
            固定值
          </a-radio>
          <a-radio value="2">
            非固定值
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2&&TaskIntegralType==1" label="邦豆奖励数量">
        <a-input v-decorator="rules.BangDouNumber" />
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2&&TaskIntegralType==1" label="成长值奖励数量">
        <a-input v-decorator="rules.GrowthNumber" />
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2&&TaskIntegralType==2" label="邦豆奖励比例">
        <a-input v-decorator="rules.BangDouProportion" />
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2&&TaskIntegralType==2" label="邦豆奖励最大值">
        <a-input v-decorator="rules.BangDouMaxNumber" />
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2&&TaskIntegralType==2" label="成长值奖励比例">
        <a-input v-decorator="rules.GrowthProportion" />
      </a-form-item>
      <a-form-item v-if="isTaskIntegral==2&&TaskIntegralType==2"  label="成长值奖励最大值">
        <a-input v-decorator="rules.GrowthMaxNumber" />
      </a-form-item>
      <a-form-item label="是否选择其他类型奖励">
        <a-radio-group v-decorator="rules.otherReward" @change="changeOtherReward">
          <a-radio value="0">
            无
          </a-radio>
          <a-radio value="1">
            活动奖励
          </a-radio>
          <!-- <a-radio value="2">
            礼包券
          </a-radio>
          <a-radio value="3">
            抽奖
          </a-radio> -->
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="otherReward==1" label="请选择活动">
        <a-input v-decorator="rules.ActivityName" @click="fn_selectActivity" />
      </a-form-item>
      <a-form-item v-if="otherReward==2" label="请选择礼包">
        <a-input v-decorator="rules.giftBagName" />
      </a-form-item>
      <a-form-item v-if="otherReward==3" label="请选择游戏">
        <a-input v-decorator="rules.gameName"  />
      </a-form-item>
      <a-form-item v-if="otherReward==3" label="抽奖次数计算方式">
        <a-radio-group v-decorator="rules.gameMaxNumberType" @change="changeGameMaxNumberType">
          <a-radio value="0">
            固定值
          </a-radio>
          <a-radio value="1">
            相对值
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="otherReward==3 && gameMaxNumberType==0" label="固定参与次数">
        <a-input v-decorator="rules.gameMaxNumber" />
      </a-form-item>
      <a-form-item v-if="otherReward==3 && gameMaxNumberType==1" label="计算比例">
        <a-input v-decorator="rules.gameMaxNumberProportion" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" style="margin-right:10px">取消</a-button>
        <a-button type="primary" html-type="submit" @click="btnCreateTask">创建任务</a-button>
      </a-form-item>
    </a-form>

    <!-- 弹框队列开始 -->
    <a-modal title="选择活动" :visible="selectActivity" @ok="fn_selectedActive" @cancel="fn_cancelActivity" width="1300px">
      <activity-modal ref="dataRows"></activity-modal>
    </a-modal>
    <!-- 弹框队列结束 -->

  </div>
</template>

<script>
import activityModal from "./activity";
import moment from 'moment';
import api from '@/api';
export default {
  components: {
    activityModal
  },
  data() {
    return {
      selectActivity: false,
      selectGame: false,
      formBasic: this.$form.createForm(this, { name: "formBasic" }),
      taskName: "",
      taskValidityDate: "",
      taskValidityStart: "",
      taskValidityEnd: "",
      taskDescribe: "",
      taskCycleType: "",
      cycleRange: "",//周期范围
      taskMaxNum: "",//最大执行次数
      taskSource: "",
      taskState: "",
      taskExecutionMode: "",
      taskUrl: "",
      taskInitialization: "",
      isTaskIntegral: "",
      TaskIntegralType: "",
      BangDouNumber: "",
      GrowthNumber: "",
      BangDouProportion: "",
      BangDouMaxNumber: "",
      GrowthProportion: "",
      GrowthMaxNumber: "",
      otherReward: "0",
      ActivityName: "",
      ActivityID: "",
      giftBagName: "",
      giftBagID: "",
      gameName: "",
      gameID: "",
      gameMaxNumberType: "0",
      gameMaxNumber: "",
      gameMaxNumberProportion: "",
      taskSourceOption: [],
      rules: {
        taskName:[
        'taskName',{
          rules:[{ required: true, message: '请输入任务名称' }]
        }],
        taskValidityDate:[
          'taskValidityDate',{
            rules:[{ required: true, message: '请选择有效期'}]
        }],
        memo:[
          'memo',{
            rules:[{ required: false}]
        }],
        taskCycleType:[
          'taskCycleType',{
            rules:[{ required: true, message: '请选择任务周期性'}]
        }],
        taskSource:[
          'taskSource',{
            rules:[{ required: true, message: '请选择任务来源'}]
        }],
        taskState:[
          'taskState',{
            initialValue:'1',
            rules:[{ required: true, message: '请选择任务状态'}]
        }],
        taskExecutionMode:[
          'taskExecutionMode',{
            rules:[{ required: true, message: '请选择任务执行方式'}]
        }],
        taskInitialization:[
          'taskInitialization',{
            initialValue:'1',
            rules:[{ required: true, message: '请选择是否是初始化任务'}]
        }],
        isTaskIntegral:[
          'isTaskIntegral',{
            initialValue:'1',
            rules:[{ required: true, message: '请选择是否进行邦豆成长值奖励'}]
        }],
        otherReward:[
          'otherReward',{
            initialValue:'0',
            rules:[{ required: true, message: '请选择是否选择其他类型奖励'}]
        }],
        cycleRange: [
          'cycleRange',{
            rules:[{ required: true, message: '请输入周期范围'}]
        }],
        taskMaxNum: [
          'taskMaxNum',{
            rules:[{ required: true, message: '请输入最大执行次数'}]
        }],
        gameName: [
          'gameName',{
            initialValue:'1',
            rules:[{ required: true, message: '请选择游戏'}]
        }],
        TaskIntegralType:[
          'TaskIntegralType',{
            initialValue:'1',
            rules:[{ required: true, message: '请选择邦豆成长值奖励计算方式'}]
        }],
        BangDouNumber: [
          'BangDouNumber',{
            rules:[{ required: true, message: '请输入邦豆奖励数量'}]
        }],
        GrowthNumber: [
          'GrowthNumber',{
            rules:[{ required: true, message: '请输入成长值奖励数量'}]
        }],
        BangDouProportion: [
          'BangDouProportion',{
            rules:[{ required: true, message: '请输入邦豆计算比例'}]
        }],
        BangDouMaxNumber: [
          'BangDouMaxNumber',{
            rules:[{ required: true, message: '请输入邦豆奖励最大值'}]
        }],
        ActivityName: [
          'ActivityName',{
            rules:[{ required: true, message: '请选择活动'}]
        }],
        giftBagName: [
          'giftBagName',{
            rules:[{ required: true, message: '请选择礼包'}]
        }],
        GrowthProportion: [
          'GrowthProportion',{
            rules:[{ required: true, message: '请输入成长值计算比例'}]
        }],
        GrowthMaxNumber: [
          'GrowthMaxNumber',{
            rules:[{ required: true, message: '请输入成长值最大数量'}]
        }],
        gameMaxNumberType:[
          'gameMaxNumberType',{
            initialValue:'0',
            rules:[{ required: true, message: '请选择抽奖次数计算方式'}]
        }],
        gameMaxNumber: [
          'gameMaxNumber',{
            rules:[{ required: true, message: '请输入最新数量'}]
        }],
        gameMaxNumberProportion: [
          'gameMaxNumberProportion',{
            rules:[{ required: true, message: '请输入计算比例'}]
        }],
      },
    };
  },
  created() {
    this.formBasic.resetFields();
    this.$nextTick(()=>{
      if(this.$route.query.id){
        this.initData(this.$route.query.id);
      }
    })
    this.getTaskSource();
  },
  methods: {
    /****************弹框事件********************/
    // 打开弹窗
    fn_selectActivity(e) {
      e.currentTarget.blur()
      this.selectActivity = true;
      //this.getCouponList();
    },
    fn_cancelActivity() {
      this.selectActivity = false;
    },
    fn_selectedActive() {
      if(this.$refs.dataRows.selectedRows){
        this.formBasic.setFieldsValue({
          ActivityName:this.$refs.dataRows.selectedRows[0].couponTitle
        });
      }
      this.selectActivity = false;
    },
    /****************监听获取值事件********************/
    changeTaskCycleType(type) {
      this.taskCycleType = type;
    },
    changeTaskExecutionMode(e){
      this.taskExecutionMode = e;
    },
    changeIsTaskIntegral(e){
      this.isTaskIntegral = e.target.value;
    },
    changeTaskIntegralType(e){
      this.TaskIntegralType = e.target.value;
    },
    changeOtherReward(e){
      this.otherReward = e.target.value;
    },
    changeGameMaxNumberType(e){
      this.gameMaxNumberType = e.target.value;
    },
    /****************数据请求********************/
    initData(id){
      let this_ = this;
      api.getTaskDetail({ taskId: id }).then(res => {
        this_.formBasic.setFieldsValue({
          taskName:res.data.taskName,
          taskValidityDate:[moment(res.data.createTime).format('YYYY-MM-DD HH:mm:ss'),moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')],
          memo:res.data.memo
        });
        // this.resData = res.data
      });
    },
    btnCreateTask(e) {
      this.formBasic.validateFields((err, values) => {
        if (err) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getTaskSource() {
      var self = this;
      let sourceList = [];
      api
        .getTaskSource()
        .then(res => {
          //self.form.taskSource = res.data[0].appName;
          self.taskSourceOption = [].concat(res.data)
        })
    }
  },
};
</script>
<<<<<<< HEAD
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
=======
>>>>>>> e013f1f50ebb6c4ba6deb9d676c86e5210f53d12
