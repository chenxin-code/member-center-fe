<template>
  <div id="propertyNotice">
    <div class="content-header">物业公告</div>
    <div class="content-main" ref="content_main" style="padding: 20px;">
      <FormList
        ref="form"
        rowCol="3"
        :formList="formList"
        :onSubmit="onCheck"
      />
      <a-button type="primary" @click="onAdd" v-if="projectData.length > 0">新建</a-button>
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
        <template slot="createdAt" slot-scope="operation">
          <div class="editable-row-operations">
            <span>{{moment(operation.createdAt).format("YYYY-MM-DD HH:mm")}}</span>
          </div>
        </template>
        <template slot="status" slot-scope="operation">
          <div class="editable-row-operations">
            <span v-if="operation.status === 0">未发布</span>
            <span v-if="operation.status === 1">已发布</span>
          </div>
        </template>
        <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations">
            <a @click="onCheckDetail(operation)" style="margin-left:20px;">查看</a>
            <a v-if="operation.status === 1" @click="onRevoke(operation)" style="margin-left:20px;">撤回</a>
            <a v-if="operation.status === 0" @click="onEdit(operation)" style="margin-left:20px;">编辑</a>
            <a v-if="operation.status === 0" @click="onDelete(operation)" style="margin-left:20px;">删除</a>
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
        :pageSizeOptions="['10','20','50','100']"
        @change="onShowSizeChange"
        @showSizeChange="onShowSizeChange"
        style="margin-top:30px;width:100%;text-align: right;"
      />
    </div>
  </div>
</template>

<script>
import FormList from "@/components/FormList/index.jsx";
// import vtables from "@/components/vtables";
import api from "@/api";
import moment from "moment";
import { debounce } from '@/utils/util';
import message from 'ant-design-vue/es/message';
export default {
  name: "propertyNotice",
  data() {
    return {
      formList: [
        {
          label: "切换项目",
          type: "select",
          name: "projectId",
          placeholder: "请选择项目",
          selectOptions: [],
          disabled: false,
          rules: [],
          initialValue: "",
          onChange: this.onProjectChange
        },
        {
          label: "类型",
          type: "select",
          name: "type",
          placeholder: "请选择类型",
          selectOptions: [],
          rules: [],
          initialValue: "全部",
        },
        {
          label: "标题",
          type: "input",
          name: "title",
          placeholder: "请输入标题",
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
              name: "未发布"
            },
            {
              id: 1,
              name: "已发布"
            },
          ],
          initialValue: "全部",
        },
        {
          label: "创建日期",
          type: "rangePicker",
          name: "date",
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
          title: "标题",
          key: "title",
          dataIndex: "title"
        },
        // {
        //   title: "阅读人数",
        //   dataIndex: "readingNumber",
        //   key: "readingNumber"
        // },
        {
          title: "类型",
          dataIndex: "typeName",
          key: "typeName"
        },
        {
          title: "创建时间",
          key: "createdAt",
          scopedSlots: { customRender: "createdAt" }
        },
        {
          title: "状态",
          key: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "操作",
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      tableData: [],
      tableLoading: false,
      //分页
      total: 0,
      current: 1,
      pageSize: 10,
      tableRefresh: false,
      pageRefresh: true
    };
  },
  components: {
    FormList,
    // vtables
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 295 + "px";
    }, 100);
    console.log(this.$refs.content_main.offsetHeight);
    this.$refs.form.setFieldsValue({
      status: this.formList[3].selectOptions[0]?.id,
    });
  },
  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true;
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "noticeSet") {
      this.tableRefresh = true;
      this.pageRefresh = false
    } else if (to.name === "propertyDetail") {
      this.tableRefresh = false;
      this.pageRefresh = false
    } else {
      // from.meta.keepAlive = false;
      this.pageRefresh = true
    }
    next();
  },
  activated(){
    if(this.pageRefresh) {
      this.$refs.form.setFieldsValue({
        title: "",
        status: this.formList[3].selectOptions[0]?.id,
        date: []
      });
      this.projectData = [];
      this.project = {};
      this.tableData = [];
      this.tableLoading = false;
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.tableRefresh = false;
      this.pageRefresh = true;
      this.getMyProject();
      this.getNoticeTypes();
    } else if (this.tableRefresh) {
      this.getNotice()
    }
  },
  created() {
    // this.getMyProject();
    // this.getNoticeTypes();
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
      this.getNotice();
    },
    onDatePicked(e, dateString) {
      console.log(e, dateString);
    },
    //查询按钮
    onCheck() {
      debounce(()=>{
        this.current = 1;
        this.getNotice();
      })
    },
    //新建公告
    onAdd() {
      debounce(()=>{
        this.$router.push({
          name: "noticeSet",
          params: {
            project: this.project
          }
        });
      })
    },
    //查看公告详情
    onCheckDetail(e) {
     debounce(()=>{
       this.$router.push({
         name: "propertyDetail",
         params: {
           project: this.project,
           notice: e
         }
       });
     })
    },
    //编辑公告
    onEdit(e) {
      debounce(()=>{
        this.$router.push({
          name: "noticeSet",
          params: {
            project: this.project,
            notice: e
          }
        });
      })
    },
    //删除公告
    onDelete(operation) {
      debounce(()=>{
        const that = this;
        that.$confirm({
          title: "删除公告",
          content: "是否删除该公告",
          centered: true,
          okText: "是",
          cancelText: "否",
          onOk() {
            that.tableLoading = true;
            const para = {
              id: operation.id
            };
            api.deletePropertyNotice(para).then(res => {
              if (res.code === 200) {
                if (that.tableData.length === 1) {
                  that.current--;
                  that.getNotice();
                } else {
                  that.getNotice();
                }
              } else {
                that.$success({
                  title: "删除公告",
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
    //撤回公告
    onRevoke(operation) {
      debounce(()=>{
        const that = this;
        that.$confirm({
          title: "撤回公告",
          content: "是否撤回该公告",
          centered: true,
          okText: "是",
          cancelText: "否",
          onOk() {
            that.tableLoading = true;
            const para = {
              id: operation.id
            };
            api.recallPropertyNotice(para).then(res => {
              if (res.code === 200) {
                that.getNotice();
              } else {
                // that.$success({
                //   title: "撤回公告",
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
      this.getNotice();
    },
    //获取项目
    getMyProject() {
      api.myProject().then(res => {
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
          this.getNotice();
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    //获取类型
    getNoticeTypes() {
      api.getPropertyNoticeTypes().then((res) => {
        if (res.code === 200) {
          const type = {
            id: "",
            name: "全部"
          };
          this.formList[1] = {
            ...this.formList[1],
            selectOptions: res.data,
          };
          this.formList[1].selectOptions.unshift(type);
          this.$refs.form.setFieldsValue({
            type: this.formList[1].selectOptions[0]?.id,
          });
        }
      });
    },
    //获取表格数据
    getNotice() {
      this.tableLoading = true;
      const { projectId, date, title, status, type } = this.$refs.form.getFieldsValue();
      console.log(date)
      const para = {
        projectId,//项目ID
        startAt: date && date[0] ? moment(date[0]).format("YYYY-MM-DD") : null,//创建时间
        endAt: date && date[1] ? moment(date[1]).format("YYYY-MM-DD") : null,//创建时间
        keyword: title ? title.trim() : "",//标题
        status,//状态
        typeId: type,//类型
        pageIndex: this.current,
        pageSize: this.pageSize,
      };
      api.getPropertyNotice(para).then(res => {
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
#propertyNotice {
  height: 100%;
  overflow: hidden;
}

.content_main {
  height: 100%;
  padding: 10px;
}
</style>
