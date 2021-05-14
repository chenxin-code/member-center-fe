<template>
  <div id="act-list">
    <div class="content-header">礼包管理</div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <FormList routePath="/gift/add" ref="thisForm" :rowCol="4" :formList="formList" :onSubmit="onQuery"/>
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ x: 958, y: scrollY }"
        :rowKey="(r, i) => i"
        style="width: 100%;margin-top: 8px;"
        :selectable="false"
        :loading="tableLoading">
        <template slot="statusSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="parseStatus(scope.status)"></span>
          </div>
        </template>
        <template slot="validitySlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="parseValidityStr(scope)"></span>
          </div>
        </template>
        <template slot="createTimeSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="momentStr(scope.createTime)"></span>
          </div>
        </template>
        <template slot="detailsSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <a style="padding-right: 10px;" @click="goGiftDetail(scope.id)">查看</a>
            <a style="padding-right: 10px;" @click="changeGiftBag(scope.id, 0)" v-if="scope.status === 1">禁用</a>
            <a style="padding-right: 10px;" @click="changeGiftBag(scope.id, 1)" v-else-if="scope.status === 0">启用</a>
            <a style="padding-right: 10px;" @click="goGiftEdit(scope.id)">编辑</a>
            <a style="padding-right: 10px;" @click="$router.push({path: '/gift/content',query: {id: scope.id}})">礼包内容管理</a>
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
  name: 'gift',
  components: {FormList},
  data() {
    return {
      formList: [
        {
          label: '礼包名称',
          type: 'input',
          name: 'name',
          placeholder: '请输入',
          labelCol: {span: 6},
          wrapperCol: {span: 18}
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
          key: 'statusSlot',
          scopedSlots: { customRender: 'statusSlot' },
          width: 120
        },
        {
          title: '有效期',
          key: 'validitySlot',
          scopedSlots: {customRender: 'validitySlot'},
          width: 250
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: {customRender: 'detailsSlot'},
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
  computed: {
    parseStatus() {
      return param => {
        if (param === 0) {
          return '禁用';
        } else if (param === 1) {
          return '启用';
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
    parseValidityStr() {
      return param => {
        return `${this.momentStrHms(param.startTime)} ～ ${this.momentStrHms(param.endTime)}`;
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
    goGiftDetail(id) {
      this.$router.push({
        path: '/gift/detail',
        query: {
          id: id
        }
      });
    },
    goGiftEdit(id) {
      this.$router.push({
        path: '/gift/edit',
        query: {
          id: id
        }
      });
    },
    changeGiftBag(id, state) {
      let title;
      if (state === 0) {
        title = '确认启用当前礼包？';
      } else if (state === 1) {
        title = '确认禁用当前礼包？';
      } else {
        title = '';
      }
      this.$confirm({
        title: title,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading = true;
          const formData = new FormData();
          formData.append('id', id);
          formData.append('status', state);
          api.changeGiftBag(formData).then(resp => {
            if (resp.code === 200) {
              this.getList();
            }
          }).finally(() => {
            this.tableLoading = false;
          });
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
        let name = '';
        let status = '';
        if (this.$refs.thisForm.getFieldsValue().name) {
          name = this.$refs.thisForm.getFieldsValue().name;
        }
        if (this.$refs.thisForm.getFieldsValue().status) {
          status = this.$refs.thisForm.getFieldsValue().status;
        }
        let startTime = '';
        let endTime = '';
        if (
          Object.prototype.toString.call(this.$refs.thisForm.getFieldsValue().createTime) === '[object Array]' &&
          this.$refs.thisForm.getFieldsValue().createTime.length > 1
        ) {
          startTime = moment(this.$refs.thisForm.getFieldsValue().createTime[0]).format('YYYY-MM-DD');
          endTime = moment(this.$refs.thisForm.getFieldsValue().createTime[1]).format('YYYY-MM-DD');
        }
        return api.selectGiftBagList({
          name: name,
          status: status,
          pageIndex: this.current,
          pageSize: this.pageSize,
          startTime: startTime,
          endTime: endTime
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
