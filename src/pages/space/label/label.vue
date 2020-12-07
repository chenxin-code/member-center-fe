<template>
  <div id="labels">
    <div class="content-header">标签管理</div>
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
            <template slot="tags" slot-scope="tags">
              <span>
                {{tags.tag === 0 ? "默认" : "自定义"}}
              </span>
            </template>
            <template slot="operation" slot-scope="operation" v-if="operation.tag === 1">
              <div class="editable-row-operations">
                <a @click="onEdit(operation)">编辑</a>
                <a @click="onDelet(operation)">删除</a>
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
          <a-modal v-model="visibleAdd" title="添加标签" @cancel="handleCancel">
            <template slot="footer">
              <a-button key="back" @click="handleCancel">
                取消
              </a-button>
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk_add">
                确定
              </a-button>
            </template>
            <a-form layout="inline">
              <a-form-item label="标签名" :validate-status="validateStatus" :help="validateHelp">
                <a-input v-model="addlabel" default-value="" style="width:195px;" @pressEnter="handleOk_add" @change="watchChange" />
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal v-model="visibleEdit" title="编辑标签" on-ok="handleOk_edit" @cancel="handleCancel">
            <template slot="footer">
              <a-button key="back" @click="handleCancel">
                取消
              </a-button>
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk_edit">
                确定
              </a-button>
            </template>
            <a-form layout="inline">
              <a-form-item label="标签名" :validate-status="validateStatus" :help="validateHelp">
                <a-input v-model="labelname" default-value="labelname" style="width:195px;" @pressEnter="handleOk_edit"  @change="watchChange" />
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
  import message from 'ant-design-vue/es/message'
  import { debounce } from '@/utils/util';
  export default {
    name: "labels",
    data() {
      return {
        formList: [
          {
            label: "标签名",
            type: "input",
            name: "sealabelName",
            placeholder: "请输入标签名"
          },
          {
            label: "类型",
            type: "select",
            name: "tag",
            selectOptions: [
              {
                id: "",
                name: "全部"
              },
              {
                id: "0",
                name: "默认"
              },
              {
                id: "1",
                name: "自定义"
              },
            ],
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
            title: "类型",
            key: "tag",
            scopedSlots: { customRender: "tags" },
          },
          {
            title: "操作",
            key: "type",
            scopedSlots: { customRender: "operation" },
          },
        ],
        tag: "",
        sealabelName: "",
        labelname: "",
        labelId: "",
        addlabel: "",
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
        console.log(this.$refs.content_main.offsetHeight);
        this.scrollY =  this.$refs.content_main.offsetHeight - 245 + "px";
      },100);
      this.$refs.form.setFieldsValue({
        tag: "",
      });
      this.getlabelList();
    },
    methods:{
      // 下拉框
      // handleSelectChange(value) {
      //   this.tag = value;
      //   this.current = 1;
      //   // this.getlabelList();
      // },
      watchChange(e) {
        const value  = e.target.value;
        if(value.trim().length > 0){
          this.validateStatus = "";
          this.validateHelp = "";
          if(value.trim().length > 20){
            this.validateStatus = "error";
            this.validateHelp = "标签名最长20字";
          }else{
            this.validateStatus = "";
            this.validateHelp = "";
          }
        }else{
          this.validateStatus = "error";
          this.validateHelp = "标签名称不能为空";
        }
      },
      //查询按钮
      onCheck() {
        debounce(()=>{
          this.current = 1;
          this.getlabelList();
        })
      },
      //添加
      onAdd() {
        // debounce(()=>{
          this.visibleAdd = true;
          this.addlabel = "";
        // })
      },
      //编辑
      onEdit(operation) {
        // debounce(()=>{
          // this.loading = false;
          this.labelname = operation.name;
          this.labelId = operation.id;
          this.visibleEdit = true;
        // })
      },
      //删除
      onDelet(operation) {
        // debounce(()=>{
          this.labelId = operation.id;
          this.$confirm({
            title: '删除标签',
            content: '是否删除该标签？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
              this.deleLabel();
            },
            onCancel: () => {
              console.log('Cancel');
            },
          });
        // })
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getlabelList();
      },
      //获取列表
      getlabelList() {
        const { tag, sealabelName } = this.$refs.form.getFieldsValue();
        const para = {
          tag: tag,
          name: sealabelName ? sealabelName.trim() : "",
          pageIndex: this.current,
          pageSize: this.pageSize
        }
        this.tableLoading = true;
        api.getLabel(para).then(res => {
         this.data = res.data.records;
         this.total = res.data.total;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      //删除标签
      deleLabel() {
        // debounce(()=>{
          const para = {
            id: this.labelId
          };
          this.tableLoading = true;
          api.deleteLabel(para).then(res => {
            if (res.code === 200) {
              if (this.data.length === 1) {
                this.current--;
                this.getlabelList();
              } else {
                this.getlabelList();
              }
              // this.data = this.data.filter(item => item.id !== this.labelId);
            }
          }).finally(() => {
            this.tableLoading = false;
          });
        // })
      },
      //编辑标签
      handleOk_edit() {
        // debounce(()=>{
          if (this.labelname.trim() === "") {
            this.validateStatus = "error";
            this.validateHelp = "标签名不能为空";
          } else if (this.labelname.length > 20){
            this.validateStatus = "error";
            this.validateHelp = "标签名最长20字";
          } else {
            const para = {
              id: this.labelId,
              name: this.labelname.trim()
            };
            this.loading = true;
            api.updateLabel(para).then(res => {
              if (res.code === 200) {
                this.labelname = "";
                this.labelId = "";
                this.visibleEdit = false;
                this.getlabelList();
              }else{
                this.validateStatus = "error";
                this.validateHelp = res.message;
                message.destroy()
              }
            }).finally(() => {
              this.loading = false;
            });
          }
        // })
      },
      //添加标签
      handleOk_add() {
        debounce(()=>{
          if (this.addlabel.trim() === "") {
            this.validateStatus = "error";
            this.validateHelp = "标签名不能为空";
          } else if (this.addlabel.length > 20){
            this.validateStatus = "error";
            this.validateHelp = "标签名最长20字";
          } else {
            this.current = 1;
            const para = {
              name: this.addlabel.trim(),
              tag: ""
            }
            api.addLabel(para).then(res => {
              if (res.code === 200) {
                this.addlabel = "";
                this.visibleAdd = false;
                this.getlabelList();
              }else if(res.code !== 200){
                this.validateStatus = "error";
                this.validateHelp = res.message;
                message.destroy()
              }
            }).finally(() => {
              this.tableLoading = false;
            });
          }
        })
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
  #labels{
    height: 100%;
    overflow: hidden;

    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
