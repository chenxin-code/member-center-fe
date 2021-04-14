<template>
  <div id="list">
    <div class="content-header">活动参与数据</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList routePath="/actTheme/add" ref="actForm" :rowCol="4" :formList="formList" :onSubmit="onQuery" />
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
        <template slot="typeId" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parseTypeId(rowData.typeId)"></span>
          </div>
        </template>
        <template slot="status" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parseStatus(rowData.status)"></span>
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
export default {
  name: 'actJoin',
  data() {
    return {
      formList: [
        {
          label: '活动id',
          type: 'input',
          name: 'id',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动主题',
          type: 'input',
          name: 'activityName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动名称',
          type: 'input',
          name: 'themeName',
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
        },
        {
          label: '活动类型',
          type: 'select',
          name: 'typeId',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '领券中心', id: '1' },
            { name: '会员权益', id: '2' },
            { name: '邦豆兑换', id: '3' }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动状态',
          type: 'select',
          name: 'status',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '已创建', id: '0' },
            { name: '未开始', id: '1' },
            { name: '进行中', id: '2' },
            { name: '已结束', id: '3' },
            { name: '已停用', id: '4' },
            { name: '已删除', id: '5' }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      ],
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: '活动id',
          dataIndex: 'id',
          key: 'id',
          width: 150
        },
        {
          title: '活动主题',
          dataIndex: 'activityName',
          key: 'activityName',
          width: 150
        },
        {
          title: '活动名称',
          dataIndex: 'themeName',
          key: 'themeName',
          width: 150
        },
        {
          title: '活动类型',
          key: 'typeId',
          scopedSlots: { customRender: 'typeId' },
          width: 150
        },
        {
          title: '活动状态',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: 150
        },
        {
          title: '参与人数',
          dataIndex: 'peopleTime',
          key: 'peopleTime',
          width: 150
        },
        {
          title: '参与次数',
          dataIndex: 'time',
          key: 'time',
          width: 150
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
    //1:领券中心,2:会员权益,3:邦豆兑换
    parseTypeId() {
      return param => {
        if(param === 1){
          return '领券中心';
        }else if(param === 2){
          return '会员权益';
        }else if(param === 3){
          return '邦豆兑换';
        }else{
          return '';
        }
      }
    },
    //0已创建，1未开始，2进行中，3已结束，4已停用，5已删除
    parseStatus() {
      return param => {
        if(param === 0){
          return '已创建';
        }else if(param === 1){
          return '未开始';
        }else if(param === 2){
          return '进行中';
        }else if(param === 3){
          return '已结束';
        }else if(param === 4){
          return '已停用';
        }else if(param === 5){
          return '已删除';
        }else{
          return '';
        }
      }
    }
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
        let id = null,themeName = null,activityName = null,typeId = null,status = null;
        if (this.$refs.actForm.getFieldsValue().id) {
          id = this.$refs.actForm.getFieldsValue().id;
        }
        if (this.$refs.actForm.getFieldsValue().themeName) {
          themeName = this.$refs.actForm.getFieldsValue().themeName;
        }
        if (this.$refs.actForm.getFieldsValue().activityName) {
          activityName = this.$refs.actForm.getFieldsValue().activityName;
        }
        if (this.$refs.actForm.getFieldsValue().typeId) {
          typeId = this.$refs.actForm.getFieldsValue().typeId;
        }
        if (this.$refs.actForm.getFieldsValue().status) {
          status = this.$refs.actForm.getFieldsValue().status;
        }
        api.getActJoinList({
          pageSize: this.pageSize,
          pageIndex: this.current,
          id: id,
          themeName: themeName,
          activityName: activityName,
          typeId: typeId,
          status: status
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
          typeId: this.formList[4].selectOptions[0].id
        });
        this.$refs.actForm.setFieldsValue({
          status: this.formList[5].selectOptions[0].id
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
    if (from.name === 'xxxxxxxxx') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'xxxxxxxxx') {
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
