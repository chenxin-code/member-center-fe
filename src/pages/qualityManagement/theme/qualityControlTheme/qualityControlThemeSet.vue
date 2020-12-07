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
            v-decorator="['name', { rules: [{validator: checkNoChina},{ required: true, message: '请输入名称' },
            { message: '名称最长20个字',max: 20 }] } ]"
            placeholder="请输入名称"
          />
        </a-form-item>
        <a-form-item label="适用项目" required>
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
            全部项目
          </a-checkbox>
          <a @click="chooseProject" v-decorator="['targetKeys', { rules: [{ required: true, message: '请选择项目' }] } ]" style="margin-left:38px;">{{selectData.length === 0 ? "选择项目" : "已选" + selectData.length + "个项目"}}</a>
        </a-form-item>
        <a-form-item label="专业线">
          <a-select
            v-decorator="['specialLineId',{ rules: [{ required: true, message: '请选择专业线' }] },]"
            placeholder="请选择专业线"
          >
          <a-select-option v-for="(item,key) in specialLineData" :key="key" :value="item.codeId">{{item.name}}</a-select-option>
          </a-select>       
        </a-form-item>
        <a-form-item label="年份">
          <a-select
            v-decorator="['year',{ initialValue: getFiveYears[0], rules: [{ required: true, message: '请选择年份' }] },]"
            placeholder="请选择年份"
          >
          <a-select-option v-for="(item,key) in getFiveYears" :key="key" :value="item">{{item}}</a-select-option>
          </a-select>        
        </a-form-item>
        
        <a-form-item label="季度" required>
          <a-row type="flex">
            <a-col>
              <a-form-item>
                <a-select v-decorator="['quarter',{ rules: [{ required: true, message: '请选择季度' }] }]" placeholder="请选择" style="width:150px;">
                    <a-select-option v-for="item in quarterData" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col style="margin: 0 20px">-</a-col>
            <a-col>
              <a-form-item>
                <a-input v-decorator="['seasonNum',{rules:[{validator: checkNum},{ required: true, message: '请填写季度-频次'}]}]" type="number" @change="onInput" style="width:100px;"/>
              </a-form-item>
            </a-col>
          </a-row>
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

    <!-- 选择项目 -->
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
   import { debounce,getFiveYears } from "@/utils/util";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import ShuttleBox from '@/components/ShuttleBox/ShuttleBox'
  import ShuttleHead from '@/components/ShuttleBox/ShuttleHead'

  export default {
    name: "qualityControlThemeSetEdit",
    components: {AFormItem,ShuttleBox ,ShuttleHead},
    props: {
      id: {
        type: Object,
        default: () => ({})
      },
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
        selectData:[],
        searchForm:{
          name:"",
          orgName:""
        },
        standColumns:[
          {dataIndex: "standardCode", title: "标准代码"},
          {dataIndex: "businessFormatName", title: "业态"},
          {dataIndex: "specialLineName", title: "专业线"},
          {dataIndex: "standardTypeName", title: "类别"},
          {dataIndex: "standardYear", title: "标准年份"}
        ],
        standtData:[],
        standTotal:0,
        pageSize:10,
        current:1,
        getFiveYears: getFiveYears(),
        form: this.$form.createForm(this, { name: "form" }),
        specialLineData: [],
        quarterData:[
          {id: "1",name: "第一季度"},
          {id: "2",name: "第二季度"},
          {id: "3", name: "第三季度"},
          {id: "4",name: "第四季度"},
        ],
        mockData: [],
        targetKeys: "",
        svisible: false,
        smockData: [],
        stargetKeys: [],
        btnLoading: false,
        standForm:{},
        spinning: false,
        tableLoading: false
      }
    },
    computed:{
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
      this.getSpecialLineOption();
      this.getStandardPage() // 查询分页标准
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

      //获取列表
    getProjectList(callback) {
      api.getProjectCity({
        ...this.searchForm
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          console.log(res.data.records);
          // res.data.records.forEach(e => {e.id = e.spaceId})
          this.mockData = res.data; // 穿梭框数据源
          callback && callback()
        }else{
          callback && callback()
        }
      })
    },

      onInput(e){
        if(!e.target.value){
          this.form.setFieldsValue({
              seasonNum: ""
            })
          return
        }
        if(e.target.value-0 <= 0){
          this.$nextTick(() => {
            this.form.setFieldsValue({
              seasonNum: 1
            })
          })
        }
      },

      // 季度
      checkNum(rule, value, callback) {
        console.log(value)
        if(value) {
          if (value < 0) {
            callback([new Error("频次不能为负数")]);
          }
          if (value.length > 10) {
            callback([new Error("季度-频次不能超过10位数字")]);
          }
        }
        callback();
      },
      
      // 点击全部选择
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
        this.toVisible = true
      },

      //选择标准
      chooseStandard() {
        this.svisible = true;
      },

      //获取详情
      getData() {
        if (this.id.id) {
          this.spinning = true
          api.detailQualitycontroltheme({ id: this.id.id }).then(res => {
            this.spinning = false
            if (res.code === 200) {
              const data = res.data;
              // 匹配已选中的项目
              let newArr = this.mockData.filter(e => data.projectIds.includes(e.id)) 
              this.selectData = newArr

              this.$nextTick(()=>{
                this.form.setFieldsValue({
                  name: data.name,//名称
                  specialLineId:data.specialLineId,//专业线                 
                  year: data.year,//年份
                  quarter: data.seasonCycle,//周期
                  seasonNum:data.seasonNum,//数量
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

      //专业线
      getSpecialLineOption(){
        const para = {
		      parentId: 12
	      };
        api.getQuCommonCodeList(para).then(res => {
          if (res.code === 200) {
            this.specialLineData = res.data.list;
          }
        })
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
              year:values.year,
              specialLineId:values.specialLineId,
              seasonCycle:values.quarter,
              seasonNum:values.seasonNum,
              projectIds: projectArr,
              standards: standArr,
            };
            if(!this.checkForm(projectArr, standArr)){ return }
            this.btnLoading = true;
            api[isAdd ? "addQualitycontroltheme" : "editQualitycontroltheme"](values).then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                this.$router.push({ name: "qualityControlTheme" });
              }
            }).finally(()=>{
              this.btnLoading = false;
            })
          }
        })
      }
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