<template>
  <div class="taskManager">
    <div class="taskManager-header">行为管理</div>
    <div class="taskManager-main" ref="contentMain">
      <a-form-model :model="formList" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row class="searchContent">
          <a-col :span="6">
            <a-form-model-item label="游戏方式" >
              <a-select v-model="formList.type" placeholder="请选择">
                <a-select-option v-for="(item,sindex) in formList.selectOptions" :key="sindex" :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="游戏名称">
              <a-input v-model="formList.name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label :wrapper-col="{ span: 24, offset: 4 }">
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button type="primary" @click="onCreateBehavior" style="margin-left: 10px;">新建游戏</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
          <FilterForm ref="form" rowCol="3" :formList="this.formList" :onSubmit="this.onSearch" />
          <a-table :style="{marginTop: '20px'}" :columns="columns" :data-source="dataList" :pagination="false" :loading="tableLoading" :scroll="{y: scrollY}">
            <span slot="action" class="record" slot-scope="record">
              <a @click="onCheck(record)">启用</a>
              <a @click="onCheck(record)">禁用</a>
              <a @click="onCheck(record)">删除</a>
              <a @click="onCheck(record)">编辑</a>
              <a @click="onCheck(record)">查看活动人员</a>
            </span>
          </a-table>
          <a-pagination :total="total" :show-total="total => `共 ${total} 条`" show-quick-jumper show-size-changer v-model="current" :current="current" :pageSize="pageSize" :pageSizeOptions="['10','20','50','100']"
            @change="change" @showSizeChange="showSizeChange" style="margin-top:30px;width:100%;text-align: right;" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
import api from "@/api";
export default {
  name: 'dealing',
  data() {
    return {
      pageSize: 10,
      current: 1,
      total: null,
      tableLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      formList: {
        type: "",
        name: "",
        createTime: "",
        selectOptions: [
          { id: '', name: '全部' },
          { id: '1', name: '九宫格' },
          { id: '2', name: '砸金蛋' }
        ]

      },
      columns: [
        {
          dataIndex: 'theme',
          key: 'theme',
          title: '游戏主题',
        },
        {
          title: '游戏名称',
          key: 'gameName',
          dataIndex: 'gameName'
        },
        {
          title: '游戏方式',
          key: 'gameMode',
          dataIndex: 'gameMode'
        },
        {
          title: '开始时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '结束时间',
          key: 'endTime',
          dataIndex: 'endTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      dataList: [],
      rangeTime: [],
      name: '',
      type: '',
      scrollY: 100,
    }
  },
  components: {
    FilterForm
  },
  created() {
    this.getTaskList()
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 290 + 'px';
    }, 0)
  },
  methods: {
    onChange(time) {
      this.formList.rangeTime = time;
    },
    onSearch() {
      this.name = this.formList.name || null;
      this.type = this.formList.type || null;
      this.rangeTime = this.formList.rangeTime || [];
      this.current = 1;
      this.getTaskList();
    },

    //查看详情
    onCheck(record) {
      this.$router.push({ name: 'taskCenter-behavior-detial', query: { id: record.id } });
    },
    //创建行为
    onCreateBehavior() {
      this.$router.push({ name: 'game-create' });
    },
    onEditBehavior(record) {
      this.$router.push({ name: 'taskCenter-behavior-edit', query: { id: record.id } });
    },

    // onShowSizeChange(current, pageSize) {
    //     this.current = current;
    //     this.pageSize = pageSize;
    //     this.getTaskList()
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
        createTimeStart: this.rangeTime.length > 0 ? moment(this.rangeTime[0]).format('YYYY-MM-DD') : null,
        createTimeEnd: this.rangeTime.length > 0 ? moment(this.rangeTime[1]).format('YYYY-MM-DD') : null,
        type: this.type,
        name: this.name,
      }
      api.getDealingList(args)
        .then(res => {
          this.tableLoading = false;
          this.dataList = res.data.records.map((item, index) => {
            return {
              ...item,
              key: index
            }
          });
          this.total = res.data.total;
        })
        .finally(() => this.tableLoading = false)
    },
  },
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 通过这个控制刷新
    if (!this.$route.meta.isUseCache) {
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.rangeTime = [];
      this.name = '';
      this.type = '';
      //初始化加载数据
      this.$refs.form.form.resetFields();
      this.getTaskList();
    }

    //重置
    this.$route.meta.isUseCache = false;
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === 'dealing_detail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'dealing_detail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  },
}
</script>
<style lang="less" scoped>
.searchContent {
  margin-top: 20px;
  margin-left: 10px;
}
.taskManager {
  height: 100%;
  &-header {
    border-bottom: 1px solid #e8e8e8;
    line-height: 60px;
    padding-left: 40px;
  }
  &-main {
    height: 100%;
  }
}
.record a {
  margin-right: 5px;
}
</style>
