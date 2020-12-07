<template>
  <div id="advertiseArea">
    <div class="content-header">装修申请</div>
    <div
      class="content-main"
      ref="content_main"
      style="padding: 20px; box-sizing: border-box"
    >
      <!-- <a-col flex:auto> -->
      <!-- <FormList ref="form" rowCol="3" :formList="formList" :onSubmit="onCheck" /> -->

      <a-form
        ref="form-ref"
        :form="form"
        @submit="handleSubmit"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        v-if="renderKey"
      >
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="项目">
              <a-select
                placeholder="全部"
                v-decorator="['projectId', { initialValue: projectList[0].id }]"
              >
                <template v-for="(item, index) in projectList">
                  <a-select-option
                    :value="item.id"
                    :key="index"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="房间">
              <a-input
                v-decorator="['spaceName', {}]"
                placeholder="请输入房间"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="业主">
              <a-input
                v-decorator="['ownerInfo', {}]"
                placeholder="请输入姓名或手机号"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="进度">
              <a-select
                placeholder="全部"
                v-decorator="[
                  'decorationStatus',
                  { initialValue: decorationList[0].codeId },
                ]"
              >
                <template v-for="(item, index) in decorationList">
                  <a-select-option
                    :value="item.codeId"
                    :key="index"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="整改情况">
              <a-select
                placeholder="全部"
                v-decorator="[
                  'rectificationStatus',
                  { initialValue: rectificationList[0].id },
                ]"
              >
                <template v-for="(item, index) in rectificationList">
                  <a-select-option
                    :value="item.id"
                    :key="index"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="装修日期">
              <a-range-picker v-decorator="['decorationDate']" />
              <!-- <a-date-picker placeholder="开始日期" v-decorator="['decorationStart', {}]" style="width:50%" @change="dateChange($event,'decorationStart')" />
                  <a-date-picker placeholder="结束日期" v-decorator="['decorationEnd', {}]" style="width:50%" @change="dateChange($event,'decorationEnd')" /> -->
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="申请日期">
              <a-range-picker v-decorator="['applyTime']" />
              <!-- <a-date-picker placeholder="开始日期" v-decorator="['applyStart', {}]" style="width:50%" @change="dateChange($event,'applyStart')" />
                  <a-date-picker placeholder="结束日期" v-decorator="['applyEnd', {}]" style="width:50%" @change="dateChange($event,'applyEnd')" /> -->
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="">
              <a-button type="primary" html-type="submit">查询</a-button>
              <!-- <a-button
                type="primary"
                @click="removeHandle"
                style="margin-left: 10px"
                >重 置</a-button
              > -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div ref="btn-ref">
        <a-button
          v-if="hasRangeAuthorityWithoutProject(['button_decorate_create'])"
          type="primary"
          @click="onAdd"
          icon="plus"
          >新 建</a-button
        >
      </div>

      <!-- 表格 -->
      <a-table
        size="small"
        :columns="tableColumns"
        :row-key="(r, i) => i"
        :data-source="tableData"
        :scroll="{ x: 1580, y: scrollY }"
        :pagination="false"
        :loading="tableLoading"
        style="margin-top: 10px"
      >
        <template slot="decorationDateStart" slot-scope="operation">
          <div class="editable-row-operations">
            <span>{{
              moment(operation.decorationDateStart).format("YYYY-MM-DD")
            }}</span>
          </div>
        </template>
        <template slot="decorationDateEnd" slot-scope="operation">
          <div class="editable-row-operations">
            <span>{{
              moment(operation.decorationDateEnd).format("YYYY-MM-DD")
            }}</span>
          </div>
        </template>
        <template slot="rectification">
          <div class="editable-row-operations">
            <span>无整改</span>
          </div>
        </template>
        <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations">
            <a 
              v-if="hasRangeAuthorityWithoutProject(['button_decorate_create']) && (operation.decorationStatus === '01'|| operation.decorationStatus === '02'|| operation.decorationStatus === '03')" 
              @click="onEdit(operation)" 
               > 
               编辑
            </a>
            <a-divider type="vertical" v-if="(hasRangeAuthorityWithoutProject(['button_decorate_create']) && (operation.decorationStatus === '01'|| operation.decorationStatus === '02'|| operation.decorationStatus === '03')) && operation.decorationStatus != '01'" />
            <a
              v-if="operation.decorationStatus != '01'"
              @click="onDetail(operation)"
            >
              查看
            </a>
            <!--<a @click="onChangeStatus(operation)">{{operation.status === 0 ? "禁用" : "启用" }}</a>
                <a @click="onDelete(operation)" style="margin-left:20px;">删除</a>-->
          </div>
        </template>
      </a-table>

      <!-- 分页 -->
      <a-pagination
        :total="total"
        :show-total="(total) => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        v-model="current"
        :default-current="current"
        :page-size.sync="pageSize"
        :pageSizeOptions="['10', '20', '30', '50', '100']"
        @change="onShowSizeChange"
        @showSizeChange="onShowSizeChange"
        style="margin-top: 10px; width: 100%; text-align: right"
      />
      <!-- </a-col> -->
    </div>
  </div>
