<template>
  <div style="height: 100%;">
      <div class="content-header">
      {{ id.id ? "编辑" : "新建" }}标准
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="height: 100%;overflow: auto;">
        <!--  help="代码命名规则请遵循 类别 类别描述 拼音首字母组合方式" -->
        <a-form-item label="标准代码">
           <a-input 
           :disabled="edit"
           v-decorator="['standardCode',
           { rules: [{validator: checkNoChina},{ required: true, message: '标准代码不能为空' },{max: 20, message:'标准代码不能超过20位'}] }]"  style="width:100%;" @focus="tospan = true" @blur="tospan = false"/>
           <div style="margin-top: -1%;" v-if="tospan">
              <span style="color: red;" >代码命名规则请遵循 类别 类别描述 拼音首字母组合方式</span>
           </div>
        </a-form-item>
      
        <a-form-item label="业态">
          <a-select
            :disabled="edit"
            v-decorator="['businessFormatId',{ rules: [{ required: true, message: '业态不能为空' }] }]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in businessFormatData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="服务模式">
          <a-select
            :disabled="edit"
            v-decorator="['serviceModeId',{ rules: [{ required: true, message: '服务模式不能为空' }] }]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in serviceModeData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业线">
          <a-select
            :disabled="edit"
            v-decorator="['specialLineId',{ rules: [{ required: true, message: '专业线不能为空' }] }]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in specialLineData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="指标属性">
          <a-select
            :disabled="edit"
            v-decorator="['dataAttributesId']"
            placeholder="请选择"
          >
            <a-select-option v-for="item in dataAttributesData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="总分值">
          <a-input :disabled="edit" v-decorator="['totalScore',{rules:[{validator: checkType}] }]" />
        </a-form-item>
        <a-form-item label="细项权重">
          <a-input :disabled="edit" v-decorator="['weight',{rules:[{validator: checkType}] }]" />
        </a-form-item>

        <a-form-item label="类别" >
          <a-select
            show-search
            option-filter-prop="name"
            :filter-option="filterOption"
            :disabled="edit"
            v-decorator="['standardTypeId',{ rules: [{required: true, message: '类别不能为空'}] }]"
            placeholder="请选择" @change="onChangeType"
          >
            <a-select-option v-for="item in standardTypeData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="类别描述" style="padding-top:5px">
          <a-select
            show-search
            option-filter-prop="name"
            :filter-option="filterOption"
            v-decorator="['typeDescription',{ rules: [{required: true, message: '类别描述不能为空'}] }]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in typeDescriptionData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
           <!-- <a-textarea  v-decorator="['typeDescription',{rules:[{message:'长度不能超过200',max:200},{required: true, message: '类别描述不能为空'}]}]" style="width:100%;" placeholder="请输入类别描述（长度不能超过200）" :auto-size="{ minRows: 6, maxRows: 12 }"/> -->
        </a-form-item>
        <a-form-item label="核查标准" style="padding-top:5px">
           <a-textarea v-decorator="['checkStandard',{rules:[{message:'长度不能超过500',max:500},{required: true, message: '检查标准不能为空'}]}]" style="width:100%;" placeholder="请输入检查标准（长度不能超过500）" :auto-size="{ minRows: 6, maxRows: 12 }" />
        </a-form-item>
        <a-form-item label="检查方法" style="padding-top:5px">
           <a-textarea v-decorator="['checkMethod',{rules:[{message:'长度不能超过100',max:100},{required: true, message: '检查方法不能为空'}]}]" style="width:100%;" placeholder="请输入检查方法（长度不能超过100）" :auto-size="{ minRows: 6, maxRows: 12 }"/>
        </a-form-item>

          <a-form-item label="整改时限" required>
              <a-row type="flex">
                  <a-col>
                      <a-form-item>
                          <a-input v-decorator="['rectificateLimitNum',{rules:[{validator:checkNum},{ required: true, message: '请填写整改时限' }]}]" type=number @change="onInput" style="width:100px;" :disabled="edit"/>
                      </a-form-item>
                  </a-col>
                  <span style="margin:0 20px">-</span>
                  <a-col>
                      <a-form-item>
                          <a-select v-decorator="['rectificateLimitUnit',{ rules: [{ required: true, message: '请选择整改时限' }] }]" placeholder="请选择" style="width:150px;" :disabled="edit">
                              <a-select-option v-for="item in rectificateLimitUnitData" :key="item.value">{{item.label}}</a-select-option>
                          </a-select>
                      </a-form-item>
                  </a-col>
              </a-row>
          </a-form-item>
