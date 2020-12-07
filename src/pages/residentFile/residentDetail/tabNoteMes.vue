<!-- 备注 -->
<template>
  <div id="tabNoteMes">
    <a-form autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 24 }" style="height: 100%;width: 100%;overflow: auto;">
      <a-form-item>
        <a-textarea 
        placeholder="请输入" 
        :rows="15"  
        v-decorator="[
        'remark',
        {
          rules:[
          {
            max: 100,
            message: '输入内容在100字内'
          }
          ]
        }
        
        ]"
        />
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
import { debounce } from "@/utils/util";   // 防抖

export default {
  name: "TabNoteMes",
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
    }
  },
  components: {
    // AFormItem,
  },
  created(){
    // console.log(this.project);
    this.getDetail()
  },
  methods:{
    getDetail(){
      let sdata = {
        custId: this.project.custId
      } 
      api.residentNodeQuery(sdata).then(res=>{
        if(res.code==200){
          if(res.data){
            this.dataId = res.data.id
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                remark:res.data.remark
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
              remark: values.remark
            }
            api["residentNodeEdit"](sdata).then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
              }
            });
          }
        })
      })
    }
  }
}
</script>
