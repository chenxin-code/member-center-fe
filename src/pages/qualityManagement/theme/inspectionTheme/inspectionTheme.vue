<template>
  <div id="advertiseArea">
    <div class="content-header">巡查主题</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" @click="onAdd" icon="plus">新 建</a-button>
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
                <a  @click="onChangeStatus(operation)">{{operation.status === '0' ? "启用" : "禁用" }}</a>
			          <a  @click="onEdit(operation)" style="margin-left:20px;">编辑</a>
                <a  @click="onDelete(operation)" style="margin-left:20px;">删除</a>
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
import {getObjYears} from '@/utils/util'

export default {
  name: "inspectionTheme",
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
               label: "角色",
               type: "select",
               name: "roleId",
               placeholder: "全部",
               selectOptions: [],  
               initialValue:""
          },
			    // {
          //      label: "专业线",
          //      type: "select",
          //      name: "specialLineId",
          //      placeholder: "全部",
          //      selectOptions: [],  
          //      initialValue:""
          // },
          // {
          //      label: "年",
          //      type: "select",
          //      name: "year",
          //      placeholder: "全部",
          //      selectOptions: getObjYears(),
          //      initialValue:""
          // },
          // {
          //      label: "季度",
          //      type: "select",
          //      name: "quarter",
          //      placeholder: "全部",
          //      selectOptions: [
          //       {
          //           id: "",
          //           name: "全部"
          //         },
          //         {
          //           id: "1",
          //           name: "第一季度"
          //         },
          //         {
          //           id: "2",
          //           name: "第二季度"
          //         },
          //         {
          //           id: "3",
          //           name: "第三季度"
          //         },
          //         {
          //           id: "4",
          //           name: "第四季度"
          //         },
          //     ],
          //     initialValue:""
			    // },
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
      specialLineData:[],
      yearData:[],
      quarterData:[],
      //表格高度
      scrollY: 0,
      //列表数据(表格)
      tableData: [],
      tableLoading: false,
      //表头数据
      tableColumns: [
        {
          title: "名称",
          key: "name",
          dataIndex: "name"
        },
        {
          title: "任务频次",
          dataIndex: "taskFrequency",
          key: "taskFrequency",
        },
        {
          title: "任务周期",
          dataIndex: "taskCycle",
          key: "taskCycle",
        },
        {
          title: "角色",
          key: "roleName",
          dataIndex: "roleName",
        },
        {
          title: "操作",
          key: "operation",
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
      console.log(this.$refs.content_main.offsetHeight)
      this.scrollY = this.$refs.content_main.offsetHeight - 225 + "px";
    }, 100);
    this.form = this.$form.createForm(this, { name: 'formList' });
    this.getSpecialLineOption();
    this.getTableData();
  },
  created() {
    //this.total = 100;
    this.getRoleList()
  },
  methods: {
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
          api.deleteInspectiontheme(para).then(res => {
            if (res.code === 200) {
              that.$message.success("删除成功");
              that.current = 1;
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
          name: "inspectionThemeSetEdit",
          params: {
            id: e
          }
      })
    },
    //启用禁用
    onChangeStatus(e) {
      console.log(e);
      let status = e.status
      console.log(status);
      this.$confirm({
        title: "提示",
        content: `确认${e.status == 1 ? '禁用' : '启用'}${e.name}?`,
        // content: status == 0 ? '确定要启用？' : '确定要禁用？',
        onOk:() => {
          this.tableLoading = true;
          const para = {
            id: e.id,
            status: status == '1' ? '0': '1' 
          };
          console.log(para);
          api.updateInspectionthemeStatus(para).then(res => {
            this.tableLoading = false;
            if (res.code === 200) {
              this.getTableData();
            } else {
              this.$success({
                title: "更改状态标准",
                content: res.message
              })
            }
          }).catch(() => {
            this.tableLoading = false;
          })
        },
      });
    },
    //新建
    onAdd() {
      this.$router.push({path: "/qualityManagement/inspectionTheme/add"})
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
        //const { businessFormatId, specialLineId, year ,quarter} = this.$refs.form.getFieldsValue();
        const { name, roleId } = this.$refs.form.getFieldsValue();
        const para = {
          pageIndex: this.current,
          pageSize: this.pageSize,
          name,
          roleId,
        };
        console.log(para);
        api.getInspectionthemeList(para).then(res => {
          console.log(res);
          this.total = res.data.totalCount;
          res.data.datalist.forEach((e) => {
              var str = e.taskFrequency
              let type = str.substring(0,1)
              var newstr;
              if( type && type === '1'){
                newstr = "每日"
              } else if( type && type === '2'){
                newstr = "每周"
              } else if( type && type === '3'){
                newstr = "每月"
              }
              e.taskFrequency = newstr + str.substr(1);
					})
          this.tableData = res.data.datalist;
          this.tableLoading = false;
        }).finally(()=>{
          this.tableLoading = false;
        });
    },
    //专业线
    getSpecialLineOption(){
        // const para = {
		    //   parentId: 12
	      // };
        // api.getQuCommonCodeList(para).then(res => {
        //   if (res.code === 200) {
        //     this.specialLineData = res.data.list
        //     this.formList[1].selectOptions = [{id:"", name:"全部"}, ...res.data.list]
        //   }
        // })
    },
    //获取角色
    getRoleList() {
      api.getQuCommonCodeList({
        parentId: 26
      }).then(res => {
        if (res.code === 200) {
             const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
             }));
          this.formList[1].selectOptions = [{id:"", name:"全部"}, ...newArr]
        }
      })
    }
  },
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
