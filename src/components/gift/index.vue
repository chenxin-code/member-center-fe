<template>
  <a-modal title="选择礼包" :visible="visible" @ok="selectedActive" @cancel="cancelActivity" width="80%">
    <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
    <a-table 
      :style="{ marginTop: '20px' }" 
      :columns="columns" 
      :data-source="tableDataList" 
      :pagination="false" 
      :loading="tableLoading" 
      :scroll="{ y: scrollY }" 
      :rowKey="(r, i) => i"
      :row-selection="rowSelection"
    >
    <template slot="validitySlot" slot-scope="scope">
      <div class="editable-row-operations">
        <span v-html="parseValidityStr(scope)"></span>
      </div>
    </template>
    <template slot="status" slot-scope="scope">
      <div class="editable-row-operations">
        <span>{{['禁用','启用'][scope.status || 0]}}</span>
      </div>
    </template>
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
          label: '礼包名称',
          type: 'input',
          name: 'name',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'cjsj',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      columns: [
        {
          title: '礼包名称',
          dataIndex: 'name',
          key: 'name',
          width: 180
        },
        {
          title: '状态',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: 120
        },
        {
          title: '有效期',
          key: 'validitySlot',
          scopedSlots: { customRender: 'validitySlot' },
          width: 250
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
    momentStr() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD');
        }
      };
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows;
        },
        type: 'radio'
      };
    },
    parseValidityStr() {
      return param => {
        return `${this.momentStr(param.startTime)} ～ ${this.momentStr(param.endTime)}`;
      };
    }
  },
  created() {
    this.getCouponList();
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
    showSizeChange(size) {
      this.current = 1;
      this.pageSize = size;
      this.getCouponList();
    },
    // 获取活动列表api
    getCouponList() {
      this.tableLoading = true;
      const para = {
        pageIndex: this.current, //起始页
        pageSize: this.pageSize, //每页展示条数
        ...this.searchVal,
        status: 1
      };

      api
        .selectGiftBagList(para)
        .finally(() => {
          this.tableLoading = false;
        })
        .then(res => {
          this.tableLoading = false;
          this.tableDataList = res.data.records;
          this.total = res.data.total;
        });
    }
  }
};
</script>