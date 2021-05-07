<template>
  <div id="act-list">
    <div class="content-header">节日礼包</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList routePath="/giftH/add" ref="thisForm" :rowCol="4" :formList="formList" :onSubmit="onQuery"/>
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 958, y: scrollY }"
        :rowKey="(r, i) => i"
        style="width: 100%;margin-top: 8px;"
        :selectable="false"
        :loading="tableLoading">
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
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a style="padding-right: 10px;" @click="goActDetail(rowData.id)">查看</a>
            <a style="padding-right: 10px;" @click="updateActStatus(rowData.id, 0)">启用</a>
            <!--<a style="padding-right: 10px;" @click="updateActStatus(rowData.id, 1)">禁用</a>-->
            <a style="padding-right: 10px;" @click="goActEdit(rowData.id)">编辑</a>
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
        style="margin-top:30px;width:100%;text-align: right;"/>
    </div>
  </div>
</template>

<script>
import FormList from './../../components/FormList/index.jsx';
import api from './../../api';
import moment from 'moment';
export default {
  name: 'giftH',
  components: {FormList},
  data() {
    return {
      formList: [
        {
          label: '节日礼包名称',
          type: 'input',
          name: 'lbmc',
          placeholder: '请输入',
          labelCol: {span: 6},
          wrapperCol: {span: 18}
        },
        {
          label: '状态',
          type: 'select',
          name: 'zt',
          placeholder: '请选择',
          selectOptions: [
            {name: '全部', id: ''},
            {name: '启用', id: 1},
            {name: '禁用', id: 2}
          ],
          labelCol: {span: 6},
          wrapperCol: {span: 18}
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'cjsj',
          labelCol: {span: 6},
          wrapperCol: {span: 18}
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: {span: 0},
          wrapperCol: {span: 24}
        },
        {},
        {},
        {},
        {
          type: 'btn-default',
          buttonName: '创建节日礼包',
          htmlType: 'button',
          align: 'right',
          labelCol: {span: 0},
          wrapperCol: {span: 24}
        }
      ],
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: '节日礼包名称',
          dataIndex: 'lbmc',
          key: 'lbmc',
          width: 180
        },
        {
          title: '状态',
          dataIndex: 'zt',
          key: 'zt',
          width: 120
        },
        {
          title: '派发时间',
          key: 'validitySlot',
          scopedSlots: {customRender: 'validitySlot'},
          width: 250
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: {customRender: 'detailsSlot'},
          fixed: 'right',
          width: 180
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
    momentStrHms() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD HH:mm:ss');
        }
      };
    },
    parseValidityStr() {
      return param => {
        return `${this.momentStr(param.startTime)} ～ ${this.momentStr(param.endTime)}`;
      };
    }
  },
  created() {
  },
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
    goActDetail(id) {
      this.$router.push({
        name: 'actManageDetail',
        query: {
          id: id
        }
      });
    },
    goActEdit(id) {
      this.$router.push({
        name: 'actManageEdit',
        query: {
          id: id
        }
      });
    },
    updateActStatus(paramId, state) {
      let title;
      let content;
      if (state === 0) {
        title = '确认启用当前活动？';
        content = '';
      } else if (state === 1) {
        title = '确认禁用当前活动？';
        content = '活动禁用后用户无法继续参加';
      } else {
        title = '';
        content = '';
      }
      this.$confirm({
        title: title,
        content: content,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading = true;
          api.updateActStatus({
            id: paramId,
            isEnable: state
          }).then(res => {
            if (res.code === 200) {
              this.getList();
            }
          }).finally(() => {
            this.tableLoading = false;
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
        let lbmc = '';
        let zt = '';
        if (this.$refs.thisForm.getFieldsValue().lbmc) {
          lbmc = this.$refs.thisForm.getFieldsValue().lbmc;
        }
        if (this.$refs.thisForm.getFieldsValue().zt) {
          zt = this.$refs.thisForm.getFieldsValue().zt;
        }
        let jointimeStart = '';
        let jointimeEnd = '';
        if (
          Object.prototype.toString.call(this.$refs.thisForm.getFieldsValue().jointime) === '[object Array]' &&
          this.$refs.thisForm.getFieldsValue().jointime.length > 1
        ) {
          jointimeStart = moment(this.$refs.thisForm.getFieldsValue().jointime[0]).format('YYYY-MM-DD');
          jointimeEnd = moment(this.$refs.thisForm.getFieldsValue().jointime[1]).format('YYYY-MM-DD');
        }
        return api.dasdsadsadasdasd({
          lbmc: lbmc,
          zt: zt,
          pageIndex: this.current,
          pageSize: this.pageSize,
          startTime: jointimeStart,
          endTime: jointimeEnd
        }).then(res => {
          if (res.code === 200) {
            this.total = res.data.total;
            this.tableData.splice(0, this.tableData.length);
            res.data.records.forEach((element, index) => {
              this.tableData.push(element);
            });
          }
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
        this.$refs.thisForm.setFieldsValue({
          zt: this.formList[1].selectOptions[0].id
        });
      });
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.$refs.thisForm.form.resetFields();
      //初始化加载数据
      this.getList();
    }
    //重置data
    this.$route.meta.isUseCache = false;
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'xxxxxxxxxxx') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'xxxxxxxxxxx') {
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
#act-list {
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
      width: 27.5% !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(4) {
      width: 10% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(8) {
      width: 10% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(3) {
      width: 35% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(7) {
      width: 35% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
