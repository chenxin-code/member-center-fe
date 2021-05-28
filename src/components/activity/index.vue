<template>
  <a-modal title="选择活动" :visible="visible" @ok="selectedActive" @cancel="cancelActivity" width="80%">
    <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
    <a-table 
      :style="{ marginTop: '20px' }" 
      :columns="columns" 
      :data-source="tableDataList" 
      :pagination="false" 
      :loading="tableLoading" 
      :scroll="{ y: scrollY,x: 'calc(700px + 50%)' }" 
      :rowKey="(r, i) => i"
      :row-selection="rowSelection"
    >
      <template slot="statusSlot" slot-scope="rowData">
        <div class="editable-row-operations">
          <span v-html="actStatusStr(rowData.status)"></span>
        </div>
      </template>
      <template slot="validitySlot" slot-scope="rowData">
        <div class="editable-row-operations">
          <span v-html="parseValidityStr(rowData)"></span>
        </div>
      </template>
      <template slot="createTimeSlot" slot-scope="rowData">
        <div class="editable-row-operations">
          <span v-html="momentStr(rowData.createTime)"></span>
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
          label: '活动ID',
          type: 'input',
          name: 'activityId',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动主题',
          type: 'input',
          name: 'themeName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动名称',
          type: 'input',
          name: 'activityName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动类型',
          type: 'select',
          name: 'typeId',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '领券中心', id: 1 },
            { name: '会员权益', id: 2 },
            { name: '邦豆兑换', id: 3 }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动有效期',
          type: 'rangePicker',
          name: 'jointime',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      ],
      columns: [
        {
          title: '活动ID',
          dataIndex: 'id',
          key: 'id',
          width: 200
        },
        {
          title: '活动主题',
          dataIndex: 'themeName',
          key: 'themeName',
          width: 180
        },
        {
          title: '活动名称',
          dataIndex: 'activityName',
          key: 'activityName',
          width: 180
        },
        {
          title: '活动类型',
          dataIndex: 'typeName',
          key: 'typeName',
          width: 120
        },
        {
          title: '活动状态',
          key: 'statusSlot',
          scopedSlots: { customRender: 'statusSlot' },
          width: 100
        },
        {
          title: '活动有效期',
          key: 'validitySlot',
          scopedSlots: { customRender: 'validitySlot' },
          width: 250
        },
        {
          title: '创建用户',
          dataIndex: 'createUserName',
          key: 'createUserName',
          width: 180
        },
        {
          title: '创建时间',
          key: 'createTimeSlot',
          scopedSlots: { customRender: 'createTimeSlot' },
          width: 150
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
    },
    parseValidityStr() {
      return param => {
        return `${this.momentStr(param.startTime)} ～ ${this.momentStr(param.endTime)}`;
      };
    },
    actStatusStr() {
      return param => {
        if (param === 0) {
          return '已创建';
        } else if (param === 1) {
          return '未开始';
        } else if (param === 2) {
          return '进行中';
        } else if (param === 3) {
          return '已结束';
        } else if (param === 4) {
          return '已停用';
        } else if (param === 5) {
          return '已删除';
        } else {
          return '';
        }
      };
    },
    momentStr() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD');
        }
      };
    },
    momentStrHms() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD HH:mm:ss');
        }
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
    showSizeChange(current, size) {
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
        startTime:
          this.searchVal.jointime && this.searchVal.jointime.length
            ? moment(this.searchVal.jointime[0]).format('YYYY-MM-DD')
            : null,
        endTime:
          this.searchVal.jointime && this.searchVal.jointime.length
            ? moment(this.searchVal.jointime[1]).format('YYYY-MM-DD')
            : null,
        jointime: '',
        status: 2
      };

      api
        .getActList(para)
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