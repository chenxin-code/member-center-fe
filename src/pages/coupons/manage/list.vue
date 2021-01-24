<template>
  <div id="coupons-list">
    <div class="content-header">卡券管理</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList routePath="/couponsManage/new" ref="memberForm" :rowCol="4" :formList="formList" :onSubmit="onQuery" />
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
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(rowData.createTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a style="padding-right: 10px;" @click="goDetail(rowData)">查看</a>
            <a style="padding-right: 10px;" @click="goCopy(rowData)">复制</a>
            <a @click="goEdit(rowData)">编辑</a>
          </div>
        </template>
      </a-table>
      <a-pagination
        :total="total"
        :show-total="total => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        :default-current="current"
        :page-size.sync="pageSize"
        :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
        @change="onShowSizeChange"
        @showSizeChange="onShowSizeChange"
        style="margin-top:30px;width:100%;text-align: right;"
      />
    </div>
  </div>
</template>

<script>
import FormList from '@/components/FormList/index.jsx';
import api from '@/api';
import moment from 'moment';

export default {
  name: 'couponsClaim',
  data() {
    return {
      formList: [
        {
          label: '卡券类型',
          type: 'select',
          name: 'type',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '增加', id: 1 },
            { name: '减少', id: 2 }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '卡券标题',
          type: 'input',
          name: 'couponTitle',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '卡券业务类型',
          type: 'select',
          name: 'type',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '增加', id: 1 },
            { name: '减少', id: 2 }
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
          label: '卡券状态',
          type: 'select',
          name: 'type',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '增加', id: 1 },
            { name: '减少', id: 2 }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'jointime',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          type: 'btn-default',
          buttonName: '新建卡券',
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
          title: '卡券id',
          dataIndex: 'id',
          key: 'id',
          width: 150
        },
        {
          title: '卡券标题',
          dataIndex: 'couponTitle',
          key: 'couponTitle',
          width: 150
        },
        {
          title: '卡券副标题',
          dataIndex: 'couponSubhead',
          key: 'couponSubhead',
          width: 150
        },
        {
          title: '卡券类型',
          dataIndex: 'couponType',
          key: 'couponType',
          width: 150
        },
        {
          title: '卡券业务类型',
          dataIndex: 'activity',
          key: 'activity',
          width: 150
        },
        {
          title: '卡券面值金额',
          dataIndex: 'amount',
          key: 'amount',
          width: 150
        },
        {
          title: '卡券有效期',
          dataIndex: 'validity',
          key: 'validity',
          width: 150
        },
        // {
        //   title: '卡券来源',
        //   dataIndex: 'validity',
        //   key: 'validity',
        //   width: 150
        // },
        {
          title: '发放方式',
          dataIndex: 'releaseForm',
          key: 'releaseForm',
          width: 150
        },
        {
          title: '发放数量',
          dataIndex: 'releaseCount',
          key: 'releaseCount',
          width: 150
        },
        {
          title: '领取数量',
          dataIndex: 'receiveCount',
          key: 'receiveCount',
          width: 150
        },
        {
          title: '核销数量',
          dataIndex: 'offCount',
          key: 'offCount',
          width: 150
        },
        // {
        //   title: '过期数量',
        //   dataIndex: 'offCount',
        //   key: 'offCount',
        //   width: 150
        // },
        {
          title: '状态',
          dataIndex: 'couponStatus',
          key: 'couponStatus',
          width: 150
        },
        {
          title: '操作人员',
          dataIndex: 'operator',
          key: 'operator',
          width: 150
        },
        {
          title: '创建时间',
          key: 'jointimeSlot',
          scopedSlots: { customRender: 'jointimeSlot' },
          width: 150
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: { customRender: 'detailsSlot' },
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
  components: {
    FormList
  },
  computed: {
    showIntegralChange() {
      return param => {
        if (param.changeType === 1) {
          return '+' + param.integralChange;
        } else if (param.changeType === 2) {
          return '-' + param.integralChange;
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
    },
    showChangeType() {
      return param => {
        let str = '';
        if (param === 1) {
          str = '增加';
        } else if (param === 2) {
          str = '减少';
        } else {
          str = '';
        }
        return str;
      };
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
    //查询按钮
    onQuery(params) {
      // console.log('params :>> ', params);
      this.current = 1;
      this.getCouponsList(true);
    },
    //查看卡券详情
    goDetail(param) {
      console.log('goDetail param :>> ', param);
      this.$router.push({
        name: 'couponsManageDetail',
        query: {
          id: param.id
        }
      });
    },
    //编辑卡券
    goEdit(id) {
      console.log('id :>> ', id);
      this.$router.push({
        name: 'couponsManageEdit',
        query: {
          id: id
        }
      });
    },
    //复制卡券
    goCopy(id) {
      console.log('id :>> ', id);
      this.$router.push({
        name: 'couponsManageCopy',
        query: {
          id: id
        }
      });
    },

    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getCouponsList();
    },

    //获取积分列表
    getCouponsList(isQuery = false) {
      if (isQuery) {
        this.current = 1;
      }
      this.tableLoading = true;
      this.$nextTick(() => {
        let couponId = '';
        let couponTitle = '';
        if (this.$refs.memberForm.getFieldsValue().couponId) {
          couponId = this.$refs.memberForm.getFieldsValue().couponId;
        }
        if (this.$refs.memberForm.getFieldsValue().couponTitle) {
          couponTitle = this.$refs.memberForm.getFieldsValue().couponTitle;
        }

        let memberCode = '';
        if (this.$refs.memberForm.getFieldsValue().memberCode) {
          memberCode = this.$refs.memberForm.getFieldsValue().memberCode;
        }

        // let memberId = '';
        // if (this.$refs.memberForm.getFieldsValue().memberId) {
        //   memberId = this.$refs.memberForm.getFieldsValue().memberId;
        // }

        let phoneNo = '';
        if (this.$refs.memberForm.getFieldsValue().phoneNo) {
          phoneNo = this.$refs.memberForm.getFieldsValue().phoneNo;
        }

        let jointimeStart = '';
        let jointimeEnd = '';
        if (
          Object.prototype.toString.call(this.$refs.memberForm.getFieldsValue().jointime) === '[object Array]' &&
          this.$refs.memberForm.getFieldsValue().jointime.length > 1
        ) {
          jointimeStart = moment(this.$refs.memberForm.getFieldsValue().jointime[0]).format('YYYY-MM-DD');
          jointimeEnd = moment(this.$refs.memberForm.getFieldsValue().jointime[1]).format('YYYY-MM-DD');
        }

        const para = {
          pageIndex: this.current, //起始页
          pageSize: this.pageSize, //每页展示条数
          activity: '', //卡券业务类型
          // createTimeStart: jointimeStart, //开始时间
          // createTimeEnd: jointimeEnd, //结束时间
          createTimeStart: '', //开始时间
          createTimeEnd: '', //结束时间
          status: '', //卡券状态
          title: couponTitle, //卡券标题
          type: '' //卡券类型
        };

        console.log('getCouponsList para :>> ', para);

        return api
          .getCouponsList(para)
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getCouponsList res :>> ', res);
            if (res.code === 200) {
              // if (Object.prototype.toString.call(res.data) !== '[object Object]') {
              //   //res.data非对象阻断
              //   return;
              // }
              // if (Object.prototype.toString.call(res.data.records) !== '[object Array]') {
              //   //res.data.records非数组阻断
              //   return;
              // }

              // this.total = res.data.total;
              this.total = res.data.records.length;
              this.tableData.splice(0, this.tableData.length);
              res.data.records.forEach((element, index) => {
                this.tableData.push(element);
              });
            }
          });
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
      this.$refs.memberForm.form.resetFields();

      //初始化加载数据
      this.getCouponsList();
    }

    //重置
    this.$route.meta.isUseCache = false;
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
  watch: {
    formList: {
      handler: function(newVal) {
        this.$refs.memberForm.setFieldsValue({
          type: this.formList[0].selectOptions[0].id
        });
        this.$refs.memberForm.setFieldsValue({
          memberSourceCode: this.formList[1].selectOptions[0].id
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
#coupons-list {
  height: 100%;
  overflow: hidden;

  .content-main {
    ::v-deep .ant-btn {
      width: 98px !important;
    }

    ::v-deep .ant-input-number {
      width: 100%;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(6) {
      width: 50% !important;

      .ant-form-item-label {
        width: calc(12.5% - 3px) !important;
      }
      .ant-form-item-control-wrapper {
        width: calc(87.5% + 3px) !important;
      }
    }
  }
}
</style>
