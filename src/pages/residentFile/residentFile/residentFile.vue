
<template>
  <div id="residenFile">
    <div class="content-header">住户档案</div>
    <div class="content-main" ref="content_main" style="padding: 20px;">
      <a-form autoComplete="off" ref="form-ref" :form="form" @submit="handleSubmit" :labelCol="{span:5}" :wrapperCol="{span:19}">
        <a-row :gutter="24"  type="flex">
          <a-col :span="8">
            <a-form-item label="项目">
              <a-select
                :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
                placeholder="请选择"
                v-decorator="['projectId',{initialValue: ''}]">
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option v-for="(item,index) in projectList" :key="index" :value="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入" v-decorator="['name',{rules:[{max:30, message: '不能超过30个字'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-decorator="['phone',{rules:[{max:30, message: '不能超过30个字'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="身份">
              <a-select
                mode="multiple"
                placeholder="请选择"
                v-decorator="['personTypes',{
                  initialValue: [1],
                }]"
              >
                <a-select-option v-for="item in personTypeAry" :key="item.id" :value="item.id">
                  {{item.name}}
                </a-select-option>
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0;" />
                  <div style="padding: 4px 8px; cursor: pointer;" @mousedown="e => e.preventDefault()">
                    <a-button  @click="selectAll">全部</a-button>
                  </div>
                </div>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8"></a-col>
          <a-col :span="8" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit" >查询</a-button>
          </a-col>
        </a-row>
      </a-form>
      <!--table-->
      <a-table
        :columns="tableColumns"
        :rowKey="(r,i) => i"
        :data-source="tableData"
        :scroll="{ x:'120%' , y: scrollY }"
        :pagination="false"
        :selectable="false"
        :loading="tableLoading"
        style="width:100%;margin-top:8px;"
      >
        <!-- :scroll="{  }" -->
        <template slot="personType" slot-scope="personType">
          {{dd(personType)}}
        </template>
        <template slot="cardType" slot-scope="cardType">
          {{getCardTypeList[cardType]}}
        </template>
        <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations">
            <a @click="onDetail(operation)" v-if="operation.personType=='1'">详情</a>
            <a @click="onDetail(operation)" v-else-if="operation.personType=='3'">详情</a>
            <a @click="onDetail(operation)" v-else-if="operation.personType=='4'">详情</a>
            <a @click="onRemove(operation)" v-else>删除</a>
          </div>
        </template>
      </a-table>
      <!-- page -->
<!--      :current="current"-->
<!--      v-model="current"-->
      <a-pagination
        :total="total"
        :show-total="total => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        :current="current"
        :default-current="current"
        :page-size-options="pageSizeOptions"
        @change="onChange"
        @showSizeChange="onChange"
        style="margin-top:30px;width:100%;text-align: right;"
      />
    </div>
  </div>
</template>
<script>
  import api from "@/api";
  import {CARD_TYPE_MAP} from "@/constance/index.js";
  import { debounce } from "@/utils/util";   // 防抖


  export default {
    name: "InspectProjectSelect", //稽查项目 下拉列表
    components: {
      VNodes: {   //  不知道是啥  没有多选下拉框不出来内容
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    props: {
      inspectProject_code: {
        type: Array,
      },
      detailDisabled: {
        type: Boolean,
      },
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        projectList:[
        ],
        projectId:"",
        personTypeAry: [
          { id: 1, name: "业主" },
          { id: 2, name: "租户" },
          { id: 3, name: "商户" },
          { id: 4, name: "前期管理费单位" },
          { id: 5, name: "家人" },
          { id: 6, name: "朋友" },
        ],
        personTypeArys: ["","业主","租户","商户","前期管理费单位","家人","朋友"],
        // 表格内容高度
        scrollY: 100,
        inspectProjectArray: [],
        tableColumns: [
          {
            title: "项目",
            dataIndex: "projectName",
            key: "projectName",
            ellipsis: true,
            // fixed: 'left',
            width: 150
          },
          {
            title: "房产",
            dataIndex: "roomNames",
            key: "roomNames",
            ellipsis: true,

          },
          {
            title: "身份",
            dataIndex: "personType",
            key: "personType",
            ellipsis: true,
            scopedSlots: { customRender: "personType" },
          },
          {
            title: "姓名",
            dataIndex: "custName",
            key: "custName",
            ellipsis: true,
          },
          {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
            ellipsis: true,
          },
          {
            title: "证件类型",
            dataIndex: "cardType",
            key: "cardType",
            ellipsis: true,
            scopedSlots: { customRender: "cardType" },
          },
          {
            title: "证件号",
            dataIndex: "cardNo",
            key: "cardNo",
            ellipsis: true,
          },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
            fixed: "right",
            width: 100
          },
        ],
        tableData: [],
        tableLoading: false,
        total: 0,   // 总计的页数
        pageSizeOptions:['10','20','30','40','50','100'],
        pageSize: 10,   // 每页展示条数
        pageIndex: 1,   // 起始页
        current: 1,   // 激活
        tableRefresh: false,
        pageRefresh: true
      };
    },
    watch: {
      inspectProject_code(newValue, oldValue) {
      },
    },
    // 表格身份
    computed:{
      dd(){
        return type=>{
          return this.comTypes(type.split(","))
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === "detail") {
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
        this.form.resetFields();
        this.projectList = [];
        this.projectId = "";
        this.inspectProjectArray = [];
        this.tableData = [];
        this.tableLoading = false;
        this.total = 0;
        this.pageSize = 10;
        this.pageIndex = 1;
        this.current = 1;
        this.tableRefresh = false;
        this.pageRefresh = true;
        this.getCardType();
        this.getProType();
      }else if (this.tableRefresh) {
         this.getList();
      }
    },
    created() {

    },
    mounted(){
      setTimeout(()=>{
        this.scrollY = this.$refs.content_main.offsetHeight - 260 + "px";
      },100)
    },
    methods: {
      //组合身份显示
      comTypes(ary){
        let showPersonType = this.personTypeAry.filter(item=>{
          return ary.find(ite=>ite == item.id)
        })
        return showPersonType.map(item=>{
          return item.name
        }).join(",")
      },

      // 查询
      handleSubmit(e){
        e.preventDefault();
        debounce(() =>{
          this.current = 1;
          // this.pageIndex = 1;
          this.getList()
          console.log(this.current)
        })
      } ,
      handlePersonTypeChange(value) {
        //console.log(value);
        this.$emit("inspectProject", value);
      },
      // 全选 -- 把数据源赋给select绑定的值
      selectAll() {
        let allChange= this.personTypeAry.map(item=>{
          return item.id
        })
        this.form.setFieldsValue({
          personTypes: allChange,
        });
      },
      // 得到项目类型
      getProType(){
        api.residentProjectType().then(res => {
          if (res.code === 200) {
            this.projectList = res.data;
            // let project = {
            //   id: "",
            //   name:"全部项目"
            // }
            // this.projectList.unshift(project);
            this.getList()   // 运行 getList 方法  得到列表数据
          }
        })
      },
      // 得到数据
      getList(){
        this.tableLoading = true;
        const {projectId,name,phone,personTypes} = this.form.getFieldsValue();
        console.log(projectId,name)
        const sdata = {
          pageIndex: this.current,
          pageSize: this.pageSize,
          projectIds: projectId,
          name:name,
          personTypes:personTypes.join(","),
          phone: phone,
          isAll: projectId==""?1:0
        }
        api.residentFile(sdata).then(res => {
          console.log(res)
          if(res.code === 200){
            this.total = res.data.total;
            this.tableData = res.data.records;
            // console.log(this.tableData)
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      // 得到证件类型
      getCardType(){
        this.getCardTypeList = CARD_TYPE_MAP;
        // console.log(this.getCardTypeList)
      },
      // 分页
      onChange(current,pageSize) {
        console.log(current, pageSize);
        this.current = current;     // 激活
        this.pageSize = pageSize;   // 每页展示条数
        this.getList();
      },
      // 查看
      onDetail(operation) {
        console.log(operation)
        // this.$router.push({path: "/resident/detail",query:{
        //   custId:operation.custId,
        //     custName:operation.custName,
        //     custBirthday:operation.custBirthday,
        //     custSex:operation.custSex,
        //     projectId:operation.projectId,
        //     phone:operation.phone}})     //params ?custid=3333
        this.$router.push({
          name:"detail",
          params:{
            project:operation
            //   {
            //   custId: operation.custId,
            //   custName: operation.custName,
            //   custBirthday:operation.custBirthday,
            //   custSex:operation.custSex,
            //   projectId:operation.projectId,
            //   phone:operation.phone
            // }
          }
        })
      },
      //删除
      onRemove(operation){
        console.log(operation)
        this.$confirm({
          title: '删除信息',
          content: '是否删除该信息',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: ()=>{
            this.tableLoading = true;
            let sdata = {
              custId: operation.custId,
              // roomId: operation.roomIds,
              personType:operation.personType
            }
            api.onRemoveItem(sdata).then(res => {
              console.log(res)
              if(res.code === 200){
                console.log(this.tableData.length)
                if(this.tableData.length === 1){
                  console.log(this.pageIndex);
                  this.pageIndex --;
                  this.getList();
                }else{
                  this.getList()
                }
              }
            })
          },
          onCancel: ()=>{
            console.log('Cancel');
          }
        })

      },
    },
  };
</script>

<style lang="less" scoped>
  #residenFile {
    height: 100%;
    // overflow: hidden;
  }
  /*.content_main {*/
  /*  height: 100%;*/
  /*  padding: 10px;*/
  /*}*/
</style>
