<template>
  <div id="form-container">
    <div class="content-header">
      任务详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
        <a-form-model
          :model="form"
          :label-col="labelCol"
          ref="ruleForm"
          :wrapper-col="wrapperCol"
          :rules="rules"
        >
          <a-form-model-item label="项目">{{projectName}}</a-form-model-item>
          <a-form-model-item label="区域" prop="areaId">
            <a-select v-model="form.areaId" placeholder="请选择" style="width: 350px">
              <a-select-option
                :value="item.id"
                v-for="item in areaData"
                :key="item.id"
              >{{item.areaName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- <a-form-model-item label="巡检点">
            <a-select v-model="form.inspectionPointId" placeholder="请选择">
              <a-select-option
                :value="item.id"
                v-for="item in inspectionUnitData"
                :key="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item> -->
          <a-form-model-item label="是否涉及维修">
            <a-radio-group v-model="form.maintenance">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <!-- <a-form-model-item label="责任人" prop="applyId">
            <a-select v-model="form.applyId" placeholder="请选择">
              <a-select-option value="shanghai">Zone one</a-select-option>
              <a-select-option value="beijing">Zone two</a-select-option>
            </a-select>
          </a-form-model-item> -->
          <a-form-model-item label="整改标准">{{standardCode}}</a-form-model-item>
          <a-form-model-item label="专业线">{{specialLineName}}</a-form-model-item>
          <a-form-model-item label="是否升级问题">
            <a-radio-group v-model="form.upgrade">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="扣罚分值">
			<a-input style="width: 350px" type="number" v-model="form.deductScore" :min="0" @blur="repair" @change="onInput"/>
		  </a-form-model-item>
          <!-- <a-form-model-item label="关单时限">
            <div class="flex">
              <a-input-number v-model="form.closeTimeNum" :min="0" style="flex:1" />
              <span style="margin-left:10px">分钟</span>
            </div>
          </a-form-model-item> -->

          <a-form-model-item label="整改描述" prop="description">
            <a-input v-model="form.description" type="textarea" style="width: 350px;height:150px" />
          </a-form-model-item>

          <a-form-model-item label="照片" prop="fileList">
            <div style="width: 30%">
              <uploadImage :fileList="form.fileList" @onChange="getImgList"></uploadImage>
            </div>
            <div style="color: #999;" class="up-des">
              图片要求:建议上传尺寸为:230*460,格式为jpg、png、大小不超过5MB。
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-row>
    </div>
    <div class="content-footer">
      <a-button size="large" style="width: 120px;" @click="FALLBACK">取消</a-button>
      <a-button type="primary" size="large" style="width: 120px;margin-left:20px" @click="onSubmit">确定</a-button>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import api from "@/api";
import uploadImage from "@/components/uploadImage/UpLoadImg.vue";

export default {
	components: {
	  uploadImage,
	},
  data() {
    return {
      form: {
        maintenance: 1,
        upgrade: 1,
        areaId:'',
        inspectionPointId:'',
        deductScore: "",
		    fileList: [],
      },
      rules: {
        areaId: [
          { required: true, message: "请选择区域", trigger: "change" },
        ],
        description: [
          { required: true, message: "请输入整改描述", trigger: "blur" },
          { max:100, message: "长度不能超过100", trigger: "blur" }
        ],
        fileList: [
          { required: true, message: "请输入照片", trigger: "blur" } 
        ]
      },
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      loading: false,
      imageUrl: "",
      id: this.$route.params.id,
      standardId: this.$route.params.standardId,
      taskId: this.$route.params.taskId,
      areaData: [], //区域列表
      inspectionUnitData: [], //巡检人列表
      specialLineName:"",
      projectId:"",
      projectName: "-",
      description: "-",
      deductScore: "",
      status:"",
      tomStatus:"",
      standardCode: "-",
      fileList: []
    };
  },
  mounted() {
    this.getInspectionUnitList();
    this.getChRectificationRecord();
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 5MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    
  // 监听图片变化
    getImgList(e){
      console.log(e)
      this.form.fileList = e.data
    },
	
	repair() {
	    var val = this.form.deductScore
	    if(val){
        if (val - 0 > this.deductScore - 0) {
          this.form.deductScore = "0"
          this.$message.error('超出总得分，请重新输入');
          return
        }

        val = val.toString()
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
	    }
    },
    
	onInput(e){
	  if(e.target.value && e.target.value < 0){
	    this.$nextTick(() => {
	      e.target.value = 0;
	    })
	  }
	},
	//获取详情
    getChRectificationRecord() {
      api.getChRectificationRecord({ id: this.id }).then(res => {
        if (res.code === 200) {
          const {
            projectId,
            projectName,
            description,
            deductScore,
            standardCode,
            specialLineName,
            status,
            tomStatus,
            areaId,
            inspectionPointId
          } = res.data;
          console.log(res.data);
          this.projectId = projectId;
          this.projectName = projectName || "-";
          this.description = description || "-";
          this.deductScore = deductScore || "";
          this.standardCode = standardCode || "-";
          this.specialLineName = specialLineName || "-";
          this.status = status;
          this.tomStatus = tomStatus;
          this.form.areaId = areaId ;
		      this.form.deductScore = this.deductScore;
          this.getAreaList();
          this.repair()
        }
      });
    },
    //获取区域列表
    getAreaList() {
      const para = {
        projectId: this.projectId,
      };
      api.getQualityAreaList(para).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.areaData = res.data;
        }
      });
    },
    //获取巡检列表
    getInspectionUnitList() {
      const para = {
        parentId: 8
      };
      api.getQuCommonCodeList(para).then(res => {
        if (res.code === 200) {
          this.inspectionUnitData = res.data.list;
        }
      });
    },
    onSubmit() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            ...that.form,
            deductScore: this.form.deductScore ? this.form.deductScore : 0,
            checkRecordId:that.id,
            standardId:that.standardId,
            taskId:that.taskId,
            tomStatus: that.tomStatus,
            status: that.status,
            url: that.form.fileList
          };
          console.log(JSON.stringify(params));
          api.updateRectificationRecord(params).then(res => {
            if (res.code === 200) {
              this.$message.success("保存成功");
              this.$router.go(-1);
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
  /deep/ .ant-form-item-label > label {
    color: #666;
  }
  /deep/ .ant-upload.ant-upload-select-picture-card {
    width: 100%;
  }
  .content-footer,
  .flex {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
<style>
#form-container {
  margin-bottom: 30px;
}
</style>