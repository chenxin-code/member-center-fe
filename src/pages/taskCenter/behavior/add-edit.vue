<template>
  <div class="form-body">
    <a-form :form="behaviorForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="行为名称">
        <div v-if="$route.path === '/taskCenter-behavior/edit'">{{ name }}</div>
        <a-input v-decorator="[
          'name',
          {
            rules: [
              {required: true, message: '请输入行为名称'}
            ]
          }
        ]" @change="nameChange" v-else/>
      </a-form-item>
      <a-form-item label="行为代码">
        <div v-if="$route.path === '/taskCenter-behavior/edit'">{{ code }}</div>
        <a-input v-decorator="[
          'code',
          {
            rules: [
              {required: true, message: '请输入行为代码'}
            ]
          }
        ]" @change="codeChange" v-else/>
      </a-form-item>
      <a-form-item label="行为来源">
        <div v-if="$route.path === '/taskCenter-behavior/edit'">{{ laiyuan }}</div>
        <a-select v-decorator="[
          'sysSource',
          {
            rules: [
              {required: true, message: '请选择行为来源'}
             ]
          }
        ]" @change="laiyuanChange" placeholder="请选择" v-else>
          <a-select-option v-for="(v,k) in laiyuanArray" :key="k" :value="v.appCode">{{ v.appName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="行为类型">
        <div v-if="$route.path === '/taskCenter-behavior/edit'">{{ leixing }}</div>
        <a-select v-decorator="[
          'type',
          {
            rules: [
              {required: true, message: '请选择行为类型'}
              ]
          }
        ]" @change="leixingChange" placeholder="请选择" v-else>
          <a-select-option v-for="(v,k) in leixingArray" :key="k" :value="v.id">{{ v.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="行为描述">
        <a-textarea @change="memoChange" placeholder="" v-decorator="[
          'memo',
          {
            initialValue: memo,
            rules: [
              {required: true, message: '请输入行为描述'},
              { max: 100, message: '最多输入100个字符' }
             ]
          }
        ]" :maxLength="250" :rows="4"/>
      </a-form-item>
      <a-form-item label="关联的任务">
        <a-button type="primary" @click="fn_selectTask()">添加任务</a-button>
        <a-table v-if="taskData.length > 0" :columns="columns1" :bordered="true" :pagination="false"
                 :data-source="taskData">
          <a slot="action" slot-scope="rowdata" @click="deleteTask(rowdata)">删除</a>
        </a-table>
      </a-form-item>
      <a-form-item label="行为状态">
        <a-switch checked-children="启用" un-checked-children="禁用" v-model="isUsing" @change="isUsingChange"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" @click="saveBehavior()" :loading="saveLoading"
                  style="margin-right:10px">保存
        </a-button>
        <a-button type="primary" html-type="submit" @click="$router.push({ path: '/taskCenter-behavior' })">取消
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal title="添加任务" :visible="visible" @ok="handleOk" @cancel="handleCancel" width="1300px">
      <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch"/>
      <a-table
        :style="{ marginTop: '20px' }"
        :columns="columns2"
        :data-source="tableDataList"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: 300 }"
        :row-selection="rowSelection">
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
    </a-modal>
  </div>
</template>
<script>
import api from './../../../api';
import FilterForm from './../../../components/FilterGroup/index.jsx';
import moment from 'moment';

export default {
  name: 'taskCenter-behavior-add-edit',
  components: {
    FilterForm
  },
  data() {
    return {
      memo: null,
      type: null,
      sysSource: null,
      name: null,
      code: null,
      isUsing: true,
      laiyuanArray: [],
      leixingArray: [
        {id: 1, name: '消费'},
        {id: 2, name: '其他'}
      ],
      laiyuan: null,//编辑
      leixing: null,//编辑
      id: null,//编辑
      saveLoading: false,
      total: 0,
      pageSize: 10,
      current: 1,
      tableLoading: false,
      tableDataList: [],
      behaviorForm: this.$form.createForm(this, {name: "behaviorForm"}),
      columns1: [
        {
          title: '任务名称',
          dataIndex: 'taskName',
          key: 'taskName',
          align: "center",
        },
        {
          title: '任务描述',
          dataIndex: 'memo',
          key: 'memo',
          align: "center",
        },
        {
          title: '奖励类型',
          dataIndex: 'taskCondition',
          key: 'taskCondition',
          align: "center",
        },
        {
          title: '操作',
          key: 'action',
          align: "center",
          scopedSlots: {customRender: 'action'}
        }],
      columns2: [
        {
          title: '任务Key',
          dataIndex: 'taskKey',
          key: 'taskKey',
        },
        {
          title: '任务名称',
          dataIndex: 'taskName',
          key: 'taskName',
        },
        {
          title: '任务有效期(天)',
          dataIndex: 'validity',
          key: 'validity',
        },
        {
          title: '是否周期性',
          dataIndex: 'isPeriodic',
          key: 'isPeriodic',
          customRender: text => (text === 1 ? '是' : '否')
        },
        {
          title: '任务状态',
          dataIndex: 'status',
          key: 'status',
          customRender: text => (text === 0 ? '禁用' : '启用')
        },
        {
          title: '对应行为',
          dataIndex: 'behaviourName',
          key: 'behaviourName',
        },
        {
          title: '任务来源',
          dataIndex: 'sourceName',
          key: 'sourceName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      ],
      taskData: [],
      visible: false,
      taskSourceOption: [],
      formList: [
        {
          label: '任务key',
          type: 'input',
          placeholder: '请输入',
          name: 'taskKey'
        },
        {
          label: '任务名称',
          type: 'input',
          placeholder: '请输入',
          name: 'taskName'
        },
        {
          label: '任务状态',
          name: 'status',
          type: 'select',
          placeholder: '全部',
          selectOptions: [{id: '', name: '全部'}, {id: '0', name: '禁用'}, {id: '1', name: '启用'}]
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
      selectedRows: [],
      selectedRowKeys: [],
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows;
          this.selectedRowKeys = selectedRowKeys;
        },
        type: 'checkbox'
      };
    }
  },
  created() {
  },
  mounted() {
  },
  activated() {
    let sourceList = [];
    api.getTaskSource().then(
      res => (sourceList = res.data.map(item => {
        return {id: item.appCode, name: item.appName};
      }))
    ).then(() => {
      this.formList = this.formList.map(item => {
        if (item.name === 'taskSource') {
          return {
            ...item,
            selectOptions: [].concat({id: '', name: '全部'}, sourceList)
          };
        } else {
          return item;
        }
      });
    });
    ///////////////////////////////////
    this.laiyuanArray = [];
    api.getClientList().then(resp => {
      if (resp.code === 200) {
        resp.data.forEach((v, k) => {
          this.laiyuanArray.push({
            appCode: v.appCode,
            appName: v.appName
          });
        });
        if (this.$route.path === '/taskCenter-behavior/edit') {
          api.selectBehaviour({
            id: this.$route.query.id
          }).then(resp2 => {
            if (resp2.code === 200) {
              this.id = resp2.data.id;
              this.name = resp2.data.name;
              this.code = resp2.data.code;
              this.memo = resp2.data.memo;
              this.isUsing = !!Number(resp2.data.isUsing);
              this.laiyuanArray.forEach((v, k) => {
                if (v.appCode === resp2.data.sysSource) {
                  this.laiyuan = v.appName;
                }
              });
              this.leixingArray.forEach((v, k) => {
                if (v.id === resp2.data.type) {
                  this.leixing = v.name;
                }
              });
              resp2.data.taskList.forEach((v, k) => {
                this.taskData.push({
                  taskName: v.taskName,
                  memo: v.memo,
                  taskCondition: v.taskCondition
                });
              });
            }
          });
        }
      }
    });
  },
  methods: {
    saveBehavior() {
      if (this.$route.path === '/taskCenter-behavior/edit') {
        this.behaviorForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            let behaviourTask = [];
            this.taskData.forEach((v, k) => {
              behaviourTask.push({
                taskId: v.id,
                taskName: v.taskName
              });
            });
            api.editBehaviour({
              id: this.id,
              memo: this.memo,
              isUsing: this.isUsing ? 1 : 0,
              behaviourTask: behaviourTask
            }).then(res => {
              if (res.code === 200) {
                this.$router.replace({path: '/taskCenter-behavior'});
              }
            }).finally(() => {
              this.saveLoading = false;
            });
          }
        });
      } else if (this.$route.path === '/taskCenter-behavior/add') {
        this.behaviorForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            let behaviourTask = [];
            this.taskData.forEach((v, k) => {
              behaviourTask.push({
                taskId: v.id,
                taskName: v.taskName
              });
            });
            api.createBehaviour({
              name: this.name,
              code: this.code,
              sysSource: this.sysSource,
              type: this.type,
              memo: this.memo,
              isUsing: this.isUsing ? 1 : 0,
              behaviourTask: behaviourTask
            }).then(res => {
              if (res.code === 200) {
                this.$router.replace({path: '/taskCenter-behavior'});
              }
            }).finally(() => {
              this.saveLoading = false;
            });
          }
        });
      }
    },
    memoChange(e) {
      this.memo = e.target.value;
    },
    laiyuanChange(val) {
      this.sysSource = val;
    },
    leixingChange(val) {
      this.type = val;
    },
    nameChange(e) {
      this.name = e.target.value;
    },
    codeChange(e) {
      this.code = e.target.value;
    },
    isUsingChange(checked) {
      this.isUsing = checked;
    },
    onSearch(args) {
      const {taskName, taskKey, status} = args;
      this.taskName = taskName || null;
      this.taskKey = taskKey || null;
      this.status = status || null;
      this.current = 1;
      this.getList();
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
      api.getTaskList({
        pageIndex: this.current,
        pageSize: this.pageSize,
        status: this.status,
        taskKey: this.taskKey,
        taskName: this.taskName
      }).then(res => {
        this.tableDataList = res.data.records.map((item, index) => {
          return {
            ...item,
            key: index
          };
        });
        this.total = res.data.total;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    fn_selectTask() {
      this.visible = true;
      this.selectedRows = [];
      this.selectedRowKeys = [];
      this.getList();
    },
    handleOk() {
      if (this.selectedRows.length > 0) {
        this.visible = false;
        this.taskData.forEach((v1, k1) => {
          this.selectedRows.forEach((v2, k2) => {
            if (v1.id === v2.id) {
              console.log('已添加该任务');
              this.selectedRows.splice(k2, 1);
            }
          })
        })
        this.taskData = this.taskData.concat(this.selectedRows);
      } else {
        this.$message.error('没有选择任务');
      }
    },
    handleCancel() {
      this.visible = false;
    },
    deleteTask(resData) {
      this.taskData.forEach((item, index) => {
        if (resData.key === item.key) {
          this.taskData.splice(index, 1);
        }
      })
    }
  },
  watch: {}
}
</script>

<style lang="less">
.form-body {
  padding: 20px 0;
}
</style>
