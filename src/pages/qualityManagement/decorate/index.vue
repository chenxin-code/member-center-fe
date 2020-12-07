<template>
  <div id="advertiseArea">
    <div class="content-header">装修巡查管理</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond ref="form" rowCol="3" :formList="formList" :onSubmit="onCheck" />
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="inspectorDate" slot-scope="inspectorDate">
              <span>{{moment(inspectorDate).format('YYYY-MM-DD')}}</span>
            </template>
            <template slot="completeTime" slot-scope="completeTime">
              <span>{{completeTime && moment(completeTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
            <template slot="status" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.status === '0'">待开始</span>
                <span v-if="operation.status === '1'">进行中</span>
                <span v-if="operation.status === '2'">已完成</span>
                <span v-if="operation.status === '3'">已过期</span>
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a @click="onDetail(operation)">查看</a>
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
            :pageSizeOptions="['10','20','30','50','100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:10px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import FromSecond from '@/components/FromSecond/FromSecond.jsx'
import moment from "moment";
export default {
  name: "inspection",
  data() {
    return {
      formList: [
        {
          label: "项目",
          type: "select",
          name: "projectId",
          placeholder: "全部",
          selectOptions: [],
          initialValue:""
        },
        {
          label: "房屋",
          type: "input",
          name: "houseName",
          placeholder: "请输入"
        },
        {
          label: "任务状态",
          type: "select",
          name: "status",
          placeholder: "全部",
          selectOptions: [],
          initialValue:""
        },
        {
          label: "巡查日期",
          type: "rangePicker",
          name: "time"
        },

        {
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
          span: 16,
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      projectOption: [], //项目
      statusOption: [],
      inspectorOption: [],
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: "房屋",
          key: "houseName",
          dataIndex: "houseName"
        },
        {
          title: "巡查日期",
          dataIndex: "inspectorDate",
          key: "inspectorDate",
          scopedSlots: { customRender: "inspectorDate" }
        },
        {
          title: "完成时间",
          dataIndex: "completeTime",
          key: "completeTime",
          scopedSlots: { customRender: "completeTime" }
        },
        {
          title: "任务状态",
          key: "status",
          scopedSlots: { customRender: "status" },
          width: 120,
          ellipsis: true,
        },
        {
          title: "操作",
          key: "operation",
          width: 120,
          span: 16,
          scopedSlots: { customRender: "operation" }
        }
      ],
      tableLoading: false, //列表表格loading
      tableData: [] //列表数据
    };
  },
  components: {
    FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 235 + "px";
    }, 100);
    this.getProjectList(); //获取工程列表   
    this.getInspectionUnitList();
    this.onCheck(); 
  },
  methods: {
    moment,
    //查询按钮
    onCheck() {
      const values = this.$refs.form.getFieldsValue();
      const params = {
        ...values,
        inspectorDateStart:
          values.time && values.time.length
            ? moment(values.time[0]).format("YYYY-MM-DD")
            : undefined,
        inspectorDateEnd:
          values.time && values.time.length
            ? moment(values.time[1]).format("YYYY-MM-DD")
            : undefined,
        time: undefined
      };
      this.current = 1;
      this.getTableData(params);
    },
    //删除活动
    onDelete(e) {
      console.log(e);
      this.$confirm({
        title: "提示",
        content: "确定要删除？",
        onOk() {
          console.log("删除" + e.title);
        }
      });
    },
    //详情
    onDetail(e) {
      this.$router.push({
        name: 'decorateDetail',
        params:{
          id:e.id
        }
      })
      console.log(e);
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.current = current;
      this.pageSize = pageSize;
      const values = this.$refs.form.getFieldsValue();
      const params = {
        ...values,
        inspectorDateStart:
          values.time && values.time.length
            ? moment(values.time[0]).format("YYYY-MM-DD")
            : undefined,
        inspectorDateEnd:
          values.time && values.time.length
            ? moment(values.time[1]).format("YYYY-MM-DD")
            : undefined,
        time: undefined
      };
      this.getTableData(params);
    },
    //获取表格数据
    getTableData(values) {
      const params = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        ...values
      };
      this.tableLoading = true;
      api
        .getInspectionlist(params)
        .then(res => {
          this.tableLoading = false;
          if (res.code === 200) {
            this.tableData = res.data.datalist;
            this.total = res.data.totalCount;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    //获取工程列表
    getProjectList() {
      api.qualityPersonProject().then(res => {
        if (res.code === 200) {
          this.$set(this.formList, 0, {
            ...this.formList[0],
            selectOptions: [...res.data]
          });
          this.$refs.form.setFieldsValue({ projectId: res.data[0].id });
          this.getTableData(this.$refs.form.getFieldsValue());
        }
      });
    },
    //获取状态列表
    getInspectionUnitList() {
      const para = {
        parentId: 16
      };
      api.getQuCommonCodeList(para).then(res => {
        if (res.code === 200) {
          const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
          }));

          this.$set(this.formList, 2, {
            ...this.formList[2],
            selectOptions: [{id:"",name:"全部"}, ...newArr]
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#advertiseArea {
  height: 100%;
  overflow: hidden;
}
.content_main {
  height: 100%;
  padding: 10px;
}
</style>
