<template>
  <div id="act-list">
    <div class="content-header">节日礼包管理</div>
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
        <template slot="generalSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="parseGeneral(scope.general)"></span>
          </div>
        </template>
        <template slot="validitySlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="parseDeliveryTime(scope.deliveryTime)"></span>
          </div>
        </template>
        <template slot="createTimeSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="momentStr(scope.createTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <!--<a style="padding-right: 10px;" @click="goDetail(scope.gBHid)">查看</a>-->
            <a style="padding-right: 10px;" @click="goEdit(scope.gBHid)">编辑</a>
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
        style="margin-top: 30px;width: 100%;text-align: right;"/>
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
          label: '礼包名称',
          type: 'input',
          name: 'giftBagName',
          placeholder: '请输入',
          labelCol: {span: 8},
          wrapperCol: {span: 16}
        },
        {
          label: '状态',
          type: 'select',
          name: 'status',
          placeholder: '请选择',
          selectOptions: [
            {name: '全部', id: ''},
            {name: '启用', id: '1'},
            {name: '禁用', id: '0'}
          ],
          labelCol: {span: 6},
          wrapperCol: {span: 18}
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'createTime',
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
          buttonName: '创建礼包',
          htmlType: 'button',
          align: 'right',
          labelCol: {span: 0},
          wrapperCol: {span: 24}
        }
      ],
      scrollY: 100,
      tableColumns: [
        {
          title: '礼包名称',
          dataIndex: 'name',
          key: 'name',
          width: 180
        },
        {
          title: '状态',
          key: 'generalSlot',
          scopedSlots: { customRender: 'generalSlot' },
          width: 120
        },
        {
          title: '派发时间',
          key: 'validitySlot',
          scopedSlots: {customRender: 'validitySlot'},
          width: 180
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: {customRender: 'detailsSlot'},
          fixed: 'right',
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
    parseDeliveryTime() {
      return param => {
        return `${this.momentStr(param)}`;
      };
    },
    parseGeneral() {
      return param => {
        if (param === 0) {
          return '禁用';
        } else if (param === 1) {
          return '启用';
        } else if (param === 2) {
          return '已保存';
        } else {
          return '';
        }
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
    goDetail(gBHid) {
      this.$router.push({
        path: '/giftH/detail',
        query: {
          id: gBHid
        }
      });
    },
    goEdit(gBHid) {
      this.$router.push({
        path: '/giftH/edit',
        query: {
          id: gBHid
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
        let giftBagName = '';
        let status = '';
        if (this.$refs.thisForm.getFieldsValue().giftBagName) {
          giftBagName = this.$refs.thisForm.getFieldsValue().giftBagName;
        }
        if (this.$refs.thisForm.getFieldsValue().status) {
          status = this.$refs.thisForm.getFieldsValue().status;
        }
        let createTimeStart = '';
        let createTimeEnd = '';
        if (Object.prototype.toString.call(this.$refs.thisForm.getFieldsValue().createTime) === '[object Array]' &&
          this.$refs.thisForm.getFieldsValue().createTime.length > 1) {
          createTimeStart = moment(this.$refs.thisForm.getFieldsValue().createTime[0]).format('YYYY-MM-DD');
          createTimeEnd = moment(this.$refs.thisForm.getFieldsValue().createTime[1]).format('YYYY-MM-DD');
        }
        return api.selectGiftBagHoliday({
          giftBagName: giftBagName,
          status: status,
          pageIndex: this.current,
          pageSize: this.pageSize,
          createTimeStart: createTimeStart,
          createTimeEnd: createTimeEnd
        }).then(resp => {
          if (resp.code === 200) {
            this.total = resp.data.total;
            this.tableData.splice(0, this.tableData.length);
            resp.data.records.forEach((v, k) => {
              this.tableData.push(v);
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
          status: this.formList[1].selectOptions[0].id
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
