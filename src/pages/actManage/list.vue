<template>
  <div id="act-list">
    <div class="content-header">活动管理</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList routePath="/actManage/new" ref="memberForm" :rowCol="4" :formList="formList" :onSubmit="onQuery" />
      <!-- 表格 -->
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 958, y: scrollY }"
        :rowKey="(r, i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading"
      >
        <template slot="statusSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="actStatusStr(rowData.status)"></span>
          </div>
        </template>
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
            <a style="padding-right: 5px;" @click="goActDetail(rowData.id)">查看</a>
            <a v-show="rowData.status === 0" style="padding-right: 5px;" @click="updateActStatus(rowData.id, 0)">
              启用
            </a>
            <a
              v-show="rowData.status === 1 || rowData.status === 2"
              style="padding-right: 5px;"
              @click="updateActStatus(rowData.id, 1)"
            >
              停用
            </a>
            <a v-show="rowData.status === 0" style="padding-right: 5px;" @click="goActEdit(rowData.id)">编辑</a>
            <a v-show="rowData.status === 0" style="padding-right: 5px;" @click="deleteAct(rowData.id)">删除</a>
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
          label: '活动ID',
          type: 'input',
          name: 'activityId',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动主题',
          type: 'input',
          name: 'themeName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动名称',
          type: 'input',
          name: 'activityName',
          placeholder: '请输入',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
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
          label: '活动类型',
          type: 'select',
          name: 'typeId',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '领券中心', id: 1 },
            { name: '会员权益', id: 2 },
            { name: '邦豆兑换', id: 3 }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动状态',
          type: 'select',
          name: 'status',
          placeholder: '请选择',
          selectOptions: [
            { name: '全部', id: '' },
            { name: '已创建', id: 0 },
            { name: '未开始', id: 1 },
            { name: '进行中', id: 2 },
            { name: '已结束', id: 3 },
            { name: '已停用', id: 4 },
            { name: '已删除', id: 5 }
          ],
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动有效期',
          type: 'rangePicker',
          name: 'jointime',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          type: 'btn-default',
          buttonName: '新建活动',
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
          title: '活动ID',
          dataIndex: 'id',
          key: 'id',
          width: 200
        },
        {
          title: '活动主题',
          dataIndex: 'themeName',
          key: 'themeName',
          width: 180
        },
        {
          title: '活动名称',
          dataIndex: 'activityName',
          key: 'activityName',
          width: 180
        },
        {
          title: '活动类型',
          dataIndex: 'typeName',
          key: 'typeName',
          width: 120
        },
        {
          title: '活动状态',
          key: 'statusSlot',
          scopedSlots: { customRender: 'statusSlot' },
          width: 100
        },
        {
          title: '活动有效期',
          key: 'validitySlot',
          scopedSlots: { customRender: 'validitySlot' },
          width: 250
        },
        {
          title: '创建用户',
          dataIndex: 'createUserName',
          key: 'createUserName',
          width: 180
        },
        {
          title: '创建时间',
          key: 'createTimeSlot',
          scopedSlots: { customRender: 'createTimeSlot' },
          width: 150
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: { customRender: 'detailsSlot' },
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
    // createUserStr() {
    //   return param => {
    //     // console.log('createUserStr param :>> ', param);
    //     if (param.length > 0) {
    //       if (param.createUser) {
    //         return param.createUser;
    //       } else {
    //         return 'createUser空2';
    //       }
    //     } else {
    //       return 'createUser空1';
    //     }
    //   };
    // },
    // createTimeStr() {
    //   return param => {
    //     if (param.length > 0) {
    //       if (param.createUser) {
    //         return this.momentStrHms(param.createTime);
    //       } else {
    //         return 'createTime空2';
    //       }
    //     } else {
    //       return 'createTime空1';
    //     }
    //   };
    // },
    parseValidityStr() {
      return param => {
        return `${this.momentStr(param.startTime)} - ${this.momentStr(param.endTime)}`;
      };
    },
    actStatusStr() {
      return param => {
        if (param === 0) {
          return '已创建';
        } else if (param === 1) {
          return '未开始';
        } else if (param === 2) {
          return '进行中';
        } else if (param === 3) {
          return '已结束';
        } else if (param === 4) {
          return '已停用';
        } else if (param === 5) {
          return '已删除';
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
      this.getActList(true);
    },
    //查看卡券详情
    goActDetail(id) {
      console.log('goActDetail id :>> ', id);
      this.$router.push({
        name: 'actManageDetail',
        query: {
          id: id
        }
      });
    },
    //编辑卡券
    goActEdit(id) {
      console.log('id :>> ', id);
      this.$router.push({
        name: 'actManageEdit',
        query: {
          id: id
        }
      });
    },
    //删除卡券
    deleteAct(paramId) {
      this.$confirm({
        title: '确认删除当前活动？',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const para = {
            id: paramId
          };
          console.log('deleteAct para :>> ', para);
          this.tableLoading = true;
          api.deleteAct(para).then(res => {
            console.log('deleteAct res :>> ', res);
            if (res.code === 200) {
              this.getActList();
            }
          });
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
        title = '确认停用当前活动？';
        content = '活动停用后用户无法继续参加';
      } else {
        title = '';
        content = '';
      }

      console.log('paramId :>> ', paramId);
      console.log('state :>> ', state);

      this.$confirm({
        title: title,
        content: content,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const para = {
            id: paramId,
            isEnable: state
          };
          console.log('updateActStatus para :>> ', para);
          this.tableLoading = true;
          api.updateActStatus(para).then(res => {
            console.log('updateActStatus res :>> ', res);
            if (res.code === 200) {
              this.getActList();
            }
          });
        }
      });
    },

    // 分页
    // onShowSizeChange(current, pageSize) {
    //   this.current = current;
    //   this.pageSize = pageSize;
    //   this.getActList();
    // },

    change(page) {
      this.current = page;
      this.getActList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getActList();
    },

    //获取活动列表
    getActList(isQuery = false) {
      if (isQuery) {
        this.current = 1;
      }
      this.tableLoading = true;
      this.$nextTick(() => {
        let activityId = ''; //活动id
        let activityName = ''; //活动名称
        let status = ''; //活动状态
        let themeName = ''; //主题名称
        let typeId = ''; //活动类型

        if (this.$refs.memberForm.getFieldsValue().activityId) {
          activityId = this.$refs.memberForm.getFieldsValue().activityId;
        }
        if (this.$refs.memberForm.getFieldsValue().activityName) {
          activityName = this.$refs.memberForm.getFieldsValue().activityName;
        }
        if (this.$refs.memberForm.getFieldsValue().status || this.$refs.memberForm.getFieldsValue().status === 0) {
          status = this.$refs.memberForm.getFieldsValue().status;
        }
        if (this.$refs.memberForm.getFieldsValue().themeName) {
          themeName = this.$refs.memberForm.getFieldsValue().themeName;
        }
        if (this.$refs.memberForm.getFieldsValue().typeId) {
          typeId = this.$refs.memberForm.getFieldsValue().typeId;
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
          activityId: activityId, //活动id
          activityName: activityName, //活动名称
          status: status, //活动状态
          themeName: themeName, //主题名称
          typeId: typeId, //活动类型
          pageIndex: this.current, //起始页
          pageSize: this.pageSize, //每页展示条数
          startTime: jointimeStart, //开始时间
          endTime: jointimeEnd //结束时间
        };

        console.log('getActList para :>> ', para);

        return api
          .getActList(para)
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getActList res :>> ', res);
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
      this.$nextTick(() => {
        this.$refs.memberForm.setFieldsValue({
          typeId: this.formList[4].selectOptions[0].id
        });
        this.$refs.memberForm.setFieldsValue({
          status: this.formList[5].selectOptions[0].id
        });
      });
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.$refs.memberForm.form.resetFields();

      //初始化加载数据
      this.getActList();
    }
    //重置data
    this.$route.meta.isUseCache = false;

    // this.$nextTick(() => {
    //   this.$refs.memberForm.setFieldsValue({
    //     typeId: this.formList[4].selectOptions[0].id
    //   });
    //   this.$refs.memberForm.setFieldsValue({
    //     status: this.formList[5].selectOptions[0].id
    //   });
    // });
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'actManageDetail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'actManageDetail') {
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
