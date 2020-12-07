<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ id.id ? "编辑" : "新建" }}主题包
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <a-spin :spinning="spinning">
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form
        :form="form"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 14 }"
        style="height: 100%;overflow: auto;"
      >
        <a-form-item label="名称" style="margin-top:16px;">
          <a-input
            v-decorator="['name', { rules: [{validator:checkNoChina} , { required: true, message: '请输入名称' },
            { message: '标题最长20个字',max: 20 }] } ]"
            placeholder="请输入名称"
            style="width:50%"
          />
        </a-form-item>

        <a-form-item label="适用项目" required>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全部项目
          </a-checkbox>
          <a @click="chooseProject" v-decorator="['targetKeys', { rules: [{ required: true, message: '请选择项目'}] } ]"  style="margin-left:38px;">
            {{selectData.length === 0 ? "选择项目" : "已选" + selectData.length + "个项目"}}
          </a>

        </a-form-item>

        <a-form-item label="任务频次" required>
          <a-row type="flex">
            <a-col>
              <a-form-item>
                <a-select v-decorator="['taskFrequencyCycle',{ rules: [{ required: true, message: '请选择任务频次' }] }]" placeholder="请选择" style="width:150px;">
                  <a-select-option
                          v-for="(item,key) in taskFrequencyCycleData"
                          :value="item.value"
                          :key="key"
                  >{{item.label}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col style="margin: 0 5px">-</a-col>
            <a-col>
              <a-form-item>
                <a-input v-decorator="['taskFrequencyNum',{rules:[{validator:checkNum},{ required: true, message: '请填写任务频次数量' }]}]" type="number" @change="onInput" style="width:100px;"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="任务周期">
          <a-range-picker
            :disabled-date="disabledDate"
            v-decorator="['taskCycle',{ rules: [{ required: true, message: '任务周期不能为空' }] },]"
          />
        </a-form-item>
        <a-form-item label="角色">
          <a-select
            v-decorator="['roleId',{ rules: [{ required: true, message: '角色不能为空' }] }]"
            placeholder="请选择角色"
            style="width:50%"
          >
            <a-select-option
              v-for="(item, key) in roleData"
              :key="key"
              :value="item.codeId"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标准" style="margin-bottom: 50px;">
          <!-- <InspectionStandard
            v-decorator="['richText', { rules: [ { required: true, message: '请选择标准' }] }]"
            :urls="{picUpload: 'uploadPropertyNoticePic',previewQRCode: ''}"
          /> -->

          <div class="btn-wrapper" v-decorator="['richText', { rules: [ { required: true, message: '请选择标准' }] }]">
            <div class="btn" @click="addStand"><a-icon type="plus" /> 添加</div>
          </div>
          <!-- 添加的标准列表 -->
          <div>
            <div v-for="(item, index) in list" :key="index" style="display: flex;margin-bottom: 4px;">
              <div style="width: 30%">
                  <a-select v-model="item.unitId" >
                    <a-select-option v-for="item1 in inspectionUnitData" :key="item1.codeId">{{item1.name}}</a-select-option>
                  </a-select>
              </div>
              <div style="width: 20%">
                <a @click="chooseStandard(index)" style="margin-left:38px;">{{item.standardIds.length === 0 ? "选择标准" : "已选" + item.standardIds.length + "个"}}</a>
              </div>
              <div style="width: 15%"> 
                <a-checkbox :checked="item.scanFlg == 1 ? true : false" :value="item.scanFlg == 1 ? true : false" @change="onScanflag($event,index)">是否扫码</a-checkbox>
              </div>
              <div v-if="list.length > 1" class="operate-wrapper" style="width: 20%;">
                <a-icon type="minus-circle" style="font-size:20px;color:gray" @click="deleteItem(index)" />
              </div>
            </div> 
          </div>

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
import { mapActions } from "vuex";
import moment from "moment";
import { debounce, getDateAll } from "@/utils/util";
import InspectionStandard from "@/components/InspectionStandard";
import ShuttleBox from '@/components/ShuttleBox/ShuttleBox'
import ShuttleHead from '@/components/ShuttleBox/ShuttleHead'

export default {
  name: "inspectionThemeSetEdit",
  components: { InspectionStandard, ShuttleBox,ShuttleHead },
  props: {
    id: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      spinning: false,
      svisible: false,
      smockData:[],
      standColumns:[
          {dataIndex: "standardCode", title: "标准代码"},
          {dataIndex: "businessFormatName", title: "业态"},
          {dataIndex: "specialLineName", title: "专业线"},
          {dataIndex: "standardTypeName", title: "类别"},
          {dataIndex: "standardYear", title: "标准年份"}
      ],
      standtData:[],
      standTotal:0,
      list:[],
      current:1,
      pageSize:10,
      selectData:[], // 已选择的数据
      targetKeys:"",
      toVisible:false,
      form: this.$form.createForm(this, { name: "form" }),
      searchForm: {
        name: "",
        orgName: ""
      },
      taskFrequencyCycleData: [
        {value: "1",label: "每日"},
        {value: "2",label: "每周"},
        {value: "3",label: "每月"}
      ],
      roleData: [],
      mockData: [],
      btnLoading: false,
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
      inspectionUnitData:[],
      standardArr:[],
      index:null,
      tableLoading: false
    };
  },

  watch:{
    list(val){
      this.form.setFieldsValue({
        richText: val.length > 0 ? JSON.stringify(val) : null
      })
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
    // 查询项目后 查询详情
    this.getProjectList(() => {
      this.getData();
    });
    this.getRoleList();
    this.getInspectionUnitList()
    this.getStandardPage()
    this.getStandardAll()
  },

  methods: {
    moment,
    ...mapActions(["FALLBACK"]),

    disabledDate(current) {
      return current && current < moment().endOf('day');
    },

    checkNoChina(rule, value, callback){
        if(value != ""){
            const a = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
            if(!a.test(value)){
              callback([new Error("请输入中文、英文或数字")]);
            }
          }
          callback();
      },

    onScanflag(e,index){
      let status = e.target.checked ? 1 : 0
      this.list[index].scanFlg = status
    },

    //获取标准 不分页
    getStandardAll(){
      // this.spinning = true
      api.getStandardListIn().then(res => {
        console.log(res)
        // this.spinning = false
        if (res.code === 200) {
          this.allStandData = res.data;
        }
      }).catch(err => {
          // this.spinning = false
      })
    },

    // 模糊查询项目
    searchHandle(){
      this.getProjectList()
    },  

    onInput(e) {
      if(!e.target.value){
        this.form.setFieldsValue({
            taskFrequencyNum: ""
        });
        return
      }
      if (e.target.value <= 0) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            taskFrequencyNum: 1
          });
        });
      }
    },

    standSearch(e){
      console.log(e)
      this.standForm = e
      this.getStandardPage(true)
    },

    onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getStandardPage();
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

    addStand() {
      let isTrue = true
      let repeat = false
      this.list.forEach((n) => {
        if(!n.unitId || !n.standardIds.length) {
          this.$message.error("请先选择巡检单元和巡查标准")
          isTrue = false
          return
        }
        let q = 0
        this.list.forEach((o) => {
          if(n.unitId == o.unitId) {
            q++;
          } 
        })
        if (q > 1) {
          repeat = true
        }
      })
      if(!isTrue){ return false}
      if (repeat) {
        this.$message.error("巡检单元不能重复")
        return false
      }
      this.list.push({ 
        unitId: '', 
        standardIds:[],
        scanFlg: 1 
      })
    },

    deleteItem(index) {
      this.list.splice(index, 1);
    },

    // 打开选择标准弹框
    chooseStandard(index){
      this.index = index;
      let idArr = this.allStandData.filter(e => JSON.stringify(this.list[index].standardIds).includes(e.id))
      this.standtData = idArr // 在这里要匹配全的
      this.svisible = true
    },

    sHandle(e){
      console.log(e)
      this.svisible = false
      if(e.type == 'ok'){
        let newArr = e.data.map(e => e.id)
        this.list[this.index].standardIds = newArr
      }
    },

    //获取巡检列表
    getInspectionUnitList(){
      api.getQuCommonCodeList({
        parentId:8
      }).then(res => {
        if (res.code === 200) {
          this.inspectionUnitData = res.data.list;
        }
      })
    },

    // 整改时限
    checkNum(rule, value, callback) {
        if(value != undefined) {
            if (value < 0) {
                callback([new Error("任务频次-次数不能为负数")]);
            }
            if (value.length > 10) {
                callback([new Error("任务频次-次数不能超过10位数字")]);
            }
        }
      callback();
    },

    // 点击全选
    onCheckAllChange(e) {
      console.log(e);
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

    //获取详情
    getData() {
      if (this.id.id) {
        this.spinning = true
        api.detailInspectiontheme({ id: this.id.id }).then(res => {
          console.log(res,'获取详情')
          this.spinning = false
          if (res.code === 200) {
            const data = res.data;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                name: data.name, //名称
                taskFrequencyCycle: data.taskFrequencyCycle, //任务频次
                taskFrequencyNum: Number(data.taskFrequencyNum), //任务频次
                taskCycle: [
                  moment(data.taskCycleStart).format("YYYY-MM-DD"),
                  moment(data.taskCycleEnd).format("YYYY-MM-DD")
                ],
                roleId: data.roleId,
                id: data.projectIds,
                richText: data.contents ? JSON.stringify(data.contents) : "" //自定义
              })
              
              let newArr = this.mockData.filter(e => data.projectIds.includes(e.id)) // 匹配已选中的项目
              this.selectData = newArr
              this.form.setFieldsValue({
                targetKeys: JSON.stringify(this.selectData)
              })
              this.list = data.contents
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
          // res.data.records.forEach(e => {e.id = e.spaceId})
          this.mockData = res.data; // 穿梭框数据源
          callback && callback()
        }else{
          callback && callback()
        }
      })
    },

    //获取角色
    getRoleList() {
      const para = {
        parentId: 26
      };
      api.getQuCommonCodeList(para).then(res => {
        if (res.code === 200) {
          this.roleData = res.data.list;
          console.log(res.data.list);
        }
      });
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
      }else{
        let isTrue = true
        let repeat = false
        richText.forEach((e) => {
          if(!e.unitId || !e.standardIds.length){
            this.$message.error("请将标准信息填写完整")
            isTrue = false
            return
          }
          let q = 0
          richText.forEach((n) => {
            if(e.unitId == n.unitId) {
              q++;
            } 
          })
          if (q > 1) {
            repeat = true
          }
        })
        if(!isTrue){ return false}
        if (repeat) {
            this.$message.error("巡检单元不能重复")
            return false
        }
      }
      return true
    },

    // 频次与日期的校验
    checkDate(type, dateArr){
      let startDate = moment(dateArr[0]).format("YYYY-MM-DD")
      let endDate = moment(dateArr[1]).format("YYYY-MM-DD")
      let dateAll = getDateAll(startDate,endDate) // 时间段的所有日期
      // if(startDate == endDate){
      //   this.$message.error("开始日期和结束日期不能是同一天")
      //   return false
      // }
      switch(type){
        case "1": // 日
          return true
        break
        case "2": // 周
          let isok = false
          dateAll.forEach((e) => {
            let timeStamp = new Date(e)
            let week = timeStamp.getDay()
            if(week == 1){
              isok = true
              return
            }
          })
          if(!isok){ this.$message.error("频次为每周，必须包含一个周一") }
          return isok
        break
        case "3": // 月
          let isYes = false
          dateAll.forEach((e) => {
            let timeStamp = new Date(e)
            let date = timeStamp.getDate()
            if(date == 1){
              isYes = true
              return
            }
          })
          if(!isYes){ this.$message.error("频次为每月，必须包含一个一号") }
          return isYes
        break
      }
    },

    //保存
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          const isAdd = this.id.id ? false : true // 是不是新增
          let projectArr = this.selectData.length ? this.selectData.map(e => e.id) : [] // 选择的项目 只取id

          let _data = {
            id: this.id.id ? this.id.id : undefined,
            name: values.name.trim(), //名称
            projectIds: projectArr, //项目
            taskFrequencyCycle: values.taskFrequencyCycle, //任务频次
            taskFrequencyNum: values.taskFrequencyNum, //任务周期
            taskCycleStart: moment(values.taskCycle[0]).format("YYYY-MM-DD"),
            taskCycleEnd: moment(values.taskCycle[1]).format("YYYY-MM-DD"),
            roleId: values.roleId, //角色
            list: this.list
          };
          if(!this.checkForm(projectArr , this.list)){ return } // 检验是否选择了项目和标准
          if(!this.checkDate(values.taskFrequencyCycle, values.taskCycle)){ return }

          this.btnLoading = true;
          api[isAdd ? "addInspectiontheme" : "editInspectiontheme"](_data).then(res => {
            if (res.code === 200) {
              this.$message.success((isAdd ? "新增" : "编辑") + "成功");
              this.$router.push({ name: "inspectionTheme" });
            }
          }).finally(() => {
            this.btnLoading = false;
          })
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
.img-div {
  width: 335px;
  height: auto;
}
.ant-upload.ant-upload-select-picture-card {
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
.ant-upload-list-picture-card-container {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
  /*text-align: center;*/
}
.ant-upload-list-picture-card .ant-upload-list-item {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
}
.ant-modal-close-x {
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

.btn-wrapper {
  display: flex;
  align-items: center;
  height: 38px;
  cursor: pointer;
  .btn{
    border:1px dashed #ccc;
    width: 50%;
    text-align: center;
    height: 32px;
    line-height: 32px;
  }
}

.operate-wrapper {
  // margin-left: auto;
  display: flex;
  align-items: center;

  .ant-btn {
    padding: 6px;

    &.hidden {
      visibility: hidden;
      cursor: default;
    }
  }
}
</style>

