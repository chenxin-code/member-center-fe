<template>
  <div id="typeManage">
    <div class="content-header">类型管理</div>
    <div class="content-main" ref="content_main" style="padding: 20px;">
      <a-button type="primary" @click="addType">+ 添加</a-button>
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ y: scrollY }"
        :row-key="(r,i) => i"
        :loading="tableLoading"
        :selectable="false"
        style="width:100%;margin-top:8px;"
      >
        <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations">
            <a @click="editType(operation)">编辑</a>
            <a @click="deleteType(operation)" style="margin-left:20px;">删除</a>
          </div>
        </template>
      </a-table>
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
      <a-modal v-model="addVisible" title="添加类型" on-ok="addTypeOk" @cancel="addTypeCancel">
        <template slot="footer">
          <a-button key="back" @click="addTypeCancel">取消</a-button>
          <a-button key="submit" type="primary" :loading="btnLoading" @click="addTypeOk">确定</a-button>
        </template>
        <a-form layout="inline">
          <a-form-item label="类型名称" :validate-status="validateStatus" :help="inputErrorTitle">
            <a-input
              v-model="addTypeName"
              style="width:195px;"
              @change="watchChange"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal v-model="editVisible" title="编辑类型" on-ok="editTypeOk" @cancel="editTypeCancel">
        <template slot="footer">
          <a-button key="back" @click="editTypeCancel">取消</a-button>
          <a-button key="submit" type="primary" :loading="btnLoading" @click="editTypeOk">确定</a-button>
        </template>
        <a-form layout="inline">
          <a-form-item label="类型名称" :validate-status="validateStatus" :help="inputErrorTitle">
            <a-input
              v-model="editTypeName"
              style="width:195px;"
              @change="watchChange"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import message from 'ant-design-vue/es/message';
  import { debounce } from '@/utils/util';
  export default {
    name: "typeManage",
    data() {
      return {
        //表头数据
        tableColumns: [
          {
            title: "类型名",
            key: "name",
            dataIndex: "name",
          },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
          },
        ],
        //表格高度
        scrollY: 100,
        //列表数据
        tableData: [],
        tableLoading: false,
        //分页
        total: 0,
        pageSize: 10,
        current: 1,
        //模态控制
        addTypeName: "",
        addVisible: false,
        operation: "",
        editTypeName: "",
        editVisible: false,
        btnLoading: false,
        //添加类型编辑类型input框的status
        validateStatus: "",
        //添加类型编辑类型input框的error提示语
        inputErrorTitle: "",
      };
    },
    components: {},
    mounted() {
      setTimeout(() => {
        this.scrollY = this.$refs.content_main.offsetHeight - 200 + "px";
      }, 100);
    },
    created() {
      this.getTypeList();
    },
    methods: {
      //input框watch事件
      watchChange(e) {
        const value  = e.target.value;
        if(value.trim().length > 0){
          this.validateStatus = "";
          this.inputErrorTitle = "";
          if(value.trim().length > 10){
            this.validateStatus = "error";
            this.inputErrorTitle = "类型名称最长10字";
          }else{
            this.validateStatus = "";
            this.inputErrorTitle = "";
          }
        }else{
          this.validateStatus = "error";
          this.inputErrorTitle = "类型名称不能为空";
        }
      },
      //添加类型
      addType() {
        // debounce(()=>{
          this.addVisible = true;
          this.addTypeName = "";
        // })
      },
      //添加类型确定按钮
      addTypeOk() {
        debounce(()=>{
          if (this.addTypeName.trim() === "") {
            this.validateStatus = "error";
            this.inputErrorTitle = "类型名称不能为空";
          } else {
            if (this.addTypeName.length > 10) {
              this.validateStatus = "error";
              this.inputErrorTitle = "类型名称最长10字";
            } else {
              this.validateStatus = "";
              this.inputErrorTitle = "";
              this.btnLoading = true;
              const para = {
                id: "",
                name: this.addTypeName.trim(),
              };
              api.addType(para).then(res => {
                if (res.code === 200) {
                  this.addVisible = false;
                  this.current = 1;
                  this.getTypeList();
                } else {
                  this.validateStatus = "error";
                  this.inputErrorTitle = res.message;
                  message.destroy()
                }
              }).finally(() => {
                this.btnLoading = false;
              })
            }
          }
        })
      },
      //添加类型取消按钮
      addTypeCancel() {
        debounce(()=>{
          this.addVisible = false;
          this.validateStatus = "";
          this.inputErrorTitle = "";
        })
      },
      //编辑类型
      editType(operation) {
        // debounce(()=>{
          this.operation = operation;
          this.editTypeName = operation.name;
          this.editVisible = true;
        // })
      },
      //编辑类型确定按钮
      editTypeOk() {
        debounce(()=>{
          if (this.editTypeName.trim() === "") {
            this.validateStatus = "error";
            this.inputErrorTitle = "类型名称不能为空";
          } else{
            if (this.editTypeName.length > 10) {
              this.validateStatus = "error";
              this.inputErrorTitle = "类型名称最长10字";
            } else {
              this.validateStatus = "";
              this.inputErrorTitle = "";
              this.btnLoading=true;
              const para = {
                id: this.operation.id,
                name: this.editTypeName.trim()
              };
              api.editType(para).then(res => {
                if (res.code === 200) {
                  this.editVisible = false;
                  this.getTypeList();
                } else {
                  this.validateStatus = "error";
                  this.inputErrorTitle = res.message;
                  message.destroy()
                }
              }).finally(() => {
                this.btnLoading = false;
              })
            }
          }
        })
      },
      //编辑类型取消按钮
      editTypeCancel() {
        // debounce(()=>{
          this.editVisible = false;
          this.validateStatus = "";
          this.inputErrorTitle = "";
        // })
      },
      //删除类型
      deleteType(operation) {
        // debounce(()=>{
          const that = this;
          that.$confirm({
            title: "删除类型",
            content: "是否删除该类型",
            centered: true,
            okText: "是",
            cancelText: "否",
            onOk() {
              that.tableLoading = true;
              const para = {
                id: operation.id
              };
              api.deleteType(para).then(res => {
                if (res.code === 200) {
                  if(that.tableData.length === 1) {
                    that.current--;
                    that.getTypeList();
                  }else{
                    that.getTypeList();
                  }
                } else {
                  that.$error({
                    title: "删除类型",
                    content: res.message
                  });
                  message.destroy();
                  that.tableLoading = false;
                }
              }).catch(()=>{
                that.tableLoading = false;
              });
            },
          });
        // })
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
        this.current = current;
        this.pageSize = pageSize;
        this.getTypeList();
      },
      //获取类型列表
      getTypeList() {
        this.tableLoading = true;
        const para = {
          pageIndex: this.current ,
          pageSize: this.pageSize
        };
        api.getType(para).then(res => {
          this.total = res.data.total;
          this.tableData = res.data.records;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
    },
  };
</script>

<style lang="less" scoped>
#typeManage {
  height: 100%;
  overflow: hidden;
}
</style>
