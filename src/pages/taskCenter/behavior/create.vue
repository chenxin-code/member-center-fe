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
    <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
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
        <a-select v-model="form.taskCycleType" placeholder="请选择">
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
      <a-form-model-item v-if="form.taskCycleType==1" ref="cycleRange" label="任务周期" prop="cycleRange">
        <a-input v-model="form.cycleRange" />
      </a-form-model-item>
      <a-form-model-item v-if="form.taskCycleType==2" ref="taskMaxNum" label="最大执行次数" prop="taskMaxNum">
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
        <a-select v-model="form.taskExecutionMode" placeholder="请选择">
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
      <a-form-model-item ref="taskUrl" v-if="form.taskExecutionMode!=0" label="任务执行地址" prop="taskUrl">
        <a-input v-model="form.taskUrl" />
      </a-form-model-item>
      <a-form-model-item label="是否是初始化任务" prop="taskInitialization">
        <a-radio-group v-model="form.taskInitialization">
          <a-radio value="1">
            不是
          </a-radio>
          <a-radio value="2">
            是
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="是否进行邦豆成长值奖励" prop="isTaskIntegral">
        <a-radio-group v-model="form.isTaskIntegral">
          <a-radio value="1">
            不是
          </a-radio>
          <a-radio value="2">
            是
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2" label="邦豆成长值奖励计算方式" prop="TaskIntegralType">
        <a-radio-group v-model="form.TaskIntegralType">
          <a-radio value="1">
            固定值
          </a-radio>
          <a-radio value="2">
            非固定值
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2&&form.TaskIntegralType==1" ref="BangDouNumber" label="邦豆奖励数量" prop="BangDouNumber">
        <a-input v-model="form.BangDouNumber" />
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2&&form.TaskIntegralType==1" ref="GrowthNumber" label="成长值奖励数量" prop="GrowthNumber">
        <a-input v-model="form.GrowthNumber" />
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2&&form.TaskIntegralType==2" ref="BangDouProportion" label="邦豆奖励比例" prop="BangDouProportion">
        <a-input v-model="form.BangDouProportion" />
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2&&form.TaskIntegralType==2" ref="BangDouMaxNumber" label="邦豆奖励最大值" prop="BangDouMaxNumber">
        <a-input v-model="form.BangDouMaxNumber" />
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2&&form.TaskIntegralType==2" ref="GrowthProportion" label="成长值奖励比例" prop="GrowthProportion">
        <a-input v-model="form.GrowthProportion" />
      </a-form-model-item>
      <a-form-model-item v-if="form.isTaskIntegral==2&&form.TaskIntegralType==2" ref="GrowthMaxNumber" label="成长值奖励最大值" prop="GrowthMaxNumber">
        <a-input v-model="form.GrowthMaxNumber" />
      </a-form-model-item>
      <a-form-model-item label="是否选择其他类型奖励" prop="TaskIntegralType">
        <a-radio-group v-model="form.otherReward">
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
      <a-form-model-item v-if="form.otherReward==1" ref="ActivityName" label="请选择活动" prop="ActivityName">
        <a-input v-model="form.ActivityName" @click="fn_selectActivity" />
      </a-form-model-item>
      <a-form-model-item v-if="form.otherReward==2" ref="giftBagName" label="请选择礼包" prop="giftBagName">
        <a-input v-model="form.giftBagName" />
      </a-form-model-item>
      <a-form-model-item v-if="form.otherReward==3" ref="gameName" label="请选择游戏" prop="gameName">
        <a-input v-model="form.gameName" @click="fn_selectGame" />
      </a-form-model-item>
      <a-form-model-item v-if="form.otherReward==3" ref="gameMaxNumberType" label="抽奖次数计算方式" prop="gameMaxNumberType">
        <a-radio-group v-model="form.gameMaxNumberType">
          <a-radio value="0">
            固定值
          </a-radio>
          <a-radio value="1">
            相对值
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item v-if="form.otherReward==3 && form.gameMaxNumberType==0" ref="gameMaxNumber" label="固定参与次数" prop="gameMaxNumber">
        <a-input v-model="form.gameMaxNumber" />
      </a-form-model-item>
      <a-form-model-item v-if="form.otherReward==3 && form.gameMaxNumberType==1" ref="gameMaxNumberProportion" label="计算比例" prop="gameMaxNumberProportion">
        <a-input v-model="form.gameMaxNumberProportion" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" style="margin-right:10px">取消</a-button>
        <a-button type="primary" html-type="submit" @click="btnCreateTask">创建任务</a-button>
      </a-form-model-item>
    </a-form-model>

    <!-- 弹框队列开始 -->
    <a-modal title="选择活动" :visible="selectActivity" @ok="fn_selectedActive" @cancel="fn_cancelActivity" width="1300px">
      <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
      <a-table :style="{ marginTop: '20px' }" :columns="columns" :data-source="tableDataList" :pagination="false" :loading="tableLoading" :scroll="{ y: scrollY }" :row-selection="rowSelection">
        <template slot="faceAmountSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="faceAmountStr(rowData)"></span>
          </div>
        </template>
        <span slot="action" slot-scope="record">
          <a @click="onCheck(record)">查看</a>
        </span>
      </a-table>
      <a-pagination :total="total" :show-total="total => `共 ${total} 条`" show-quick-jumper show-size-changer v-model="current" :current="current" :pageSize="pageSize"
        :pageSizeOptions="['10', '20', '30', '40', '50', '100']" @change="change" @showSizeChange="showSizeChange" style="margin-top:30px;width:100%;text-align: right;" />
    </a-modal>
    <!-- 弹框队列结束 -->

  </div>
