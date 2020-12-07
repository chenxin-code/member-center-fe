<template>
  <div id="advertisePush">
    <div class="content-header">广告推送管理</div>
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
            :scroll="{ x: 1450, y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="projectIds" slot-scope="operation">
              <div class="editable-row-operations" style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                <span v-if="data.length > 0 && operation.proIds">{{handleProjectData(data,operation.proIds).join(",")}}</span>
              </div>
            </template>
            <template slot="push" slot-scope="operation">
              <span v-if="operation.pushType === 0">按用户身份</span>
              <span v-if="operation.pushType === 1">按业主标签</span>
<!--              <div class="editable-row-operations" style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">-->
<!--                <span v-if="labelList.length > 0 && operation.labels">{{handleProjectData(labelList,operation.labels).join(",")}}</span>-->
<!--              </div>-->
            </template>
            <template slot="type" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.type === 0">链接</span>
                <span v-if="operation.type === 1">自定义</span>
                <span v-if="operation.type === 2">模块</span>
              </div>
            </template>
            <template slot="status" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.pushStatus === 0">已推送</span>
                <span v-if="operation.pushStatus === 1">定时推送</span>
              </div>
            </template>
            <template slot="pushTime" slot-scope="operation">
              <div class="editable-row-operations">
                <span>{{moment(operation.pushTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
              </div>
            </template>
            <template slot="updateTime" slot-scope="operation">
              <div class="editable-row-operations">
                <span>{{moment(operation.updateTime).format("YYYY-MM-DD HH:mm")}}</span>
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a v-if="operation.pushStatus === 0" @click="onLook(operation)">查看</a>
                <a v-if="operation.pushStatus === 1" @click="onEdit(operation)">编辑</a>
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
  import FormList from "@/components/FormList/index.jsx";
  import moment from "moment";
  import { debounce } from '@/utils/util';
  export default {
    name: "advertisePush",
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
            label: "标题",
            type: "input",
            name: "title",
            placeholder: "请输入标题",
          },
          {
            label: "类型",
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
                name: "链接"
              },
              {
                id: 1,
                name: "自定义"
              },
              {
                id: 2,
                name: "模块"
              },
            ],
          },
          {
            label: "推送状态",
            type: "select",
            name: "status",
            selectOptions: [
              {
                id: "",
                name: "全部"
              },
              {
                id: 0,
                name: "已推送"
              },
              {
                id: 1,
                name: "定时推送"
              },
            ],
          },
          {
            label: "推送时间",
            type: "rangePicker",
            name: "pushTime",
          },
          {
            label: "更新时间",
            type: "rangePicker",
            name: "updateTime",
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
            dataIndex: "title",
            key: "title",
            width: 120,
            ellipsis: true,
          },
          {
            title: "项目",
            key: "projectIds",
            scopedSlots: { customRender: "projectIds" },
            // width: 120,
            ellipsis: true,
          },
          {
            title: "类型",
            key: "type",
            scopedSlots: { customRender: "type" },
            width: 120,
            ellipsis: true,
          },
          {
            title: "推送状态",
            key: "status",
            scopedSlots: { customRender: "status" },
            width: 120,
            ellipsis: true,
          },
          {
            title: "推送用户",
            key: "push",
            scopedSlots: { customRender: "push" },
            // width: 120,
            ellipsis: true,
          },
          // {
          //   title: "点击次数",
          //   dataIndex: "name",
          //   key: "5",
          //   width: 120,
          //   ellipsis: true,
          // },
          // {
          //   title: "点击人数",
          //   dataIndex: "name",
          //   key: "6",
          //   width: 120,
          //   ellipsis: true,
          // },
          {
            title: "推送时间",
            key: "pushTime",
            scopedSlots: { customRender: "pushTime" },
            width: 200,
            ellipsis: true,
          },
          {
            title: "更新时间",
            key: "updateTime",
            scopedSlots: { customRender: "updateTime" },
            width: 200,
            ellipsis: true,
          },
          {
            title: "创建人",
            dataIndex: "createUserName",
            key: "createUserName",
            width: 120,
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
        labelList: [],
        tableRefresh: false,
        pageRefresh: true
      }
    },
    components: {
      FormList
    },
    mounted () {
      this.$refs.form.setFieldsValue({
        type: this.formList[2].selectOptions[0]?.id,
        status: this.formList[3].selectOptions[0]?.id,
      });
      // this.getAdvertiseList();
      // this.getSpaceProjectList();
      // this.getUserLabel();
      setTimeout(()=>{
        this.scrollY = this.$refs.content_main.offsetHeight - 295 + "px";
      },100)
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === "advertisePushSet") {
        this.tableRefresh = true;
        this.pageRefresh = false
      } else if (to.name === "advertisePushDetail") {
        this.tableRefresh = false;
        this.pageRefresh = false
      } else {
        this.pageRefresh = true
      }
      next();
    },
    activated(){
      if(this.pageRefresh) {
        this.$refs.form.setFieldsValue({
          title: "",
          type: this.formList[2].selectOptions[0]?.id,
          status: this.formList[3].selectOptions[0]?.id,
          validTime: [],
          updateTime: []
        });
        this.tableData = [];
        this.tableLoading = false;
        this.total = 0;
        this.pageSize = 10;
        this.current = 1;
        this.data = [];
        this.labelList = [];
        this.tableRefresh = false;
        this.pageRefresh = true;
        this.getAdvertiseList();
        this.getSpaceProjectList();
        // this.getUserLabel();
      }else if (this.tableRefresh) {
        this.getAdvertiseList()
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
          this.$router.push({path: "/advertise/advertisePushSet"})
        })
      },
      //查看
      onLook(operation) {
        debounce(()=>{
          this.$router.push({
            name: "advertisePushDetail",
            params: {
              id: operation
            }
          })
        })
      },
      //编辑
      onEdit(operation) {
        debounce(()=>{
          this.$router.push({
            name: "advertisePushSet",
            params: {
              id: operation
            }
          })
        })
      },
      //删除
      onDelete(operation) {
        debounce(()=>{
          const that = this;
          that.$confirm({
            title: "删除广告",
            content: "确定删除" + operation.title + "吗？",
            centered: true,
            okText: "确定",
            cancelText: "取消",
            onOk() {
              that.tableLoading = true;
              const para = {
                advertId: operation.id
              };
              api.deleteAdvertises(para).then(res => {
                if (res.code === 200) {
                  if (that.tableData.length === 1) {
                    that.current--;
                    that.getAdvertiseList();
                  } else {
                    that.getAdvertiseList();
                  }
                } else {
                  // that.$success({
                  //   title: "删除广告",
                  //   content: res.message
                  // });
                  that.tableLoading = false;
                }
              }).catch(() => {
                that.tableLoading = false;
              });
            },
          });
        })
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
      //获取用户标签
      getUserLabel() {
        api.advertiseUserLabel().then(res => {
          if (res.code === 200) {
            // console.log(res.data);
            this.labelList = res.data
          }
        })
      },
      //获取列表
      getAdvertiseList() {
        this.tableLoading = true;
        const { projectId, title, type, status, isDefault, validTime, updateTime   } = this.$refs.form.getFieldsValue();
        const para = {
          advertAreaIds: [9],
          projectId,
          title: title ? title.trim() : "",
          type,
          pushStatus: status,
          isDefault,
          startValidTime: validTime && validTime !== [] && validTime[0] ? moment(validTime[0]).format("YYYY-MM-DD") : null,
          endValidTime: validTime && validTime !== [] && validTime[1] ? moment(validTime[1]).format("YYYY-MM-DD") : null,
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
  #advertisePush{
    height: 100%;
    overflow: hidden;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
