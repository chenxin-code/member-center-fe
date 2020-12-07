<!--身份证信息 -->
<template>
  <div id="IdeMes">
    <a-form autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" style="height: 100%;overflow: auto;">
      <a-form-item label="证件类型">
        <span class="ant-form-text">
          {{getCardTypeList[cardType]}}
        </span>
      </a-form-item>
      <a-form-item label="证件号码">
        <span class="ant-form-text">
          {{cardNo}}
        </span>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import api from "@/api";
import AFormItem from "ant-design-vue/es/form/FormItem";
import {CARD_TYPE_MAP} from "@/constance/index.js";
export default {
  name: "IdeMes",
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
      cardNo:"",    // 证件号
      cardType: "",  // 证件类型
      getCardTypeList:[],
    }
  },
  created(){
    this.getCardType()
  },
  mounted(){
    // console.log(this.project);
    this.getIdeDetail()
  },
  methods:{
    // 得到身份类型
    getCardType(){
      this.getCardTypeList = CARD_TYPE_MAP;
      console.log(this.getCardTypeList)
    },
    getIdeDetail(){
      let  sdata = {
        customerId: this.project.custId,
      }
      // console.log("77777777",sdata)
      api.residentCard(sdata).then(res =>{
        if(res.code === 200){
          this.cardNo =  res.data.cardNo,
          this.cardType = res.data.cardType
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    AFormItem,
  },
}
</script>
