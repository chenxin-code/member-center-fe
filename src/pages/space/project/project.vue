<template>
  <div id="project">
    <div class="content-header">项目管理</div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <!-- 表格 -->
          <a-table
            :columns="columns"
            :row-key="(r,i) => i"
            :data-source="data"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="width:100%;margin-top:8px;"
          >
          <template slot="operation" slot-scope="operation">
            <div class="editable-row-operations">
              <a @click="onLook(operation)">查看</a>
            </div>
          </template>
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            :default-current="current"
            :page-size.sync="pageSize"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            :pageSizeOptions= "['10', '20', '50', '100']"
            style="margin-top:30px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import FormList from "@/components/FormList/index.jsx";
import api from "@/api";
import { debounce } from '@/utils/util';

export default {
  name: 'project',
  data() {
    return {
      formList: [
        {
          label: "项目名称",
          type: "input",
          name: "projectName",
          placeholder: "请输入项目名称"
        },
        {
          label: "所属公司",
          type: "input",
          name: "orgName",
          placeholder: "请输入所属公司"
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
      scrollY:100,
      //表头数据
      columns : [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '所属公司',
          dataIndex: 'orgName',
          key: 'orgName',
        },
        {
          title: '操作',
          key: 'type',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      company: [
        {name: '上海'},
        {name: '北京'},
        {name: '广州'}
      ],
      tableLoading: true,
      loading: true,
      //列表数据
      data : [],
      projectName: "",
      orgName: "",
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      tableRefresh: false,
      pageRefresh: true
    }
  },
  components: {
    FormList
  },
  mounted() {
    this.getproList();
    setTimeout(()=>{
      console.log(this.$refs.contentMain.offsetHeight);
      this.scrollY =  this.$refs.contentMain.offsetHeight - 215 + "px";
    },100)
    this.$refs.form.setFieldsValue({
      projectName: "",
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "projectDetail") {
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
        projectName: "",
      });
      this.tableLoading = true;
      this.loading = true;
      this.data = [];
      this.projectName = "";
      this.orgName = "";
      this.total = 0;
      this.pageSize = 10;
      this.current = 1;
      this.tableRefresh = false;
      this.pageRefresh = true;
      this.getproList();
    }else  if (this.tableRefresh) {
      this.getproList();
    }
  },
  created() {

  },
  methods:{
    //查看按钮
    onLook(operation) {
      debounce(()=>{
        // window.localStorage.setItem("projectName", operation.name);
        // window.localStorage.setItem("orgName", operation.orgName);
        this.$router.push({
          name: "projectDetail",
          params: {
            project: {
              projectId: operation.id,
              projectName: operation.name,
              orgName: operation.orgName
            }
          }
        })
      })
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getproList();
    },
    //查询
    onCheck() {
      debounce(()=>{
        this.current = 1;
        this.getproList();
      })
    },
    //获取列表
    getproList() {
      this.tableLoading = true;
      const { orgName, projectName } = this.$refs.form.getFieldsValue();
      const para = {
        orgName: orgName ? orgName.trim() : "",
        name: projectName ? projectName.trim() : "",
        pageIndex: this.current,
        pageSize: this.pageSize
      }
      api.getProject(para).then(res => {
        if (res.code === 200) {
          this.data = res.data.records;
          this.total = res.data.total;
        }
      }).catch(() => {
        this.tableLoading = false;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
  }
}
</script>

<style lang="less" scoped>
  #project{
    height: 100%;
    overflow: hidden;
  }
</style>
