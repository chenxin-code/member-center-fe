<!-- 宠物信息 -->
<template>
  
  <div id="petMes">
    <a-button type="primary" @click="addType">+ 添加</a-button>
    <a-table
      :columns="tableColumns"
      :row-key="(r, i) => i"
      :data-source="tableData"
      :scroll="{y:440}"
      :pagination="false"
      :loading="tableLoading"
      style="margin-top: 8px;"
    >
      <template slot="petType" slot-scope="petType">
          {{petTypeObj[petType]}}
      </template>
      <template slot="isComplain" slot-scope="isComplain">
        {{isComplain== "0" ?"是":"否"}}
      </template>
      <template slot="operation" slot-scope="operation">
        <div class="editable-row-operations">
          <a @click="onEdit(operation)">编辑</a>
          &nbsp;&nbsp;
          <a @click="onDelete(operation)">删除</a>
        </div>
      </template>
    </a-table>
    <a-pagination
      :total="total"
      :show-total="total => `共 ${total} 条`"
      show-quick-jumper
      show-size-changer
      :default-current="current"
      :page-size-options="pageSizeOptions"
      @change="onChange"
      @showSizeChange="onChange"
      style="margin-top:30px;width:100%;text-align: right;"
    />
    <!-- 添加宠物信息 -->
    <a-modal v-model="addVisible" :title="diaTitle" on-ok="addPetOk">
      <template slot="footer">
        <a-button key="back" @click="closeDia">
          取消
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" :loading="btnLoading" @click="addPetOk">
          确定
        </a-button>
      </template>
      <div class="content-main">
        <a-form  autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="宠物类型">
            <a-select
              placeholder="请选择"
              v-decorator="[
                'petType',
                { rules: [{ required: true, message: '请选择宠物!' }] },
              ]"
            >
              <a-select-option v-for="item of petTypeList" :key="item.name" :value="item.name">
                {{item.value}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="数量">
<!--            :validate-status="validateStatus"-->
<!--            :help="errorMsg"-->
<!--            @change="handleNumberChange"-->
            <a-input
              style="width: 100%"
              v-decorator="['petNum',
                {
                  rules: [
                    { required: true, message: '请输入正确数字',whitespace: true, pattern: new RegExp(/^[1-9]\d*$/),},
                  ]
                }
              ]"
              placeholder="请输入数量"
              :maxLength = 3
            />
          </a-form-item>
          <a-form-item label="被投诉情况">
            <a-radio-group name="radioGroup"
              v-decorator="['isComplain', { rules: [{ required: true}] ,initialValue:'0'} ]"
            >
              <a-radio value="1">
                否
              </a-radio>
              <a-radio value="0">
                是
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api";
import AFormItem from "ant-design-vue/es/form/FormItem";
import { debounce } from "@/utils/util";   // 防抖
export default {
  name: "PetMes",
  props:{
    project:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  data(){
    return {
      diaTitle: "添加",
      form: this.$form.createForm(this, { name: "form" }),
      petTypeList:[
        {name: "dog", value:"狗"},
        {name: "cat", value:"猫"},
        {name: "else", value:"其它"}
      ],
      petTypeObj:{
        "dog": "狗",
        "cat": "猫",
        "else": "其它"
      },
      // 表头
      tableColumns: [
        {
          title: "宠物类型",
          dataIndex: "petType",
          key: "petType",
          ellipsis: true,
          scopedSlots: { customRender: "petType" },
        },
        {
          title: "数量",
          dataIndex: "petNum",
          key: "petNum",
          ellipsis: true,
        },
        {
          title: "被投诉情况",
          dataIndex: "isComplain",
          key: "isComplain",
          ellipsis: true,
          scopedSlots: { customRender: "isComplain" },
        },
        {
          title: "操作",
          key: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      tableData: [],
      tableLoading: false,
      btnLoading: false,
      // 增加宠物
      addVisible: false,
      diatype: "add",
      editPetId: "",
      validateStatus:"",
      errorMsg:null,

      total: 0,   // 总计的页数
      pageSizeOptions:['10','20','30','40','50','100'],
      pageSize: 10,   // 每页展示条数
      pageIndex: 1,   // 起始页
      current: 1,   // 激活
    }
  },
  created(){
    // console.log(this.project);
    this.getPetList()
  },
  methods: {
    // 添加宠物校验
    // validatePrimeNumber(){
    //   console.log(this.petNumber)
    //   console.log(typeof this.petNumber)
    //   if(this.petNumber>0 && this.petNumber<1000 && /^[1-9][0-9]*$/.test(this.petNumber)){
    //     this.validateStatus = 'success';
    //     this.errorMsg = null;
    //   }else{
    //     this.validateStatus = "error";
    //     this.errorMsg = "请输入正确数字"
    //   }
    // },
    // handleNumberChange(e){
    //   console.log(e)
    //   this.petNumber = e.currentTarget.value;
    //   this.validatePrimeNumber()
    // },
    //宠物列表分页
    onChange(current,pageSize) {
      // console.log(current, pageSize);
      this.pageIndex = current;     // 激活
      this.pageSize = pageSize;   // 每页展示条数
      this.getPetList();
    },
    //获得宠物列表
    getPetList(){
      let sdata = {
        customerId: this.project.custId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        // current: this.current,
      }
      this.tableLoading = true;
      api.residentPetQuery(sdata).then(res=>{
        if(res.code==200){
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    // 删除
    onDelete(operation){
      this.$confirm({
        title: '删除宠物信息',
        content: '是否删除该信息',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: ()=>{
          this.tableLoading = true;
          api.residentPetDel({petId:operation.id}).then(res=>{
            if(res.code==200){
              // let sdata = {
              //   customerId: this.$route.query.custId,
              //   pageIndex: Math.ceil((this.total-1)/this.pageSize),
              //   pageSize: 10,
              //   // current: this.current,
              // }
              // api.residentPetQuery(sdata).then(res=>{
              //   if(res.code==200){
              //     this.tableData = res.data.records;
              //     this.total = res.data.total;
              //   }
              // })
              console.log(this.tableData.length)
              if(this.tableData.length === 1){
                console.log(this.pageIndex);
                this.pageIndex --;
                this.getPetList();
              }else{
                this.getPetList()
              }
            }
          }).finally(() => {
            this.tableLoading = false;
          });
        },
        onCancel: ()=>{
          console.log('Cancel');
        }
      })
      
      // this.tableData.splice( this.tableData.findIndex(item => item.id == operation.id), 1)
    },
    // 添加弹出
    addType(){
      this.addVisible = true;
      this.diaTitle = "添加宠物信息";
      this.diatype = "add";
      this.form.resetFields();
      this.validateStatus = 'success';
      this.errorMsg = null;
    },
     // 编辑弹出
    onEdit(operation){
      console.log(operation)
      this.addVisible = true;
      this.diaTitle = "编辑宠物信息";
      this.diatype = "edit";
      this.editPetId = operation.id;
      this.$nextTick(()=>{
        this.form.setFieldsValue({
          petType: operation.petType,
          petNum: operation.petNum,
          isComplain: String(operation.isComplain),
        })
      })
    },
    // 增加操作
     addPetOk(e){
      e.preventDefault();
      debounce(() => {
        this.form.validateFields((err, tar) => {
          if (!err) {
            this.btnLoading = true;
            let sdata = {
              isComplain: tar.isComplain,
              petNum: tar.petNum,
              petType: tar.petType,
            }
            this.diatype=="add"?sdata.customerId = this.project.custId : sdata.petId = this.editPetId;
            api[this.diatype=="add"?"residentPetAdd":"residentPetUpdate"](sdata).then(res => {
              if(res.code === 200){
                this.addVisible = false;
                this.$message.success((this.diatype=="add" ? "新增" : "编辑") + "成功");
                this.getPetList()
              }
            }).finally(()=>{
              this.btnLoading = false;
            })
          }else{
            console.log("添加失败")
            // this.validateStatus = "error"
            // this.errorMsg = "请输入正确数字"
          }
        });
      })
    },
   
    // 关闭
    closeDia(){
      this.addVisible = false;
    }
  },
  components:{
    AFormItem,
  }
}
</script>
<style lang="less" scoped>
</style>