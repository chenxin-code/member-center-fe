<template>
  <div id="form-container">
    <div class="content-header">
      {{type==='edit'?'编辑':'新建'}}
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14}" style="height: 100%;overflow: auto;">
      <a-form-item label="主题">
        <a-select v-decorator="['themeId',{ rules: [{ required: true, message: '请选择主题' }] }]" @change="onThemeChange" placeholder="请选择" style="width:60%;">
            <a-select-option v-for="item in qualitycontrolthemeList" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="项目">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange"
                      v-decorator="['id', { rules: [{ required: true, message: '项目不能为空' }] } ]">
            全部项目
          </a-checkbox>
          <a @click="chooseProject" style="margin-left:38px;">{{selectData.length === 0 ? "选择项目" : "已选" + selectData.length + "个项目"}}</a>
      </a-form-item>
      </a-form>
    </div>
    
    <div class="content-footer">
      <a-button size="large" style="width: 120px;" @click="FALLBACK">取消</a-button>
      <a-button
        type="primary"
        size="large"
        style="width: 120px;margin-left:20px"
        @click="onSubmit"
      >保存</a-button>
    </div>

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

  </div>
</template>
<script>
import { mapActions } from "vuex";
import api from "@/api";
import ShuttleBox from '@/components/ShuttleBox/ShuttleBox'

export default {
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
      searchForm: {
        name: "",
        orgName: ""
      },
      selectData:[],
      projectData: [],
      type: this.$route.params.type,
      id: this.$route.params.id,
      qualitycontrolthemeList: [],
      form: this.$form.createForm(this, { name: "form" }),
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
      visible: false,
      mockData: [],
      total: "",
      first:true
    };
  },
  computed:{
   indeterminate(){
      return this.selectData.length ? this.selectData.length < this.mockData.length : false // 如果选择的小于数据源的的数量
    },
    checkAll(){
      return this.selectData.length ? this.selectData.length == this.mockData.length : false // 判断全部选中状态
    }
  },
  components: {ShuttleBox },

  mounted() {
    this.getQualitycontrolthemeList();
    this.getProjectList();
    if (this.$route.params.type === "edit") {
      this.checktaskDetail();
    }
  },
  methods: {
    ...mapActions(["FALLBACK"]),

    // 模糊查询项目
    searchHandle(){
      this.getProjectList()
    },  

    toHandle(e){
      console.log(e)
      this.toVisible = false
      if(e.type == 'ok'){
        this.selectData = e.data
        this.form.setFieldsValue({
            id: this.selectData.length ? this.selectData.length : ""
        });
      }
    },

    //获取主题列表
    getQualitycontrolthemeList() {
      const para = {
        pageIndex: 1,
        pageSize: 1000000,
        status:'1',
      };
      api.getQualitycontrolthemeList(para).then(res => {
        this.qualitycontrolthemeList = res.data.datalist;
      });
    },

    checktaskDetail() {
      const params = {
        id: this.id
      };
      api.checktaskDetail(params).then(res => {
        if (res.code === 200) {
          this.form.projectId = res.data.projectId;
          this.form.themeId = res.data.themeId;
        }
      });
    },

    onSubmit(e) {
        e.preventDefault();
        const isAdd = (this.type === "add");
        this.form.validateFields((err, values) => {
          if (!err) {
          let projectArr = this.selectData.length ? this.selectData.map(e => e.id) : [] // 选择的项目 只取id
          if(!projectArr.length){
            this.$message.error('请选择项目')
            return
          }
            this.btnLoading = true;
            values = {
              themeId:values.themeId,
              projectIds: projectArr,
            };
            
            api["addSpotCheckItem"](values).then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                this.$router.push({
                  path: "/qualityManagement/qualityControlHead"
                });
            }
            }).finally(()=>{
              this.btnLoading = false;
            });
          }
        });
    },

    //选择项目
    chooseProject() {
      this.toVisible = true
    },

    onThemeChange(e) {
      api.detailQualitycontroltheme({ id: e }).then(res => {
        if (res.code === 200) {
          const standardArr = res.data.projectIds_
          let newArr = this.allData.filter(e => JSON.stringify(standardArr).includes(e.id)) 
          this.selectData = newArr
          this.form.setFieldsValue({
            id: this.selectData.length ? this.selectData.length : null
          })
        }
      });
    },
    
    onCheckAllChange(e) {
      console.log(e)
      if(e.target.checked){
        this.selectData = JSON.parse(JSON.stringify(this.mockData))
        this.form.setFieldsValue({
            id: this.selectData.length
        });
      }else{
        this.selectData = []
        this.form.setFieldsValue({
            id: ""
        });
      }
    },
    
    //获取列表
    getProjectList(callback) {
      api.getProjectCity({
        ...this.searchForm
      }).then(res => {
        if (res.code === 200) {
          console.log(res.data);         
          // res.data.records.forEach(e => {e.id = e.spaceId})
          this.mockData = res.data; // 穿梭框数据源
          if(this.first){
            this.allData = res.data
            this.first = false
          }
          callback && callback()
        }else{
          callback && callback()
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>