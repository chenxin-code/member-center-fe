<template>
  <div id="coupons-cancel">
    <div class="content-header">卡券核销记录</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList ref="memberForm" rowCol="3" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 1038, y: scrollY }"
        :rowKey="(r, i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading"
      >
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(rowData.offTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a @click="goDetail(rowData)">查看卡券</a>
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
// import mock from './mock';
// console.log('mock :>> ', mock);

export default {
  name: 'couponsClaim',
  data() {
    return {
      formList: [
        {
          label: '卡券id',
          type: 'input',
          name: 'couponId',
          placeholder: '请输入'
        },
        {
          label: '卡券标题',
          type: 'input',
          name: 'couponTitle',
          placeholder: '请输入'
        },
        {
          label: '核销时间',
          type: 'rangePicker',
          name: 'jointime'
        },
        {
          label: '会员唯一标识',
          type: 'input',
          // name: 'memberId',
          name: 'memberCode',
          placeholder: '请输入'
        },
        {
          label: '手机号',
          type: 'inputNumber',
          name: 'phoneNo',
          placeholder: '请输入'
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
          title: '核销时间',
          key: 'jointimeSlot',
          scopedSlots: { customRender: 'jointimeSlot' },
          width: 150
        },
        {
          title: '会员昵称',
          dataIndex: 'memberName',
          key: 'memberName',
          width: 150
        },
        {
          title: '会员唯一标识',
          dataIndex: 'memberCode',
          key: 'memberCode',
          // dataIndex: 'memberId',
          // key: 'memberId',
          width: 150
        },
        {
          title: '会员手机号',
          dataIndex: 'phone',
          key: 'phone',
          width: 150
        },
        {
          title: '订单/账单号',
          dataIndex: 'orderNo',
          key: 'orderNo',
          width: 150
        },
        {
          title: '订单/账单类型',
          dataIndex: 'orderType',
          key: 'orderType',
          width: 150
        },
        {
          title: '订单/账单金额',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 150
        },
        {
          title: '核销金额',
          dataIndex: 'offAmount',
          key: 'offAmount',
          width: 150
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: { customRender: 'detailsSlot' },
          fixed: 'right',
          width: 100
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
      this.getClaimCancel(true);
    },
    //查看卡券详情
    goDetail(param) {
      console.log('param :>> ', param);
      this.$router.push({
        name: 'couponsManageDetail',
        query: {
          id: param.memberId
        }
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getClaimCancel();
    },

    //获取积分列表
    getClaimCancel(isQuery = false) {
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
          status: 2,
          pageIndex: this.current,
          pageSize: this.pageSize,
          couponId: couponId, //卡券id
          title: couponTitle, //卡券标题
          createTimeStart: jointimeStart, //领取开始时间
          createTimeEnd: jointimeEnd, //领取结束时间
          memberId: memberCode, //会员唯一标识
          phone: phoneNo //手机号
        };

        console.log('getClaimCancel para :>> ', para);

        return api
          .getClaimCancel(para)
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getClaimCancel res :>> ', res);
            if (res.code === 200) {
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
      this.getClaimCancel();
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
#coupons-cancel {
  height: 100%;
  overflow: hidden;

  .content-main {
    ::v-deep .ant-btn {
      width: 98px !important;
    }

    ::v-deep .ant-input-number {
      width: 100%;
    }
  }
}
</style>
