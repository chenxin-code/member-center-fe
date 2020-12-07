<template>
  <div id="activity">
    <div class="content-header">专项主题</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond
            ref="form"
            rowCol="3"
            labelAlign="left"
            :labelCol="{ span: 4}"
            :wrapperCol="{ span: 20 }"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" @click="onAdd" icon="plus">新建</a-button>
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
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
			          <a  @click="onEdit(operation)">编辑</a>
                <a-divider type="vertical" />
                <a  @click="onDelete(operation)">删除</a>
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
import api from '@/api';
import FromSecond from '@/components/FromSecond/FromSecond.jsx'
import moment from "moment"
import {getFiveYears} from '@/utils/util'

export default {
  name: "specialCheckTheme",
  data() {
    return {
      formList: [
			    {
               label: "名称",
               type: "input",
               name: "name",
               placeholder: "请输入名称",
			    },
          {
               label: "年份",
               type: "select",
               name: "year",
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
                wrapperCol: { span: 24 },
          }		
      ],
      
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      yearData:[],
      //表格高度
      scrollY: 100,
      //列表数据(表格)
      tableData: [],
      tableLoading: false,
      //表头数据
      tableColumns: [
        {
          title: "名称",
          key: "name",
          dataIndex: "name",
        },
        {
          title: "年份",
          dataIndex: "year",
          key: "year",
        },
        {
          title: "任务周期",
          dataIndex: "taskCycle",
          key: "taskCycle",
        },
        {
          title: "操作",
          key: "operation",
          width: 200,
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  components: {
      FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 235 + "px";
    }, 100);
     this.form = this.$form.createForm(this, { name: 'formList' });
     this.getTableData();
  },
  created() {
    //this.total = 100;
    this.getYears()
  },
  methods: {
    // 循环年份
    getYears(){
      let FiveYears = getFiveYears()
      let newArr = [{id:"", name:"全部"}]
      FiveYears.forEach(e => {
        newArr.push({id: e,name: e})
      })
      this.formList[1].selectOptions = newArr
    },

    //查询按钮
    onCheck() {
      this.current = 1;
      this.getTableData();
    },
    //删除活动
    onDelete(e) {
      console.log(e);
      const that = this;
      this.$confirm({
        title: "提示",
        content: `确认删除${e.name}？`,
        onOk() {
          that.tableLoading = true;
            const para = {
              id: e.id
          };
          api.deleteSpecialChecktheme(para).then(res => {
            if (res.code === 200) {
              that.$message.success("删除成功");
              that.getTableData();
            } else {
               that.$message.error({
                title: "删除申请",
                content: res.message
              });
                that.tableLoading = false;
              }
            }).catch(() => {
              that.tableLoading = false;
          });

          console.log("删除" + e.title);
        },
      });
    },
    //编辑活动
    onEdit(e) {
      this.$router.push({
          name: "specialCheckThemeSetEdit",
          params: {
            id: e
          }
       })
    },
    //新建
    onAdd() {
      this.$router.push({path: "/qualityManagement/specialCheckTheme/add"})
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.current = current;
      this.pageSize = pageSize;
      this.getTableData();
    },
    //获取表格数据
    getTableData() {
        this.tableLoading = true;
        const { name, year} = this.$refs.form.getFieldsValue();
        const para = {
          pageIndex: this.current,
          pageSize: this.pageSize,
          name,
          year
        };
        console.log(para);
        api.getSpecialCheckList(para).then(res => {
          console.log(res);
          this.total = res.data.totalCount;
          this.tableData = res.data.datalist;
          this.tableLoading = false;
        }).finally(()=>{
          this.tableLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
#activity {
  height: 100%;
  overflow: hidden;
}
.content_main {
  height: 100%;
  padding: 10px;
}
</style>
