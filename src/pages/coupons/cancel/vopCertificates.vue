<template>
  <div id="coupons-cancel">
    <div class="content-header">卡券核销记录</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList ref="memberForm" rowCol="3" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <a-table :columns="tableColumns" :data-source="tableData" :pagination="false" :scroll="{ x: 1038, y: scrollY }" :rowKey="(r, i) => i" style="width:100%;margin-top:8px;" :selectable="false" :loading="tableLoading">
        <template slot="jointimeSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(scope.offTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <a @click="goDetail(scope.couponCode)">查看卡券</a>
          </div>
        </template>
      </a-table>
      <a-pagination :total="total" :show-total="total => `共 ${total} 条`" show-quick-jumper show-size-changer :current="current" :pageSize="pageSize" :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
        @change="change" @showSizeChange="showSizeChange" style="margin-top:30px;width:100%;text-align: right;" />
    </div>
  </div>
</template>

<script>
import FormList from '@/components/FormList/index.jsx';
import api from '@/api';
import moment from 'moment';

export default {
  name: 'couponsCancel',
  data() {
    return {
      jointime:[],
      formList: [
        {
          label: '卡券编号',
          type: 'input',
          name: 'couTypeCode',
          placeholder: '请输入'
        },
        // {
        //   label: '卡券标题',
        //   type: 'input',
        //   name: 'couponName',
        //   placeholder: '请输入'
        // },
        {
          label: '会员唯一标识',
          type: 'input',
          name: 'memberCode',
          placeholder: '请输入'
        },
        {
          label: '手机号',
          type: 'input',
          name: 'phone',
          placeholder: '请输入'
        },
        {
          label: '核销时间',
          type: 'rangePicker',
          name: 'jointime'
        },
        {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
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
          title: '卡券类型编号',
          dataIndex: 'couTypeCode',
          key: 'couTypeCode',
          width: 150
        },
        {
          title: '卡券ID',
          dataIndex: 'couponId',
          key: 'couponId',
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
          dataIndex: 'createTime',
          key: 'createTime',
          width: 150
        },
        {
          title: '会员昵称',
          dataIndex: 'memberName',
          key: 'memberName',
          width: 150
        },
        {
          title: '会员手机号',
          dataIndex: 'phone',
          key: 'phone',
          width: 150
        },
        {
          title: '操作人员ID',
          dataIndex: 'createUser',
          key: 'createUser',
          width: 150
        },
        {
          title: '创建人员姓名',
          dataIndex: 'createUserName',
          key: 'createUserName',
          width: 150
        },
        // {
        //   title: '操作',
        //   key: 'detailsSlot',
        //   scopedSlots: { customRender: 'detailsSlot' },
        //   fixed: 'right',
        //   width: 100
        // }
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
  created() { },
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
      const { couTypeCode, memberCode, phone, jointime } = params;
      this.couTypeCode = couTypeCode || null;
      this.memberCode = memberCode || null;
      this.phone = phone || null;
      this.jointime = jointime || [];
      this.current = 1;
      this.getClaimCancel();
    },
    //查看卡券详情
    goDetail(code) {
      console.log('goDetail code :>> ', code);
      this.$router.push({
        name: 'couponsManageDetail',
        query: {
          code: code
        }
      });
    },
    // 分页
    // onShowSizeChange(current, pageSize) {
    //   this.current = current;
    //   this.pageSize = pageSize;
    //   this.getClaimCancel();
    // },
    change(page) {
      this.current = page;
      this.getClaimCancel();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getClaimCancel();
    },

    //获取积分列表
    getClaimCancel() {
      this.tableLoading = true;

      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        startTime: this.jointime.length ? moment(this.jointime[0]).format('YYYY-MM-DD') : null,
        endTime: this.jointime.length ? moment(this.jointime[1]).format('YYYY-MM-DD') : null,
        phone: this.phone,
        memberCode: this.memberCode,
        couTypeCode: this.couTypeCode
      };

      api
        .couponExchange(args)
        .finally(() => {
          this.tableLoading = false;
        })
        .then(res => {
          this.tableLoading = false;
          if (res.code === 200) {
            this.total = res.data.total;
            this.tableData.splice(0, this.tableData.length);
            res.data.records.forEach((element, index) => {
              this.tableData.push(element);
            });
          }
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
    if (from.name === 'couponsManageDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'couponsManageDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  watch: {
    formList: {
      handler: function (newVal) {
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
