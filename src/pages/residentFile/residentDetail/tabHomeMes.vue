<!-- 家庭信息 -->
<template>
<div id="tabHomeMes">
  <a-form autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" style="height: 100%;">
    <a-form-item label="家庭结构">
      <a-select placeholder="请选择" :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
        v-decorator="['familyType']">
        <a-select-option v-for="item of familyTypeList" :key="item.id">
          {{item.name}}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="家庭同住人数">
<!--      :validate-status="validateStatusFamilySize"-->
<!--      :help="errorMsgFamilySize"-->
<!--      @change="handleChangeFamilySize"-->
      <!--        :maxLength="3"-->
      <a-input
        placeholder="请输入"
        :maxLength="3"
        v-decorator="[
        'familySize',
          {rules: [
          { required: false, message: '请输入正确人数', pattern: new RegExp(/^(0|[1-9][0-9]*)$/),},
          ]}
        ]"
      />
    </a-form-item>
    <a-form-item label="小孩个数">
<!--      :validate-status="validateStatusChildSize"-->
<!--      :help="errorMsgChildSize"-->
<!--      @change="handleChangeChildSize"-->
<!--      -->
      <a-input
        placeholder="请输入"
        :maxLength="3"
        v-decorator="[
        'childNum',
          {rules:[
          {required: false, message: '请输入正确人数', pattern: new RegExp(/^(0|[1-9][0-9]*)$/),},
          ]}
        ]"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
      <a-button type="primary" html-type="submit"
        @click="editHomeBase"
        :loading="btnLoading">
        保存
      </a-button>
    </a-form-item>
  </a-form>
</div>
</template>
<script>
import api from "@/api";
import { debounce } from "@/utils/util";   // 防抖

// import AFormItem from "ant-design-vue/es/form/FormItem";
export default {
  name: "TabHomeMes",
  props:{
    project:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  data(){
    return{
      form: this.$form.createForm(this, { name: "form" }),
      familyTypeList: [ // 家庭结构
        {id:"11",name: "单身青年独居"},
        {id:"12",name: "单身与父母同住"},
        {id:"13",name: "老人独居"},
        {id:"21",name: "已婚无小孩"},
        {id:"22",name: "已婚有小孩"},
        {id:"23",name: "三代同堂"},
      ],
      btnLoading: false,
      familySize: "",
      validateStatusFamilySize: "",
      errorMsgFamilySize: null,
      childNum:"",
      validateStatusChildSize:"",
      errorMsgChildSize: null,
    }
  },
  components: {
    // AFormItem,
  },
  created(){
    this.getHomeMes()
  },
  mounted(){
    // console.log(this.project);
    // this.getHomeMes()
  },
  methods: {
    // 同住人数校验
    // handleChangeFamilySize(e){
    //   this.familySize = e.currentTarget.value;
    //   this.validateFamilySize()
    // },
    // validateFamilySize(){
    //   if( /^(0|[1-9][0-9]*)$/.test(this.familySize)){
    //     this.validateStatusFamilySize = 'success';
    //     this.errorMsgFamilySize = null;
    //   }else{
    //     this.validateStatusFamilySize = "error";
    //     this.errorMsgFamilySize = "请输入正确数字"
    //   }
    // },
    // 儿童数量校验
    // handleChangeChildSize(e){
    //   this.childNum = e.currentTarget.value;
    //   this.validateChildSize()
    // },
    // validateChildSize(){
    //   if( /^(0|[1-9][0-9]*)$/.test(this.childNum)){
    //     this.validateStatusChildSize = 'success';
    //     this.errorMsgChildSize = null;
    //   }else{
    //     this.validateStatusChildSize = "error";
    //     this.errorMsgChildSize = "请输入正确数字"
    //   }
    // },
    getHomeMes(){
      let sdata = {
        customerId: this.project.custId
      }
      api.residentFamilyQuery(sdata).then(res => {
        if(res.code ===200){
          if(res.data){
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                familyType: res.data.familyType,
                familySize: res.data.familySize,
                childNum: res.data.childNum,
              });
            });
          }
        }
      })
    },
    editHomeBase(e){
      e.preventDefault();
      debounce(() => {
        // if( /^(0|[1-9][0-9]*)$/.test(this.familySize)==false)return
        //  if( /^(0|[1-9][0-9]*)$/.test(this.childNum)==false)return
        this.form.validateFields((err, values) => {
          console.log(err);
          console.log(values)
          if(!err){
            let sdata = {
              customerId: this.project.custId,
              childNum: values.childNum,
              familySize: values.familySize,
              familyType: values.familyType,
            }
            api.residentFamilyUpdate(sdata).then(res=>{
              if(res.code==200){
                this.$message.success("修改成功！");
              }
            })
          }
        })
      })
    }
  }
}
</script>