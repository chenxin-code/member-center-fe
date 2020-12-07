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
                  <a-form-model-item label="类别描述" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                    {{info.typeDescriptionName}}
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
              <a-form-model-item label="是否参与考核">
                <a-radio-group name="radioGroup" v-model="form.scoreFlg" @change="radioChange" >
                  <a-radio :value='1'>
                    是
                  </a-radio>
                  <a-radio :value='0'>
                    否
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-row v-if="form.scoreFlg == '1'">
                <a-form-model-item label="扣分">
                  <!-- <a-input-number v-model="form.deductScore" style="width:100%" placeholder="请输入" /> -->
                  <a-input v-model="form.deductScore" type="number" min=0 style="width:100%" placeholder="请输入" @blur="repair" @change="onInput"/>
                </a-form-model-item>
                <a-form-model-item label="得分">{{form.resultScore}}</a-form-model-item>
              </a-row>
              <a-form-model-item label="详细描述" prop="description">
                <a-input v-model="form.description" type="textarea" :maxLength="200" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="照片">
                <div>
                  <uploadImage :fileList="fileList" @onChange="getImgList"></uploadImage>
                </div>
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
      info: {},
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      deductScoreBefore:"",
      form: {
        resultScore: "0.00",
        deductScore: "0.00",
        description: "",
        checkTime: "",
        scoreFlg: 1,
		    url: [],
        deductScore:""
      },
      loading: false,
      imageUrl: "",
      id: this.$route.params.id,
      taskId: this.$route.params.taskId,
      fileList: [],
      rules: {
        description: [
          { required: true, message: "详细描述不能为空", trigger: "blur" },
          { max:100, message: "长度不能超过100", trigger: "blur" }
        ],
        checkTime: [
          { required: true, message: "检查时间不能为空", trigger: "blur" } 
        ]
      },
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    moment,
    ...mapActions(["FALLBACK"]),
    // 当前时间
    getCurrentData(){
      // return new Date().toLocaleDateString();
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      let gettime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
      return gettime;
    },
    
    // 监听图片变化
    getImgList(e){
      console.log(e)
      this.fileList = e.data
    },

    radioChange(evt){
      this.form.scoreFlg = evt.target.value;
    },
 
    //扣分判断
    repair() {
        var val = this.form.deductScore
        if(val){
          let pointIndex = val.indexOf('.');
          if ( (pointIndex < 0 && val.length > 8 ) ||  pointIndex > 8 ) {
						this.form.deductScore = this.deductScoreBefore;
						this.$message.error('只能输入8位整数');
						return;
					}
					if (pointIndex > 0 && (val.length - pointIndex) > 3) {
            this.form.deductScore = this.deductScoreBefore;
						this.$message.error('只能输入2位小数');
						return;
					}
					if (val - 0 > this.info.totalScore - 0) {
            this.form.deductScore = this.deductScoreBefore; // 恢复扣分
            this.form.resultScore = (this.info.totalScore - this.deductScoreBefore).toFixed(2); // 恢复得分
            this.$message.error('超出总得分，请重新输入');
						return
          }
         // 补零
          if (val.lastIndexOf(".") != -1) {
            var num = val.substring(val.lastIndexOf(".") + 1)
            if (parseInt(num.length) == 1) {
              this.form.deductScore += '0'
            }
          }
          if (val.lastIndexOf(".") == -1) {
            this.form.deductScore += '.00'
          }
          // this.deductScoreBefore = this.form.deductScore;
          this.form.resultScore = (Number(this.info.totalScore)-Number(this.form.deductScore)).toFixed(2)
        }
        const res = /^[0-9]\d*.\d*|0.\d*[0-9]\d*/
        if (!res.test(this.form.deductScore)) {
          this.form.deductScore = this.deductScoreBefore;
        }
      },
    onInput(e){
      if(e.target.value && e.target.value < 0){
        this.$nextTick(() => {
          this.form.deductScore = this.deductScoreBefore;
        })
      }
    },
    //获取详情
    getDetail() {
      api.detailStandardAll({ id: this.id }).then(res => {
        if (res.code === 200) {
          this.info = res.data.standard || {};
          let checkRecord = res.data.checkRecord || {};
          let deductScore = checkRecord.deductScore?checkRecord.deductScore:"0.00"
          let resultScore = checkRecord.resultScore?checkRecord.resultScore:(Number(this.info.totalScore?this.info.totalScore:"0.00")-Number(deductScore)).toFixed(2)
          this.deductScoreBefore = deductScore;
          this.form = {
            resultScore: resultScore,
            deductScore: deductScore,
            description: checkRecord.description,
            checkTime: checkRecord.checkTime?moment(checkRecord.checkTime).format("YYYY-MM-DD HH:mm"): moment().format('YYYY-MM-DD HH:mm'), 
            scoreFlg: checkRecord.scoreFlg?parseInt(checkRecord.scoreFlg):1 
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
            checkTime: that.form.checkTime
              ? moment(that.form.checkTime).valueOf()
              : undefined,
            url:that.fileList, 
            scoreFlg:that.form.scoreFlg
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