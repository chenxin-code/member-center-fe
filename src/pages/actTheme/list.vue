<template>
  <div id="list">
    <div class="content-header">活动主题管理</div>
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
        <template slot="isEnable" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="isEnableParse(rowData.isEnable)"></span>
          </div>
        </template>
        <template slot="createTime" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(rowData.createTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a @click="$router.push({path: '/actTheme/edit', query: {id: rowData.id}})" style="padding-right: 10px;">编辑</a>
            <a @click="goDel(rowData.id)" style="padding-right: 10px;">删除</a>
            <a @click="OnOff(rowData.id, 0)" v-if="rowData.isEnable === 1">
              启用
            </a>
            <a @click="OnOff(rowData.id, 1)" v-else-if="rowData.isEnable === 0">
              禁用
            </a>
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
  name: 'actTheme',
  data() {
    return {
      formList: [
        {
          label: '主题名称',
          type: 'input',
          name: 'themeName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '主题状态',
          type: 'select',
          name: 'isEnable',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '已启用', id: '0' },
            { name: '已禁用', id: '1' }
          ],
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
          dataIndex: 'themeName',
          key: 'themeName',
          width: 150
        },
        {
          title: '主题状态',
          key: 'isEnable',
          scopedSlots: { customRender: 'isEnable' },
          width: 150
        },
        {
          title: '创建用户',
          dataIndex: 'createUserName',
          key: 'createUserName',
          width: 150
        },
        {
          title: '备注',
          dataIndex: 'memo',
          key: 'memo',
          width: 150
        },
        {
          title: '创建时间',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' },
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
      pageSize: 10,
      searchObj: {},
    };
  },
  components: {
    FormList
  },
  computed: {
    isEnableParse() {
      return param => {
        if(param === 0){
          return '已启用';
        }else if(param === 1){
          return '已禁用';
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
      this.searchObj = params;
      this.current = 1;
      this.getList(true);
    },
    goDel(id){
      this.$confirm({
        title: `删除活动主题`,
        content: `您确定要删除该活动主题吗？`,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          //this.tableLoading = true;
          api.delTheme({id: id}).then(res => {
            if (res.code === 200) {
              this.getList();
            }
          }).finally(() => {
            //this.tableLoading = false;
          });
        }
      });
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
        api.getActThemeList({
          pageSize: this.pageSize,
          pageIndex: this.current,
          themeName: this.searchObj.themeName,
          isEnable: this.searchObj.isEnable
        }).then(res => {
          this.tableLoading = false;
          this.total = res.data.total;
          this.tableData = res.data.records;
        }).finally(() => {
          this.tableLoading = false;
        });
      });
    },
    OnOff(id, isEnable) {
      let str = '';
      if (isEnable === 0) {
        str = '启用';
      } else if (isEnable === 1) {
        str = '禁用';
      } else {
        return;
      }
      this.$confirm({
        title: `${str}活动主题`,
        content: `您确定要${str}该活动主题吗？`,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading = true;
          api.stopTheme({id: id,isEnable: isEnable}).then(res => {
            if (res.code === 200) {
              this.getList();
            }
          }).finally(() => {
            this.tableLoading = false;
          });
        }
      });
    },
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
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
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