<!--        <a-form-item label="整改时限" required>-->
<!--           <a-input :disabled="edit" @change="onInput" v-decorator="['rectificateLimitNum',{rules:[{validator:checkNum}]}]" type="number"  style="width:100px;" />-->
<!--           <span style="margin:0 20px">-</span>-->
<!--           <a-select :disabled="edit" v-decorator="['rectificateLimitUnit']" placeholder="请选择" style="width:120px">-->
<!--              <a-select-option v-for="item in rectificateLimitUnitData" :key="item.value">{{item.label}}</a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->

        <a-form-item label="标准年份">
            <a-select
              v-decorator="['yearPick',{ initialValue: getFiveYears[0], rules: [{ required: true, message: '请选择年份' }] },]"
              placeholder="请选择年份"
              :disabled="edit"
              style="width:300px"
            >
              <a-select-option v-for="(item,key) in getFiveYears" :key="key" :value="item">{{item}}</a-select-option>
            </a-select>

        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button size="large" style="width: 120px;" :loading="btnLoading" @click="FALLBACK">取消</a-button>
      <a-button type="primary" size="large" style="width: 120px;margin-left:20px" :loading="btnLoading" @click="onSubmit">确定</a-button>
    </div>
  </div>
</template>

<script>
  import api from '@/api';
  import { mapActions } from "vuex"
  import moment from "moment"
  import { DatePicker } from "ant-design-vue"
  import { debounce,getFiveYears } from "@/utils/util";

  export default {
    name: "standardEdit",
    components: {
      'a-date-picker': DatePicker,
    },
    // props: {
    //   id: {
    //     type: Object,
    //     default: () => ({})
    //   },
    // },

    data() {
      return {
        //表单数据
        form: this.$form.createForm(this, { name: "form" }),
        getFiveYears: getFiveYears(),

        tags: [],
        //被选中的标签
        chooseData: [],
        //主项目层级Data
        mainProjectTier: [],
        //树选择数据
        treeData: [],
        checkedList: [],
        tagOptions: [],
        visible: false,
        //空间名称input框的status
        validateStatus: "",
        //空间名称input框的error提示语
        inputErrorTitle: "",
        projectId: "",
        businessFormatData:[],
        serviceModeData:[],
        specialLineData:[],
        dataAttributesData:[],
        standardTypeData:[],
        typeDescriptionData:[],
        rectificateLimitUnitData: [{
          value: '1',
          label: '分钟'
        }, {
          value: '2',
          label: '小时'
        }],
        btnLoading: false,
        yearPickShow:false,
        id:{},
        edit: false,
        // 标准代码下提示文字
        tospan: false
    }
    },
    created () {     
      let { id } = this.$route.params
      this.id = id ? id : {}
      this.edit = this.id.reference > 0 ? true : false

      this.getBusinessFormatList();//业态
      this.getServiceModeOption();//服务模式
      this.getSpecialLineOption();//专业线
      this.getDataAttributesOption();//指标属性
      this.getStandardTypeOption(() => {
		    this.getData(); 
	    });//类别
    },
    methods: {
      onInput(e){
        if(e.target.value && e.target.value < 0){
          this.$nextTick(() => {
            this.form.setFieldsValue({
              rectificateLimitNum: 0
            })
          })
        }
      },
      //   onInput(e){
      //       if(e.target.value-0 < 0){
      //           this.$nextTick(() => {
      //               this.form.setFieldsValue({
      //                   rectificateLimitNum: 0
      //               })
      //           })
      //       }
      //   },
      moment,

      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
	  
	  
	  checkNoChina(rule, value, callback){
      if(value != undefined) {
          // var han = /^[^x00-xff]+$/
          if(/[\u4E00-\u9FA5]/g.test(value)){
            callback([new Error("输入内容不能包含汉字")]);
          }
        }
      callback();
	  },

      // 整改时限
      checkNum(rule, value, callback) {
          if(value != undefined) {
              if (value < 0) {
                  callback([new Error("整改时限不能为负数")]);
              }
              if (value.length > 10) {
                  callback([new Error("整改时限不能超过10位数字")]);
              }
          }
        callback();
      },

      checkType(rule, value, callback){
          if(!value || value == 0){
            callback();
          }
          const a = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,7}\.\d{0,2}$|^[1-9]\d{0,7}$/
          if(a.test(value)){
            callback();
            return
          }
          callback([new Error("输入值整数最多8位并保留2位小数")]);
        
      },

      ...mapActions([
        "FALLBACK"
      ]),
      handleOpenChange(status){
         this.yearPickShow = status;
      },
      handlePanelChange(value){
        console.log(value)
        if (moment(value).format("YYYY") <= moment().year(0).format("YYYY")) {
          value = moment(moment.now());
        }
        this.yearPickShow = false;
        this.form.setFieldsValue({
          yearPick: value
        })
      },
      onChange(){

      },
     //获取业态
    getBusinessFormatList() {
        const para = {
		      parentId: 10
	      };
        api.getQuCommonCodeList(para).then(res => {
          if (res.code === 200) {
            this.businessFormatData = res.data.list;			      
          }
        })
    },

    //服务模式
    getServiceModeOption(){
        const para = {
		      parentId: 11
	      };
        api.getQuCommonCodeList(para).then(res => {
          if (res.code === 200) {
            this.serviceModeData = res.data.list;			      
          }
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
    //指标属性
    getDataAttributesOption(){
        const para = {
		      parentId: 13
	      };
        api.getQuCommonCodeList(para).then(res => {
          if (res.code === 200) {
            this.dataAttributesData = res.data.list;			      
          }
        })
    },
    //类别
    getStandardTypeOption(callBack){
        const para = {
		      parentId: 14
	      };
        api.getQuCommonCodeList(para).then(res => {
          if (res.code === 200) {
            this.standardTypeData = res.data.list;
          }
		  callBack && callBack()
        }).catch(() => {
			callBack && callBack()
		})
    },

    onStandard(e){
      console.log(e)
      api.getQuCommonCodeList({
        parentId: e
      }).then(res => {
        if (res.code === 200) {
          this.typeDescriptionData = res.data.list;			      
        }
      })
    },

    onChangeType(e){
      let obj = {};
      obj = this.standardTypeData.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.codeId === e; //筛选出匹配数据
      });
	    //obj = this.standardTypeData[idx]
      const para = {
		    parentId: obj.id
	    };
      api.getQuCommonCodeList(para).then(res => {
        if (res.code === 200) {
          this.typeDescriptionData = res.data.list;			      
        }
      })
      this.form.setFieldsValue({
        typeDescription: null
      })
    },
       //获取详情
       getData() {
        if (this.id?.id) {
          api.detailStandard({ id: this.id.id }).then(res => {
            if (res.code === 200) {
              const data = res.data;
              //
              this.onChangeType(data.standardTypeId);
              this.$nextTick(()=>{
                this.form.setFieldsValue({
                  standardCode: data.standardCode,//标准代码
                  businessFormatId: data.businessFormatId,//业态
                  serviceModeId:data.serviceModeId,//服务模式
                  specialLineId:data.specialLineId,//专业线
                  dataAttributesId:data.dataAttributesId,//指标属性
                  totalScore:data.totalScore,//总分值
                  weight:data.weight,//细项权重
                  standardTypeId:data.standardTypeId,//类别
                  typeDescription:data.typeDescription,//类别描述
                  checkStandard:data.checkStandard,//核查标准
                  checkMethod:data.checkMethod,
                  rectificateLimitNum:data.rectificateLimitNum,
                  rectificateLimitUnit:data.rectificateLimitUnit,
                  yearPick:data.standardYear,
                });
              });
              console.log(data)
            }
          });
        }
      },
      //保存
      onSubmit(e) {
        e.preventDefault();
        const isAdd = !this.id.id;
        this.form.validateFields((err, values) => {
          if (!err) {
            this.btnLoading = true;
            values = {
              id: !isAdd ? this.id.id : undefined,
              standardCode: values.standardCode,
              businessFormatId: values.businessFormatId,
              serviceModeId: values.serviceModeId,
              specialLineId: values.specialLineId,
              dataAttributesId: values.dataAttributesId,
              totalScore: Number(values.totalScore),
              weight: Number(values.weight),
              standardTypeId: values.standardTypeId,
              typeDescription: values.typeDescription,
              checkStandard: values.checkStandard,
              checkMethod: values.checkMethod,
              rectificateLimitNum: Number(values.rectificateLimitNum),
              rectificateLimitUnit: values.rectificateLimitUnit,
              // standardYear: values.yearPick?moment(values.yearPick).format('YYYY'): "",
              standardYear: values.yearPick,
            };
            console.log(values);
            api[isAdd ? "addStandard" : "editStandard"](values).then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                this.$router.push({path: "/qualityManagement/standard"})
              }
            }).finally(()=>{
              this.btnLoading = false;
            });
          }
        });
      },

    },
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

