<template>
  <a-modal title="标准详情" :visible="visible" width="50%" @ok="handleCancel" @cancel="handleCancel">
    <a-row>
      <a-form-model  :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" id="form-container">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="标准代码">{{info.standardCode?info.standardCode:''}}</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="业态">{{info.businessFormatName?info.businessFormatName:''}}</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="服务模式">{{info.serviceModeName?info.serviceModeName:''}}</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="专业线">{{info.specialLineName?info.specialLineName:''}}</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="指标属性">{{info.dataAttributesName?info.dataAttributesName:''}}</a-form-model-item>
          </a-col>
          <a-col :span="8"> 
            <a-form-model-item label="总分值">{{info.totalScore?Number(info.totalScore).toFixed(2):'0.00'}}分</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="细项权重">{{info.weight?Number(info.weight).toFixed(2):'0.00'}}分</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="类别">{{info.standardTypeName?info.standardTypeName:''}}</a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="类别描述">{{info.typeDescriptionName?info.typeDescriptionName:''}}</a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="核查标准" ></a-form-model-item>
          </a-col>
            <a-col :span="23" :offset="1">
            {{info.checkStandard?info.checkStandard:''}}
            </a-col>

          <a-col :span="8">
            <a-form-model-item label="检查方法"></a-form-model-item>
          </a-col>
          <a-col :span="23" :offset="1">
            {{info.checkMethod?info.checkMethod:''}}
          </a-col>

          <a-row :span="24">
              <a-col :span="8">
                <a-form-model-item
                  label="整改期限"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 10 }"
                >{{info.rectificateLimit?info.rectificateLimit:''}}
                </a-form-model-item>
              </a-col>
          </a-row>
        </a-row>
      </a-form-model>
    </a-row>
  </a-modal>
</template>

<script>
import api from '@/api'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkId: {
      type: String,
      default: ""
    }
  },
  data(){
    return{
      info:{}
    }
  },
  watch: {
    visible:function(newVal){
      if(newVal){
        this.getDetail()
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit("closeModal");
    },
    getDetail(){
      api.detailStandard({id:this.checkId}).then(res=>{
        if(res.code===200){
          this.info = res.data||{}
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
#form-container {
  /deep/ .ant-form-item-label > label {
    color: #666;
  }
}
</style>