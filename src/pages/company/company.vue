<template>
  <div id="company">
    <div class="content-header">公司管理</div>
    <div class="content-main" ref="contentMain">
      <a-row type="flex" style="padding:20px;height:100%;flex-flow: row;">
        <!-- 左边树形控件 -->
        <a-col flex="220px" class="left_content">
          <ul class="left-list">
            <li @click="change_item('inCompany')" :class="{ active:item == 'inCompany'}" style="cursor:pointer">HCM内部公司</li>
            <!-- <li @click="change_item('outCompany')" :class="{ active:item == 'outCompany'}">HCM外部公司</li> -->
            <li @click="change_item('notCompany')" :class="{ active:item == 'notCompany'}" style="cursor:pointer">非HCM公司</li>
          </ul>
        </a-col>
        <!-- 右边列表 -->
        <a-col flex="auto" style="padding:0px 10px;height:100%;">
          <template v-if="item === 'inCompany'">
            <!-- 查询条件 -->
            <FormList
              ref="form"
              rowCol="3"
              :formList="formList"
              :onSubmit="onSearchIn"
            />
            <!-- 表格 -->
            <a-table
              :columns="columns"
              :row-key="(r,i) => i"
              :loading="tableLoading"
              :data-source="dataIn"
              :pagination="false"
              :scroll="{ y: scrollY }"
              style="width:100%;margin-top:8px;"
            >
              <template slot="createTime" slot-scope="createTime">
                <span>{{ moment(createTime).format("YYYY-MM-DD") }}</span>
              </template>
            </a-table>
          </template>
          <template v-if="item === 'outCompany'">
            <!-- 查询条件 -->
            <FormList
              ref="form"
              rowCol="3"
              :formList="formList"
              :onSubmit="onSearchOut"
            />

            <!-- 表格 -->
            <a-table
              :columns="columnsOut"
              :row-key="(r,i) => i"
              :data-source="dataOut"
              :loading="tableLoading"
              :pagination="false"
              :scroll="{ y: scrollY }"
              style="width:100%;margin-top:8px;"
            >
            </a-table>
          </template>
          <template v-if="item === 'notCompany'">
            <!-- 查询条件 -->
            <a-form  layout="inline">
              <FormList
                ref="form"
                rowCol="3"
                :formList="formListNot"
                :onSubmit="onSearchNot"
              />
              <a-button type="primary" html-type="submit" @click="onAdd">
                +添加
              </a-button>
<!--              <a-form-item label="公司名称">-->
<!--                <a-input v-model="name" style="width:195px;"/>-->
<!--              </a-form-item>-->
<!--              <a-form-item :wrapper-col="{ span: 12, offset: 5 }">-->
<!--                <a-button type="primary" html-type="submit" @click="onSearchNot">-->
<!--                  查询-->
<!--                </a-button>-->
<!--              </a-form-item>-->
<!--              <a-form-item :wrapper-col="{ span: 12, offset: 5 }">-->
<!--               -->
<!--              </a-form-item>-->
            </a-form>
            <!-- 表格 -->
            <a-table
              :columns="columnsNot"
              :data-source="dataNot"
              :row-key="(r,i) => i"
              :loading="tableLoading"
              :pagination="false"
              :scroll="{ y: scrollYNo }"
              style="width:100%;margin-top:8px;"
            >
              <template slot="createTime" slot-scope="createTime">
                <span>{{ moment(createTime).format("YYYY-MM-DD") }}</span>
              </template>
              <template slot="operation" slot-scope="operation">
                <div class="editable-row-operations">
                  <a @click="onEdit(operation)">编辑</a>
                  <a @click="onDelete(operation)" style="margin-left:20px;">删除</a>
                </div>
              </template>
            </a-table>
          </template>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            v-model="current"
            :default-current="current"
            :page-size.sync="pageSize"
            :pageSizeOptions= "['10', '20', '50', '100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:20px;width:100%;text-align: right;"
          />
        </a-col>

        <a-modal v-model="visibleAdd" title="添加公司" on-ok="addCompany">
          <template slot="footer">
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="addCompany">
              确定
            </a-button>
          </template>
          <a-form layout="inline">
            <a-form-item label="公司名称" :validate-status="validateStatus" :help="validateHelp">
              <a-input v-model="addcompanyname" default-value="" style="width:195px;" @change="companyedit" @pressEnter="addCompany" />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-modal v-model="visibleEdit" title="编辑公司" on-ok="editCompany">
          <template slot="footer">
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="editCompany">
              确定
            </a-button>
          </template>
          <a-form layout="inline">
            <a-form-item label="公司名称" :validate-status="validateStatus" :help="validateHelp">
              <a-input v-model="companyname" :default-value="companyname" style="width:195px;" @change="companyedit" />
            </a-form-item>
          </a-form>
        </a-modal>
      </a-row>
    </div>
  </div>
</template>

<script>
import FormList from "@/components/FormList/index.jsx";
import api from "@/api";
import moment from "moment"
import message from 'ant-design-vue/es/message'

