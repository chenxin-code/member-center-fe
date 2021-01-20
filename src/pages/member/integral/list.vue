<template>
  <div id="integral-manage">
    <div class="content-header">积分管理</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList ref="memberForm" rowCol="3" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <!-- :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
      <a-table
        :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ y: scrollY }"
        :rowKey="(r, i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading"
      >
        <template slot="integralChangeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="showIntegralChange(rowData)"></span>
          </div>
        </template>
        <template slot="phoneNoSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="`+${rowData.phoneAreaCode} ${rowData.phone}`"></span>
          </div>
        </template>
        <template slot="changeTypeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="showChangeType(rowData.changeType)"></span>
          </div>
        </template>
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStrHms(rowData.createTime)"></span>
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
  name: 'integralManage',
  data() {
    return {
      selectedRowKeys: [], //表格单选
      selectedRowData: {}, //表格单选
      formList: [
        {
          label: '类型',
          type: 'select',
          name: 'type',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '增加', id: 1 },
            { name: '减少', id: 2 }
          ]
        },
        {
          label: '来源',
          type: 'select',
          name: 'memberSourceCode',
          placeholder: '请选择',
          selectOptions: [
            {
              id: '',
              name: '全部'
            }
          ]
        },
        {
          label: '时间',
          type: 'rangePicker',
          name: 'jointime'
        },
        {
          label: '唯一标识',
          type: 'input',
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
          title: '积分变动',
          key: 'integralChangeSlot',
          scopedSlots: { customRender: 'integralChangeSlot' }
        },
        {
          title: '类型',
          key: 'changeTypeSlot',
          scopedSlots: { customRender: 'changeTypeSlot' }
        },
        {
          title: '来源',
          dataIndex: 'clientName',
          key: 'clientName'
        },
        {
          title: '描述',
          dataIndex: 'describe',
          key: 'describe'
        },
        {
          title: '会员昵称',
          dataIndex: 'memberName',
          key: 'memberName'
        },
        {
          title: '会员手机号',
          key: 'phoneNoSlot',
          scopedSlots: { customRender: 'phoneNoSlot' }
        },
        {
          title: '会员唯一标识',
          dataIndex: 'memberCode',
          key: 'memberCode'
        },
        // jointimeSlot
        {
          title: '时间',
          key: 'jointimeSlot',
          scopedSlots: { customRender: 'jointimeSlot' }
        },
        {
          title: '操作人',
          dataIndex: 'createUserName',
          key: 'createUserName'
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
    onSelectChange(selectedKeys, selectedRows) {
      console.log('onSelectChange selectedKeys :>> ', selectedKeys);
      console.log('onSelectChange selectedRows :>> ', selectedRows);
      //切换分页要清空selectedRowKeys
      this.selectedRowKeys = selectedKeys;
      this.selectedRowData = selectedRows[0];
      console.log('this.selectedRowKeys :>> ', this.selectedRowKeys);
      console.log('this.selectedRowData :>> ', this.selectedRowData);
    },
    //查询按钮
    onQuery(params) {
      // console.log('params :>> ', params);
      this.current = 1;
      this.getIntegralList(true);
    },
    //查看微应用详情
    goDetail(param) {
      console.log('param :>> ', param);
      this.$router.push({
        name: 'memberInfoDetail',
        query: {
          id: param.memberId
        }
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.selectedRowKeys = []; //表格单选
      this.selectedRowData = {}; //表格单选
      this.$forceUpdate(); //表格单选
      this.current = current;
      this.pageSize = pageSize;
      this.getIntegralList();
    },

    //获取会员来源
    getClientList() {
      return api.getClientList().then(res => {
        console.log('getClientList res :>> ', res);
        if (res.code === 200) {
          this.formList[1].selectOptions.splice(1, this.formList[1].selectOptions.length);
          res.data.forEach(element => {
            let tempObj = {};
            tempObj.id = element.appCode;
            tempObj.name = element.appName;
            this.formList[1].selectOptions.push(tempObj);
          });
        }
      });
    },
    //获取积分列表
    getIntegralList(isQuery = false) {
      if (isQuery) {
        this.current = 1;
      }
      this.tableLoading = true;
      this.$nextTick(() => {
        let type = '';
        let memberSourceCode = '';
        if (this.$refs.memberForm.getFieldsValue().type) {
          type = this.$refs.memberForm.getFieldsValue().type;
        }
        if (this.$refs.memberForm.getFieldsValue().memberSourceCode) {
          memberSourceCode = this.$refs.memberForm.getFieldsValue().memberSourceCode;
        }

        let memberCode = '';
        if (this.$refs.memberForm.getFieldsValue().memberCode) {
          memberCode = this.$refs.memberForm.getFieldsValue().memberCode;
        }

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
          type: type,
          clientCode: memberSourceCode,
          memberCode: memberCode,
          phone: phoneNo,
          createTimeStart: jointimeStart,
          createTimeEnd: jointimeEnd,
          pageIndex: this.current,
          pageSize: this.pageSize
        };

        console.log('getIntegralList para :>> ', para);

        return api
          .getIntegralList(para)
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getIntegralList res :>> ', res);
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
      this.getClientList();
      this.getIntegralList();
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
#integral-manage {
  height: 100%;
  overflow: hidden;

  .content-main {
    ::v-deep .ant-btn {
      width: 98px !important;
    }

    ::v-deep .ant-input-number {
      width: 100%;
    }

    ::v-deep .ant-table-thead .ant-checkbox-inner {
      display: none;
    }
  }
}
</style>
