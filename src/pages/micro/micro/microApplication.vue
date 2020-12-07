<template>
  <div id="microApplication">
    <div class="content-header">应用列表</div>
    <div class="content-main" ref="content_main" style="padding: 20px;">
      <FormList
        ref="form"
        rowCol="3"
        :formList="formList"
        :onSubmit="onCheck"
      />
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
        <template slot="icon" slot-scope="operation">
          <div class="editable-row-operations">
            <img :src="operation.icon" style="width:35px;height:35px;"/>
          </div>
        </template>
        <template slot="type" slot-scope="operation">
          <div class="editable-row-operations">
            <span v-if="operation.type === 1">原生</span>
            <span v-if="operation.type === 2">uniapp</span>
            <span v-if="operation.type === 3">微应用</span>
            <span v-if="operation.type === 4">H5</span>
          </div>
        </template>
        <template slot="status" slot-scope="operation">
          <div class="editable-row-operations">
            <span v-if="operation.status === 0">可用</span>
            <span v-if="operation.status === 1">不可用</span>
          </div>
        </template>
        <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations">
            <a @click="onCheckDetail(operation)" style="margin-left:20px;">详情</a>
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
import moment from "moment"
export default {
  name: "microApplication",
  data() {
    return {
      formList: [
        {
          label: "小区名称",
          type: "select",
          name: "projectId",
          placeholder: "请选择",
          selectOptions: [],
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
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: "微应用图标",
          key: "icon",
          scopedSlots: { customRender: "icon" }
        },
        {
          title: "微应用名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "Key",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "类型",
          key: "type",
          // scopedSlots: { customRender: "type" }
          dataIndex: "type",
        },
        {
          title: "平台",
          dataIndex: "appCode",
          key: "appCode",
        },
        {
          title: "微应用排序",
          dataIndex: "id",
          key: "sort",
        },
        {
          title: "状态",
          key: "status",
          // scopedSlots: { customRender: "status" }
          dataIndex:"isDeleted",
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
    };
  },
  components: {
    FormList,
  },
  mounted() {
    this.getMicroList();
    this.getMyProject();
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 215 + "px";
    }, 100);
  },
  created() {

  },
  methods: {
    moment,
    //查询按钮
    onCheck() {
      this.current = 1;
      this.getMicroList();
    },
    //查看微应用详情
    onCheckDetail(e) {
      this.$router.push({
        name: "microApplicationDetail",
        query: {
          id: e.id
        }
      });
      // this.$router.push({
      //   name: "microApplicationDetail",
      //   params: {
      //     id: e.id
      //   }
      // })
    },
   //查看微应用编辑
   onCheckDetailEdit(e) {
     this.$router.push({
       name: "microApplicationEdit",
       query: {
         id: e.id
       }
     });
     // this.$router.push({
     //   name: "microApplicationEdit",
     //   params: {
     //     id: e.id
     //   }
     // })
   },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getMicroList();
    },
    //获取项目
    getMyProject() {
      api.microProject().then(res => {
        if (res.code === 200) {
          const project = {
            id: "",
            name: "全部项目"
          };
          this.formList[0] = {
            ...this.formList[0],
            selectOptions: res.data,
          };
          this.formList[0].selectOptions.unshift(project);
          this.$refs.form.setFieldsValue({
            projectId: this.formList[0].selectOptions[0]?.id,
          });
          this.getMicroList();
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    //获取表格数据
    getMicroList() {
      this.tableLoading = true;
      const { projectId} = this.$refs.form.getFieldsValue();
      const para = {
        projectId,
        pageIndex: this.current,
        pageSize: this.pageSize,
      };
      api.getMicroApplication(para).then(res => {
        if (res.code === 200) {
          this.total = res.data.total;
          this.tableData = res.data.records;
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
#microApplication {
  height: 100%;
  overflow: hidden;
}
.content_main {
  height: 100%;
  padding: 10px;
}
</style>
