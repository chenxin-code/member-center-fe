<template>
  <div class="release">
    <div class="release-header">行为管理</div>
    <div class="release-main" ref="contentMain">
      <a-row type="flex" style="height: 100%;flex-flow: row;">
        <a-col flex="auto" style="padding: 20px 10px;height: 100%;">
          <FormList routePath="/taskCenter-behavior/add" ref="behaviorForm" rowCol="4" :formList="formList"
                    :onSubmit="onSearch"/>
          <a-table :style="{marginTop: '20px'}" :columns="columns" :data-source="dataList" :pagination="false"
                   :loading="tableLoading" :scroll="{y: scrollY}" :row-key="(r, i) => i">
            <template slot="isUsingSlot" slot-scope="scope">
              <div class="editable-row-operations">
                <span v-html="parseIsUsing(scope.isUsing)"></span>
              </div>
            </template>
            <template slot="action" slot-scope="scope">
              <a @click="goDetail(scope.id)" style="padding-right: 10px;">查看详情</a>
              <a @click="goJournal(scope.id)" style="padding-right: 10px;">查看日志</a>
              <a @click="goEdit(scope.id)">编辑</a>
              <!--<a @click="">启用</a>
              <a @click="">禁用</a>-->
            </template>
          </a-table>
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            v-model="current"
            :current="current"
            :pageSize="pageSize"
            :pageSizeOptions="['10','20','50','100']"
            @change="change"
            @showSizeChange="showSizeChange"
            style="margin-top: 30px;width: 100%;text-align: right;"/>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from './../../../api';
import FormList from './../../../components/FormList/index.jsx';
import moment from 'moment';
export default {
  name: 'taskCenter-behavior',
  components: {
    FormList
  },
  data() {
    return {
      pageSize: 10,
      current: 1,
      total: 0,
      tableLoading: false,
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      formList: [
        {
          label: '行为类型',
          type: 'select',
          placeholder: "全部",
          name: 'type',
          selectOptions: [
            {id: '', name: '全部'},
            {id: '1', name: '消费'},
            {id: '2', name: '其他'}
          ],
          labelCol: {span: 6},
          wrapperCol: {span: 18}
        },
        {
          label: '行为名称',
          type: "input",
          placeholder: "请输入",
          name: 'name',
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
          buttonName: '创建行为',
          htmlType: 'button',
          align: 'right',
          labelCol: {span: 0},
          wrapperCol: {span: 24}
        }
      ],
      columns: [
        {
          dataIndex: 'type',
          key: 'type',
          title: '行为类型',
          customRender: text => text === 1 ? '消费' : '其他',
          width: 150
        },
        {
          title: '行为名称',
          key: 'name',
          dataIndex: 'name',
          width: 150
        },
        {
          title: '行为来源',
          key: 'sourceName',
          dataIndex: 'sourceName',
          width: 150
        },
        {
          title: '状态',
          key: 'isUsingSlot',
          scopedSlots: { customRender: 'isUsingSlot' },
          width: 120
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: {customRender: 'action'},
          width: 150
        }
      ],
      dataList: [],
      rangeTime: [],
      name: '',
      type: '',
      scrollY: 100,
    }
  },
  computed: {
    parseIsUsing() {
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
  },
  created() {
    this.getList();
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 290 + 'px';
    }, 0)
  },
  methods: {
    onSearch(args) {
      const {type, name, createTime} = args;
      this.name = name || null;
      this.type = type || null;
      this.rangeTime = createTime || [];
      this.current = 1;
      this.getList();
    },
    goAdd() {
      this.$router.push({path: '/taskCenter-behavior/add'});
    },
    goDetail(id) {
      this.$router.push({path: '/taskCenter-behavior/detial', query: {id: id}});
    },
    goJournal(id) {
      this.$router.push({path: '/taskCenter-behavior/journal', query: {id: id}});
    },
    goEdit(id) {
      this.$router.push({path: '/taskCenter-behavior/edit', query: {id: id}});
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
    getList() {
      this.tableLoading = true;
      api.getDealingList({
        pageIndex: this.current,
        pageSize: this.pageSize,
        createTimeStart: this.rangeTime.length > 0 ? moment(this.rangeTime[0]).format('YYYY-MM-DD') : null,
        createTimeEnd: this.rangeTime.length > 0 ? moment(this.rangeTime[1]).format('YYYY-MM-DD') : null,
        type: this.type,
        name: this.name
      }).then(res => {
        this.dataList = res.data.records.map((item, index) => {
          return {
            ...item,
            key: index
          }
        });
        this.total = res.data.total;
      }).finally(() => {
        this.tableLoading = false;
      })
    },
  },
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 通过这个控制刷新
    if (!this.$route.meta.isUseCache) {
      this.$nextTick(() => {
        this.$refs.behaviorForm.setFieldsValue({
          type: this.formList[0].selectOptions[0].id
        });
      });
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.rangeTime = [];
      this.name = '';
      this.type = '';
      //初始化加载数据
      this.$refs.behaviorForm.form.resetFields();
      this.getList();
    }
    //重置
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
}
</script>

<style lang="less" scoped>
.release {
  height: 100%;
  overflow: hidden;

  &-header {
    border-bottom: 1px solid #e8e8e8;
    line-height: 60px;
    padding-left: 40px;
  }

  &-main {
    height: 100%;

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
      width: 15% !important;
      padding-left: 0 !important;
      padding-right: 30px !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(8) {
      width: 15% !important;
      padding-left: 0 !important;
      padding-right: 30px !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(3) {
      width: 30% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(7) {
      width: 30% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
