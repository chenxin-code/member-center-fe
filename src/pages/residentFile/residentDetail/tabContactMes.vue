<!-- 联系方式 -->
<template>
  <div id="tabContacMes">
    <a-form autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" style="height: 100%;overflow: auto;">
      <a-form-item label="手机号">
        <span class="ant-form-text">
          {{phone}}
        </span>
      </a-form-item>
      <a-form-item label="微信号" >
        <a-input
          placeholder="请输入"
          :maxLength = 20
          v-decorator="['wechatNumber',
            {
              rules: [
                {required: false, message: '请输入不超过20长度的微信号', pattern: new RegExp(/^[^\u4e00-\u9fa5\uF900-\uFA2D\u0020]+$/),},
              ]
            }
          ]"/>
      </a-form-item>
    </a-form>
    <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" html-type="submit" @click="save">
          保存
        </a-button>
      </a-form-item>
  </div>
</template>
<script>
import api from "@/api";
import AFormItem from "ant-design-vue/es/form/FormItem";
import { debounce } from "@/utils/util";   // 防抖

export default {
  name: "TabContacMes",
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
      phone: "",
      dataId:""
    }
  },
  components: {
    AFormItem,
  },
  created(){
    // console.log(this.project);
    this.getDetail()
  },
  methods:{
    getDetail(){
      let sdata= {
        custId: this.project.custId,
      }
      api.residentContactQuery(sdata).then(res=>{
        if(res.code==200 ){
          this.phone= this.project.phone
          if(res.data){
            this.dataId = res.data.id;
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                wechatNumber: res.data.wechatNumber,
              })
            })
          }
        }
      })
    },
    save(e){
      e.preventDefault();   // 防止点击跳转
      debounce(() => {
        const isAdd = !this.dataId;
        this.form.validateFields((err,values) =>{
          if(!err){
            let sdata = {
              id: !isAdd ? this.dataId : undefined,
              customerId: this.project.custId,
              wechatNumber: values.wechatNumber
            }
            api["residentCardEdit"](sdata).then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                this.getDetail()
              }
            });
          }
        })
      })
    }
  }
}
</script>