export default {
  name: "company",
  data() {
    return {
      formList: [
        {
          label: "公司名称",
          type: "input",
          name: "name",
          placeholder: "请输入公司名称"
        },
        {
          label: "公司编码",
          type: "input",
          name: "code",
          placeholder: "请输入公司编码"
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
      formListNot:[
        {
          label: "公司名称",
          type: "input",
          name: "noName",
          placeholder: "请输入公司名称"
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
      code: "",
      name: "",
      companyId: "",
      addcompanyname: "",
      companyname: "",
      item: "inCompany",
      //表格高度
      scrollY: 200,
      scrollYNo: 200,
      //表头数据
      columns : [
        {
          title: "公司名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "公司编码",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "所属板块",
          dataIndex: "typeText",
          key: "typeText",
        },
      ],
      columnsOut : [
        {
          title: "公司名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "公司编码",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "合作机构",
          dataIndex: "parterner",
          key: "parterner",
        },
      ],
      //表头数据
      columnsNot : [
        {
          title: "公司名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "操作",
          key: "type",
          scopedSlots: { customRender: "operation" },
        },
      ],
      //列表数据
      dataIn : [],
      dataOut : [],
      dataNot : [],
      validateStatus: "",
      validateHelp: "",
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      visibleAdd: false,
      visibleEdit: false,
      loading: false,
      tableLoading: true
    };
  },
  watch: {
    visibleAdd() {
      this.addcompanyname = "";
      this.validateStatus = "";
      this.validateHelp = "";
    },
    visibleEdit() {
      this.validateStatus = "";
      this.validateHelp = "";
    },
  },
  components: {
    FormList
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 205 + "px";
      this.scrollYNo = this.$refs.contentMain.offsetHeight - 240 + "px";
    }, 100);
    this.getHcmlist();
  },
  methods: {
    moment,
    getHcmlist(){
      this.tableLoading = true;
      const { code, name } = this.$refs.form.getFieldsValue();
      const para = {
        code: code ? code.trim() : "",
        name: name ? name.trim() : "",
        pageIndex: this.current,
        pageSize: this.pageSize
      }
      api.getQueryHcm(para).then(res => {
       this.dataIn = res.data.records;
       this.total = res.data.total;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    getnotHcmlist(){
      this.tableLoading = true;
      const { noName } = this.$refs.form.getFieldsValue();
      const para = {
        name: noName ? noName.trim() : "",
        pageIndex: this.current,
        pageSize: this.pageSize
      }
      api.getQueryNotHcm(para).then(res => {
         this.dataNot = res.data.records;
         this.total = res.data.total;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    addCompany() {
      if (this.addcompanyname.trim() === "") {
        this.validateStatus = "error";
        this.validateHelp = "公司名不能为空";
      } else if (this.addcompanyname.length > 30) {
        this.validateStatus = "error";
        this.validateHelp = "公司名最长30字";
      } else {
        const para = {
          name: this.addcompanyname.trim(),
        };
        this.loading = true;
        api.addQueryNotHcm(para).then((res) => {
            if (res.code === 200) {
              this.visibleAdd = false;
              this.current = 1;
              this.getnotHcmlist();
            } else {
              this.validateStatus = "error";
              this.validateHelp = res.message;
              message.destroy()
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    updateCompany() {
      if (this.companyname.trim() === "") {
        this.validateStatus = "error";
        this.validateHelp = "公司名不能为空";
      } else if (this.companyname.length > 30) {
        this.validateStatus = "error";
        this.validateHelp = "公司名最长30字";
      } else {
        const para = {
          id: this.companyId,
          name: this.companyname.trim(),
        };

        this.loading = true;
        api.updateQueryNotHcm(para).then((res) => {
            if (res.code === 200) {
              this.visibleEdit = false;
              this.tableLoading = true;
              this.getnotHcmlist();
            } else {
              this.validateStatus = "error";
              this.validateHelp = res.message;
              message.destroy()
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    deleCompany() {
      const para = {
        id: this.companyId,
      };
      api
        .deleQueryNotHcm(para)
        .then((res) => {
          if (res.code === 200) {
            if (this.dataNot.length === 1) {
              this.current--;
              this.getnotHcmlist();
            } else {
              this.getnotHcmlist();
            }
          }
        })
        .finally(() => {
        });
    },
    companyedit(){
      this.validateStatus = "";
      this.validateHelp = "";
    },
    change_item(item){
      this.item = item;
      this.current = 1;
      this.total = 0;
      this.getChangeList(item);
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getChangeList();
    },
    getChangeList(){
      if(this.item === "inCompany"){
        this.getHcmlist();
      }else if(this.item === "notCompany"){
        this.getnotHcmlist();
      }
    },
    onSearchIn(){
      this.current = 1;
      this.getHcmlist();
    },
    onSearchNot(){
      this.current = 1;
      this.getnotHcmlist();
    },
    onSearchOut(){

    },
    handleCancel() {
      this.addcompany = "";
      this.visibleAdd = false;
      this.visibleEdit = false;
    },
    editCompany() {
      this.updateCompany();
    },
    //添加
    onAdd(){
      this.visibleAdd = true;
    },
    //编辑
    onEdit(operation) {
      // this.operation = operation;
      this.companyname = operation.name;
      this.companyId = operation.id;
      this.visibleEdit = true;
    },
    //删除
    onDelete(operation) {
      this.companyId = operation.id;
      this.$confirm({
        title: "删除公司",
        content: "确定删除该公司吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.deleCompany();
        },
        onCancel: () => {
        },
      });

    },
  },
}
</script>

<style lang="less" scoped>
#company {
  height: 100%;
  .left_content{
    height: 100%;
    width: 100%;
    background: #F7F8FC;

    .left-list{
      width: 100%;
      padding: 10px;

      li{
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #E9E9E9;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
      }

      li.active{
        background: #E2F3FF;
        border: 1px solid #4B7AFB;
        border-radius: 2px;
        color: #4B7AFB;
        font-family: PingFangSC-Semibold;
      }
    }
  }
}
</style>
