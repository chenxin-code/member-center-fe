<template>
  <div class="taskManager">
    <div class="taskManager-header">任务管理</div>
    <div class="taskManager-main" ref="contentMain">
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
          <FilterForm ref="form" rowCol="3" :formList="this.formList" :onSubmit="this.onSearch" />
          <a-table
            :style="{ marginTop: '20px' }"
            :columns="columns"
            :data-source="dataList"
            :pagination="false"
            :loading="tableLoading"
            :scroll="{ y: scrollY }"
          >
            <span slot="action" slot-scope="record">
              <a @click="onCheck(record)">查看</a>
            </span>
          </a-table>
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            v-model="current"
            :current="current"
            :pageSize="pageSize"
            :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
            @change="change"
            @showSizeChange="showSizeChange"
            style="margin-top:30px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
import api from '@/api';
export default {
  name: 'task-manager',
  data() {
    return {
      scrollY: 100,
      pageSize: 10,
      current: 1,
      total: null,
      tableLoading: false,
      formList: [
        {
          label: '任务名称',
          name: 'taskName',
          type: 'input',
          placeholder: '请输入'
        },
        {
          label: '任务Key',
          type: 'input',
          placeholder: '请输入',
          name: 'taskKey'
        },
        {
          label: '任务状态',
          type: 'select',
          placeholder: '全部',
          name: 'status',
          selectOptions: [
            { id: '', name: '全部' },
            { id: '0', name: '禁用' },
            { id: '1', name: '启用' }
          ]
        },
        {
          label: '任务来源',
          type: 'select',
          name: 'taskSource',
          placeholder: '全部',
          selectOptions: [],
          rules: [],
          initialValue: '全部'
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'taskDate'
        }
      ],
      columns: [
        {
          dataIndex: 'taskKey',
          key: 'id',
          title: '任务key'
        },
        {
          title: '任务名称',
          key: 'taskName',
          dataIndex: 'taskName'
        },
        {
          title: '任务有效期(天)',
          key: 'validity',
          dataIndex: 'validity'
        },
        {
          title: '是否周期性',
          key: 'isPeriodic',
          dataIndex: 'isPeriodic',
          customRender: text => (text === 1 ? '是' : '否')
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          customRender: text => (text === 0 ? '禁用' : '启用')
        },
        {
          title: '对应行为',
          key: 'behaviourName',
          dataIndex: 'behaviourName'
        },
        {
          title: '任务来源',
          key: 'sourceName',
          dataIndex: 'sourceName'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm')
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataList: [],
      taskKey: '',
      taskDate: [],
      taskName: '',
      taskSource: '',
      status: null
    };
  },
  components: {
    FilterForm
  },
  mounted() {
    this.getTaskSource();
    this.getTaskList();
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 340 + 'px';
    }, 0);
  },
  methods: {
    onSearch(args) {
      const { taskKey, taskDate, taskName, taskSource, status } = args;
      this.taskKey = taskKey || null;
      this.taskName = taskName || null;
      this.taskSource = taskSource || null;
      this.status = status || null;
      this.taskDate = taskDate || [];
      this.current = 1;
      this.getTaskList();
    },

    onCheck(record) {
      this.$router.push({ name: 'task_detail', query: { id: record.id } });
    },

    // onShowSizeChange(current, pageSize) {
    //   this.current = current;
    //   this.pageSize = pageSize;
    //   this.getTaskList();
    // },
    change(page) {
      this.current = page;
      this.getTaskList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getTaskList();
    },

    getTaskList() {
      this.tableLoading = true;
      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        createTimeStart: this.taskDate.length ? moment(this.taskDate[0]).format('YYYY-MM-DD') : null,
        createTimeEnd: this.taskDate.length ? moment(this.taskDate[1]).format('YYYY-MM-DD') : null,
        status: this.status,
        taskKey: this.taskKey,
        taskName: this.taskName,
        taskSource: this.taskSource
      };
      api
        .getTaskList(args)
        .then(res => {
          this.dataList = res.data.records.map((item, index) => {
            return {
              ...item,
              key: index
            };
          });
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    getTaskSource() {
      let sourceList = [];
      api
        .getTaskSource()
        .then(
          res =>
            (sourceList = res.data.map(item => {
              return { id: item.appCode, name: item.appName };
            }))
        )
        .then(() => {
          this.formList = this.formList.map(item => {
            if (item.name === 'taskSource') {
              return {
                ...item,
                selectOptions: [].concat({ id: '', name: '全部' }, sourceList)
              };
            } else {
              return item;
            }
          });
        });
    }
  },
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 通过这个控制刷新
    if (!this.$route.meta.isUseCache) {
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.taskKey = '';
      this.taskDate = [];
      this.taskName = '';
      this.taskSource = '';
      this.status = null;
      //初始化加载数据
      this.$refs.form.form.resetFields();
      this.getTaskList();
    }

    //重置
    this.$route.meta.isUseCache = false;
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === 'task_detail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'task_detail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  }
};
</script>

<style lang="less" scoped>
.taskManager {
  height: 100%;
  overflow: hide;
  &-header {
    border-bottom: 1px solid #e8e8e8;
    line-height: 60px;
    padding-left: 40px;
  }
  &-main {
    height: 100%;
  }
}
</style>