</template>

<script>
import api from "@/api";
// import FormList from "@/components/FormList/index.jsx";
import moment from "moment";
import { hasRangeAuthorityWithoutProject } from "@/utils/authority";
export default {
  name: "decorateManagement",
  data() {
    return {
      form: this.$form.createForm(this, { name: "formList" }),
      projectList: [{ id: "", name: "全部" }],
      decorationList: [{ codeId: "", name: "全部" }],
      rectificationList: [
        { id: "", name: "全部" },
        { id: 1, name: "无整改" },
        { id: 2, name: "待整改" },
        { id: 3, name: "已验收" },
      ],
      renderKey: true,
      formList: [
        {
          label: "项目",
          type: "select",
          name: "projectId",
          placeholder: "全部",
          selectOptions: [],
        },
        {
          label: "房间",
          type: "input",
          name: "spaceName",
          placeholder: "请输入房间",
        },
        {
          label: "业主",
          type: "input",
          name: "ownerInfo",
          placeholder: "请输入业主",
        },
        {
          label: "进度",
          type: "select",
          name: "decorationStatus",
          placeholder: "全部",
          selectOptions: [],
        },
        {
          label: "整改状态",
          type: "select",
          name: "rectificationStatus",
          placeholder: "全部",
          selectOptions: [
            {
              id: "",
              name: "全部",
            },
            {
              id: 1,
              name: "无整改",
            },
            {
              id: 2,
              name: "待整改",
            },
            {
              id: 3,
              name: "已验收",
            },
          ],
        },
        {
          label: "装修结束日期",
          type: "rangePicker",
          name: "decorationDate",
        },
        {
          label: "申请时间",
          type: "rangePicker",
          name: "applyTime",
        },
        {
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
          labelCol: { span: 0 },
          wrapperCol: { span: 24 },
        },
      ],
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      // limit: 10,
      total: 0,
      tableData: [], //表格数据
      tableLoading: false,
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: "项目",
          key: "projectName",
          width: 120,
          dataIndex: "projectName",
          ellipsis: true,
        },
        {
          title: "房间",
          key: "spaceName",
          dataIndex: "spaceName",
          width: 220,
          ellipsis: true,
        },
        {
          title: "业主",
          key: "ownerInfo",
          width: 130,
          dataIndex: "ownerInfo",
          ellipsis: true,
        },
        {
          title: "装修开始日期",
          key: "decorationDateStart",
          width: 80,
          scopedSlots: { customRender: "decorationDateStart" },
          ellipsis: true,
        },
        {
          title: "装修结束日期",
          key: "decorationDateEnd",
          width: 80,
          scopedSlots: { customRender: "decorationDateEnd" },
          ellipsis: true,
        },
        {
          title: "申请日期",
          key: "createTimeStr",
          width: 120,
          dataIndex: "createTimeStr",
          ellipsis: true,
        },
        {
          title: "进度",
          key: "decorationStatusString",
          width: 120,
          dataIndex: "decorationStatusString",
          ellipsis: true,
        },
        {
          title: "整改状态",
          key: "rectification",
          width: 80,
          scopedSlots: { customRender: "rectification" },
          ellipsis: true,
        },
        {
          title: "操作",
          width: 100,
          key: "operation",
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
      projectData: [],
      spaceOption: [],
      decorationStatusOption: [],
      progressOption: [],
    };
  },
  components: {
    // FormList
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollY =
          this.$refs.content_main.offsetHeight -
          this.$refs["form-ref"].$el.offsetHeight -
          154 +
          "px";
      }, 0);
    });
    this.getProjectList();
    this.getStatusList();
    this.getTableData();
  },
  methods: {
    moment,

    getHeight(dom, type) {
      console.log(dom, type);
      let height = 0;
      return this.$nextTick(() => {
        if (type == "com") {
          height = this.$refs[dom].$el.offsetHeight;
        } else {
          height = this.$refs[dom].offsetHeight;
        }
        return height;
      });
    },
    hasRangeAuthorityWithoutProject(authKeys) {
      return hasRangeAuthorityWithoutProject(authKeys);
    },
    //查询按钮
    onCheck() {
      this.current = 1;
      this.getTableData();
    },

    //删除活动
    onDelete(operation) {
      console.log(e);
      this.$confirm({
        title: "提示",
        content: "确定要删除？",
        onOk() {
          that.tableLoading = true;
          const para = {
            id: operation.id,
          };
          api
            .deleteDecorateApply(para)
            .then((res) => {
              if (res.code === 200) {
                that.getTableData();
              } else {
                that.$success({
                  title: "删除申请",
                  content: res.message,
                });
                that.tableLoading = false;
              }
            })
            .catch(() => {
              that.tableLoading = false;
            });

          console.log("删除" + e.title);
        },
      });
    },

    //编辑活动
    onEdit(operation) {
      this.$router.push({
        name: "decorateManagementEdit",
        params: { id: operation.applicationId },
      });
    },

    onDetail(operation) {
      this.$router.push({
        name: "decorateManagementDetail",
        params: { id: operation.applicationId },
      });
    },

    //新建
    onAdd() {
      this.$router.push({ path: "/decorateManagement/add" });
    },
    removeHandle() {
      this.renderKey = false;
      this.$nextTick(() => {
        this.renderKey = true;
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.current = current;
      this.pageSize = pageSize;
      this.getTableData();
    },

    // 点击查询
    handleSubmit(e) {
      e.preventDefault();
      console.log(this.form.getFieldsValue());
      this.current = 1;
      this.getTableData();
    },

    //获取表格数据
    getTableData() {
      const {
        projectId,
        spaceName,
        ownerInfo,
        decorationStatus,
        rectificationStatus,
        decorationDate,
        applyTime,
      } = this.form.getFieldsValue();

      console.log(decorationDate);
      const para = {
        projectId, //项目ID
        spaceName, //标题
        ownerInfo, //状态
        decorationStatus, //类型
        rectificationStatus,
        decorationDateStart:
          decorationDate && decorationDate.length != 0
            ? moment(decorationDate[0]).format("YYYY-MM-DD")
            : null,
        decorationDateEnd:
          decorationDate && decorationDate.length != 0
            ? moment(decorationDate[1]).format("YYYY-MM-DD")
            : null,
        applyTimeStart:
          applyTime && applyTime.length != 0
            ? moment(applyTime[0]).format("YYYY-MM-DD")
            : null,
        applyTimeEnd:
          applyTime && applyTime.length != 0
            ? moment(applyTime[1]).format("YYYY-MM-DD")
            : null,
        pageIndex: this.current,
        pageSize: this.pageSize,
      };
      console.log(para);
      api
        .getDecorateAppleList(para)
        .then((res) => {
          console.log(res.data);
          if (res.code === 200) {
            this.tableData = res.data.datalist;
            this.total = res.data.totalCount;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    //获取项目
    getProjectList() {
      api.decorationPersonProject().then((res) => {
        if (res.code === 200) {
          console.log(res);
          this.projectList = this.projectList.concat(res.data);
        }
      });
    },

    //获取装修状态
    getStatusList() {
      api
        .getDeCommonCodeList({
          parentId: 1,
        })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.decorationList = this.decorationList.concat(res.data.list);
          }
        });
    },

    // 监听时间改变
    dateChange(event, type) {
      console.log(event, type);
      let timeSign = new Date(moment(event._d).format("YYYY-MM-DD")).getTime();
      let { getFieldsValue, setFieldsValue } = this.form;

      if (type == "decorationStart") {
        this.checkTime(timeSign, "decorationEnd", "大于");
      } else if (type == "decorationEnd") {
        this.checkTime(timeSign, "decorationStart", "小于");
      } else if (type == "applyStart") {
        this.checkTime(timeSign, "applyEnd", "大于");
      } else if (type == "applyEnd") {
        this.checkTime(timeSign, "applyStart", "小于");
      }
    },

    checkTime(timeSign, type, symbol) {
      let { getFieldsValue, setFieldsValue } = this.form;
      let aStart = getFieldsValue([type])[type]; // 中国标准时间
      let applyStart = aStart
        ? new Date(moment(aStart).format("YYYY-MM-DD")).getTime()
        : 0; //时间戳
      if (symbol == "大于") {
        if (timeSign > applyStart && applyStart != 0) {
          // 如果开始时间大于结束时间
          setFieldsValue({
            [type]: undefined,
          });
          this.$message.warning("开始时间不能大于结束时间");
        }
      } else {
        if (timeSign < applyStart && applyStart != 0) {
          // 如果开始时间大于结束时间
          setFieldsValue({
            [type]: undefined,
          });
          this.$message.warning("开始时间不能大于结束时间");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
#advertiseArea {
  width: 100%;
  height: 100%;
  /deep/ .ant-table-thead tr {
    background: rgb(244, 244, 244) !important;
    th {
      font-weight: bold !important;
      color: gray;
    }
  }
}
</style>