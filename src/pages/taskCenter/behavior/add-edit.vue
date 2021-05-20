<template>
  <div id="coupons-detail">
    <div class="content-header">
      {{ $route.path === '/taskCenter-behavior/add' ? '创建' : '编辑' }}行为
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer;">返回</span>
    </div>
    <div class="coupons-main">
      <a-row style="height: 100%;">
        <div class="coupons-common coupons-base">
          <a-row class="common-row">
            <a-col :span="24">
              <a-form :form="behaviorForm" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
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
              {required: true, message: '请输入行为代码'},
              {validator: this.checkBehaviorCode, trigger: ['blur']}
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
                    <a-select-option v-for="(v,k) in laiyuanArray" :key="k" :value="v.appCode">{{
                        v.appName
                      }}
                    </a-select-option>
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
        ]" :maxLength="250" :rows="4" allow-clear/>
                </a-form-item>
                <a-form-item label="关联的任务">
                  <a-button type="primary" @click="fn_selectTask()">添加任务</a-button>
                  <a-table v-if="taskData.length > 0" :columns="columns1" :bordered="true" :pagination="false"
                           :data-source="taskData" :row-key="(r, i) => i">
                    <template slot="jianglileixing" slot-scope="scope">
                      <div class="editable-row-operations">
                        <span v-html="parseJianglileixing(scope)"></span>
                      </div>
                    </template>
                    <a slot="action" slot-scope="scope" @click="deleteTask(scope)">删除</a>
                  </a-table>
                </a-form-item>
                <a-form-item label="行为状态">
                  <a-switch checked-children="启用" un-checked-children="禁用" v-model="isUsing" @change="isUsingChange" />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="saveBehavior()" :loading="saveLoading"
                            style="margin-right: 10px;">保存
                  </a-button>
                  <a-button html-type="submit" @click="$router.replace({ path: '/taskCenter-behavior' })">取消
                  </a-button>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </div>
      </a-row>
    </div>
    <a-modal title="添加任务" :visible="visible" @ok="handleOk" @cancel="handleCancel" width="1300px">
      <FilterForm ref="form" rowCol="4" :formList="formList" :onSubmit="onSearch" />
      <a-table
        :row-key="(r, i) => i"
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
        style="margin-top: 30px;width: 100%;text-align: right;"
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
      rangeTime: [],
      sourceName: null,
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
          key: 'jianglileixing',
          scopedSlots: { customRender: 'jianglileixing' },
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
          label: '任务来源',
          type: 'select',
          name: 'sourceName',
          placeholder: '全部',
          selectOptions: [],
          rules: [],
          initialValue: '全部'
        },
        {
          label: '创建时间',
          type: 'rangePicker',
          name: 'createTime'
        }
      ],
      selectedRows: [],
      selectedRowKeys: [],
    }
  },
  computed: {
    parseJianglileixing() {
      return param => {
        if (param.awardIntegral && !param.awardGrow) {
          return '邦豆';
        } else if (!param.awardIntegral && param.awardGrow) {
          return '成长值';
        } else if (param.awardIntegral && param.awardGrow) {
          return '邦豆，成长值';
        } else if (!param.awardIntegral && !param.awardGrow) {
          return '其它';
        } else {
          return '';
        }
      };
    },
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
  methods: {
    checkBehaviorCode(rule, value, callback) {
      if (value && !/^[a-z_]+$/.test(value)) {
        callback(new Error('行为代码格式不正确'));
      } else {
        callback();
      }
    },
    saveBehavior() {
      if (this.$route.path === '/taskCenter-behavior/edit') {
        this.behaviorForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            let behaviourTask = [];
            if (this.taskData.length === 0) {
              this.$message.error('必须选择关联的任务');
              this.saveLoading = false;
              return
            }
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
            if (this.taskData.length === 0) {
              this.$message.error('必须选择关联的任务');
              this.saveLoading = false;
              return
            }
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
      const {taskName, taskKey, sourceName, createTime} = args;
      this.taskName = taskName || null;
      this.taskKey = taskKey || null;
      this.sourceName = sourceName || null;
      this.rangeTime = createTime || [];
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
        status: '1',//启用
        taskKey: this.taskKey ? this.taskKey : '',
        taskName: this.taskName ? this.taskName : '',
        taskSource: this.sourceName,
        createTimeStart: this.rangeTime.length > 0 ? moment(this.rangeTime[0]).format('YYYY-MM-DD') : null,
        createTimeEnd: this.rangeTime.length > 0 ? moment(this.rangeTime[1]).format('YYYY-MM-DD') : null
      }).then(resp => {
        this.tableDataList = resp.data.records.map((v, k) => {
          return {
            ...v,
            key: k
          };
        });
        this.total = resp.data.total;
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
        this.$message.error('至少选择1个任务');
      }
    },
    handleCancel() {
      this.visible = false;
    },
    deleteTask(scope) {
      this.taskData.forEach((v, k) => {
        if (scope.key === v.key) {
          this.taskData.splice(k, 1);
        }
      })
    }
  },
  created() {
    let sourceList = [];
    api.getTaskSource().then(
      res => (sourceList = res.data.map(item => {
        return {id: item.appCode, name: item.appName};
      }))
    ).then(() => {
      this.formList = this.formList.map(item => {
        if (item.name === 'sourceName') {
          return {
            ...item,
            selectOptions: [].concat({id: '', name: '全部'}, sourceList)
          };
        } else {
          return item;
        }
      });
    });
    this.laiyuanArray = [];
    this.taskData = [];
    api.getClientList().then(resp => {
      if (resp.code === 200) {
        resp.data.forEach((v, k) => {
          this.laiyuanArray.push({
            appCode: v.appCode,
            appName: v.appName
          });
        });
      }
    });
    if (this.$route.path === '/taskCenter-behavior/edit') {
      api.selectBehaviour({
        id: this.$route.query.id
      }).then(resp => {
        if (resp.code === 200) {
          this.id = resp.data.id;
          this.name = resp.data.name;
          this.code = resp.data.code;
          this.memo = resp.data.memo;
          this.isUsing = !!Number(resp.data.isUsing);
          this.laiyuan = resp.data.sourceName;
          this.leixingArray.forEach((v, k) => {
            if (v.id === resp.data.type) {
              this.leixing = v.name;
            }
          });
          resp.data.taskList.forEach((v, k) => {
            this.taskData.push({
              id: v.id,
              taskName: v.taskName,
              memo: v.memo,
              awardIntegral: v.awardIntegral,
              awardGrow: v.awardGrow
            });
          });
        }
      });
    }
  },
  mounted() {},
  activated() {},
  watch: {}
}
</script>

<style lang="less" scoped>
#coupons-detail {
  height: 100%;

  .content-header {
    .fallback {
      cursor: pointer;
    }
  }

  .coupons-main {
    height: calc(100% - 50px);
    overflow-y: auto;

    .coupons-common {
      background-color: #fff;

      .common-title {
        color: #666;
        padding: 20px 0 0 30px;

        .common-title-content {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
          padding-left: 8px;
          border-left: 3px solid rgba(33, 33, 206, 0.5);
        }
      }

      .common-row {
        padding: 20px 16px 0;
        border-bottom: 1px dashed #ccc;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;

        ::v-deep .ant-form .ant-input-number {
          width: 100%;
        }

        .common-submit-cancle {
          padding: 30px 0 0 150px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .common-btn {
            margin-right: 30px;

            ::v-deep .ant-btn {
              box-sizing: content-box;
              padding: 2px 15px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: 500;
            }
          }

          .common-cancle {
            ::v-deep .ant-btn {
              color: #666;
              background-color: #fff;
              border-color: #ccc;
            }
          }
        }
      }

      .common-row:last-child {
        border: none;
      }
    }

    .coupons-base {
      padding-bottom: 50px;
    }
  }
}
</style>
