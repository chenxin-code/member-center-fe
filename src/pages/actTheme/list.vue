<template>
  <div id="list">
    <div class="content-header">活动主题管理</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList routePath="/actTheme/new" ref="actForm" :rowCol="4" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 988, y: scrollY }"
        :rowKey="(r, i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading"
      >
        <template slot="couponTypeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData.couponType)"></span>
          </div>
        </template>
        <template slot="activitySlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData.activity)"></span>
          </div>
        </template>
        <template slot="faceAmountSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData)"></span>
          </div>
        </template>
        <template slot="sourceSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData.source)"></span>
          </div>
        </template>
        <template slot="validitySlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData)"></span>
          </div>
        </template>
        <template slot="couponStatusSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData.couponStatus)"></span>
          </div>
        </template>
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parse(rowData.createTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a @click="$router.push({path: '/actTheme/edit', query: {id: rowData.id}})" style="padding-right: 10px;">编辑</a>
            <a @click="goDel(rowData.id)" style="padding-right: 10px;">删除</a>
            <a @click="">启用</a>
            <!--<a @click="">禁用</a>-->
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
    </div>
  </div>
</template>

<script>
import FormList from './../../components/FormList/index.jsx';
import api from '@/api';
import moment from 'moment';

export default {
  name: 'Manage',
  data() {
    return {
      formList: [
        {
          label: '主题名称',
          type: 'input',
          name: 'couponTitle',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '主题状态',
          type: 'select',
          name: 'couponBusinessType',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '已推送', id: '' },
            { name: '定时推送', id: '' }
          ],
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        },
        {
          type: 'btn-default',
          buttonName: '新建主题',
          htmlType: 'button',
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
          title: '主题名称',
          dataIndex: 'a',
          key: 'a',
          width: 150
        },
        {
          title: '主题状态',
          dataIndex: 'b',
          key: 'b',
          width: 150
        },
        {
          title: '创建用户',
          dataIndex: 'c',
          key: 'c',
          scopedSlots: { customRender: 'c' },
          width: 150
        },
        {
          title: '备注',
          dataIndex: 'd',
          key: 'd',
          scopedSlots: { customRender: 'd' },
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'e',
          key: 'e',
          scopedSlots: { customRender: 'e' },
          width: 150
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
    parse() {
      return '';
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
    goDel(id){},
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
      //this.tableLoading = true;
      this.$nextTick(() => {
        this.tableData = [
          {
            a: '双十一活动',
            b: '启用',
            c: '王川 13900000001',
            d: '...............',
            e: '2020-12-10 22:00:00'
          }
        ]
      });
    }
  },

  activated() {
    console.log('this.$route.meta.isUseCache :>> ', this.$route.meta.isUseCache);
    // isUseCache为false时才重新刷新获取数据
    // 通过这个控制刷新
    if (!this.$route.meta.isUseCache) {
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

    // this.$nextTick(() => {
    //   this.$refs.actForm.setFieldsValue({
    //     couponType: this.formList[0].selectOptions[0].id
    //   });
    //   this.$refs.actForm.setFieldsValue({
    //     couponBusinessType: this.formList[2].selectOptions[0].id
    //   });
    //   this.$refs.actForm.setFieldsValue({
    //     couponStatus: this.formList[4].selectOptions[0].id
    //   });
    // });
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'integralManageDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'integralManageDetail') {
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
