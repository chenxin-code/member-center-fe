<template>
  <div id="microApplication">
    <div class="content-header">会员信息</div>
    <div class="content-main" ref="content_main" style="padding: 20px;">
      <FormList ref="memberForm" rowCol="4" :formList="formList" :onSubmit="onCheck" />
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
        <!-- <template slot="phoneNoSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="`+${rowData.phoneAreaCode} ${rowData.phone}`"></span>
          </div>
        </template> -->
        <template slot="sexSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-show="rowData.sex === 0">未知</span>
            <span v-show="rowData.sex === 1">男</span>
            <span v-show="rowData.sex === 2">女</span>
          </div>
        </template>
        <template slot="memberSourceSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-show="rowData.memberSource === undefined || rowData.memberSource === null">全部项目</span>
            <span v-show="rowData.memberSource === '1'">地产</span>
            <span v-show="rowData.memberSource === '5'">邻里帮</span>
          </div>
        </template>
        <template slot="jointimeSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="`${moment(rowData.createTime).format('YYYY-MM-DD')}`"></span>
          </div>
        </template>
        <template slot="levelNameSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="showLevel(rowData)"></span>
          </div>
        </template>

        <template slot="detailsSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <a @click="onCheckDetail(rowData)" style="margin-left:20px;">详情</a>
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
  name: 'microApplication',
  data() {
    return {
      formList: [
        {
          label: '创建来源',
          type: 'select',
          name: 'memberSource',
          placeholder: '请选择',
          selectOptions: []
        },
        {
          label: '手机号',
          type: 'input',
          name: 'phoneNo',
          placeholder: '请输入'
        },
        {
          label: '加入时间',
          type: 'rangePicker',
          name: 'jointime'
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
          title: '唯一标识',
          dataIndex: 'memberId',
          key: 'memberId'
        },
        {
          title: '姓名',
          dataIndex: 'memberName',
          key: 'memberName'
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone'
          // scopedSlots: { customRender: 'phoneNoSlot' }
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
    showLevel() {
      return param => {
        let tempStr = '';
        if (param.levels.length > 1) {
          param.levels.slice(0, 1).forEach(element => {
            if (element.levelName) {
              tempStr += element.levelName;
            }
          });
        } else if (param.levels.length === 1) {
          param.levels.forEach(element => {
            if (element.levelName) {
              tempStr += element.levelName;
            }
          });
        } else {
          tempStr = '';
        }
        return tempStr;
      };
    }
  },
  mounted() {
    const timer1 = setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 215 + 'px';
    }, 0);
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(timer1);
    });

    this.getMemberList();
    this.getClientList();
  },
  created() {
    const loginUrl = 'http://8.129.225.124:8000/login';
    let tokenStr = '';
    const tokenArr = window.location.href.match(/token=(.*?)(&|$|#)/);
    if (Object.prototype.toString.call(tokenArr).indexOf('Array') !== -1) {
      if (tokenArr[1]) {
        tokenStr = tokenArr[1];
      }
    }
    if (tokenStr) {
      console.log('有参数');
      window.localStorage.setItem('SD_ACCESS_TOKEN', tokenStr);
      window.localStorage.setItem('SD_LOGIN_URL', loginUrl);
      window.location.href = window.location.origin + window.location.pathname;
    } else {
      console.log('没有参数');
    }
  },
  methods: {
    moment,
    //查询按钮
    onCheck() {
      this.current = 1;
      this.getMemberList();
    },
    //查看微应用详情
    onCheckDetail(param) {
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
      this.current = current;
      this.pageSize = pageSize;
      this.getMemberList();
    },
    //获取会员来源
    getClientList() {
      api
        .getClientList()
        .then(res => {
          console.log('res :>> ', res);
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

            this.$refs.memberForm.setFieldsValue({
              memberSource: this.formList[0].selectOptions[0].id
            });
            this.getMemberList();
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //获取表格数据
    getMemberList() {
      this.tableLoading = true;

      let memberSource = '';
      if (this.$refs.memberForm.getFieldsValue().memberSource) {
        memberSource = this.$refs.memberForm.getFieldsValue().memberSource;
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
        memberSource: memberSource,
        phone: phoneNo,
        createTimeStart: jointimeStart,
        createTimeEnd: jointimeEnd,
        isAll: 0,
        pageIndex: this.current,
        pageSize: this.pageSize
      };
      console.log('getMemberList para :>> ', para);

      // for (let index = 0; index < mock.data.records.length; index++) {
      //   const element = mock.data.records[index];
      //   element.id = Date.now().toString(32) + index;
      // }

      // this.total = mock.data.total;
      // this.tableData.splice(0, this.tableData.length);
      // mock.data.records.forEach(element => {
      //   this.tableData.push(element);
      // });

      api
        .getMemberList(para)
        .then(res => {
          console.log('getMemberList res :>> ', res);
          if (res.code === 200) {
            this.total = res.data.total;
            this.tableData.splice(0, this.tableData.length);
            res.data.records.forEach((element, index) => {
              // if (element.memberId === undefined || element.memberId === '') {
              //   element.memberId = Date.now().toString() + '-' + index;
              // }

              this.tableData.push(element);
            });
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
#microApplication {
  height: 100%;
  overflow: hidden;
}
.content_main {
  height: 100%;
  padding: 10px;
}
</style>
