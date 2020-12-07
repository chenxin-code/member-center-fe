<template>
  <div id="classifyManage">
    <div class="content-header">分类管理</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" html-type="submit" @click="onAdd">
            +添加
          </a-button>
          <!-- 表格 -->
          <a-table
            :columns="columns"
            :row-key="(r,i) => i"
            :data-source="data"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="width:100%;margin-top:8px;"
          >
            <template slot="operation" slot-scope="operation" >
              <div class="editable-row-operations">
                <a @click="onEdit(operation)">编辑</a>
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
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            :pageSizeOptions= "['10', '20', '50', '100']"
            style="margin-top:30px;width:100%;text-align: right;"
          />
          <a-modal v-model="visibleAdd" title="添加分类" on-ok="handleOk_add">
            <template slot="footer">
              <a-button key="back" @click="handleCancel">
                取消
              </a-button>
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk_add">
                确定
              </a-button>
            </template>
            <a-form layout="inline">
              <a-form-item label="分类名" :validate-status="validateStatus" :help="validateHelp">
                <a-input v-model="addLabel" default-value="" style="width:225px;" @pressEnter="handleOk_add" @change="labelEdit" placeholder="请输入分类名称，最长10个字"/>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal v-model="visibleEdit" title="分类标签" on-ok="handleOk_edit">
            <template slot="footer">
              <a-button key="back" @click="handleCancel">
                取消
              </a-button>
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk_edit">
                确定
              </a-button>
            </template>
            <a-form layout="inline">
              <a-form-item label="分类名" :validate-status="validateStatus" :help="validateHelp">
                <a-input v-model="labelName" default-value="labelName" style="width:225px;" @pressEnter="handleOk_edit" @change="labelEdit" />
              </a-form-item>
            </a-form>
          </a-modal>
        </a-col>
      </a-row>

    </div>
  </div>
</template>

<script>
  import FormList from "@/components/FormList/index.jsx";
  import api from "@/api";

  export default {
    name: "classifyManage",
    data() {
      return {
        formList: [
          {
            label: "分类名",
            type: "input",
            name: "name",
            placeholder: "请输入"
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
        scrollY:100,
        //表头数据
        columns : [
          {
            title: "标签名",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "操作",
            key: "type",
            scopedSlots: { customRender: "operation" },
          },
        ],
        tag: "",
        name: "",
        labelName: "",
        labelId: "",
        addLabel: "",
        loading: false,
        visibleEdit: false,
        visibleAdd: false,
        tableLoading: true,
        validateStatus: "",
        validateHelp: "",
        //列表数据
        data : [],
        //分页
        total: 0,
        pageSize: 10,
        current: 1
      }
    },
    components: {
      FormList
    },
    mounted() {
      setTimeout(()=>{
        this.scrollY =  this.$refs.content_main.offsetHeight - 245 + "px";
      },100);
      this.getLabelList();
    },
    methods:{
      //查询按钮
      onCheck() {
        this.current = 1;
        this.getLabelList();
      },
      //添加
      onAdd() {
        this.addLabel = ""
        this.visibleAdd = true;
      },
      //编辑
      onEdit(operation) {
        this.labelName = operation.name;
        this.labelId = operation.id;
        this.visibleEdit = true;
      },
      //删除
      onDelete(operation) {
        this.labelId = operation.id;
        this.$confirm({
          title: '删除分类',
          content: '是否删除该分类？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.delLabel();
          },
          onCancel: () => {
            console.log('Cancel');
          },
        });
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        // console.log(current, pageSize);
        this.current = current;
        this.pageSize = pageSize;
        this.getLabelList();
      },
      //获取列表
      getLabelList() {
        const { name } = this.$refs.form.getFieldsValue();
        const para = {
          name,
          pageIndex: this.current,
          pageSize: this.pageSize
        };
        this.tableLoading = true;
        api.getResidentLabel(para).then(res => {
          this.data = res.data.records;
          this.total = res.data.total;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      //删除标签
      delLabel() {
        const para = {
          id: this.labelId
        };
        this.tableLoading = true;
        api.deleteResidentLabel(para).then(res => {
          if (res.code === 200) {
            this.getLabelList();
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      //编辑标签
      handleOk_edit() {
        if (this.labelName.trim() === "") {
          this.validateStatus = "error";
          this.validateHelp = "标签名不能为空";
        } else if (this.labelName.length > 10){
          this.validateStatus = "error";
          this.validateHelp = "标签名最长10字";
        } else {
          const para = {
            id: this.labelId,
            name: this.labelName.trim()
          };
          this.loading = true;
          api.updateResidentLabel(para).then(res => {
            if (res.code === 200) {
              this.labelName = "";
              this.labelId = "";
              this.visibleEdit = false;
              this.getLabelList();
            }else{
              this.validateStatus = "error";
              this.validateHelp = res.message;
            }
          }).finally(() => {
            this.loading = false;
          });
        }
      },
      //添加标签
      handleOk_add() {
        if (this.addLabel.trim() === "") {
          this.validateStatus = "error";
          this.validateHelp = "标签名不能为空";
        } else if (this.addLabel.length > 10){
          this.validateStatus = "error";
          this.validateHelp = "标签名最长10字";
        } else {
          this.current = 1;
          const para = {
            name: this.addLabel.trim(),
            tag: ""
          };
          this.loading = true;
          api.addResidentLabel(para).then(res => {
            if (res.code === 200) {
              this.addLabel = "";
              this.visibleAdd = false;
              this.getLabelList();
            }else if(res.code !== 200){
              this.validateStatus = "error";
              this.validateHelp = res.message;
            }
          }).catch(() => {
            this.loading = false;
            this.tableLoading = false;
          }).finally(() => {
            this.loading = false;
            this.addLabel = "";
          });
        }
      },
      labelEdit() {
        this.validateStatus = "";
        this.validateHelp = "";
      },
      handleCancel() {
        this.loading = false;
        this.validateStatus = "";
        this.validateHelp = "";
        this.visibleEdit = false;
        this.visibleAdd = false;
      },
    }
  }
</script>

<style lang="less" scoped>
  #classifyManage{
    height: 100%;
    overflow: hidden;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
