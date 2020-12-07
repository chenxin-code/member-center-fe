<template>
  <a-form-model :model="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" id="form-container" >
    <a-row :gutter="24"  type="flex" justify="space-between">
      <a-col :span="8">
        <a-form-model-item label="项目">{{data.projectName}}</a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="房屋">{{data.spaceName}}</a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="业主">{{data.ownerInfo}}</a-form-model-item>
      </a-col>
      
      <a-col :span="8">
        <a-form-model-item label="开始日期">{{data.decorationDateStartStr?data.decorationDateStartStr:''}}</a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="结束日期">{{data.decorationDateEndStr?data.decorationDateEndStr:''}}</a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="是否委托装修公司">{{data.entrustFlag?'是':'否'}}</a-form-model-item>
      </a-col>
    </a-row>

    <a-row v-if="data.entrustFlag" :gutter="24"  type="flex" justify="space-between">
      <a-col :span="8">
        <a-form-model-item label="装修公司">{{data.decorationCompany}}</a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="装修负责人">{{data.decorationDirector}}</a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="联系电话">{{data.directorTel}}</a-form-model-item>
      </a-col>
    </a-row>

    <a-row style="margin-top:10px" :gutter="24"  type="flex">
      <a-col :span="8">
        <a-form-model-item label="操作记录" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-steps
            :current="list.length-1"
            direction="vertical"
            size="default"
            style="padding:10px 5px;"
          >
            <a-step v-for="(item,index) in list" :key="index">
              <template slot="title">{{item.nodeName}}</template>
              <div slot="description">
                <a-timeline>
                  <a-timeline-item v-for="(items,idx) in item.details" :key="idx">
                    <p>{{items.recordMessage}}</p>
                    <p>{{items.recordDetails}}</p>                    
                    <p>{{items.recordTime}}</p>
                    <!-- <a-button v-if="items.recordMessage === '管家预审核已拒绝'" @click="goRefuseDetail(items.recordDetails)">详情</a-button>
                    <a-button v-if="items.recordMessage === '管家关闭装修申请'" @click="goCloseDetail(items.recordDetails)">详情</a-button>-->
                  </a-timeline-item> 
                </a-timeline>
              </div>
            </a-step>
          </a-steps>
        </a-form-model-item>
      </a-col>
    </a-row>

    <!-- 拒绝装修申请弹窗 -->
    <a-modal v-model="refuseApplyVisible" :centered="true" title="拒绝详情" @cancel="refuseApplyCancel">
      <template slot="footer">
        <a-button key="back" @click="refuseApplyCancel">
                    取消
        </a-button>
      </template>
        <a-form layout="inline">
          <a-form-item label="拒绝原因">
          <a-textarea  :rows="3"  style="width:300px;" v-model="refuseMessage"/>
        </a-form-item>
      </a-form>
    </a-modal>          
     <!-- 关闭装修申请弹窗 -->             
    <a-modal v-model="closeApplyVisible" :centered="true" title="关闭详情" :maskClosable="false" @cancel="closeApplyCancel">
        <template slot="footer">
          <a-button key="back" @click="closeApplyCancel">
                    取消
          </a-button>
          </template>
          <a-form layout="inline">
          <a-form-item label="关闭理由">
            <a-textarea :rows="3"  style="width:300px;"  v-model="closeMessage"/>
          </a-form-item>
        </a-form>
    </a-modal>
  </a-form-model>
  <!-- 关闭装修申请弹窗 -->

</template>
<script>
import api from "@/api";

export default {
  name: "BasicInformation",
  props: ["data", "list"],
  data() {
    return {
      form: {},
      current: 1,
      refuseMessage:"",
      closeMessage:"",
      refuseApplyVisible:false,
      closeApplyVisible:false,
    };
  },
  methods:{
    /**
     * 跳转详情
     * @author Chen Kuo
     * @date 2020-11-01
     * @returns {any}
     */
    goRefuseDetail(value){
      //this.$emit('changeCurrent','2')
      console.log(value);

      this.refuseApplyVisible = true;
      this.refuseMessage = value;

      // const para = {
      //   applicationId:this.data.applicationId,
      //   nodeId:"01"
      // };
      // api.getDecorationRecordDetail(para).then(res => {
      //   if (res.code === 200) {
      //     this.refuseMessage = res.data.details;
      //   }
      // });
    },
    goCloseDetail(value){
      //this.$emit('changeCurrent','2')
      this.closeApplyVisible = true;
      this.closeMessage = value;

      // const para = {
      //   applicationId:this.data.applicationId,
      //   nodeId:"07"
      // };
      // api.getDecorationRecordDetail(para).then(res => {
      //   if (res.code === 200) {
      //     this.closeMessage = res.data.details;
      //   }
      // });
    },
    refuseApplyCancel(){
      this.refuseApplyVisible = false;
    },
    closeApplyCancel(){
      this.closeApplyVisible = false;
    },
  }
};
</script>
<style lang="less" scoped>
#form-container {
  /deep/ .ant-steps-item-content {
    margin-right: 0;
  }
  /deep/ .ant-steps-item-title {
    padding-right: 0;
    margin-bottom: 10px;
  }
  /deep/ .ant-form-item-label > label {
    color: #666;
    font-weight: bolder;
  }
}
</style>