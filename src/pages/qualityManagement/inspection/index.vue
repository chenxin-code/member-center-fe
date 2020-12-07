<template>
  <div id="advertiseArea">
    <div class="content-header">巡查管理</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond ref="form" :labelCol="{span:7}" :wrapperCol="{span:17}" rowCol="3"  :formList="formList" :onSubmit="searchData" />
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{  y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="planStart" slot-scope="planStart">
              <span>{{moment(planStart).format('YYYY-MM-DD')}}</span>
            </template>
            <template slot="planEnd" slot-scope="planEnd">
              <span>{{moment(planEnd).format('YYYY-MM-DD')}}</span>
            </template>
            <template slot="completeTime" slot-scope="completeTime">
              <span>{{completeTime ? moment(completeTime).format('YYYY-MM-DD HH:mm') : ''}}</span>
            </template>
            <template slot="inspectorName" slot-scope="inspectorName,scope">
              <span>{{inspectorName}} - {{scope.inspectorPhone}}</span>
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
                <a @click="goDetail(operation)">查看</a>
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
      scrollY:0,
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
          label: "状态",
          type: "select",
          name: "status",
          placeholder: "全部",
          selectOptions:[],
          initialValue:""
        },
        // {
        //   label: "业主",
        //   type: "input",
        //   name: "ownerInfo",
        //   placeholder: "请输入业主"
        // },
        {
          label: "巡查人",
          type: "input",
          name: "inspectorName",
          placeholder: "请输入"
        },
        {
          label: "计划结束日期",
          type: "rangePicker",
          name: "time"
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
      limit: 10,
      tableData: [], //表格数据
      tableLoading: false,
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: "计划开始日期",
          key: "planStart",
          dataIndex: "planStart",
          scopedSlots: { customRender: "planStart" }
        },
        {
          title: "计划结束日期",
          dataIndex: "planEnd",
          key: "planEnd",
          scopedSlots: { customRender: "planEnd" }
        },
        {
          title: "完成时间",
          dataIndex: "completeTime",
          key: "completeTime",
          scopedSlots: { customRender: "completeTime" }
        },
        {
          title: "巡查人",
          key: "inspectorName",
          dataIndex: "inspectorName",
          scopedSlots: { customRender: "inspectorName" }
        },
        {
          title: "任务状态",
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
          width: 100,
          scopedSlots: { customRender: "operation" }
        }
      ],
      projectId: "",
      project: {},
      projectData: [],
      projectOption: [], //项目
      statusOption: [],
      inspectorOption: [],
      inspectionUnitData: []
    };
  },
  components: {
    FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 240 + "px";
    }, 100);
    this.getProjectList(); //获取工程列表
    this.getInspectionUnitList();
  },
  methods: {
    moment,

    searchData(){
      this.onFinsh(true)
    },

    /**
     * 搜索
     * @author Chen Kuo
     * @date 2020-11-04
     * @returns {any}
     */
    onFinsh(refresh) {
      const values = this.$refs.form.getFieldsValue();
      if(refresh){
        this.current = 1;
      }
      const params = {
        current: this.current,
        ...values,
        planStart:
          values.time && values.time.length
            ? moment(values.time[0]).format("YYYY-MM-DD")
            : undefined,
        planEnd:
          values.time && values.time.length
            ? moment(values.time[1]).format("YYYY-MM-DD")
            : undefined,
        time: undefined
      };
      this.getTableData(params);
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.onFinsh();
    },
    /**
     * 查看详情
     * @author Chen Kuo
     * @date 2020-11-04
     * @param {object} item
     * @returns {any}
     */
    goDetail(item) {
      const { id } = item;
      this.$router.push({
        name: "inspectionDetail",
        params: {
          id
        }
      });
    },
    /**
     * 获取巡检列表
     * @author Chen Kuo
     * @date 2020-11-04
     * @returns {any}
     */
    getTableData(values) {
      const params = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        ...values
      };
      console.log(params);
      this.tableLoading = true;
      api.getInspectiontaskList(params).then(res => {
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
      api.qualityPersonProject().then(res => {
        if (res.code === 200) {
          this.projectData = res.data;

         this.$set(this.formList, 0, {
            ...this.formList[0],
            selectOptions: [...res.data]
          });
          this.$refs.form.setFieldsValue({ projectId: res.data[0].id });
          this.project = this.projectData[0] || {};
          this.onFinsh();
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
          this.$set(this.formList,1 ,{
            ...this.formList[1],
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