<template>
  <div id="coupons-claim">
    <div class="content-header">卡券领取记录</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList ref="memberForm" rowCol="3" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ y: scrollY }"
        :rowKey="(r, i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading"
      >
        <template slot="jointimeSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(scope.createTime)"></span>
          </div>
        </template>
        <template slot="statusSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="parseStatus(scope.status)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <a @click="goDetail(scope.couponCode)">查看卡券</a>
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
import FormList from '@/components/FormList/index.jsx';
import api from '@/api';
import moment from 'moment';

export default {
  name: 'couponsClaim',
  data() {
    return {
      formList: [
        {
          label: '卡券编号',
          type: 'input',
          name: 'couponCode',
          placeholder: '请输入'
        },
        {
          label: '卡券标题',
          type: 'input',
          name: 'couponName',
          placeholder: '请输入'
        },
        {
          label: '领取时间',
          type: 'rangePicker',
          name: 'jointime'
        },
        {
          label: '会员唯一标识',
          type: 'input',
          name: 'memberCode',
          placeholder: '请输入'
        },
        {
          label: '手机号',
          type: 'inputPhone',
          name: 'memberPhone',
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
          title: '卡券编号',
          dataIndex: 'couponCode',
          key: 'couponCode'
        },
        {
          title: '卡券标题',
          dataIndex: 'couponName',
          key: 'couponName'
        },
        {
          title: '领取时间',
          key: 'jointimeSlot',
          scopedSlots: { customRender: 'jointimeSlot' }
        },
        {
          title: '会员昵称',
          dataIndex: 'memberName',
          key: 'memberName'
        },
        {
          title: '会员唯一标识',
          dataIndex: 'memberCode',
          key: 'memberCode'
        },
        {
          title: '会员手机号',
          dataIndex: 'memberPhone',
          key: 'memberPhone'
        },
        {
          title: '状态',
          key: 'statusSlot',
          scopedSlots: { customRender: 'statusSlot' }
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: { customRender: 'detailsSlot' }
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
    parseStatus() {
      return param => {
        if (param === 0) {
          return '派发中';
        } else if (param === 1) {
          return '派发成功';
        } else if (param === 2) {
          return '派发失败';
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
    getClaimCancel(isQuery = false) {
      console.log('getClaimCancel isQuery :>> ', isQuery);
      if (isQuery) {
        this.current = 1;
      }
      this.tableLoading = true;
      this.$nextTick(() => {
        let couponCode = '';
        let couponActivitiesId = this.$route.query.id ? this.$route.query.id : '';
        if (!isQuery) {
          this.$refs.memberForm.setFieldsValue({
            couponCode: this.$route.query.code ? this.$route.query.code : ''
          });
        }
        if (this.$refs.memberForm.getFieldsValue().couponCode) {
          couponCode = this.$refs.memberForm.getFieldsValue().couponCode;
        } else {
          couponActivitiesId = '';
        }

        let couponName = '';
        if (this.$refs.memberForm.getFieldsValue().couponName) {
          couponName = this.$refs.memberForm.getFieldsValue().couponName;
        }

        let memberCode = '';
        if (this.$refs.memberForm.getFieldsValue().memberCode) {
          memberCode = this.$refs.memberForm.getFieldsValue().memberCode;
        }

        let memberPhone = '';
        if (this.$refs.memberForm.getFieldsValue().memberPhone) {
          memberPhone = this.$refs.memberForm.getFieldsValue().memberPhone;
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
          pageIndex: this.current,
          pageSize: this.pageSize,
          status: 1,
          couponActivitiesId: couponActivitiesId,
          couponCode: couponCode, //卡券编号
          createTimeStart: jointimeStart, //领取开始时间
          createTimeEnd: jointimeEnd, //领取结束时间
          memberCode: memberCode, //会员唯一标识
          phone: memberPhone, //手机号
          title: couponName //卡券标题 //手机号
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
              this.total = res.data.total;
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
#coupons-claim {
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
