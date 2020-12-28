<template>
  <div id="member-info">
    <div class="content-header">会员信息</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList ref="memberForm" rowCol="4" :formList="formList" :onSubmit="onQuery" />
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
        <template slot="phoneNoSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="`+${rowData.phoneAreaCode} ${rowData.phone}`"></span>
          </div>
        </template>
        <template slot="sexSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="sexStr(rowData)"></span>
          </div>
        </template>
        <template slot="memberSourceSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="showSource(rowData)"></span>
          </div>
        </template>
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="momentStr(rowData.createTime)"></span>
          </div>
        </template>
        <template slot="levelNameSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="showLevel(rowData)"></span>
          </div>
        </template>

        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a @click="goDetail(rowData)">查看</a>
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
  name: 'memberInfo',
  data() {
    return {
      formList: [
        {
          label: '创建来源',
          type: 'select',
          name: 'memberSourceCode',
          placeholder: '请选择',
          selectOptions: []
        },
        {
          label: '唯一标识',
          type: 'input',
          name: 'memberCode',
          placeholder: '请输入'
        },
        {
          label: '手机号',
          type: 'input',
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
        },
        {
          label: '加入时间',
          type: 'rangePicker',
          name: 'jointime'
        }
      ],
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: '唯一标识',
          dataIndex: 'memberCode',
          key: 'memberCode'
        },
        {
          title: '姓名',
          dataIndex: 'memberName',
          key: 'memberName'
        },
        {
          title: '手机号',
          // dataIndex: 'phone',
          key: 'phone',
          scopedSlots: { customRender: 'phoneNoSlot' }
        },
        {
          title: '性别',
          key: 'sexSlot',
          scopedSlots: { customRender: 'sexSlot' }
        },
        {
          title: '创建来源',
          key: 'memberSourceSlot',
          scopedSlots: { customRender: 'memberSourceSlot' }
        },
        {
          title: '加入时间',
          key: 'jointimeSlot',
          scopedSlots: { customRender: 'jointimeSlot' }
        },
        {
          title: '邦豆值',
          dataIndex: 'integral',
          key: 'integral'
        },
        {
          title: '时代邻里会员卡等级',
          key: 'levelNameSlot',
          scopedSlots: { customRender: 'levelNameSlot' }
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
    sexStr() {
      return param => {
        let str = '';
        if (param === 1) {
          str = '男';
        } else if (param === 2) {
          str = '女';
        } else {
          str = '';
        }
        return str;
      };
    },
    showLevel() {
      return param => {
        let tempStr = '';
        if (param.memberCardRelats.length > 1) {
          // param.memberCardRelats.slice(0, 1).forEach(element => {
          //   if (element.levelName) {
          //     tempStr += element.levelName;
          //   }
          // });

          param.memberCardRelats.forEach(element => {
            if (element.levelName) {
              tempStr += element.levelName + ',';
            }
          });
          tempStr = tempStr.substring(0, tempStr.length - 1);
        } else if (param.memberCardRelats.length === 1) {
          param.memberCardRelats.forEach(element => {
            if (element.levelName) {
              tempStr += element.levelName;
            }
          });
        } else {
          tempStr = '';
        }
        return tempStr;
      };
    },
    showSource() {
      return param => {
        let tempStr = '';
        if (param.memberSources.length > 1) {
          // param.memberSources.slice(0, 1).forEach(element => {
          //   if (element.sourceName) {
          //     tempStr += element.sourceName;
          //   }
          // });
          param.memberSources.forEach(element => {
            if (element.sourceName) {
              tempStr += element.sourceName + ',';
            }
          });
          tempStr = tempStr.substring(0, tempStr.length - 1);
        } else if (param.memberSources.length === 1) {
          param.memberSources.forEach(element => {
            if (element.sourceName) {
              tempStr += element.sourceName;
            }
          });
        } else {
          tempStr = '';
        }
        return tempStr;
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
    //查询按钮
    onQuery() {
      this.current = 1;
      this.getMemberList();
    },
    //查看微应用详情
    goDetail(param) {
      console.log('param :>> ', param);
      this.$router.push({
        name: 'memberInfoDetail',
        params: {
          id: param.memberId
        }
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getMemberList();
    },

    //获取会员来源
    getClientList() {
      return api.getClientList().then(res => {
        console.log('getClientList res :>> ', res);
        if (res.code === 200) {
          const project = {
            id: '',
            name: '全部'
          };
          this.formList[0].selectOptions.splice(1, this.formList[0].length);
          res.data.forEach(element => {
            let tempObj = {};
            tempObj.id = element.appCode;
            tempObj.name = element.appName;
            this.formList[0].selectOptions.push(tempObj);
          });
          this.formList[0].selectOptions.unshift(project);
        }
      });
    },
    //获取表格数据
    getMemberList() {
      this.tableLoading = true;
      this.$nextTick(() => {
        let memberSourceCode = '';
        if (this.$refs.memberForm.getFieldsValue().memberSourceCode) {
          memberSourceCode = this.$refs.memberForm.getFieldsValue().memberSourceCode;
        }
        console.log('memberSourceCode :>> ', memberSourceCode);

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
        if (this.$refs.memberForm.getFieldsValue().jointime) {
          jointimeStart = moment(this.$refs.memberForm.getFieldsValue().jointime[0]).format('YYYY-MM-DD');
          jointimeEnd = moment(this.$refs.memberForm.getFieldsValue().jointime[1]).format('YYYY-MM-DD');
        }

        const para = {
          memberSourceCode: memberSourceCode,
          memberCode: memberCode,
          phone: phoneNo,
          createTimeStart: jointimeStart,
          createTimeEnd: jointimeEnd,
          isAll: 0,
          pageIndex: this.current,
          pageSize: this.pageSize
        };

        console.log('getMemberList para :>> ', para);

        return api
          .getMemberList(para)
          .then(res => {
            this.tableLoading = false;
            console.log('getMemberList res :>> ', res);
            if (res.code === 200) {
              this.total = res.data.total;
              this.tableData.splice(0, this.tableData.length);
              res.data.records.forEach((element, index) => {
                this.tableData.push(element);
              });
            }
          })
          .finally(() => {
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
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.$refs.memberForm.form.resetFields();

      //初始化加载数据
      this.getClientList();
      this.getMemberList();
    }

    //重置
    this.$route.meta.isUseCache = false;
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === 'memberInfoDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'memberInfoDetail') {
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
          memberSourceCode: this.formList[0].selectOptions[0].id
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
#member-info {
  height: 100%;
  overflow: hidden;

  .content-main {
    ::v-deep .ant-btn {
      width: 98px !important;
    }
  }
}
</style>
