<template>
  <div id="form-container">
    <div class="content-header">
      登记结果
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
        <a-row>
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" id="form-container">
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
        <a-form-model :model="form" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="扣分">
                <a-input v-model="form.deductScore" type="number" style="width:100%" min=0 placeholder="请输入" @blur="repair" @change="onInput"/>
              </a-form-model-item>
              <a-form-model-item label="得分">{{form.resultScore}}</a-form-model-item>
              <a-form-model-item label="详细描述" prop="description">
                <a-input v-model="form.description" type="textarea" :maxLength="200" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="照片">
                <uploadImage :fileList="fileList" @onChange="getImgList"></uploadImage>
              </a-form-model-item>
            </a-col>
          </a-row>
           <a-row>
            <a-col :span="20" :offset="1">
              <div style="color: #999; margin-left: 3.2%;" class="up-des">
                图片要求:建议上传尺寸为:230*460,格式为jpg、png、大小不超过5MB。
              </div>
            </a-col>
          </a-row>
           <a-row>
            <a-col :span="8">
              <a-form-model-item label="检查时间" style="margin-bottom: 30px;" prop="checkTime">
                <a-date-picker
                  v-model="form.checkTime"
                  show-time
                  type="date"
                  placeholder="请选择检查时间"
                  style="width:100%"
                  format="YYYY-MM-DD HH:mm"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-row>
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import api from "@/api";
import moment from "moment";
import uploadImage from "@/components/uploadImage/UpLoadImg.vue";
export default {
	components: {
	  uploadImage,
	},	
  data() {
    return {
      previewVisible: false,
      previewImage: null,
      info: {},
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      deductScoreBefore:"",
      form: {
        resultScore: "",
        deductScore: "",
        description: "",
        checkTime: "",
		    url: []
      },
      loading: false,
      imageUrl: "",
      id: this.$route.params.id,
      standardId:this.$route.params.standardId,
      taskId: this.$route.params.taskId,
      fileList: [ // 图片固定 格式如下
        // {
        //   uid:'vc-upload-1606299051793-5',
        //   name:"lADPD2eDNvUBKV3NCrDNDkA_3648_2736.jpg_720x720q90g.jpg",
        //   url: "http://10.1.160.177/kms/admin/portal.proxy_download?download_file_id=53/94/1AAF4B9532FE6208B91A9A1EAEABB01C-106164.jpg&download_file_name=&app_key=timeswyapp&app_key_tokening=777c80a1faabd0de2221e0a7841f1e5cis_stream=1"
        // }
      ],
      rules: {
        description: [
          { required: true, message: "详细描述不能为空", trigger: "blur" },
          { max:100, message: "长度不能超过100", trigger: "blur" }
        ],
        checkTime: [
          { required: true, message: "检查时间不能为空", trigger: "change" } 
        ]
      },
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    moment,

    // 监听图片变化
    getImgList(e){
      console.log(e)
      this.fileList = e.data
    },

    //扣分判断
    repair() {
        // var val = this.form.deductScore
        // if(val){
        //   let pointIndex = val.indexOf('.');
        //   if ( (pointIndex < 0 && val.length > 8 ) ||  pointIndex > 8 ) {
				// 		this.form.deductScore = this.deductScoreBefore;
				// 		this.$message.error('只能输入8位整数');
				// 		return;
				// 	}
				// 	if (pointIndex > 0 && (val.length - pointIndex) > 3) {
				// 		this.form.deductScore = this.deductScoreBefore;
				// 		this.$message.error('只能输入2位小数');
				// 		return;
				// 	}
        //   let allscore = this.info.totalScore || 0.00
				// 	if (val - 0 > this.info.totalScore - 0) {
				// 		this.form.deductScore = this.deductScoreBefore; // 恢复扣分
        //     this.form.resultScore =  (this.info.totalScore - this.deductScoreBefore).toFixed(2) // 恢复得分
        //     this.$message.error('超出总得分，请重新输入');
				// 		return
        //   }
        //  // 补零
        //   if (val.lastIndexOf(".") != -1) {
        //     var num = val.substring(val.lastIndexOf(".") + 1)
        //     if (parseInt(num.length) == 1) {
        //       this.form.deductScore += '0'
        //     }
        //   }
        //   if (val.lastIndexOf(".") == -1) {
        //     this.form.deductScore += '.00'
        //   }
        //   // this.deductScoreBefore = this.form.deductScore;
        //   this.form.resultScore = (Number(this.info.totalScore)-Number(this.form.deductScore)).toFixed(2)
        // }
        // const res = /^[0-9]\d*.\d*|0.\d*[0-9]\d*/
        // if (!res.test(this.form.deductScore)) {
        //   this.form.deductScore = this.deductScoreBefore;
        // }

        var reg1 = /(^[0-9]{1,8}$)|(^[0-9]{1,8}[\.]{1}[0-9]{1,2}$)/;
				var val = this.form.deductScore || "0"
				val = val.toString()
				
				if(!reg1.test(val)){
					this.$message.error('只能输入8位整数，并且最多2位小数');
					this.restScore()
					return
				}
				if((val - 0) > (this.info.totalScore - 0)){
					this.$message.error('超出总得分，请重新输入');
					this.restScore()
					return
				}
				// 通过了前两个验证，计算得分
				this.form.deductScore = this.form.deductScore && (this.form.deductScore - 0).toFixed(2)
				this.form.resultScore = (this.info.totalScore - val).toFixed(2)
    },

    restScore(){
      this.form.deductScore = this.deductScoreBefore; // 恢复扣分
      this.form.resultScore =  (this.info.totalScore - this.deductScoreBefore).toFixed(2) // 恢复得分
    },

    onInput(e){
      if(e.target.value && e.target.value < 0){
        this.$nextTick(() => {
          e.target.value = this.deductScoreBefore;
        })
      }
    },

    //获取详情
    getDetail() {
      api.detailStandardAll({ id: this.id }).then(res => {
        if (res.code === 200) {
          this.info = {...res.data.standard} || {};
          let checkRecord = res.data.checkRecord || {};
          let deductScore = checkRecord.deductScore?checkRecord.deductScore:"0.00"
          let resultScore = checkRecord.resultScore?checkRecord.resultScore:(Number(this.info.totalScore?this.info.totalScore:"0.00")-Number(deductScore)).toFixed(2)
          this.deductScoreBefore = deductScore;
          this.form = {
            resultScore: resultScore,
            deductScore: deductScore,
            description: checkRecord.description,
            checkTime: checkRecord.checkTime?moment(checkRecord.checkTime).format("YYYY-MM-DD HH:mm"):"", 
          }
          // 改造图片列表数据
          let newArr = res.data.urls.length ? res.data.urls.map((e) => {
            return {
              ...e,
              uid: e.documentId,
              name: e.fileName || '无数据',
              url: e.picturePath || '无数据',
              thumbUrl: e.picturePath || '无数据',
            }
          }) : []
          this.fileList = newArr
        }
      });
    },

    onSubmit() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            ...that.form,
            cdId: that.id,
            taskId: that.taskId,
            scoreFlg:"1",
            checkTime: that.form.checkTime
              ? moment(that.form.checkTime).valueOf()
              : undefined,
            url: that.fileList  
          };
          api.checkrecordRegistration(params).then(res => {
            if(res.code===200){
              that.$router.go(-1);
              that.$message.success('保存成功')
            }
          });
        }
      });
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
  /deep/ .ant-upload-list-picture-card-container{
    width: 100%;
  }
  /deep/ .ant-upload-list-picture-card .ant-upload-list-item{
     width: 100%;
  }
  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>