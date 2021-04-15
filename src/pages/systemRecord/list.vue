<template>
  <div id="list">
    <div class="content-header">系统运行日志</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList ref="actForm" :rowCol="4" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 988, y: scrollY }"
        :rowKey="(r, i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading">
        <template slot="behavior" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="behaviorParse(rowData.behavior)"></span>
          </div>
        </template>
        <template slot="date" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(rowData.date)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a @click="$router.push({path: '/systemRecord/detail', query: {id: rowData.id}})">查看详情</a>
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
        style="margin-top: 30px;width: 100%;text-align: right;"
      />
    </div>
  </div>
</template>

<script>
import FormList from './../../components/FormList/index.jsx';
import api from './../../api';
import moment from 'moment';
export default {
  name: 'systemRecord',
  data() {
    return {
      formList: [
        {
          label: '行为名称',
          type: 'select',
          name: 'behavior',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '邦豆充值异常', id: '1' },
            { name: '成长值发放异常', id: '2' },
            { name: '优惠券派发异常', id: '3' },
            { name: '手机号修改异常', id: '4' },
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '会员手机号',
          type: 'input',
          name: 'memberPhone',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '会员ID',
          type: 'input',
          name: 'memberId',
          placeholder: '请输入',
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
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: '行为名称',
          key: 'behavior',
          scopedSlots: { customRender: 'behavior' },
          width: 150
        },
        {
          title: '记录时间',
          key: 'date',
          scopedSlots: { customRender: 'date' },
          width: 150
        },
        {
          title: '会员ID',
          dataIndex: 'memberId',
          key: 'memberId',
          width: 150
        },
        {
          title: '会员手机号',
          dataIndex: 'memberPhone',
          key: 'memberPhone',
          width: 150
        },
        {
          title: '异常是否解决',
          dataIndex: 'type',
          key: 'type',
          width: 150,
          customRender: text => (text === 1 ? '已解决' : '未解决')
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: { customRender: 'detailsSlot' },
          fixed: 'right',
          width: 200
        }
      ],
      tableData: [],
      tableLoading: false,
      //分页
      total: 0,
      current: 1,
      pageSize: 10
    };
  },
  components: {
    FormList
  },
  computed: {
    behaviorParse() {
      return param => {
        if(param == '1'){
          return '邦豆充值异常';
        }else if(param == '2'){
          return '成长值发放异常';
        }else if(param == '3'){
          return '优惠券派发异常';
        }else if(param == '4'){
          return '手机号修改异常';
        }else{
          return '';
        }
      }
    },
    momentStrHms() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD HH:mm:ss');
        }
      };
    },
  },
  created() {},
  mounted() {
    const timer1 = setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 275 + 'px';
    }, 0);
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(timer1);
    });
  },
  methods: {
    onQuery(params) {
      this.current = 1;
      this.getList(true);
    },
    change(page) {
      this.current = page;
      this.getList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getList();
    },
    getList(isQuery = false) {
      if (isQuery) {
        this.current = 1;
      }
      this.tableLoading = true;
      this.$nextTick(() => {
        let behavior = null,memberPhone = null,memberId = null;
        if (this.$refs.actForm.getFieldsValue().behavior) {
          behavior = this.$refs.actForm.getFieldsValue().behavior;
        }
        if (this.$refs.actForm.getFieldsValue().memberPhone) {
          memberPhone = this.$refs.actForm.getFieldsValue().memberPhone;
        }
        if (this.$refs.actForm.getFieldsValue().memberId) {
          memberId = this.$refs.actForm.getFieldsValue().memberId;
        }
        api.systemRecord({
          pageSize: this.pageSize,
          pageIndex: this.current,
          behavior: behavior,
          memberPhone: memberPhone,
          memberId: memberId
        }).then(res => {
          this.tableLoading = false;
          this.total = res.data.total;
          this.tableData = res.data.records;
        }).finally(() => {
          this.tableLoading = false;
        });
      });
    }
  },
  activated() {
    console.log('this.$route.meta.isUseCache :>> ', this.$route.meta.isUseCache);
    // isUseCache为false时才重新刷新获取数据
    // 通过这个控制刷新
    if (!this.$route.meta.isUseCache) {
      this.$nextTick(() => {
        this.$refs.actForm.setFieldsValue({
          behavior: this.formList[0].selectOptions[0].id
        });
      });
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.$refs.actForm.form.resetFields();
      //初始化加载数据
      this.getList();
    }
    //重置
    this.$route.meta.isUseCache = false;
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'systemRecordDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'systemRecordDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  watch: {}
};
</script>

<style lang="less" scoped>
#list {
  height: 100%;
  overflow: hidden;

  .content-main {
    ::v-deep .ant-btn {
      width: 98px !important;
    }

    ::v-deep .ant-input-number {
      width: 100%;
    }

    ::v-deep .ant-form > .ant-row > .ant-col {
      width: 30% !important;
    }
    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(4) {
      width: 10% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(7) {
      width: 40% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
