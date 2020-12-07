<template>
  <div id="advertiseArea">
    <div class="content-header">专项管理</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond ref="form" rowCol="3" :formList="formList" :onSubmit="onCheck" />
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{ x: 1550, y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
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
                <a-divider type="vertical" />
<!--                <a-popconfirm-->
<!--                  title="确认删除吗?"-->
<!--                  ok-text="Yes"-->
<!--                  cancel-text="No"-->
<!--                  @confirm="deleteItem(operation)"-->
<!--                >-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
                <a  @click="deleteItem(operation)">删除</a>
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

export default {
  name: "inspection",
  data() {
    return {
      formList: [
        {
          label: "项目",
          type: "input",
          name: "projectName",
          placeholder: "请输入"
        },
        {
          label: "城市公司",
          type: "input",
          name: "cityName",
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
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
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
          title: "主题",
          key: "themeName",
          dataIndex: "themeName"
        },
        {
          title: "项目",
          dataIndex: "projectName",
          key: "projectName"
        },
        {
          title: "城市公司",
          dataIndex: "cityName",
          key: "cityName"
        },
        {
          title: "年份",
          dataIndex: "year",
          key: "year"
        },
        {
          title: "任务周期",
          dataIndex: "taskCycle",
          key: "taskCycle",
        },
        {
          title: "得分",
          dataIndex: "resultScore",
          key: "resultScore"
        },
        {
          title: "任务状态",
          key: "status",
          scopedSlots: { customRender: "status" },
          width: 120,
        },
        {
          title: "整改问题个数",
          key: "rectification",
          dataIndex: "rectification"
        },
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          width: 130,
          scopedSlots: { customRender: "operation" }
        }
      ],
      tableData: [],
      tableLoading: false
    };
  },
  components: {
    FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 185 + "px";
    }, 100);
    //this.getTableData();
    this.onCheck();
    this.getInspectionUnitList();
  },
  methods: {

    //查询按钮
    onCheck() {
      this.current = 1;
      const values = this.$refs.form.getFieldsValue();
      this.getTableData({ ...values });
    },
    //详情
    onDetail(item) {
      console.log(item.id);
      this.$router.push({
        name: "specialCheckDetail",
        params: {
          id: item.id
        }
      });
    },
    //删除
    deleteItem(item) {
      console.log(item);
      const that = this;
      this.$confirm({
        title: "提示",
        // content: `确定要删除 ${item.themeName}？`,
        content: `确认删除${item.themeName}的专项任务吗？`,
        onOk() {
          that.tableLoading = true;
          // const para = {
          //   id: e.id
          // };
          api.deleteListBySpecialItem({ id: item.id }).then(res => {
            if (res.code === 200) {
              that.$message.success("删除成功");
              that.getTableData();
            }
          });
        },
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.current = current;
      this.pageSize = pageSize;
      const values = this.$refs.form.getFieldsValue();
      this.getTableData({ ...values });
    },
    //获取表格数据
    getTableData(values) {
      const params = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        ...values
      };
      this.tableLoading = true;
      console.log(params);
      api
        .getListBySpecialList(params)
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
          this.inspectionUnitData = res.data.list;
          this.$set(this.formList,2 ,{
            ...this.formList[2],
            selectOptions: [{id:"",name:"全部"},...newArr]
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
