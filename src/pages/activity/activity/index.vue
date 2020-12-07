<template>
  <div id="activity">
    <div class="content-header">活动列表</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" @click="onAdd">新建</a-button>
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{ x: 1600, y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="isDefault" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.isDefault === 0">是</span>
                <span v-if="operation.isDefault === 1">否</span>
              </div>
            </template>
            <template slot="projectIds" slot-scope="operation">
              <div class="editable-row-operations" style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                <span v-if="data.length > 0 && operation.proIds">{{handleProjectData(data,operation.proIds).join(",")}}</span>
              </div>
            </template>
            <template slot="status" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.status === 0">启用</span>
                <span v-if="operation.status === 1">禁用</span>
              </div>
            </template>
            <template slot="updateTime" slot-scope="operation">
              <div class="editable-row-operations">
                <span>{{moment(operation.updateTime).format("YYYY-MM-DD HH:mm")}}</span>
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a @click="onEdit(operation)">编辑</a>
                <a @click="onDelete(operation)">删除</a>
              </div>
            </template>
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            v-model="current"
            :default-current="current"
            :page-size.sync="pageSize"
            :pageSizeOptions="['10','20','50','100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:30px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { ADVERTISE_SKIP_TYPE } from "@/constance";
  import FormList from "@/components/FormList/index.jsx";
  import moment from "moment";
  import { debounce } from '@/utils/util';
  export default {
    name: "activity",
    data() {
      return {
        formList: [
          {
            label: "项目",
            type: "select",
            name: "projectId",
            placeholder: "请选择项目",
            selectOptions: [],
          },
          {
            label: "分类",
            type: "select",
            name: "type",
            placeholder: "请选择类型",
            selectOptions: [
              {
                id: "",
                name: "全部"
              },
              {
                id: 0,
                name: "待审核"
              },
              {
                id: 1,
                name: "已通过"
              },
              {
                id: 2,
                name: "已驳回"
              },
            ],
          },
          {
            label: "状态",
            type: "select",
            name: "status",
            selectOptions: [
              {
                id: "",
                name: "全部"
              },
              {
                id: 0,
                name: "是"
              },
              {
                id: 1,
                name: "否"
              },
            ],
          },
          {
            label: "发布方",
            type: "select",
            name: "status",
            selectOptions: [
              {
                id: "",
                name: "全部"
              },
              {
                id: 0,
                name: "是"
              },
              {
                id: 1,
                name: "否"
              },
            ],
          },
          {
            label: "标题",
            type: "input",
            name: "title",
            placeholder: "请输入",
          },
          {
            type: "button",
            buttonName: "查询",
            htmlType: "submit",
            align: "right",
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
          }
        ],
        //表格高度
        scrollY: 100,
        //表头数据
        tableColumns: [
          {
            title: "标题",
            key: "projectIds",
            scopedSlots: { customRender: "projectIds" },
            // width: 120,
            ellipsis: true,
          },
          {
            title: "活动分类",
            dataIndex: "title",
            key: "title",
            width: 120,
            ellipsis: true,
          },
          {
            title: "发布方",
            key: "type",
            dataIndex: "type",
            // width: 120,
            ellipsis: true,
            customRender: (val) => ADVERTISE_SKIP_TYPE[val] || val
          },
          {
            title: "可报名人数",
            key: "type1",
            dataIndex: "type1",
            // width: 120,
            ellipsis: true,
            customRender: (val) => ADVERTISE_SKIP_TYPE[val] || val
          },
          {
            title: "状态",
            key: "updateTime",
            scopedSlots: { customRender: "updateTime" },
            // width: 200,
            ellipsis: true,
          },
          {
            title: "报名人数",
            key: "status",
            scopedSlots: { customRender: "status" },
            // width: 120,
            ellipsis: true,
          },
          {
            title: "签到人数",
            key: "status1",
            scopedSlots: { customRender: "status" },
            // width: 120,
            ellipsis: true,
          },
          {
            title: "开始时间",
            dataIndex: "createUserName",
            key: "createUserName",
            // width: 120,
            ellipsis: true,
          },
          {
            title: "结束时间",
            dataIndex: "createUserName2",
            key: "createUserName2",
            // width: 120,
            ellipsis: true,
          },
          {
            title: "创建日期",
            dataIndex: "createUserName1",
            key: "createUserName1",
            // width: 120,
            ellipsis: true,
          },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
            fixed: "right",
          },
        ],
        //列表数据
        tableData: [],
        tableLoading: false,
        //分页
        total: 0,
        pageSize: 10,
        current: 1,
        data:[],
        tableRefresh: false,
        pageRefresh: true
      }
    },
    components: {
      FormList
    },
    mounted () {
      this.$refs.form.setFieldsValue({
        type: this.formList[1].selectOptions[0]?.id,
        status: this.formList[2].selectOptions[0]?.id,
      });
      this.getAdvertiseList();
      this.getSpaceProjectList();
      setTimeout(()=>{
        this.scrollY = this.$refs.content_main.offsetHeight - 295 + "px";
      },100)
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === "guidePageAppCSet") {
        this.tableRefresh = true;
        this.pageRefresh = false;
      } else {
        this.tableRefresh = false;
        this.pageRefresh = true;
      }
      next();
    },
    activated(){
      if(this.pageRefresh){
        this.getAdvertiseList();
        this.getSpaceProjectList();
      }else if (this.tableRefresh) {
        this.getAdvertiseList();
      }
    },
    created () {
      // this.getSpaceProjectList()
    },
    methods:{
      moment,
      handleProjectData(data, ids, project = []) {
        data.forEach(item => {
          ids.forEach((id)=>{
            if (item.id === id) {
              project.push(item.name)
            }
          });
        });
        return project;
      },
      //查询按钮
      onCheck() {
        debounce(()=>{
          this.current = 1;
          this.getAdvertiseList();
        })
      },
      //新建
      onAdd() {
        debounce(()=>{
          this.$router.push({path: "/releasePass/addReleasePass"})
        })
      },
      //编辑
      onEdit() {
        console.log("编辑")
      },
      //删除
      onDelete() {
        console.log("删除")
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getAdvertiseList();
      },
      //获取项目列表
      getSpaceProjectList() {
        api.advertiseProject().then(res => {
          if (res.code === 200) {
            const project = {
              id: "",
              name: "全部项目"
            };
            this.data = res.data;
            this.formList[0] = {
              ...this.formList[0],
              selectOptions: res.data,
            };
            this.formList[0].selectOptions.unshift(project);
            this.$refs.form.setFieldsValue({
              projectId: this.formList[0].selectOptions[0]?.id,
            });
          }
        });
      },
      //获取列表
      getAdvertiseList() {
        this.tableLoading = true;
        const { projectId, title, type, status, isDefault, updateTime   } = this.$refs.form.getFieldsValue();
        const para = {
          advertAreaIds: [6],
          projectId,
          title: title ? title.trim() : "",
          type,
          status,
          isDefault,
          // startValidTime: validTime && validTime !== [] ? moment(validTime[0]).format("YYYY-MM-DD") : null,
          // endValidTime: validTime && validTime !== [] ? moment(validTime[1]).format("YYYY-MM-DD") : null,
          startUpdateTime: updateTime && updateTime !== [] && updateTime[0] ? moment(updateTime[0]).format("YYYY-MM-DD"): null,
          endUpdateTime: updateTime && updateTime !== [] && updateTime[1]? moment(updateTime[1]).format("YYYY-MM-DD"): null,
          currentPage: this.current,
          pageSize: this.pageSize
        };
        api.getAdvertise(para).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  #activity{
    height: 100%;
    overflow: hidden;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
