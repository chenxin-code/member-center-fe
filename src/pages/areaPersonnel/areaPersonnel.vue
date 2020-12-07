<template>
  <div id="areaPersonnel">
    <div class="content-header">区域人员配置</div>
    <div class="content-main" ref="content_main" style="padding: 20px;">
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
        :data-source="tableData"
        :pagination="false"
        :scroll="{ y: scrollY }"
        :rowKey="(r,i) => i"
        style="width:100%;margin-top:8px;"
        :selectable="false"
        :loading="tableLoading"
      >
        <template slot="regionIds" slot-scope="operation">
          <div class="editable-row-operations" style="width: 260px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
            <span>{{handleProjectData(areaData,operation.regionIds).join(",")}}</span>
          </div>
        </template>
        <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations">
            <a @click="onEdit(operation)">编辑</a>
            <a @click="onDelete(operation)" style="margin-left:20px;">删除</a>
          </div>
        </template>
      </a-table>

      <a-pagination
        :total="total"
        :show-total="total => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        :default-current="current"
        :page-size.sync="pageSize"
        @change="onShowSizeChange"
        @showSizeChange="onShowSizeChange"
        style="margin-top:30px;width:100%;text-align: right;"
      />
    </div>
  </div>
</template>

<script>
  import FormList from "@/components/FormList/index.jsx";
  import api from "@/api";
  import moment from "moment";
  import { debounce } from '@/utils/util';
  import message from 'ant-design-vue/es/message';
  export default {
    name: "areaPersonnel",
    data() {
      return {
        formList: [
          {
            label: "项目",
            type: "select",
            name: "projectId",
            placeholder: "请选择项目",
            selectOptions: [],
            selectOptionsCode: "",
            disabled: false,
            onChange: this.onProjectChange
          },
          {
            label: "角色",
            type: "select",
            name: "roleCode",
            placeholder: "请选择类型",
            selectOptions: [],
          },
          {
            label: "员工",
            type: "input",
            name: "userName",
            placeholder: "请输入员工姓名",
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
        projectData: [],//项目
        project: {},
        //表格高度
        scrollY: 100,
        //表头数据
        tableColumns: [
          {
            title: "角色",
            key: "roleName",
            dataIndex: "roleName",
            width: 120,
            ellipsis: true,
          },
          {
            title: "员工",
            dataIndex: "userName",
            key: "userName",
            width: 120,
            ellipsis: true,
          },
          {
            title: "联系方式",
            dataIndex: "phone",
            key: "phone",
            width: 200,
            ellipsis: true,
          },
          {
            title: "管辖范围",
            key: "regionIds",
            scopedSlots: { customRender: "regionIds" },
            width: 260,
            ellipsis: true,
          },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
            width: 200,
            ellipsis: true,
          }
        ],
        tableData: [],
        tableLoading: false,
        areaData: [],
        //分页
        total: 0,
        current: 1,
        pageSize: 10,
        tableRefresh: false,
        pageRefresh: true
      };
    },
    components: {
      FormList
    },
    mounted() {
      setTimeout(() => {
        this.scrollY = this.$refs.content_main.offsetHeight - 260 + "px";
      }, 100);
      // this.getAreaPersonnelList()
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === "areaPersonnelSet") {
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
        this.$refs.form.setFieldsValue({
          userName: "",
        });
        this.projectData = [];
        this.project = {};
        this.tableData = [];
        this.tableLoading = false;
        this.areaData = [];
        this.total = 0;
        this.current = 1;
        this.pageSize = 10;
        this.tableRefresh = false;
        this.pageRefresh = true;
        this.getMyProject();
        this.getAreaPersonnelRole();
        this.getAreaList()
      }else if (this.tableRefresh) {
        this.getAreaPersonnelList();
      }
    },
    created() {
      // this.getMyProject();
      // this.getAreaPersonnelRole();
    },
    methods: {
      moment,
      onProjectChange(e, { data }) {
        this.$refs.form.setFieldsValue({
          projectId: e
        });
        this.project = {
          id: e,
          name: data.attrs["data-title"]
        };
      },
      handleProjectData(data, ids, project = []) {
        data.forEach(item => {
          ids.forEach((id)=>{
            if (item.id === id) {
              project.push(item.areaName)
            }
          });
        });
        return project;
      },
      //查询按钮
      onCheck() {
        debounce(()=>{
          this.current = 1;
          this.getAreaPersonnelList();
        })
      },
      //新建
      onAdd() {
        debounce(()=>{
          this.$router.push({
            name: "areaPersonnelSet",
            params: {
              project: this.project
            }
          });
        })
      },
      //编辑
      onEdit(e) {
        debounce(()=>{
          this.$router.push({
            name: "areaPersonnelSet",
            params: {
              id: e
            }
          });
        })
      },
      //删除
      onDelete(operation) {
        debounce(()=>{
          const that = this;
          that.$confirm({
            title: "删除员工",
            content: "确认删除" + operation.roleName + operation.userName + "吗？" ,
            centered: true,
            okText: "是",
            cancelText: "否",
            onOk() {
              that.tableLoading = true;
              const para = {
                regionUserId: operation.id
              };
              api.deleteAreaPersonnel(para).then(res => {
                if (res.code === 200) {
                  if (that.tableData.length === 1) {
                    that.current--;
                    that.getAreaPersonnelList();
                  } else {
                    that.getAreaPersonnelList();
                  }
                } else {
                  that.$success({
                    title: "删除员工",
                    content: res.message
                  });
                  that.tableLoading = false;
                  message.destroy()
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
        this.getAreaPersonnelList();
      },
      //获取项目
      getMyProject() {
        api.areaPersonnelProject().then(res => {
          if (res.code === 200) {
            this.projectData = res.data;
            this.formList[0] = {
              ...this.formList[0],
              selectOptions: res.data,
              disabled: this.projectData.length === 1
            };
            this.$refs.form.setFieldsValue({
              projectId: this.projectData[0]?.id,
            });
            this.project = this.projectData[0] || {};
            this.getAreaPersonnelList()
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      //获取角色
      getAreaPersonnelRole() {
        api.areaPersonnelRoles().then((res) => {
          if (res.code === 200) {
            const roleData = res.data.map(item => ({
              id: item.code,
              name: item.name,
            }));
            const role = {
              id: "",
              name: "全部"
            };
            this.formList[1] = {
              ...this.formList[1],
              selectOptions: roleData,
            };
            this.formList[1].selectOptions.unshift(role);
            this.$refs.form.setFieldsValue({
              roleCode: this.formList[1].selectOptions[0]?.id,
            });
          }
        });
      },
      //获取区域列表
      getAreaList() {
        api.areaPersonnelArea().then(res => {
          if (res.code === 200) {
            // const newArr = res.data.map(item => ({
            //   key: item.id,
            //   title: item.areaName,
            //   projectId: item.projectId,
            // }));
            this.areaData = res.data;
            // this.total = this.areaData.length;
            // this.getData()
          }
        })
      },
      //获取表格数据
      getAreaPersonnelList() {
        this.tableLoading = true;
        const { projectId, roleCode,userName } = this.$refs.form.getFieldsValue();
        const para = {
          projectId,
          roleCodes: roleCode ? [roleCode] : [],
          userName: userName ? userName.trim() : "",
          currentPage: this.current,
          pageSize: this.pageSize,
        };
        api.getAreaPersonnel(para).then(res => {
          this.total = res.data.total;
          this.tableData = res.data.records;
        }).finally(() => {
          this.tableLoading = false;
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  #areaPersonnel {
    height: 100%;
    overflow: hidden;
  }
  .content_main {
    height: 100%;
    padding: 10px;
  }
</style>
