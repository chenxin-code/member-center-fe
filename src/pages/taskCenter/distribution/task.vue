<template>
    <div>
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
  data() {
    return {
        scrollY: 300,
        pageSize: 10,
        current: 1,
        total: null,
        tableLoading: false,
        tableDataList: [],
        taskDate: [],
        formList: [
            {
            label: '任务名称',
            type: 'input',
            placeholder: '请输入',
            name: 'taskName'
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
          dataIndex: 'taskName',
          key: 'taskName',
          title: '任务名称'
        },
        {
          title: '有效期',
          key: 'validity',
          dataIndex: 'validity'
        },
      ],
    }
  },
  mounted(){
    this.getTaskList();
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
    // 查询卡券列表
    onSearch(args) {
      console.log(args);
      const { taskName, validity } = args;
      this.taskName = taskName || null;
      this.validity = validity || null;
      this.current = 1;
      this.getTaskList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getTaskList();
    },
    change(){
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
    },  
  }
}
</script>
<style>

</style>