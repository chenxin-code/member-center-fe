<template>
  <div id="communication">
    <a-button type="primary" html-type="submit" @click="onSet()">
      +添加
    </a-button>
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :rowKey="(r,i) => i"
      :scroll="{ x:'120%', y:430 }"
      style="width:100%;margin-top:8px;"
      :selectable="false"
      :loading="tableLoading"
    >
      <template slot="city" slot-scope="operation" >
        <div class="editable-row-operations">
          {{operation.provinceName + operation.cityName + operation.districtName}}
        </div>
      </template>
      <template slot="operation" slot-scope="operation" >
        <div class="editable-row-operations">
          <a @click="onSet(operation)">编辑</a>
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
<!--    添加编辑通讯信息-->
    <a-modal v-model="visible" :title="title" on-ok="handleOk_add">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleChange">
          确定
        </a-button>
      </template>
      <a-form autoComplete="off" :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="通讯省市区">
          <a-cascader
            :options="prov"
            v-decorator="['city',{ rules: [{ required: true, message: '省市区不能为空' }] } ]"
            :fieldNames="{label: 'name', value: 'code', children: 'children'}"
            placeholder="请选择省/市/区"
            @change="onChange"
          />
        </a-form-item>
        <a-form-item label="通讯街道">
          <a-input v-decorator="['street',{ rules: [
          { required: true, message: '请输入通讯街道', whitespace: true },
          { max: 30, message: '通讯街道最长30字'}
          ] } ]"
          placeholder="请输入通讯街道"/>
        </a-form-item>
        <a-form-item label="详细通讯地址">
          <a-input v-decorator="['address',{ rules: [
          { required: true, message: '详细通讯地址不能为空', whitespace: true },
          { max: 50, message: '详细通讯地址最长50个字符'}
          ] } ]" placeholder="请具体到门牌号"/>
        </a-form-item>
        <a-form-item label="邮政编码">
<!--          :validate-status="validateStatusPostcode"-->
<!--          :help="errorMsg"-->
<!--          @change="handlePostcodeChange"-->
          <a-input
          placeholder="请输入6位邮编"
          :maxLength="6"
          v-decorator="[
          'postalCode',
            {rules:[
            {required: false,whitespace: true,message: '请输入正确数字',pattern: new RegExp(/^[0-9]\d{5}$/),}
            ]}
          ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import api from "@/api";
  import provinces from "@/assets/json/provinces.json";
  import { debounce } from "@/utils/util";   // 防抖

  export default {
    name: "communication",
    props:{
      project:{
        type:Object,
        default(){
          return{}
        }
      }
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        //表头数据
        columns : [
          {
            title: "通讯省市区",
            key: "city",
            scopedSlots: { customRender: "city" },
            // ellipsis: true,
            fixed: 'left',
            width: 130
          },
          {
            title: "通讯街道",
            dataIndex: "street",
            key: "street",
          },
          {
            title: "详细通讯地址",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "邮政编码",
            dataIndex: "postalCode",
            key: "postalCode",
          },
          {
            title: "操作",
            key: "type",
            scopedSlots: { customRender: "operation" },
            fixed: "right",
            width: 150
          },
        ],
        visible: false,
        title: "",
        loading: false,
        tableLoading: true,
        id: "",
        //列表数据
        data : [],
        //分页
        total: 0,
        pageSize: 10,
        current: 1,
        prov:[],
        validateStatusPostcode:"",
        errorMsg: null,
        postalCode:"",
        pageIndex: 1,   // 起始页
      }
    },
    components: {

    },
    created() {
      // console.log(this.project);
    },
    mounted() {
      this.getCommunicationList();
      this.getData()
    },
    methods:{
      // 邮编校验
      // validatePostcode(){
      //   if(/^[0-9]{6}$/.test(this.postalCode)){
      //     this.validateStatusPostcode = "success";
      //     this.errorMsg = null;
      //   }else{
      //     this.validateStatusPostcode = "error";
      //     this.errorMsg = "请输入6位正确邮编"
      //   }
      // },
      // handlePostcodeChange(e){
      //   this.postalCode = e.currentTarget.value;
      //   this.validatePostcode()
      // },

      getData() {
        return new Promise(()=>{
        this.prov = provinces["prov"];
        });
      },
      onChange(value) {
        console.log(value);
      },
      //添加编辑
      onSet(operation) {
        this.visible = true;
        if (operation) {
          this.id = operation.id;
          this.title = "编辑通讯信息";
          this.$nextTick(()=>{
            this.form.setFieldsValue({
              city: [operation.province,operation.city,operation.district],
              street: operation.street,
              address: operation.address,
              postalCode: operation.postalCode
            });
          })
        }else{
          this.id  = ""
          this.form.resetFields();
          this.title = "添加通讯信息";
          console.log(operation)
        }
      },
      handleChange(e) {
        console.log(1)
        e.preventDefault();
        debounce(() => {
          const isAdd = !this.id;
          this.form.validateFields((err,values) => {
            console.log(values)
            if (!err) {
              this.loading = true;
              console.log(values)
              values = {
                id: !isAdd ? this.id : undefined,
                customerId: this.project.custId,
                province: values.city[0],
                city: values.city[1],
                district: values.city[2],
                street: values.street,
                address: values.address,
                postalCode: values.postalCode
              };
              api[isAdd ? "addCommunication" : "updateCommunication"](values).then(res => {
                if (res.code === 200) {
                  this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                  this.visible = false;
                  this.getCommunicationList();
                }
              }).finally(()=>{
                this.loading = false;
              });
            }else{
              console.log("添加失败")
            }
          });
        })
      },
      //删除
      onDelete(operation) {
        const that = this;
        that.$confirm({
          title: '删除通讯信息',
          content: '确定删除该通讯信息吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            that.tableLoading = true;
            api.deleteCommunication({id: operation.id}).then(res => {
              if (res.code === 200) {
                console.log(this.data.length)
                if(this.data.length === 1){
                  this.pageIndex --;
                  this.getCommunicationList();
                }else{
                  this.getCommunicationList()
                }
              }
            }).finally(() => {
              that.tableLoading = false;
            });
          },
          onCancel: () => {
            console.log('Cancel');
          },
        });
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.pageIndex = current;
        this.pageSize = pageSize;
        this.getCommunicationList();
      },
      //获取列表
      getCommunicationList() {
        const para = {
          customerId: this.project.custId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        };
        this.tableLoading = true;
        api.getCommunication(para).then(res => {
          this.data = res.data.records;
          this.total = res.data.total;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      handleCancel() {
        this.visible = false;
        this.loading = false;
      },
    }
  }
</script>

<style lang="less" scoped>
  #communication{
    height: 100%;
    overflow: hidden;
    margin-bottom: 40px;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
