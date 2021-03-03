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
        <template slot="couponTypeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="couponTypeStr(rowData.couponType)"></span>
          </div>
        </template>
        <template slot="activitySlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="activityStr(rowData.activity)"></span>
          </div>
        </template>
        <template slot="faceAmountSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="faceAmountStr(rowData)"></span>
          </div>
        </template>
        <template slot="sourceSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="sourceStr(rowData.source)"></span>
          </div>
        </template>
        <template slot="validitySlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="parseValidity(rowData)"></span>
          </div>
        </template>
        <template slot="couponStatusSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="couponStatusStr(rowData.couponStatus)"></span>
          </div>
        </template>
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(rowData.createTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a style="padding-right: 10px;" @click="goDetail(rowData.id)">查看</a>
            <a style="padding-right: 10px;" @click="goCopy(rowData.id)">复制</a>
            <a @click="goEdit(rowData.id)" v-if="rowData.couponStatus === 3">编辑</a>
            <!-- <a @click="couponOnOrOff(rowData, 1)" v-else-if="rowData.couponStatus === 0">
              启用
            </a> -->
            <a @click="couponOnOrOff(rowData, 0)" v-else-if="rowData.couponStatus === 1">
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
  name: 'couponsManage',
  data() {
    return {
      formList: [
        {
          label: '卡券类型',
          type: 'select',
          name: 'couponType',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '代金券', id: 10 },
            { name: '满减券', id: 20 },
            { name: '折扣券', id: 40 }
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
          name: 'couponBusinessType',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '物业费', id: '4014' },
            { name: '购物券', id: '4005' }
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
        // 卡券状态 0：禁用; 1：启用; 2：逻辑删除; 3 临时保存；
        {
          label: '卡券状态',
          type: 'select',
          name: 'couponStatus',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '禁用', id: '0' },
            { name: '启用', id: 1 },
            { name: '保存', id: 3 }
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
        // {
        //   title: '卡券副标题',
        //   dataIndex: 'couponSubhead',
        //   key: 'couponSubhead',
        //   width: 150
        // },
        {
          title: '卡券类型',
          key: 'couponTypeSlot',
          scopedSlots: { customRender: 'couponTypeSlot' },
          width: 150
        },
        {
          title: '卡券业务类型',
          key: 'activitySlot',
          scopedSlots: { customRender: 'activitySlot' },
          width: 150
        },
        {
          title: '卡券面值金额',
          // dataIndex: 'faceAmount',
          key: 'faceAmountSlot',
          scopedSlots: { customRender: 'faceAmountSlot' },
          width: 150
        },
        {
          title: '卡券有效期',
          scopedSlots: { customRender: 'validitySlot' },
          key: 'validitySlot',
          width: 450
        },
        {
          title: '卡券平台',
          key: 'sourceSlot',
          scopedSlots: { customRender: 'sourceSlot' },
          width: 150
        },
        {
          title: '状态',
          key: 'couponStatusSlot',
          scopedSlots: { customRender: 'couponStatusSlot' },
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
    couponTypeStr() {
      return param => {
        if (param === 10) {
          return '代金券';
        } else if (param === 20) {
          return '满减券';
        } else if (param === 40) {
          return '折扣券';
        } else {
          return '';
        }
      };
    },
    activityStr() {
      return param => {
        if (param === '4014') {
          return '物业费';
        } else if (param === '4005') {
          return '购物券';
        } else {
          return '';
        }
      };
    },
    faceAmountStr() {
      return param => {
        if (param.couponType === 10) {
          return param.faceAmount;
        } else if (param.couponType === 20) {
          return param.faceAmount;
        } else if (param.couponType === 40) {
          return param.discountRatio * 10 + '折';
        } else {
          return '';
        }
      };
    },
    sourceStr() {
      return param => {
        if (param === '10' || param === 10) {
          return '地产';
        } else if (param === '20' || param === 20) {
          return '邻里邦';
        } else if (param === '30' || param === 30) {
          return '邻里商城';
        } else if (param === '40' || param === 40) {
          return '会员中心';
        } else if (param === '50' || param === 50) {
          return '收费中心';
        } else {
          return '';
        }
      };
    },
    parseValidity() {
      return param => {
        if (param.validityType === 1) {
          //固定有效期
          return param.validityStartTime + ' ~ ' + param.validityEndTime;
        } else if (param.validityType === 3) {
          //相对有效期
          return '相对有效期: ' + param.validityDayNums + '天，领取后' + param.takeEffectDayNums + '天生效';
        } else {
          return '';
        }
      };
    },
    couponStatusStr() {
      return param => {
        if (param === 0) {
          return '禁用';
        } else if (param === 1) {
          return '启用';
        } else if (param === 2) {
          return '删除';
        } else if (param === 3) {
          return '保存';
        } else {
          return '';
        }
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
    goDetail(id) {
      console.log('goDetail id :>> ', id);
      this.$router.push({
        name: 'couponsManageDetail',
        query: {
          id: id
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

    couponOnOrOff(rowData, state) {
      let stateStr = '';
      if (state === 0) {
        stateStr = '禁用';
      } else if (state === 1) {
        stateStr = '启用';
      } else {
        return;
      }

      console.log('rowData :>> ', rowData);
      console.log('state :>> ', state);
      this.$confirm({
        title: `${stateStr}卡券`,
        content: `您确定要${stateStr}该卡券吗？`,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const para = {
            id: rowData.id,
            state: state
          };
          console.log('couponOnOrOff para :>> ', para);
          this.tableLoading = true;
          api.couponOnOrOff(para).then(res => {
            console.log('couponOnOrOff res :>> ', res);
            if (res.code === 200) {
              this.getCouponsList();
            }
          });
        }
      });
    },

    // 分页
    // onShowSizeChange(current, pageSize) {
    //   this.current = current;
    //   this.pageSize = pageSize;
    //   this.getCouponsList();
    // },
    change(page) {
      this.current = page;
      this.getCouponsList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getCouponsList();
    },

    //获取积分列表
    getCouponsList(isQuery = false) {
      if (isQuery) {
        this.current = 1;
      }
      this.tableLoading = true;
      this.$nextTick(() => {
        let couponType = ''; //卡券类型
        let couponTitle = ''; //卡券标题
        let couponBusinessType = ''; //卡券业务类型
        let couponStatus = ''; //卡券状态
        if (this.$refs.memberForm.getFieldsValue().couponType) {
          couponType = this.$refs.memberForm.getFieldsValue().couponType;
        }
        if (this.$refs.memberForm.getFieldsValue().couponTitle) {
          couponTitle = this.$refs.memberForm.getFieldsValue().couponTitle;
        }
        if (this.$refs.memberForm.getFieldsValue().couponBusinessType) {
          couponBusinessType = this.$refs.memberForm.getFieldsValue().couponBusinessType;
        }
        if (this.$refs.memberForm.getFieldsValue().couponStatus) {
          couponStatus = this.$refs.memberForm.getFieldsValue().couponStatus;
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
          activity: couponBusinessType, //卡券业务类型
          createTimeStart: jointimeStart, //开始时间
          createTimeEnd: jointimeEnd, //结束时间
          status: couponStatus, //卡券状态
          title: couponTitle, //卡券标题
          type: couponType //卡券类型
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
      this.getCouponsList();
    }
    //重置
    this.$route.meta.isUseCache = false;

    this.$nextTick(() => {
      this.$refs.memberForm.setFieldsValue({
        couponType: this.formList[0].selectOptions[0].id
      });
      this.$refs.memberForm.setFieldsValue({
        couponBusinessType: this.formList[2].selectOptions[0].id
      });
      this.$refs.memberForm.setFieldsValue({
        couponStatus: this.formList[4].selectOptions[0].id
      });
    });
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
