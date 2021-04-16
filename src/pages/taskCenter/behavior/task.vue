<template>
    <div>
    <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
      <a-table :style="{ marginTop: '20px' }" :row-selection="{ selectedRowKeys: selectedRowKeys,selectedRows: selectedRows, onChange: rowSelection }" :columns="columns" :data-source="tableDataList" :loading="tableLoading" :scroll="{ y: scrollY }">
      </a-table>
    </div>
</template>
<script>
import { typeList, activityList } from '@/pages/coupons/release/createForms';
import FilterForm from '@/components/FormList/index.jsx';
import api from '@/api';
import moment from 'moment';
export default {
  name: "taskList",
  components: {
    FilterForm
  },
  props:{
    taskSourceOption:{   
        type: Array,
        default: []
    },
    resData:{
      type: Array,
      default: []
    }
  },
  data() {
    return {
        scrollY: 300,
        pageSize: 10000,
        current: 1,
        total: null,
        tableLoading: false,
        tableDataList: [],
        taskDate: [],
        formList: [
            {
            label: '任务KEY',
            type: 'input',
            placeholder: '请输入',
            name: 'taskKey'
            },
            {
            label: '任务名称',
            type: 'input',
            placeholder: '请输入',
            name: 'taskName'
            },
            {
            label: '状态',
            placeholder: '请输入',
            name: 'statusOption',
            type: 'select',
            placeholder: '全部',
            selectOptions: [
              { id: '', name: '全部' },
              { id: '0', name: '禁用' },
              { id: '1', name: '启用' }],
            },
            {
            label: '任务来源',
            placeholder: '请输入',
            name: 'taskSourceOption',
            type: 'select',
            placeholder: '全部',
            selectOptions: this.taskSourceOption,
            },
            {
            label: '创建时间',
            type: 'rangePicker',
            name: 'taskDate'
            },
            {
            type: 'button',
            buttonName: '查询',
            htmlType: 'submit',
            align: 'left',
            }
        ],
        columns: [
        {
          dataIndex: 'taskKey',
          key: 'id',
          title: '任务Key'
        },
        {
          title: '任务名称',
          key: 'taskName',
          dataIndex: 'taskName'
        },
        {
          title: '任务有效期(天)',
          key: 'validity',
          dataIndex: 'validity'
        },
        {
          title: '是否周期性',
          key: 'isPeriodic',
          dataIndex: 'isPeriodic',
          customRender: text => (text === 1 ? '是' : '否')
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          customRender: text => (text === 1 ? '是' : '否')
        },
        {
          title: '对应行为',
          key: 'behaviourName',
          dataIndex: 'behaviourName'
        },
        {
          title: '任务来源',
          key: 'sourceName',
          dataIndex: 'sourceName'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm')
        },
      ],
      selectedRows:[],
      selectedRowKeys:[],
    }
  },
  mounted(){
    console.log(this.taskSourceOption)
    this.getTaskList();
  },
  methods: {
    rowSelection(selectedRowKeys,selectedRows) {
      this.selectedRows = selectedRows;
      this.selectedRowKeys = selectedRowKeys;
    },
    // 查询卡券列表
    onSearch(args) {
      let this_ = this;
      setTimeout(() => {
        console.log(this_.selectedRowKeys)
      this_.selectedRowKeys = [];
    }, 1000);
      console.log(args);
      const { taskName, validity } = args;
      this.taskName = taskName || null;
      this.validity = validity || null;
      this.current = 1;
      this.getTaskList();
    },
    // 获取卡券列表
    getTaskList() {
      this.tableLoading = true;
      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        createTimeStart: this.taskDate.length ? moment(this.taskDate[0]).format('YYYY-MM-DD') : null,
        createTimeEnd: this.taskDate.length ? moment(this.taskDate[1]).format('YYYY-MM-DD') : null,
        taskName: this.taskName,
      };
      let this_ = this;
      api
        .getTaskList(args)
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
    }
  }
}
</script>
<style>

</style>