<template>
  <div id="form-container">
    <div class="content-header">
      结果详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
       <a-row>
          <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" id="form-container">
            <a-row>
              <a-col :span="6"> 
                <a-form-item label="标准代码">{{info.standardCode}}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="业态">{{info.businessFormatName}}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="服务模式">{{info.serviceModeName}}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="专业线">{{info.specialLineName}}</a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6"> 
                <a-form-item label="指标属性">{{info.dataAttributesName}}</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="总分值">{{info.totalScore?Number(info.totalScore).toFixed(2):'0.00'}}分</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="细项权重">{{info.weight?Number(info.weight).toFixed(2):'0.00'}}分</a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="类别">{{info.standardTypeName}}</a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-col :span="6">
                  <a-form-model-item
                    label="类别描述"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span: 18 }"
                  >{{info.typeDescriptionName}}
                  </a-form-model-item>
                </a-col>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-model-item label="核查标准" ></a-form-model-item>
              </a-col>
              <a-col :span="23" :offset="1">
              {{info.checkStandard}}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-model-item label="检查方法"></a-form-model-item>
              </a-col>
              <a-col :span="23" :offset="1">
                {{info.checkMethod}}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-model-item
                  label="整改时限"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                >{{info.rectificateLimit}}
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form>
        </a-row>
        <a-divider dashed />
        <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
           <a-row>
              <a-row>
                <a-col :span="24"> 
                  <a-form-item label="是否参与考核">{{checkRecord.scoreFlg=='0'?'是':'否'}}</a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="checkRecord.scoreFlg=='1'">
                  <a-col :span="24"> 
                    <a-form-item label="扣分">{{checkRecord.deductScore}}</a-form-item>
                  </a-col>
                  <a-col :span="24"> 
                    <a-form-item label="得分">{{checkRecord.resultScore}}</a-form-item>
                  </a-col>
              </a-row>
              <a-col :span="24"> 
                <a-form-item label="详细描述">{{checkRecord.description}}</a-form-item>
              </a-col>
              <a-col :span="24"> 
                 <a-form-item label="照片" style="margin-top:16px;">
                    <div v-if="fileList&&fileList.length">
                      <img
                        class="img-style"
                        :src="item.picturePath"
                        v-for="item in fileList"
                        :key="item.id"
                        @click="handleClick(item)"
                      />
                    </div>
                  </a-form-item>
              </a-col>
              <a-col :span="24"> 
                <a-form-item label="检查时间">{{checkRecord.checkTime?moment(checkRecord.checkTime).format('YYYY-MM-DD HH:mm'):''}}</a-form-item>
              </a-col>
           </a-row>
        </a-form>
      </a-row>
    </div>
    <div class="content-footer">
      <a-button size="large" style="width: 120px;" @click="FALLBACK">取消</a-button>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import api from "@/api";
import moment from "moment";
export default {
  data() {
    return {
      info: {},
      labelCol: { span: 2 },
      wrapperCol: { span: 7 },
      form: {},
      checkRecord:{},
      loading: false,
      imageUrl: "",
      id: this.$route.params.id,
      standardId:this.$route.params.standardId,
      taskId: this.$route.params.taskId,
      fileList: {}
    };
  },

  mounted() {
    this.getDetail();
  },
  methods: {
    moment,
    ...mapActions(["FALLBACK"]),
    
     //获取详情
    getDetail() {
      console.log(this.standardId);
      // 原先standardId standard表Id   现用check_record表id
      api.detailStandardAll({ id: this.id }).then(res => {
        if (res.code === 200) {
          this.info = res.data.standard || {};
          this.checkRecord = res.data.checkRecord || {};
          this.fileList = res.data.urls;
        }
      });
    },
    handleClick(url) {
      this.previewVisible = true;
      this.previewImage = url;
    }
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
  }
  /deep/ .ant-card {
    border-top: 0;
  }
  /deep/ .ant-tabs-bar {
    margin: 0;
  }
  /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    width: 120px;
    text-align: center;
  }
  /deep/ .ant-upload.ant-upload-select-picture-card {
    width: 100%;
  }
  /deep/ .ant-upload-list-picture-card-container {
    width: 100%;
  }
  /deep/ .ant-upload-list-picture-card .ant-upload-list-item {
    width: 100%;
  }
  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
    .rowdiv{
    width: 17%;
    padding:20px;
    color: #666;
    display: flex;
  }
  .coldiv{
    width: 40%;
    text-align: right;
  }
  .coldiv::after{
    content: ':';
    position: relative;
    top: -0.5px;
    margin: 0 8px 0 2px;
  }
  .coltext{
    width: 60%;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  .width90{
    width: 90%;
  }
  .rowwidth{
    width: 100%;
  }
}
</style>