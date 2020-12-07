<template>
  <div id="vehicle">
    <a-button type="primary" @click="addSet">
      +添加
    </a-button>
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :row-key="(r,i) => i"
      :data-source="data"
      :scroll="{}"
      :pagination="false"
      :loading="tableLoading"
      style="width:100%;margin-top:8px;"
    >
      <template slot="vehicleType" slot-scope="operation" >
        <div class="editable-row-operations">
          {{changeVehicle(vehicleBrandData,operation.vehicleType)}}
        </div>
      </template>
      <template slot="operation" slot-scope="operation">
        <div class="editable-row-operations">
          <a @click="onEdit(operation)">编辑</a>
          <a @click="onDelete(operation)">删除</a>
        </div>
      </template>
    </a-table>
    <!-- 分页 -->
<!--    v-model="current"-->
<!--    @showSizeChange="onShowSizeChange"-->
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
    <!--    添加编辑通讯信息-->
    <a-modal v-model="visible" :title="title" on-ok="handleChange">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="handleChange">
          确定
        </a-button>
      </template>
      <a-form  autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="车辆品牌">
          <a-select
            v-decorator="[
            'vehicleType',
            { rules: [{ required: true, message: '车辆品牌不能为空'}] } ]"
            placeholder="请选择车辆品牌"
          >
            <a-select-option v-for="item in vehicleBrandData" :key="item.CODE">{{item.NAME}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="车牌号码">
<!--          :validate-status="validateStatusCarId"-->
<!--          :help="errorCarId"-->
<!--          { validator: handlePass, message: '车牌号码不能为空1'}-->
<!--          @change="handleCarChange"-->
          <a-input
            v-decorator="['vehiclePlate',{
            rules:[
              { required: true, message: '请输入正确车牌号码（不能为空）',
              pattern: new RegExp(/^([\u4e00-\u9fa5][a-zA-Z0-9]*)$/),
              whitespace: true,max:10,min: 8,},
            ]
          }]"
          placeholder="请输入车牌号码,如京A88888"
          :maxLength = 11
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import api from "@/api";
  import vehicleBrand from "@/assets/json/vehicleBrand.json";
  import { debounce } from "@/utils/util";   // 防抖

  export default {
    name: "vehicle",
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
            title: "车辆品牌",
            key: "vehicleType",
            scopedSlots: { customRender: "vehicleType" }
          },
          {
            title: "车牌号码",
            dataIndex: "vehiclePlate",
            key: "vehiclePlate",
          },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
          },
        ],
        vehicleBrandData: [

        ],
        visible: false,
        title: "",
        btnLoading: false,
        tableLoading: true,
        //列表数据
        data : [],
        //分页
        pageSizeOptions:['10','20','30','40','50','100'],
        total: 0,
        pageSize: 10,
        current: 1,
        pageIndex:1,
        diatype: "add",   // 给弹出一个唯一标识
        id:"",
      }
    },
    components: {
    },
    created() {
      // console.log(this.$route.query.custId)
      // console.log(this.project);
    },
    mounted() {
      this.getVehicleList();
      this.getVehicleBrand()
    },
    methods:{
      // 校验车牌号
      // validateCarId(){
      //   console.log(this.vehiclePlate);
      //   if( this.vehiclePlate === ""){
      //     this.validateStatusCarId = "error";
      //     this.errorCarId = null
      //     console.log(111)
      //   }else
      //   if(/^([\u4e00-\u9fa5][a-zA-Z0-9]*)$/.test(this.vehiclePlate) && this.vehiclePlate.length < 10){
      //     this.validateStatusCarId = "success";
      //     this.errorCarId = null;
      //     if(this.vehiclePlate === ""){
      //       this.validateStatusCarId = "error";
      //       this.errorCarId = null;
      //     }
      //   }else{
      //     this.validateStatusCarId = "error";
      //     this.errorCarId = "请输入正确车牌号"
      //   };
      // },
      // handleCarChange(e){
      //   this.vehiclePlate = e.currentTarget.value;
      //   this.validateCarId()
      // },
      // handlePass(rule,value,callback){
      //   console.log(rule,value)
      //   console.log(value)
      //   if(value === ""){
      //     callback('')
      //   }
      // },
      changeVehicle(data,id,name){
        data.forEach((item)=>{
          if (item.CODE === id) {
            name = item.NAME
          }
        });
        return name
      },
      //新建弹出
      addSet(){
        this.visible = true;
        this.title = "添加车辆信息";
        this.diatype = "add";
        this.form.resetFields();
        // this.validateStatusCarId = "success";
        // this.errorCarId = null
      },
      //编辑弹出
      onEdit(operation) {
        // console.log(operation)
        this.visible = true;   // 弹出
        this.title = "编辑车辆信息";
        this.diatype = "edit"
        this.id = operation.id;
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            vehicleType: operation.vehicleType,
            vehiclePlate: operation.vehiclePlate,
          })
        })
      },
      handleChange(e) {
        e.preventDefault();
        debounce(() => {
          this.form.validateFields((err, tar) => {
            console.log(tar)
            if (!err) {
              this.btnLoading = true;
              let sdata = {
                customerId: this.project.custId,
                // id: "" ? this.id : undefined,
                vehicleType: tar.vehicleType,
                vehiclePlate: tar.vehiclePlate,
              };
              this.diatype=="add"? sdata.id = undefined : sdata.id = this.id;
              console.log(sdata)
              api[this.diatype=="add" ? "addVehicle" : "updateVehicle"](sdata).then(res => {
                if (res.code === 200) {
                  this.visible = false;
                  this.$message.success((this.diatype=="add" ? "新增" : "编辑") + "成功");
                  this.getVehicleList();
                  // event.disabled = true
                }
              }).finally(()=>{
                this.btnLoading = false;
                // this.validateStatusCarId = "error";
                // this.errorCarId = "车牌号码不能为空2"
              });
            }else{
              console.log("添加失败")
              // this.validateStatusCarId = "error";
              // this.errorCarId = "车牌号码不能为空1"
            }
          });
        })
        // const isAdd = !this.id;
      },
      //删除
      onDelete(operation) {
        // const that = this;
        this.$confirm({
          title: '删除车辆信息',
          content: '确定删除该车辆信息吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            const para = {
              id: operation.id,
            };
            this.tableLoading = true;
            api.deleteVehicle(para).then(res => {
              if (res.code === 200) {
                console.log(this.data.length)
                if(this.data.length === 1){
                  console.log(this.pageIndex);
                  this.pageIndex --;
                  this.getVehicleList();
                }else{
                  this.getVehicleList()
                }
              }
            }).finally(() => {
              this.tableLoading = false;
            });
          },
          onCancel: () => {
            console.log('Cancel');
          },
        });
      },
      getVehicleBrand() {
        return new Promise(()=>{
          this.vehicleBrandData = vehicleBrand["vehicleBrand"];
        })
      },
      // 分页
      onChange(current, pageSize) {
        console.log(current, pageSize);
        this.pageIndex = current;
        this.pageSize = pageSize;
        this.getVehicleList();
      },
      //获取列表
      getVehicleList() {
        const para = {
          customerId: this.project.custId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        };
        this.tableLoading = true;
        api.getVehicle(para).then(res => {
          if (res.code === 200) {
            this.data = res.data.records;
            this.total = res.data.total;
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      // 取消
      handleCancel() {
        this.visible = false;
        this.btnLoading = false;
      },
    }
  }
</script>

<style lang="less" scoped>
  #vehicle{
    height: 100%;
    overflow: hidden;
    margin-bottom: 40px;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
