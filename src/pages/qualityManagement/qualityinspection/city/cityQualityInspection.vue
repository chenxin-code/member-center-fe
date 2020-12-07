<template>
  <div id="advertiseArea">
    <div class="content-header">城市公司自检</div>
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
            <template slot="quarter" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.quarter === '1'">第一季度</span>
                <span v-if="operation.quarter === '2'">第二季度</span>
                <span v-if="operation.quarter === '3'">第三季度</span>
                <span v-if="operation.quarter === '4'">第四季度</span>
              </div>
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
                <a-divider type="vertical" />
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
import {getFiveYears, getObjYears} from '@/utils/util'

export default {
  name: "inspection",
  data() {
    return {
      formList: [
        {
          label: "主题",
          type: "select",
          name: "themeId",
          placeholder: "全部",
          selectOptions: [],
          initialValue:""
        },
        {
          label: "专业线",
          type: "select",
          name: "specialLineId",
          placeholder: "全部",
          selectOptions: [],
          initialValue:""
        },
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
          label: "年份",
          type: "select",
          name: "year",
          placeholder: "全部",
          selectOptions: getObjYears(),
          initialValue:""
        },
        {
          label: "季度",
          type: "select",
          name: "quarter",
           placeholder: "全部",
          selectOptions:[
              {
                id:"",
                name:"全部"
              },
              {
                id: "1",
                name: "第一季度"
              },
              {
                id: "2",
                name: "第二季度"
              },
              {
                id: "3",
                name: "第三季度"
              },
              {
                id: "4",
                name: "第四季度"
              },
          ],
          initialValue:""
        },
        {
          label: "状态",
          type: "select",
          name: "status",
           placeholder: "全部",
          selectOptions:[],
          initialValue:""
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
      //表头数据
      tableColumns: [
        {
          title: "主题",
          key: "themeName",
          dataIndex: "themeName"
        },
        {
          title: "专业线",
          dataIndex: "specialLineName",
          key: "specialLineName"
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
          title: "季度",
          key: "quarter",
          scopedSlots: { customRender: "quarter" }
        },
        {
          title: "状态",
          key: "status",
          scopedSlots: { customRender: "status" }
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
          width: 200,
          scopedSlots: { customRender: "operation" }
        }
      ],
      projectId: "",
      tableData: [],
      tableLoading: false,
      scrollY:0
    };
  },
  components: {
    FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 285 + "px";
    }, 100);
    this.onCheck();
    this.getQualitycontrolthemeList();
    this.getProjectList();
    this.getInspectionUnitList();
    this.getSpecialLineOption()
  },
  methods: {

    //查询按钮
    onCheck() {
      this.current = 1;
      const values = this.$refs.form.getFieldsValue();
      this.getTableData({ ...values });
    },
    //查看详情
    onDetail(e) {
      this.$router.push({
        name: "qualityControlCityDetail",
        params: {
          id: e.id
        }
      });
    },
    //启用禁用
    onChangeStatus(e) {
      console.log(e);
      let status = e.status
      console.log(status);
      this.$confirm({
        title: "提示",
        content: status == 0 ? '确定要启用？' : '确定要禁用？',
        onOk:() => {
          this.tableLoading = true;
          const para = {
            id: e.id,
            status: status == '1' ? '0': '1' 
          };
          console.log(para);
          api.updateChecktaskStatus(para).then(res => {
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

    //删除活动
    onDelete(e) {
      console.log(e);
      const that = this;
      this.$confirm({
        title: "提示",
        content: `确认删除${e.themeName}的城市公司质检任务？`,
        onOk() {
          that.tableLoading = true;
            const para = {
              id: e.id
             };
          api.deleteListBySpecialItem(para).then(res => {
            if (res.code === 200) {
              that.$message.success("删除成功");
              that.getTableData();
            } else {
              that.$message.error({
                title: "删除失败",
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

    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.current = current;
      this.pageSize = pageSize;
      const values = this.$refs.form.getFieldsValue();
      this.getTableData({ ...values });
    },
    //获取表格数据
    getTableData(params) {
      this.tableLoading = true;
      api
        .getSpotCheckList({
          pageIndex: this.current,
          pageSize: this.pageSize,
          taskType: "2",  //城市
          ...params
        })
        .then(res => {
          this.tableLoading = false;
          if (res.code === 200) {
            this.tableData = res.data.datalist;
            this.total = res.data.totalCount;
          }
        }).catch(()=>{
           this.tableLoading = false;
        })
    },
    //获取工程列表
    getProjectList() {
      api.spaceProject().then(res => {
        if (res.code === 200) {
          const newList = [{id:"",name:"全部"},...res.data];
          this.formList[2].selectOptions = newList;
        }
      });
    },
    //获取主题列表
    getQualitycontrolthemeList() {
      const para = {
        pageIndex: 1,
        pageSize: 1000000
      };

      api.getQualitycontrolthemeList(para).then(res => {
        if (res.code === 200) {
          this.formList[0].selectOptions = [{id:"",name:"全部"}, ...res.data.datalist];
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
          this.inspectionUnitData = res.data.list;
          this.formList[6] = {
            ...this.formList[6],
            selectOptions: [{id:"",name:"全部"}, ...newArr]
          };
        }
      });
    },
    //获取专业线
    getSpecialLineOption() {
      const para = {
        parentId: 12
      };
      api.getQuCommonCodeList(para).then(res => {
        if (res.code === 200) {
           const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
            }));
          this.formList[1].selectOptions = [{id:"",name:"全部"}, ...newArr];
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
