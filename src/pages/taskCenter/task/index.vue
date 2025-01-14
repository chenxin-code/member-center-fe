<template>
  <div class="taskManager">
    <div class="taskManager-header">任务管理</div>
    <div class="taskManager-main" ref="contentMain" >
      <a-form-model ref="ruleForm" :model="formList" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row class="searchContent">
          <a-col :span="6">
            <a-form-model-item label="任务名称">
              <a-input v-model.trim="formList.taskName" whitespace />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="任务key">
              <a-input v-model.trim="formList.taskKey" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="任务状态">
              <a-select v-model.trim="formList.status" placeholder="请选择">
                <a-select-option
                  v-for="(item,sindex) in formList.statusOption"
                  :key="sindex"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label :wrapper-col="{ span: 20, offset: 4 }" class="search-btn">
              <a-button type="primary" @click="onSearch" :disabled="tableLoading">查询</a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="任务来源">
              <a-select v-model.trim="formList.taskSource" placeholder="请选择">
                <a-select-option
                  v-for="(item,sindex) in formList.taskSourceOption"
                  :key="sindex"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="创建时间">
              <a-range-picker @change="onChange" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label :wrapper-col="{ span: 20, offset: 4 }" class="search-btn">
              <a-button type="primary" @click="onCreateTask" style="margin-left: 10px;">新建任务</a-button>
            </a-form-model-item>
          </a-col>
         
        </a-row>
      </a-form-model>
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <a-col flex="auto" style="padding:10px 10px;height:100%;">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="false"
            :loading="tableLoading"
            :scroll="{ y: scrollY }"
          >
            <span slot="action" slot-scope="record">
              <a-button type="link" class="record" @click="onCheck(record)">查看</a-button>
              <a-button type="link" class="record" @click="onStatus(record)">{{record.status === 1 ? '禁用' : '启用'}}</a-button>
              <a-button type="link" class="record" @click="onEditTask(record)" :disabled="record.status === 1">编辑</a-button>
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
// import FilterForm from '@/components/FilterGroup/index.jsx';
import FormList from '@/components/FormList/index.jsx';
import moment from 'moment';
import api from '@/api';
import { getTaskList, postUpdateStatus } from '@/api/task';
export default {
  name: 'task-manager',
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      scrollY: 100,
      pageSize: 10,
      current: 1,
      total: null,
      tableLoading: false,
      formList: {
        taskName: '',
        taskKey: '',
        status: '',
        taskDate: '',
        taskSource: '',
        createTimeStart: '',
        createTimeEnd: '',
        statusOption: [{ id: '', name: '全部' }, { id: '0', name: '禁用' }, { id: '1', name: '启用' }],
        taskSourceOption: []
      },
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
          width: 200,
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
    // FormList
  },
  mounted() {
    this.getTaskSource();
    this.getTaskList();
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 340 + 'px';
    }, 0);
  },
  methods: {
    onChange(time) {
      this.formList.taskDate = time;
    },
    onSearch() {
      this.taskKey = this.formList.taskKey || null;
      this.taskName = this.formList.taskName || null;
      this.taskSource = this.formList.taskSource || null;
      this.status = this.formList.status || null;
      this.taskDate = this.formList.taskDate || [];
      this.current = 1;
      this.getTaskList();
    },

    onCheck(record) {
      this.$router.push({ name: 'taskCenter-task-detial', query: { id: record.id } });
    },
    onEditTask(record) {
      this.$router.push({ name: 'taskCenter-task-create', query: { id: record.id, type: 'edit' } });
    },
    onCreateTask() {
      this.$router.push({ name: 'taskCenter-task-create', query: { type: 'add' } });
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
      getTaskList(args)
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
          this.formList.taskSourceOption = [].concat({ id: '', name: '全部' }, sourceList);
        });
    },

    // 是否启用
    onStatus(row) {
      this.tableLoading = true;
      postUpdateStatus({
        id: row.id,
        status: row.status === 1 ? 0 : 1
      })
        .then(res => {
          this.getTaskList();
          this.$message.success('状态已更改');
        })
        .finally(() => {
          this.tableLoading = false;
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
      this.$refs.ruleForm.resetFields();
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
.searchContent {
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
}
.taskManager {
  height: 100%;
  overflow: hidden;
  &-header {
    border-bottom: 1px solid #e8e8e8;
    line-height: 60px;
    padding-left: 40px;
  }
  &-main {
    height: 100%;
  }
  .record {
    padding: 0 5px;
  }
}
.table-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.search-btn ::v-deep .ant-form-item-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
