<template>
  <div id="addPromotion">
    <div class="content-header">AppB增值推广管理</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" @click="onAdd">新建</a-button>
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{ x: 1000, y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="status" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.status === 0">启用</span>
                <span v-if="operation.status === 1">禁用</span>
              </div>
            </template>
            <template slot="updateTime" slot-scope="operation">
              <div class="editable-row-operations">
                <span>{{moment(operation.updateTime).format("YYYY-MM-DD HH:mm")}}</span>
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a @click="onEdit(operation)">编辑</a>
                <a @click="onChangeStatus(operation)">{{operation.status === 0 ? "禁用" : "启用" }}</a>
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
            :pageSizeOptions="['10','20','50','100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:30px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { ADVERTISE_SKIP_TYPE } from "@/constance";
  import FormList from "@/components/FormList/index.jsx";
  import moment from "moment";
  import { debounce } from '@/utils/util';
  export default {
    name: "addPromotion",
    data() {
      return {
        formList: [
          {
            label: "标题",
            type: "input",
            name: "title",
            placeholder: "请输入标题",
          },
          {
            label: "类型",
            type: "select",
            name: "type",
            placeholder: "请选择类型",
            selectOptions: [
              {
                id: "",
                name: "全部"
              },
              {
                id: 0,
                name: "链接"
              },
              {
                id: 1,
                name: "自定义"
              },
              {
                id: 2,
                name: "模块"
              },
              {
                id: 3,
                name: "小程序"
              },
              {
                id: 4,
                name: "不跳转"
              },
            ],
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
                name: "启用"
              },
              {
                id: 1,
                name: "禁用"
              },
            ],
          },
          {
            label: "更新时间",
            type: "rangePicker",
            name: "updateTime",
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
        scrollY: 100,
        //表头数据
        tableColumns: [
          {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: 120,
            ellipsis: true,
          },
          {
            title: "类型",
            key: "type",
            dataIndex: "type",
            // width: 120,
            ellipsis: true,
            customRender: (val) => ADVERTISE_SKIP_TYPE[val] || val
          },
          {
            title: "状态",
            key: "status",
            scopedSlots: { customRender: "status" },
            // width: 120,
            ellipsis: true,
          },
          {
            title: "优先级",
            dataIndex: "priorityLevel",
            key: "priorityLevel",
            // width: 100,
            ellipsis: true,
          },
          // {
          //   title: "点击次数",
          //   dataIndex: "name",
          //   key: "5",
          //   width: 120,
          //   ellipsis: true,
          // },
          // {
          //   title: "点击人数",
          //   dataIndex: "name",
          //   key: "6",
          //   width: 120,
          //   ellipsis: true,
          // },
          {
            title: "更新时间",
            key: "updateTime",
            scopedSlots: { customRender: "updateTime" },
            // width: 200,
            ellipsis: true,
          },
          {
            title: "创建人",
            dataIndex: "createUserName",
            key: "createUserName",
            // width: 120,
            ellipsis: true,
          },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
            fixed: "right",
          },
        ],
        //列表数据
        tableData: [],
        tableLoading: false,
        //分页
        total: 0,
        pageSize: 10,
        current: 1,
        data:[],
        tableRefresh: false,
        pageRefresh: true
      }
    },
    components: {
      FormList
    },
    mounted () {
      this.$refs.form.setFieldsValue({
        type: this.formList[1].selectOptions[0]?.id,
        status: this.formList[2].selectOptions[0]?.id,
      });
      // this.getAdvertiseList();
      setTimeout(()=>{
        this.scrollY = this.$refs.content_main.offsetHeight - 295 + "px";
      },100)
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === "neighborhoodLifeSet") {
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
          title: "",
          type: this.formList[1].selectOptions[0]?.id,
          status: this.formList[2].selectOptions[0]?.id,
          updateTime: []
        });
        this.tableData = [];
        this.tableLoading = false;
        this.total = 0;
        this.pageSize = 10;
        this.current = 1;
        this.data = [];
        this.tableRefresh = false;
        this.pageRefresh = true;
        this.getAdvertiseList();
      }else if (this.tableRefresh) {
        this.getAdvertiseList();
      }
    },
    created () {

    },
    methods:{
      moment,
      //查询按钮
      onCheck() {
        debounce(()=>{
          this.current = 1;
          this.getAdvertiseList();
        })
      },
      //新建
      onAdd() {
        debounce(()=>{
          this.$router.push({path: "/advertise/addPromotionSet"})
        })
      },
      //编辑
      onEdit(operation) {
        debounce(()=>{
          this.$router.push({
            name: "addPromotionSet",
            params: {
              id: operation
            }
          })
        })
      },
      //启用禁用
      onChangeStatus(operation) {
        debounce(()=>{
          const that = this;
          that.$confirm({
            title: operation.status === 0 ? "禁用广告" : "启用广告",
            content: operation.status === 0 ? "确定禁用" + operation.title + "吗？" : "确定启用" + operation.title + "吗？",
            centered: true,
            okText: "确定",
            cancelText: "取消",
            onOk() {
              that.tableLoading = true;
              const para = {
                advertId: operation.id
              };
              api.getAdvertiseStatus(para).then(res => {
                if (res.code === 200) {
                  that.getAdvertiseList();
                } else {
                  that.$success({
                    title: operation.status === 0 ? "禁用广告" : "启用广告",
                    content: res.message
                  });
                  that.tableLoading = false;
                }
              }).catch(() => {
                that.tableLoading = false;
              });
            },
          });
        })
      },
      //删除
      onDelete(operation) {
        debounce(()=>{
          const that = this;
          that.$confirm({
            title: "删除广告",
            content: "确定删除" + operation.title + "吗？",
            centered: true,
            okText: "确定",
            cancelText: "取消",
            onOk() {
              that.tableLoading = true;
              const para = {
                advertId: operation.id
              };
              api.deleteAdvertises(para).then(res => {
                if (res.code === 200) {
                  if (that.tableData.length === 1) {
                    that.current--;
                    that.getAdvertiseList();
                  } else {
                    that.getAdvertiseList();
                  }
                } else {
                  // that.$success({
                  //   title: "删除广告",
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
        this.getAdvertiseList();
      },
      //获取列表
      getAdvertiseList() {
        this.tableLoading = true;
        const { title, type, status, updateTime   } = this.$refs.form.getFieldsValue();
        const para = {
          advertAreaIds: [10],
          title: title ? title.trim() : "",
          type,
          status,
          startUpdateTime: updateTime && updateTime !== [] && updateTime[0] ? moment(updateTime[0]).format("YYYY-MM-DD"): null,
          endUpdateTime: updateTime && updateTime !== [] && updateTime[1]? moment(updateTime[1]).format("YYYY-MM-DD"): null,
          currentPage: this.current,
          pageSize: this.pageSize
        };
        api.getAdvertise(para).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  #addPromotion{
    height: 100%;
    overflow: hidden;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
