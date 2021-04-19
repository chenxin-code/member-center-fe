<template>
  <div class="form-body">
    <a-form :form="formBasic" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="行为名称">
            <a-input v-decorator="rules.behaviorName"/>
        </a-form-item>
        <a-form-item label="行为来源">
          <a-select v-decorator="rules.behaviorSource" placeholder="请选择">
            <a-select-option value="0">
              一次性任务
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="行为类型">
          <a-select v-decorator="rules.behaviorType" placeholder="请选择">
            <a-select-option value="0">
              一次性任务
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="行为描述">
          <a-textarea placeholder="行为描述限制250个字" v-decorator="rules.behaviorDescribe" :maxLength="250" :rows="4" />
        </a-form-item>
        <a-form-item label="关联的任务">
          <a-button type="primary" @click="fn_selectTask">
            选择
          </a-button>
          <a-table v-if="data.length > 0" :columns="columns" :bordered="true" :pagination="false" :data-source="data">
            <a slot="action" slot-scope="rowdata" href="javascript:;" @click="deleteTask(rowdata)" >删除</a>
          </a-table>
        </a-form-item>
        <a-form-item label='行为状态'>
            <a-radio-group v-decorator="rules.behaviorState">
            <a-radio value="1">
                启用
            </a-radio>
            <a-radio value="2">
                禁用
            </a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
            <a-button type="primary" html-type="submit" style="margin-right:10px">取消</a-button>
            <a-button type="primary" html-type="submit" @click="btnCreateTask">创建行为</a-button>
        </a-form-item>
    </a-form>
    <a-modal title="选择任务" :visible="selectTask" @ok="fn_selectTaskOk" @cancel="fn_selectTaskHide" width="1300px">
      <task-modal ref="dataRows" :resData="data" :taskSourceOption="taskSourceOption"></task-modal>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api';
import moment from 'moment';
import taskModal from './task';
export default {
  components: {
    taskModal
  },
  data() {
    return {
      //表单
      formBasic: this.$form.createForm(this, { name: 'formBasic' }),
      rules: {
        behaviorName: [
          'behaviorName',
          {
            rules: [{ required: true, message: '请输入行为名称' }]
          }
        ],
        behaviorSource: [
          'behaviorSource',
          {
            rules: [{ required: true, message: '请选择行为来源' }]
          }
        ],
        behaviorType: [
          'behaviorType',
          {
            rules: [{ required: true, message: '请选择行为类型' }]
          }
        ],
        behaviorDescribe: [
          'behaviorDescribe',
          {
            rules: [{ required: true, message: '请输入行为描述' }]
          }
        ],
        behaviorState: [
          'behaviorState',
          {
            initialValue: '1',
            rules: [{ required: true, message: '请选择行为状态' }]
          }
        ]
      },
      //表格
      columns: [
        {
          title: '任务名称',
          dataIndex: 'taskName',
          key: 'taskName',
          align: 'center'
        },
        {
          title: '任务描述',
          dataIndex: 'memo',
          key: 'memo',
          align: 'center'
        },
        {
          title: '奖励类型',
          dataIndex: 'taskCondition',
          key: 'taskCondition',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      selectTask: false,
      taskSourceOption: []
    };
  },
  created() {
    this.getTaskSource();
    this.formBasic.resetFields();
    this.$nextTick(() => {
      if (this.$route.query.id) {
        //数据查询
        //this.initData(this.$route.query.id);
      }
    });
  },
  methods: {
    fn_selectTask() {
      this.selectTask = true;
    },
    fn_selectTaskOk() {
      let this_ = this;
      this.data = [];
      if (this.$refs.dataRows.selectedRows) {
        this.$refs.dataRows.selectedRows.forEach(item => {
          this_.data.push(item);
        });
      }
      this.selectTask = false;
    },
    fn_selectTaskHide() {
      this.selectTask = false;
    },
    /****************数据请求********************/
    initData() {
      this.formBasic.setFieldsValue({});
    },
    btnCreateTask() {
      this.formBasic.validateFields((err, values) => {
        if (err) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    deleteTask(resData) {
      let this_ = this;
      this.data.forEach(function(item, index) {
        if (resData.key == item.key) {
          this_.data.splice(index, 1);
        }
      });
    },
    getTaskSource() {
      let sourceList = [];
      api
        .getTaskSource()
        .then(
          res =>
            (sourceList = res.data.map(item => {
              return { id: item.appCode, name: item.appName };
            }))
        )
        .then(() => {
          this.taskSourceOption = [].concat({ id: '', name: '全部' }, sourceList);
        });
    }
  }
};
</script>
<style lang="less">
.form-body {
  padding: 20px 0px;
}
</style>
