<template>
  <a-modal title="选择任务" :visible="visible" @ok="selectedActive" @cancel="cancelActivity" width="80%">
    <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
    <a-table 
      :style="{ marginTop: '20px' }" 
      :columns="columns" 
      :data-source="tableDataList" 
      :pagination="false" 
      :loading="tableLoading" 
      :scroll="{ y: scrollY }" 
      :rowKey="(r, i) => r.id"
      :row-selection="rowSelection"
    >
    </a-table>
    <a-pagination 
      :total="total" 
      :show-total="total => `共 ${total} 条`" 
      show-quick-jumper 
      show-size-changer 
      :current="current" 
      :pageSize="pageSize"
      :pageSizeOptions="['10', '20', '30', '40', '50', '100']" 
      @change="change" 
      @showSizeChange="showSizeChange" 
      style="margin-top:30px;width:100%;text-align: right;" 
    />
  </a-modal>
</template>
<script>
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
import { getTaskList, postUpdateStatus } from '@/api/task';
import api from '@/api';
export default {
  name: 'modalTable',
  components: {
    FilterForm
  },
  data() {
    return {
      scrollY: 300,
      selectedRows: [],
      formList: [
        {
          label: '任务名称',
          type: 'input',
          name: 'taskName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '任务键',
          type: 'input',
          name: 'taskKey',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        // {
        //   label: '任务状态',
        //   type: 'select',
        //   name: 'status',
        //   placeholder: '请输入',
        //   labelCol: { span: 6 },
        //   wrapperCol: { span: 18 },
        //   selectOptions: [{ id: '', name: '全部' }, { id: '0', name: '禁用' }, { id: '1', name: '启用' }]
        // },
        {
          label: '任务来源',
          type: 'select',
          name: 'taskSource',
          placeholder: '请选择',
          selectOptions: [],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'jointime',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      ],
      columns: [
        {
          dataIndex: 'taskKey',
          key: 'id',
          title: '任务key'
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
          customRender: text => (text === 0 ? '禁用' : '启用')
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
        }
      ],
      total: 0,
      pageSize: 10,
      current: 1,
      tableDataList: [],
      tableLoading: false,
      searchVal: {}
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows;
        },
        type: 'radio'
      };
    }
  },
  watch: {
    visible(e) {
      if (e) {
        this.$nextTick(function() {
          this.$refs.form.form.resetFields();
        });
        this.current = 1;
        this.pageSize = 10;
        this.searchVal = {};
        this.getTaskSource();
        this.getCouponList();
      }
    }
  },
  methods: {
    cancelActivity() {
      this.$emit('update:visible', false);
    },
    selectedActive() {
      this.$emit('update:visible', false);
      this.$emit('selectedActive', this.selectedRows);
    },
    // 查询活动列表
    onSearch(args) {
      this.searchVal = args;
      this.current = 1;
      this.getCouponList();
    },
    change(page) {
      this.current = page;
      this.getCouponList();
    },
    showSizeChange(current, pageSize) {
      this.current = 1;
      this.pageSize = pageSize;
      this.getCouponList();
    },
    // 获取活动列表api
    getCouponList() {
      this.tableLoading = true;
      const para = {
        pageIndex: this.current, //起始页
        pageSize: this.pageSize, //每页展示条数
        ...this.searchVal,
        createTimeStart:
          this.searchVal.jointime && this.searchVal.jointime.length
            ? moment(this.searchVal.jointime[0]).format('YYYY-MM-DD')
            : null,
        createTimeEnd:
          this.searchVal.jointime && this.searchVal.jointime.length
            ? moment(this.searchVal.jointime[1]).format('YYYY-MM-DD')
            : null,
        jointime: '',
        status: 1
      };

      getTaskList(para)
        .finally(() => {
          this.tableLoading = false;
        })
        .then(res => {
          this.tableLoading = false;
          this.tableDataList = res.data.records;
          this.total = res.data.total;
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
          this.$set(
            this.formList,
            3,
            Object.assign(this.formList[3], { selectOptions: [].concat({ id: '', name: '全部' }, sourceList) })
          );
        });
    }
  }
};
</script>