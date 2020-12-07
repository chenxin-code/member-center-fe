<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ id.id ? "编辑" : "新建" }}主题包
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <a-spin :spinning="spinning">
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="height: 100%;overflow: auto;">
        <a-form-item label="名称" style="margin-top:16px;">
          <a-input
            v-decorator="['name', { rules: [{validator:checkNoChina},{ required: true, message: '请输入名称' },
            { message: '标题最长20个字',max: 20 }] } ]"
            placeholder="请输入名称"
          />
        </a-form-item>
        <a-form-item label="适用项目">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
            全部项目
          </a-checkbox>
          <a @click="chooseProject" v-decorator="['targetKeys', { rules: [{ required: true, message: '请选择项目' }] } ]" style="margin-left:38px;">{{selectData.length === 0 ? "选择项目" : "已选" + selectData.length + "个项目"}}</a>
        </a-form-item>      
        <a-form-item label="标准" required>
          <a @click="chooseStandard" v-decorator="['stargetKeys', { rules: [{ required: true, message: '请选择标准' }] } ]" style="margin-left:38px;">{{standtData.length === 0 ? "选择标准" : "已选" + standtData.length + "个"}}</a>
        </a-form-item>
      </a-form>
    </div>
    </a-spin>
    <div class="content-footer">
	  <a-button size="large" style="width: 120px;" :loading="btnLoading" @click="FALLBACK">取消</a-button>
	  <a-button type="primary" size="large" style="width: 120px;margin-left:20px" :loading="btnLoading" @click="onSubmit">保存</a-button>
    </div>

     <!-- dataSource数据源 columns表头 selectData右边表格数据 handle点击按钮回调 -->
    <ShuttleBox 
      :visible="toVisible" 
      :dataSource="mockData"
      :columns="columns" 
      :selectData="selectData"
      @handle="toHandle"
    >
      <div class="search-wrap">
        <div class="search-item-2">
          <div class="name">项目</div>
          <div class="val">
            <a-input v-model="searchForm.name" allowClear placeholder="请输入名称"/>
          </div>
        </div>

        <div class="search-item-4">
          <div class="name">城市公司</div>
          <div class="val">
            <a-input v-model="searchForm.orgName" allowClear placeholder="请输入名称"/>
          </div>
        </div>
        
        <a-button type="primary" @click="searchHandle">查询</a-button>
      </div>
    </ShuttleBox>

    <!-- 选择标准 -->
    <ShuttleBox 
      :visible="svisible" 
      :dataSource="smockData"
      :columns="standColumns" 
      :selectData="standtData"
      @handle="sHandle"
      title="选择标准"
      :pagination="true"
      :modalWidth="1050"
      :tableLoading="tableLoading"
    >
      <!-- 头部插槽 -->
      <ShuttleHead @search="standSearch"></ShuttleHead>

      <!-- 分页插槽 -->
      <div class="pagination" slot="pagination">
        <a-pagination
          :total="standTotal"
          :show-total="total => `共 ${standTotal} 条`"
          v-model="current"
          :page-size.sync="pageSize"
          @change="onShowSizeChange"
          @showSizeChange="onShowSizeChange"
          size="small"
        />
      </div>
    </ShuttleBox>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment"
  import { debounce } from "@/utils/util";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import ShuttleBox from '@/components/ShuttleBox/ShuttleBox'
  import ShuttleHead from '@/components/ShuttleBox/ShuttleHead'

  export default {
    name: "decorationInspectionThemeSetEdit",
    components: {AFormItem,ShuttleBox,ShuttleHead },
    props: {
      id: {
        type: Object,
        default: () => ({})
      },
    },
	watch:{
	  stargetKeys: {
	    handler(newVal, oldVal) {
	      console.log(newVal)
	      this.form.setFieldsValue({
	        stargetKeys: newVal.length ? newVal.length : ""
	      });
	    },
	    deep: true
	  }
	},
    data() {
      return {
        toVisible: false,
        columns: [
          {
            dataIndex: "name",
            title: "项目"
          },
          {
            dataIndex: "orgName",
            title: "城市公司"
          }
        ],
        searchForm:{
          name:"",
          orgName:""
        },
        selectData:[],
        standtData:[],
        standTotal:0,
        current:1,
        pageSize:10,
        targetKeys:"",
        form: this.$form.createForm(this, { name: "form" }),
        loading: false,
        yearData:[],
        specialLineData: [],
        quarterData:[],
        mockData: [],
        total: "",
        //标准
        svisible: false,
        stypeId: 0,
        sleftColumns: [
          {
            dataIndex: "title",
            title: "标准code",
          },
        ],
        srightColumns: [
          {
            dataIndex: "title",
            title: "标准code",
          },
        ],
        smockData: [],
        stargetKeys: [],
        soriTargetKeys: [],
        sindeterminate: false,        
        stotal: "",      
        previewVisible: false,
        previewImage: "",
        fileList: [],
        picUploading: false,
        btnLoading: false,
        standForm:{},
        standColumns:[
          {dataIndex: "standardCode", title: "标准代码"},
          {dataIndex: "businessFormatName", title: "业态"},
          {dataIndex: "specialLineName", title: "专业线"},
          {dataIndex: "standardTypeName", title: "类别"},
          {dataIndex: "standardYear", title: "标准年份"}
        ],
        spinning: false,
        tableLoading: false
      }
    },
    computed: {
      indeterminate(){
        return this.selectData.length ? this.selectData.length < this.mockData.length : false // 如果选择的小于数据源的的数量
      },
      checkAll(){
        return this.selectData.length ? this.selectData.length == this.mockData.length : false // 判断全部选中状态
      }
    },

    mounted() {
      this.getProjectList(() => {
        this.getData();
      });
      this.getStandardPage()
      
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),

      checkNoChina(rule, value, callback){
        if(value != ""){
            const a = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
            if(!a.test(value)){
              callback([new Error("请输入中文、英文或数字")]);
            }
          }
          callback();
      },

      // 模糊查询项目
      searchHandle(){
        this.getProjectList()
      }, 
      standSearch(e){
        console.log(e)
        this.standForm = e
        this.getStandardPage(true)
      },

      // 获取标准分页
      getStandardPage(refresh){
        if(refresh){ this.current = 1 }
        const para = {
          pageIndex: this.current,
          pageSize: this.pageSize,
          ...this.standForm,
          status: 1
        };
        this.tableLoading = true
        api.getStandardList(para).then(res => {
          console.log(res);
          this.tableLoading = false
          this.smockData = res.data.datalist
          this.standTotal = res.data.totalCount
        }).catch(err => {
          this.tableLoading = false
        })
      },

      toHandle(e){
        console.log(e)
        this.toVisible = false
        if(e.type == 'ok'){
          this.selectData = e.data
          this.form.setFieldsValue({
            targetKeys: JSON.stringify(this.selectData)
          })
        }
      },
      sHandle(e){
        console.log(e)
        this.svisible = false
        if(e.type == 'ok'){
          this.standtData = e.data 
          this.form.setFieldsValue({
            stargetKeys: this.standtData.length ? JSON.stringify(this.standtData) : ""
          })
        }
      },
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getStandardPage();
      },

      onCheckAllChange(e) {
        if(e.target.checked){
          this.selectData = JSON.parse(JSON.stringify(this.mockData))
          this.form.setFieldsValue({
            targetKeys: JSON.stringify(this.selectData)
          })
        }else{
          this.selectData = []
          this.form.setFieldsValue({
            targetKeys: ""
          })
        }
      },

      //选择项目
      chooseProject() {
        this.toVisible = true;
      },

      //选择标准
      chooseStandard() {
        this.svisible = true;
      },
   
        // 检验项目 和 标准是否填写
    checkForm(targetKeys,richText){
      if(!targetKeys.length){
        this.$message.error("请至少选择一个项目")
        return false
      }
      if(!richText || !richText.length){
        this.$message.error("请添加标准")
        return false
      }
      return true
    },

    //获取标准 不分页
      getStandardAll(){
        this.spinning = true
        api.getStandardListIn().then(res => {
          console.log(res)
          this.spinning = false
          if (res.code === 200) {
            this.allStandData = res.data;
            let newArr = this.allStandData.filter(e => JSON.stringify(this.standardId).includes(e.id)) 
            this.standtData = newArr
            this.form.setFieldsValue({
              stargetKeys: this.standtData.length ? JSON.stringify(this.standtData) : ""
            })
          }
        }).catch(err => {
            this.spinning = false
        })
      },

      //获取详情
      getData() {
        if (this.id.id) {
          this.spinning = true
          api.detailDecorationinspectiontheme({ id: this.id.id }).then(res => {
            this.spinning = false
            if (res.code === 200) {
              const data = res.data;
              let newArr = this.mockData.filter(e => data.projectIds.includes(e.id)) // 匹配已选中的项目
              this.selectData = newArr
              this.$nextTick(()=>{
                this.form.setFieldsValue({
                  name: data.name,//标题
                  targetKeys: JSON.stringify(this.selectData)
                })
                
                this.standardId = data.standardIds_ // 标准id数组
                this.getStandardAll() // 查询所有标准 并根据standardId匹配已选中的标准
              })
            }
          }).catch(err => {
            this.spinning = false
          })
        }else{ // 新建
          this.selectData = JSON.parse(JSON.stringify(this.mockData))
          this.form.setFieldsValue({
            targetKeys: JSON.stringify(this.selectData)
          })
        }
      },

      //获取列表
      getProjectList(callback) {
        api.getProjectCity({
          ...this.searchForm
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            //res.data.records.forEach(e => {e.id = e.spaceId})
            this.mockData = res.data; // 穿梭框数据源
            callback && callback()
          }else{
            callback && callback()
          }
        })
      },

      //保存
      onSubmit(e) {
        e.preventDefault();
        const isAdd = !this.id.id;
        this.form.validateFields((err, values) => {
          if (!err) {
            let projectArr = this.selectData.length ? this.selectData.map(e => e.id) : [] // 选择的项目 只取id
            let standArr = this.standtData.length ? this.standtData.map(e => e.id) : []

            values = {
              id: !isAdd ? this.id.id : undefined,
              name:values.name,
              projectIds: projectArr,
              standards: standArr,
            };
            if(!this.checkForm(projectArr, standArr)){ return }
            this.btnLoading = true;
            api[isAdd ? "addDecorationinspectiontheme" : "editDecorationinspectiontheme"](values).then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                this.$router.push({ name: "decorationInspectionTheme" });
              }
            }).finally(()=>{
              this.btnLoading = false;
            });
          }
        });
      },
    }
  }
</script>

<style lang="less">
  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    & > *:not(.last-child) {
      margin-right: 10px;
    }
  }
  .img-div{
    width:335px;
    height:auto;
  }
  .ant-upload.ant-upload-select-picture-card{
    display: table;
    float: left;
    width: 335px;
    height: 115px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
    vertical-align: top;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  .ant-upload-list-picture-card-container{
    float: left;
    width: 335px;
    height: auto;
    margin: 0 8px 8px 0;
    /*text-align: center;*/
  }
  .ant-upload-list-picture-card .ant-upload-list-item{
    float: left;
    width: 335px;
    height: auto;
    margin: 0 8px 8px 0;
  }
  .ant-modal-close-x{
    display: block;
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-style: normal;
    line-height: 30px;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
  }
</style>