</template>

<script>
import { couponsCenterList, bangdouList, cardList, level, typeList, activityList } from '@/pages/coupons/release/createForms';
import FilterForm from '@/components/FormList/index.jsx';
import moment from 'moment';
import api from '@/api';
export default {
  components: {
    FilterForm
  },
  data() {
    return {
      //弹框变量--开始
      scrollY: 300,
      pageSize: 10,
      current: 1,
      total: null,
      tableLoading: false,
      tableDataList: [],
      //弹框变量--结束
      selectActivity: false,
      selectGame: false,
      form: {
        taskName: "",
        taskValidityDate: "",
        taskValidityStart: "",
        taskValidityEnd: "",
        taskDescribe: "",
        taskCycleType: "0",
        cycleRange: "",//周期范围
        taskMaxNum: "",//最大执行次数
        taskSource: "",
        taskState: "1",
        taskExecutionMode: "0",
        taskUrl: "",
        taskInitialization: "1",
        isTaskIntegral: "1",
        TaskIntegralType: "1",
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
        gameMaxNumberProportion: ""
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
        gameName: [
          { required: true, message: '请选择游戏', trigger: 'blur' }
        ],
        BangDouNumber: [
          { required: true, message: '请输入邦豆奖励数量', trigger: 'blur' }
        ],
        GrowthNumber: [
          { required: true, message: '请输入成长值奖励数量', trigger: 'blur' }
        ],
        BangDouProportion: [
          { required: true, message: '请输入邦豆计算比例', trigger: 'blur' }
        ],
        BangDouMaxNumber: [
          { required: true, message: '请输入邦豆奖励最大值', trigger: 'blur' }
        ],
        ActivityName: [
          { required: true, message: '请选择活动', trigger: 'blur' }
        ],
        giftBagName: [
          { required: true, message: '请选择礼包', trigger: 'blur' }
        ],
        GrowthProportion: [
          { required: true, message: '请输入成长值计算比例', trigger: 'blur' }
        ],
        GrowthMaxNumber: [
          { required: true, message: '请输入成长值最大数量', trigger: 'blur' }
        ],
        gameMaxNumber: [
          { required: true, message: '请输入最新数量', trigger: 'blur' }
        ],
        gameMaxNumberProportion: [
          { required: true, message: '请输入计算比例', trigger: 'blur' }
        ],
      },
      formList: [
        {
          label: '卡券ID',
          type: 'input',
          placeholder: '请输入',
          name: 'newid'
        },
        {
          label: '卡券类型',
          name: 'type',
          type: 'select',
          placeholder: '全部',
          selectOptions: typeList
        },
        {
          label: '卡券标题',
          type: 'input',
          placeholder: '请输入',
          name: 'title'
        },
        {
          label: '卡券业务类型',
          type: 'select',
          placeholder: '全部',
          name: 'activity',
          selectOptions: activityList,
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        }
      ],
      columns: [
        {
          dataIndex: 'id',
          key: 'id',
          title: '卡券ID'
        },
        {
          title: '卡券标题',
          key: 'couponTitle',
          dataIndex: 'couponTitle'
        },
        // {
        //     title: '卡券副标题',
        //     key: 'couponSubhead',
        //     dataIndex: 'couponSubhead'
        // },
        {
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => typeList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券业务类',
          key: 'activity',
          dataIndex: 'activity',
          customRender: text => activityList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: { customRender: 'faceAmountSlot' }
        },
        {
          title: '操作人员',
          key: 'operator',
          dataIndex: 'operator'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      ],
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },
  created() {
    this.getTaskSource();
  },
  computed: {
    faceAmountStr() {
      return param => {
        if (param.couponType === 10) {
          return param.faceAmount;
        } else if (param.couponType === 20) {
          return param.faceAmount;
        } else if (param.couponType === 40) {
          return param.discountRatio * 10 + '折';
        } else {
          return '';
        }
      };
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRows = selectedRows;
        },
        type: 'radio'
      };
    }
  },
  methods: {
    // 打开弹窗
    fn_selectActivity() {
      this.selectActivity = true;
      this.getCouponList();
    },
    fn_cancelActivity() {
      this.selectActivity = false;
    },
    fn_selectedActive() {
      this.selectActivity = false;
    },
    // 查询卡券列表
    onSearch(args) {
      console.log(args);
      const { newid, activity, title, type } = args;
      this.newid = parseInt(newid) || null;
      this.activity = activity || null;
      this.title = title || null;
      this.type = type || null;
      this.current = 1;
      this.getCouponList();
    },
    change(page) {
      this.current = page;
      this.getCouponList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getCouponList();
    },
    // 获取卡券列表
    getCouponList() {
      this.tableLoading = true;
      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        id: this.newid,
        activity: this.activity,
        type: this.type,
        title: this.title,
        //status: 99
      };
      api
        .getCouponList(args)
        .then(res => {
          console.log(res);
          this.tableLoading = false;
          this.tableDataList = res.data.records.map((item, index) => {
            return {
              ...item,
              key: index
            };
          });
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    onChange(time) {
      console.log(time);
    },
    btnCreateTask(e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
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
