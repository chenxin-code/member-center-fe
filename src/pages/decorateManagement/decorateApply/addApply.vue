<template>
  <div style="height: 100%;">
    <div class="content-header">
      <span style="font-weight:bold">{{ applicationId ? "编辑" : "新建" }}装修申请</span>
      <span class="fallback" @click="back" style="cursor:pointer">返回</span>
    </div>

    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form
        :form="form"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 14 }"
        style="height: 100%;overflow: auto;"
      >
        <div style="border-bottom:1px dashed #ccc;padding-bottom:20px">
          <div class="item-title" >
            <span>基础信息</span>
          </div>
          <a-form-item  label="项目" style="margin-top:16px;">
            <a-select
              v-decorator="['projectId',{ initialValue: '全部' }]"
              placeholder="请选择"
              style="width: 60%"
              @change="onProjectChange"
			  :disabled="optionDisabled"
            >
              <a-select-option v-for="(item,key) in projectData" :key="key" :value="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="房屋" required>
            <span>{{spaceName}}</span>
            <!-- <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange"
                        v-decorator="['id', { rules: [{ required: true, message: '项目不能为空' }] } ]">
              全部项目
            </a-checkbox>-->
            <a v-if="houseFlg" @click="chooseHouse" style="margin-left:38px;">选择房屋</a>
          </a-form-item>
          <a-form-item label="业主" hasFeedback>
            <!-- <a-input v-decorator="['ownerInfo',{rules:[{ required: true, message: '业主不能为空' }]}]" placeholder="请输入" style="width: 60%" />-->
            <a-select 
               v-decorator="['ownerInfo',{ rules: [{ required: true, message: '业主不能为空' }] }]"
               placeholder="请选择业主" style="width: 60%" 
               @change="onCheckOwnerInfoChange" :disabled="optionDisabled">
              <a-select-option v-for="(item,key) in ownerInfoData" :key="item.id" :value="item.name">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="装修日期">
            <a-range-picker
              v-decorator="['decorationDate',{ rules: [{ required: true, message: '装修日期不能为空' }] }]"
              :format="dateFormat"
              :disabled-date="disabledDate" @change="decorationDateChange"
            />  
          </a-form-item>
          <a-form-model-item label="是否委托装修公司">
            <a-radio-group v-decorator="['entrustFlag', {initialValue: 1}]" @change="onChange">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div v-show="decorationBtn">
            <a-form-item label="装修公司">
              <a-input v-decorator="['decorationCompany', { rules: [{ message: '装修公司最长应为20个字',max: 20 }] }]" placeholder="请输入" style="width: 60%" />
            </a-form-item>
            <a-form-item label="装修负责人">
              <a-input v-decorator="['decorationDirector', { rules: [{ message: '装修负责人最长应为10个字',max: 10 }] }]" placeholder="请输入" style="width: 60%" />
            </a-form-item>
            <a-form-item label="联系电话">
              <a-input
                v-decorator="['directorTel', { rules: [
                { message: '联系电话最长应为11个数字',max: 11 },
                { validator: checkData, trigger: 'blur' }] } ]"
                placeholder="请输入"
                style="width: 60%"
              />
            </a-form-item>
            <a-form-item label="装修负责人身份证">
              <a-row type="flex" justify="start">
                <a-col :span="12">
                  <a-spin class="img-div" :spinning="picUploading1">
                    <a-upload
					  :fileList="fileList1"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                      @preview="handlePreview"
                      @change="addPic1"
                      v-decorator="['fileList1',{ rules: [{ required: true, message: '装修负责人身份证正面不能为空' }] }]"
                    >
                    <!--  v-decorator="['fileList1',{ rules: [{ required: true, message: '装修负责人身份证正面不能为空' }] }]" -->
                      <div v-if="fileList1.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传身份证正面（头像面）</div>
                      </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                      <img class="img" alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </a-spin>
                </a-col>
                <a-col :span="12">
                  <a-spin class="img-div" :spinning="picUploading2">
                    <a-upload
					:fileList="fileList2"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                      @preview="handlePreview"
                      @change="addPic2"
                      v-decorator="['fileList2',{ rules: [{ required: true, message: '装修负责人身份证反面不能为空' }] }]"
                    >
                      <div v-if="fileList2.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传身份证反面（国徽面）</div>
                      </div>
                    </a-upload>
              
                  </a-spin>
                </a-col>
              </a-row>
              <span
                style="margin-left:10px;color:#999999;font-size:12px;"
              >图片要求：请注意身份信息不要模糊，建议上传尺寸为：230x460，格式为jpg、png，大小不超过5MB。</span>
            </a-form-item>
            <a-form-item label="装修公司营业执照">
              <a-spin class="img-div" :spinning="picUploading3">
                <a-upload
				:fileList="fileList3"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
                  @preview="handlePreview"
                  @change="addPic3"
                  v-decorator="['fileList3',{ rules: [{ required: true, message: '装修公司营业执照不能为空' }] }]"
                >
                  <div v-if="fileList3.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传装修公司营业执照</div>
                  </div>
                </a-upload>
             
              </a-spin>
              <span
                style="margin-left:10px;color:#999999;font-size:12px;"
              >图片要求：需加盖公章，建议上传尺寸为：230x460，格式为jpg、png，大小不超过5MB</span>
            </a-form-item>
            <a-form-item label="装修公司资质证书">
              <a-spin class="img-div" :spinning="picUploading4">
                <a-upload
				:fileList="fileList4"
                  list-type="picture-card"
                  v-decorator="['fileList4',{ rules: [{ required: true, message: '装修公司资质证书不能为空' }] }]"
                 :before-upload="beforeUpload"
                  @preview="handlePreview"
                  @change="addPic4"
                >
                  <div v-if="fileList4.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传装修公司资质证书</div>
                  </div>
                </a-upload>
          
              </a-spin>
              <span
                style="margin-left:10px;color:#999999;font-size:12px;"
              >图片要求：需加盖公章，建议上传尺寸为：230x460，格式为jpg、png，大小不超过5MB.</span>
            </a-form-item>
          </div>
        </div>
        <div style="border-bottom:1px dashed #ccc;padding-bottom:20px">
          <div class="item-title">
            <span>主要装修项目</span>
          </div>
          <a-form-item label="土建部分">
            <a-checkbox-group v-model="engineeringlist">
              <a-checkbox
                v-for="(item,index) in engineeringOptions"
                :key="index"
                :value="item.codeId"
                :defaultChecked="item.checked"
                @change="onChangeEngineering"
              >{{item.name}}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="电气部分">
            <a-checkbox-group v-model="electricallist">
              <a-checkbox
                v-for="(item,index) in electricalOptions"
                :key="index"
                :value="item.codeId"
                :defaultChecked="item.checked"
                @change="onChangeElectrical"
              >{{item.name}}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="其他">
            <a-textarea placeholder="请输入" :maxLength="50" :rows="6" v-decorator="['other',{rules:[{max:50,message:'字数不能超过50'}]}]" />
          </a-form-item>
        </div>

        <!-- <a-divider orientation="left">上传装修图纸</a-divider> -->
        <div class="item-title">
          <span>上传装修图纸</span>
        </div>
        <a-form-item label="原设计图">
          <a-upload
            name="file"
            :multiple="true"
            action
            list-type="picture"
            :file-list="fileList5"
			      :before-upload="beforeUpload5"
            v-decorator="['imageUrl5']"
            @change="addPic5"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList5&&fileList5.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="承重墙">
          <a-upload
            name="file"
            :multiple="true"
            action
            list-type="picture"
            :file-list="fileList6"
			:before-upload="beforeUpload6"
            v-decorator="['imageUrl6']"
            @change="addPic6"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList6&&fileList6.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="外观墙面图">
          <a-upload
            name="file"
            :multiple="true"
            action="/api/addBatchPriceAdjustDetails"
            list-type="picture"
            :file-list="fileList7"
			:before-upload="beforeUpload7"
            v-decorator="['imageUrl7']"
            @change="addPic7"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList7&&fileList7.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="平面/立体图">
          <a-upload
            name="file"
            :multiple="true"
            action="/api/addBatchPriceAdjustDetails"
            list-type="picture"
            :file-list="fileList8"
			:before-upload="beforeUpload8"
            v-decorator="['imageUrl8']"
            @change="addPic8"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList8&&fileList8.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="电力图">
          <a-upload
            name="file"
            :multiple="true"
            action="/api/addBatchPriceAdjustDetails"
            list-type="picture"
            :file-list="fileList9"
			:before-upload="beforeUpload9"
            v-decorator="['imageUrl9']"
            @change="addPic9"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList9&&fileList9.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="空调图">
          <a-upload
            name="file"
            :multiple="true"
            action="/api/addBatchPriceAdjustDetails"
            list-type="picture"
            :file-list="fileList10"
			:before-upload="beforeUpload10"
            v-decorator="['imageUrl10']"
            @change="addPic10"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList10&&fileList10.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="给排水图">
          <a-upload
            name="file"
            :multiple="true"
            action="/api/addBatchPriceAdjustDetails"
            list-type="picture"
            :file-list="fileList11"
			:before-upload="beforeUpload11"
            v-decorator="['imageUrl11']"
            @change="addPic11"
            @preview="onPreview"
            class="upload-list-inline"
          >
            <a-button v-if="fileList11&&fileList11.length<5">
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-item>
		<a-form-item label="消防图">
		  <a-upload
		    name="file"
		    :multiple="true"
		    action="/api/addBatchPriceAdjustDetails"
		    list-type="picture"
		    :file-list="fileList12"
			:before-upload="beforeUpload12"
		    v-decorator="['imageUrl12']"
		    @change="addPic12"
        @preview="onPreview"
		    class="upload-list-inline"
		  >
		    <a-button v-if="fileList12&&fileList12.length<5">
		      <a-icon type="upload" />上传文件
		    </a-button>
		  </a-upload>
		</a-form-item>
		<a-form-item label="其他图纸">
		  <a-upload
		    name="file"
		    :multiple="true"
		    action="/api/addBatchPriceAdjustDetails"
		    list-type="picture"
		    :file-list="fileList13"
			:before-upload="beforeUpload13"
		    v-decorator="['imageUrl13']"
		    @change="addPic13"
        @preview="onPreview"
		    class="upload-list-inline"
		  >
		    <a-button v-if="fileList13&&fileList13.length<5">
		      <a-icon type="upload" />上传文件
		    </a-button>
		  </a-upload>
		</a-form-item>
      </a-form>
    </div>

    <div class="content-footer">
      <a-button
        type="primary"
        style="width: 120px;"
        :loading="btnLoading"
        @click="onSubmit"
        :disabled="commitBtn"
      >保存</a-button>
      <a-button 
      type="primary" 
      style="width: 120px;" 
      :loading="btnLoading" 
      @click="onCommit" 
      :disabled='!(!this.decorationBtn ? this.spaceName && this.ownerInfo && this.decorationDateStr !="" 
        : this.spaceName && this.ownerInfo && this.decorationDateStr !="" && this.fileList1.length 
        && this.fileList2.length && this.fileList3.length && this.fileList4.length)'
      >
      提交</a-button>
    </div>

    <!-- 选择房屋 -->
    <!-- <a-modal
      v-model="visible"
      :centered="true"
      :maskClosable="false"
      title="选择房屋"
      width="960"
      @cancel="onCancel"
    >
      <template slot="footer">
        <a-button key="back" @click="onCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="onConfirm">确定</a-button>
      </template>
      <a-input-search
        style="width:200px;margin:23px 10px 10px 10px;"
        :loading="houseLoading"
        placeholder="请输入房屋"
        @change="onHouseSearch"
      />
      <a-list
        size="small"
        :split="false"
        :data-source="houseList"
        style="height:calc(100% - 85px);overflow: auto"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="item"
          :class="{active:spaceId == item.id}"
          @click="onHouseChange(item.id)"
          style="width: 100%;height:40px;padding:0 15px;"
        >{{ item.blockName }}{{ item.buildingName }}{{ item.roomName }}</a-list-item>
      </a-list>
    </a-modal>-->

    <a-modal
      v-model="visible"
      :centered="true"
      :maskClosable="false"
      title="选择房屋"
      width="900px"
      @cancel="onCancel"
    >
      <template slot="footer">
        <a-button key="back" @click="onCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="onConfirm">确定</a-button>
      </template>

      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-row :gutter="24"  type="flex">
          <a-col :span="8">
            <a-form-item label="期">
              <a-select v-model="period" placeholder="请选择期" @change="indexPeriodSelect01($event)">
                <a-select-option v-for="(item,key) in periodOption" :value="item.id" :key="key">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="楼栋">
              <a-select
                v-model="buildingId"
                placeholder="请选择楼栋"
                @change="indexBuildingSelect01($event)"
              >
                <a-select-option v-for="(item,key) in buildingOption" :value="item.id"  :key="key">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="房屋">
              <a-input v-model="rooming"  />
            </a-form-item>
          </a-col>
          <a-col :span="2">
            <a-form-item>
              <a-button type="primary" htmlType="button" @click="onQuery">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-radio-group v-model="handleQuery" @change="getRadioVal" class="radio-wrap"> 
        <a-radio
          style="margin-bottom:5px"
          v-for="item in onQueryResult"
          :key="item.name"
          :value="item.id"                 
        >{{ item.name }}</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex";
import { LOCATION } from "@/constance";
import moment from "moment";
import { debounce } from "@/utils/util";
import richTextLike from "@/components/richTextLike";
import vTransfer from "@/components/transfer";
import AFormItem from "ant-design-vue/es/form/FormItem";

export default {
  name: "decorateManagementAdd",
  components: { AFormItem, richTextLike, vTransfer },
  props: {
    id: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
	 //项目，业主是否可以编辑
	 optionDisabled:true,
	 //房屋 是否可以选择
	 houseFlg:false,
	 //选中的房屋	
	 spaceIdSelected: "",
	 spaceNameSelected: "",
      form: this.$form.createForm(this, { name: "form" }),
	  loading: false,
      dateFormat: "YYYY-MM-DD",
      visible: false,
      decorationBtn: true,
      typeId: 0,
      mockData: [],
      targetKeys: [],
      oriTargetKeys: [],
      checkAll: false,
      indeterminate: false,
      total: "",
      //图片
      previewVisible: false,

      previewImage: "",

      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      fileList6: [],
      fileList7: [],
      fileList8: [],
      fileList9: [],
      fileList10: [],
      fileList11: [],
	  fileList12: [],
	  fileList13: [],
	  
	  beforeUpload5Count: 0,
	  beforeUpload6Count: 0,
	  beforeUpload7Count: 0,
	  beforeUpload8Count: 0,
	  beforeUpload9Count: 0,
	  beforeUpload10Count: 0,
	  beforeUpload11Count: 0,
	  beforeUpload12Count: 0,
	  beforeUpload13Count: 0,
	  
	  beforeUpload5CountFlag: true,
	  beforeUpload6CountFlag: true,
	  beforeUpload7CountFlag: true,
	  beforeUpload8CountFlag: true,
	  beforeUpload9CountFlag: true,
	  beforeUpload10CountFlag: true,
	  beforeUpload11CountFlag: true,
	  beforeUpload12CountFlag: true,
	  beforeUpload13CountFlag: true,

      picUploading1: false,
      picUploading2: false,
      picUploading3: false,
      picUploading4: false,

      btnLoading: false,
      //
      projectId: "",
      projectData: [],
      engineeringOptions: [],
      electricalOptions: [],
      engineeringlist: [], //土建部分
      electricallist: [], //电器部分
      userId:"",
      ownerInfo: "",
      ownerInfoData: [],//业主部分
      periodOption: [], //期
      buildingOption: [], //
      decorationDateStr:"",
      period: "",
      periodName: "",
      buildingId: "",
      buildingName: "",
      rooming: "",
      onQueryResult: [], //查询结果
      handleQuery: "",
      houseLoading: "",
      houseList: [],
      spaceId: "",
      spaceName: "",
      applicationId: "",
      entrustFlag: "1",
      commitBtn: false,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.applicationId = this.$route.params.id;
    this.getProjectList();
    this.getEngineeringOptions();
    this.getElectricalOptions();
    this.getData();
  },
  methods: {
    moment,
    ...mapActions(["FALLBACK"]),
    decorationDateChange(date,dateString){
      this.decorationDateStr = date;
    },
    getCurrentData() {
      return new Date().toLocaleDateString();
    },
	
	back(){
		// this.$router.go(-1);		
		this.$confirm({
		  title: "提示",
		  content: "是否保存该装修申请？",
		  onOk:()=> {
			  this.onSubmit();
		  },
		  onCancel:()=> {
			 this.$router.go(-1);
		  },
		});
	},
	
    //
    //验证正则只能输入数字
    checkData(rule, value, callback) {
      if (value == undefined) {
        callback();
        return;
      } else {
        var phone = value.replace(/\s/g, ""); //去除空格
        //校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、176~178。14号段为上网卡专属号段
        let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
        if (!regs.test(phone)) {
          callback([new Error("手机号输入不合法")]);
        } else {
          callback();
        }
      }
    },
    disabledDate(current) {
      return !(        
        current > moment().startOf("day") && current < moment().add(3, "month")
      );
    },
    //
    onChange(e) {
      //
      console.log(e.target.value);
      if (e.target.value == 1) {
        this.decorationBtn = true;
      } else {
        this.decorationBtn = false;
      }
    },
    onChangeEngineering(e) {
      console.log(JSON.stringify(e));
    },
    onChangeElectrical(e) {
      console.log(JSON.stringify(e));
    },
    //
    onProjectChange(e) {
      this.projectId = e;
      let obj = {};
      console.log(this.projectData);
      obj = this.projectData.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.id === e; //筛选出匹配数据
      });
      this.projectId = obj.id;
      this.projectName = obj.name;
      this.spaceId = "";
      this.spaceName="";
      this.ownerInfoData = [];
      this.form.setFieldsValue({
          ownerInfo: ""
      });
    },
    //图片上传//OK
    addPic1({ fileList }) {
      if (this.fileList1.length > 0) {
        const that = this;
        that.$confirm({
          title: "删除图片",
          content: "确定删除图片吗？",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            that.fileList1 = [];
            that.form.setFieldsValue({
              imageUrl1: ""
            });
          }
        });
      } else {
        debounce(() => {
          const isJpgOrPng =
            fileList[0].type === "image/jpeg" ||
            fileList[0].type === "image/png";
          if (!isJpgOrPng) {
            this.$message.error("图片格式错误，请重新上传");
          } else {
            const imgSize = fileList[0].size / 1024 / 1024 < 5;
            if (!imgSize) {
              this.$message.error(
                "您上传的图片超过最大5M限定，请重新选择图片"
              );
            } else {
              this.picUploading1 = true;
              const formData = new FormData();
              fileList.forEach((file, index) => {
                formData.append("file" + index, file.originFileObj);
              });
              api["uploadDecorateImagePic"](formData)
                .then(res => {
                  if (res.code === 200) {
                    console.log(res.data);
                    this.fileList1[0] = {
                      uid: "-1",
                      fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url,
                      fileId: res.data.fileId, 
					            thumbUrl: res.data.url,
                    };
                  }
                })
                .finally(() => {
                  this.picUploading1 = false;
                });
            }
          }
        });
      }
    },
    addPic2({ fileList }) {
      if (this.fileList2.length > 0) {
        const that = this;
        that.$confirm({
          title: "删除图片",
          content: "确定删除图片吗？",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            that.fileList2 = [];
            that.form.setFieldsValue({
              imageUrl2: ""
            });
          }
        });
      } else {
        debounce(() => {
          const isJpgOrPng =
            fileList[0].type === "image/jpeg" ||
            fileList[0].type === "image/png";
          if (!isJpgOrPng) {
            this.$message.error("图片格式错误，请重新上传");
          } else {
            const imgSize = fileList[0].size / 1024 / 1024 < 5;
            if (!imgSize) {
              this.$message.error(
                "您上传的图片超过最大5M限定，请重新选择图片"
              );
            } else {
              this.picUploading2 = true;
              const formData = new FormData();
              fileList.forEach((file, index) => {
                formData.append("file" + index, file.originFileObj);
              });
              api["uploadDecorateImagePic"](formData)
                .then(res => {
                  if (res.code === 200) {
                    this.fileList2[0] = {
                      uid: "-1",
                      fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url,
                      fileId: res.data.fileId, 
					            thumbUrl: res.data.url,
                    };
                  }
                })
                .finally(() => {
                  this.picUploading2 = false;
                });
            }
          }
        });
      }
    },
    addPic3({ fileList }) {
      if (this.fileList3.length > 0) {
        const that = this;
        that.$confirm({
          title: "删除图片",
          content: "确定删除图片吗？",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            that.fileList3 = [];
            that.form.setFieldsValue({
              imageUrl3: ""
            });
          }
        });
      } else {
        debounce(() => {
          const isJpgOrPng =
            fileList[0].type === "image/jpeg" ||
            fileList[0].type === "image/png";
          if (!isJpgOrPng) {
            this.$message.error("图片格式错误，请重新上传");
          } else {
            const imgSize = fileList[0].size / 1024 / 1024 < 5;
            if (!imgSize) {
              this.$message.error(
                "您上传的图片超过最大5M限定，请重新选择图片"
              );
            } else {
              this.picUploading3 = true;
              const formData = new FormData();
              fileList.forEach((file, index) => {
                formData.append("file" + index, file.originFileObj);
              });
              console.log(formData);
              api["uploadDecorateImagePic"](formData)
                .then(res => {
                  if (res.code === 200) {
                    this.fileList3[0] = {
                      uid: "-1",
                      fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url,
                      fileId: res.data.fileId, 
					            thumbUrl: res.data.url,
                    };
                  }
                })
                .finally(() => {
                  this.picUploading3 = false;
                });
            }
          }
        });
      }
    },
    addPic4({ fileList }) {
      if (this.fileList4.length > 0) {
        const that = this;
        that.$confirm({
          title: "删除图片",
          content: "确定删除图片吗？",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            that.fileList4 = [];
            that.form.setFieldsValue({
              imageUrl4: ""
            });
          }
        });
      } else {
        debounce(() => {
          const isJpgOrPng =
            fileList[0].type === "image/jpeg" ||
            fileList[0].type === "image/png";
          if (!isJpgOrPng) {
            this.$message.error("图片格式错误，请重新上传");
          } else {
            const imgSize = fileList[0].size / 1024 / 1024 < 5;
            if (!imgSize) {
              this.$message.error(
                "您上传的图片超过最大5M限定，请重新选择图片"
              );
            } else {
              this.picUploading4 = true;
              const formData = new FormData();
              fileList.forEach((file, index) => {
                formData.append("file" + index, file.originFileObj);
              });
              api["uploadDecorateImagePic"](formData)
                .then(res => {
                  if (res.code === 200) {
                    this.fileList4[0] = {
                      uid: "-1",
                      fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url,
                      fileId: res.data.fileId, 
					            thumbUrl: res.data.url,
                    };
                  }
                })
                .finally(() => {
                  this.picUploading4 = false;
                });
            }
          }
        });
      }
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    addPic5(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList5.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList5 = newFile;
		this.beforeUpload5Count = this.fileList5.length;
        return;
      }
      const fileList = file.fileList;

      // if (this.fileList5.length > 4) {
      //     this.$message.error('图片最多上传5张');
      // } else 

	  if (this.beforeUpload5Count <= 5) {
        const isJpgOrPng =
          file.file.type === "image/jpeg" || file.file.type === "image/png";
        if (!isJpgOrPng) {
          this.$message.error("图片格式错误，请重新上传");
        } else {
          const imgSize = file.file.size / 1024 / 1024 < 5;
          if (!imgSize) {
            this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
          } else {
            this.picUploading = true;
            const formData = new FormData();
            formData.append("file", file.file.originFileObj);

            api["uploadDecorateImagePic"](formData)
              .then(res => {
                if (res.code === 200) {
                  this.fileList5.push({
                    uid: this.uuid(),
                    fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                  });
				  this.beforeUpload5Count = this.fileList5.length;
                  this.$set(this.fileList5, this.fileList5);
                }
              })
              .finally(() => {
                this.picUploading = false;
              });
           }
        }
      }
    },
    addPic6(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList6.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList6 = newFile;
		this.beforeUpload6Count = this.fileList6.length;
        return;
      }
      const fileList = file.fileList;
      if (this.beforeUpload6Count <= 5) {
        const isJpgOrPng =
          file.file.type === "image/jpeg" || file.file.type === "image/png";
        if (!isJpgOrPng) {
          this.$message.error("图片格式错误，请重新上传");
        } else {
          const imgSize = file.file.size / 1024 / 1024 < 5;
          if (!imgSize) {
            this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
          } else {
            this.picUploading = true;
            const formData = new FormData();
            formData.append("file", file.file.originFileObj);
            api["uploadDecorateImagePic"](formData)
              .then(res => {
                if (res.code === 200) {
                  this.fileList6.push({
                    uid: this.uuid(),
                    fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                  });
				  this.beforeUpload6Count = this.fileList6.length;
                  this.$set(this.fileList6, this.fileList6);
                }
              })
              .finally(() => {
                this.picUploading = false;
              });
          }
        }
      }
    },
    addPic7(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList7.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList7 = newFile;
		this.beforeUpload7Count = this.fileList7.length;
        return;
      }
      const fileList = file.fileList;
      if (this.beforeUpload7Count <= 5) {
        const isJpgOrPng =
        file.file.type === "image/jpeg" || file.file.type === "image/png";
        if (!isJpgOrPng) {
          this.$message.error("图片格式错误，请重新上传");
        } else {
          const imgSize = file.file.size / 1024 / 1024 < 5;
          if (!imgSize) {
            this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
          } else {
            this.picUploading = true;
            const formData = new FormData();
            formData.append("file", file.file.originFileObj);

            api["uploadDecorateImagePic"](formData)
              .then(res => {
                if (res.code === 200) {
                  this.fileList7.push({
                    uid: this.uuid(),
                    fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                  });
				  this.beforeUpload7Count = this.fileList7.length;
                  this.$set(this.fileList7, this.fileList7);
                }
              })
              .finally(() => {
                this.picUploading = false;
              });
          }
        }
      }

    },
    addPic8(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList8.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList8 = newFile;
		this.beforeUpload8Count = this.fileList8.length;
        return;
      }
      const fileList = file.fileList;
      if (this.beforeUpload8Count <= 5) {
        const isJpgOrPng =
        file.file.type === "image/jpeg" || file.file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("图片格式错误，请重新上传");
      } else {
        const imgSize = file.file.size / 1024 / 1024 < 5;
        if (!imgSize) {
          this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
        } else {
          this.picUploading = true;
          const formData = new FormData();
          formData.append("file", file.file.originFileObj);

          api["uploadDecorateImagePic"](formData)
            .then(res => {
              if (res.code === 200) {
                this.fileList8.push({
                  uid: this.uuid(),
                  fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                });
				this.beforeUpload8Count = this.fileList8.length;
                this.$set(this.fileList8, this.fileList8);
              }
            })
            .finally(() => {
              this.picUploading = false;
            });
        }
       }
      }

    },
    addPic9(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList9.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList9 = newFile;
		this.beforeUpload9Count = this.fileList9.length;
        return;
      }
      const fileList = file.fileList;
      if (this.beforeUpload9Count <= 5) {
        const isJpgOrPng =
        file.file.type === "image/jpeg" || file.file.type === "image/png";
        if (!isJpgOrPng) {
        this.$message.error("图片格式错误，请重新上传");
        } else {
        const imgSize = file.file.size / 1024 / 1024 < 5;
        if (!imgSize) {
          this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
        } else {
          this.picUploading = true;
          const formData = new FormData();
          formData.append("file", file.file.originFileObj);

          api["uploadDecorateImagePic"](formData)
            .then(res => {
              if (res.code === 200) {
                this.fileList9.push({
                  uid: this.uuid(),
                  fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                });
				this.beforeUpload9Count = this.fileList9.length;
                this.$set(this.fileList9, this.fileList9);
              }
            })
            .finally(() => {
              this.picUploading = false;
            });
        }
        }
      }

    },
    addPic10(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList10.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList10 = newFile;
		this.beforeUpload10Count = this.fileList10.length;
        return;
      }
      const fileList = file.fileList;
      if (this.beforeUpload10Count <= 5) {
        const isJpgOrPng =
          file.file.type === "image/jpeg" || file.file.type === "image/png";
        if (!isJpgOrPng) {
        this.$message.error("图片格式错误，请重新上传");
        } else {
        const imgSize = file.file.size / 1024 / 1024 < 5;
        if (!imgSize) {
          this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
        } else {
          this.picUploading = true;
          const formData = new FormData();
          formData.append("file", file.file.originFileObj);

          api["uploadDecorateImagePic"](formData)
            .then(res => {
              if (res.code === 200) {
                this.fileList10.push({
                  uid: this.uuid(),
                  fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                });
				this.beforeUpload10Count = this.fileList10.length;
                this.$set(this.fileList10, this.fileList10);
              }
            })
            .finally(() => {
              this.picUploading = false;
            });
        }
        }
      }
    },
    addPic11(file) {
      if (file.file.status === "removed") {
        const newFile = this.fileList11.filter(item => {
          return item.uid != file.file.uid;
        });
        this.fileList11 = newFile;
		this.beforeUpload11Count = this.fileList11.length;
        return;
      }
      const fileList = file.fileList;
      if (this.beforeUpload11Count <= 5) {
        const isJpgOrPng =
          file.file.type === "image/jpeg" || file.file.type === "image/png";
        if (!isJpgOrPng) {
          this.$message.error("图片格式错误，请重新上传");
        } else {
          const imgSize = file.file.size / 1024 / 1024 < 5;
          if (!imgSize) {
            this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
          } else {
            this.picUploading = true;
            const formData = new FormData();
            formData.append("file", file.file.originFileObj);

            api["uploadDecorateImagePic"](formData)
              .then(res => {
                if (res.code === 200) {
                  this.fileList11.push({
                    uid: this.uuid(),
                   fileName: res.data.fileName,
                      fileSize: res.data.fileSize,
                      documentId: res.data.documentId,
                      fileExt: res.data.fileExt,
                      url: res.data.url ? res.data.url : "",
                      fileId: res.data.fileId,  
                  });
				  this.beforeUpload11Count = this.fileList11.length;
                  this.$set(this.fileList11, this.fileList11);
              }
            })
            .finally(() => {
              this.picUploading = false;
            });
          }
        }
      }

    },
	addPic12(file) {
	  if (file.file.status === "removed") {
	    const newFile = this.fileList12.filter(item => {
	      return item.uid != file.file.uid;
	    });
	    this.fileList12 = newFile;
		this.beforeUpload12Count = this.fileList12.length;
	    return;
	  }
	  const fileList = file.fileList;
	  if (this.beforeUpload12Count <= 5) {
	    const isJpgOrPng =
	      file.file.type === "image/jpeg" || file.file.type === "image/png";
	    if (!isJpgOrPng) {
	      this.$message.error("图片格式错误，请重新上传");
	    } else {
	      const imgSize = file.file.size / 1024 / 1024 < 5;
	      if (!imgSize) {
	        this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
	      } else {
	        this.picUploading = true;
	        const formData = new FormData();
	        formData.append("file", file.file.originFileObj);
	
	        api["uploadDecorateImagePic"](formData)
	          .then(res => {
	            if (res.code === 200) {
	              this.fileList12.push({
	                uid: this.uuid(),
	               fileName: res.data.fileName,
	                  fileSize: res.data.fileSize,
	                  documentId: res.data.documentId,
	                  fileExt: res.data.fileExt,
	                  url: res.data.url ? res.data.url : "",
	                  fileId: res.data.fileId,  
	              });
				  this.beforeUpload12Count = this.fileList12.length;
	              this.$set(this.fileList12, this.fileList12);
	          }
	        })
	        .finally(() => {
	          this.picUploading = false;
	        });
	      }
	    }
	  }
	
	},
	addPic13(file) {
	  if (file.file.status === "removed") {
	    const newFile = this.fileList13.filter(item => {
	      return item.uid != file.file.uid;
	    });
	    this.fileList13 = newFile;
		this.beforeUpload13Count = this.fileList13.length;
	    return;
	  }
	  const fileList = file.fileList;
	  if (this.beforeUpload13Count <= 5) {
	    const isJpgOrPng =
	      file.file.type === "image/jpeg" || file.file.type === "image/png";
	    if (!isJpgOrPng) {
	      this.$message.error("图片格式错误，请重新上传");
	    } else {
	      const imgSize = file.file.size / 1024 / 1024 < 5;
	      if (!imgSize) {
	        this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
	      } else {
	        this.picUploading = true;
	        const formData = new FormData();
	        formData.append("file", file.file.originFileObj);
	
	        api["uploadDecorateImagePic"](formData)
	          .then(res => {
	            if (res.code === 200) {
	              this.fileList13.push({
	                uid: this.uuid(),
	               fileName: res.data.fileName,
	                  fileSize: res.data.fileSize,
	                  documentId: res.data.documentId,
	                  fileExt: res.data.fileExt,
	                  url: res.data.url ? res.data.url : "",
	                  fileId: res.data.fileId,  
	              });
				  this.beforeUpload13Count = this.fileList13.length;
	              this.$set(this.fileList13, this.fileList13);
	          }
	        })
	        .finally(() => {
	          this.picUploading = false;
	        });
	      }
	    }
	  }
	
  },
  beforeUpload(file) {
		return new Promise((resolve, reject) => {
      const isJpgOrPng =
            file.type === "image/jpeg" ||
            file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("图片格式错误，请重新上传");
        return reject(false);
      }
      const imgSize = file.size / 1024 / 1024 < 5;
      if (!imgSize) {
        this.$message.error("您上传的图片超过最大5M限定，请重新选择图片");
        return reject(false);
      }
      return resolve(true);
		});
  },
	beforeUpload5(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload5Count >= 5) {
				if (this.beforeUpload5CountFlag) {
					this.beforeUpload5CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload5CountFlag = true;
			}
			this.beforeUpload5Count = this.beforeUpload5Count + 1;
			return resolve(true);
		});
	},
	beforeUpload6(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload6Count >= 5) {
				if (this.beforeUpload6CountFlag) {
					this.beforeUpload6CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload6CountFlag = true;
			}
			this.beforeUpload6Count = this.beforeUpload6Count + 1;
			return resolve(true);
		});
	},
	beforeUpload7(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload7Count >= 5) {
				if (this.beforeUpload7CountFlag) {
					this.beforeUpload7CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload7CountFlag = true;
			}
			this.beforeUpload7Count = this.beforeUpload7Count + 1;
			return resolve(true);
		});
	},
	beforeUpload8(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload8Count >= 5) {
				if (this.beforeUpload8CountFlag) {
					this.beforeUpload8CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload8CountFlag = true;
			}
			this.beforeUpload8Count = this.beforeUpload8Count + 1;
			return resolve(true);
		});
	},
	beforeUpload9(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload9Count >= 5) {
				if (this.beforeUpload9CountFlag) {
					this.beforeUpload9CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload9CountFlag = true;
			}
			this.beforeUpload9Count = this.beforeUpload9Count + 1;
			return resolve(true);
		});
	},
	beforeUpload10(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload10Count >= 5) {
				if (this.beforeUpload10CountFlag) {
					this.beforeUpload10CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload10CountFlag = true;
			}
			this.beforeUpload10Count = this.beforeUpload10Count + 1;
			return resolve(true);
		});
	},
	beforeUpload11(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload11Count >= 5) {
				if (this.beforeUpload11CountFlag) {
					this.beforeUpload11CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload11CountFlag = true;
			}
			this.beforeUpload11Count = this.beforeUpload11Count + 1;
			return resolve(true);
		});
	},
	beforeUpload12(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload12Count >= 5) {
				if (this.beforeUpload12CountFlag) {
					this.beforeUpload12CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload12CountFlag = true;
			}
			this.beforeUpload12Count = this.beforeUpload12Count + 1;
			return resolve(true);
		});
	},
	beforeUpload13(file) {
		return new Promise((resolve, reject) => {
			if (this.beforeUpload13Count >= 5) {
				if (this.beforeUpload13CountFlag) {
					this.beforeUpload13CountFlag = false;
					this.$message.error("最多上传5张图片");
				}
				return reject(false);
			} else {
				this.beforeUpload13CountFlag = true;
			}
			this.beforeUpload13Count = this.beforeUpload13Count + 1;
			return resolve(true);
		});
	},
    handleCancel() {
      this.previewVisible = false;
    },

    handleCancel5() {
      this.previewVisible5 = false;
    },
    handleCancel6() {
      this.previewVisible6 = false;
    },
    handleCancel7() {
      this.previewVisible7 = false;
    },
    

    //图片预览
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async handlePreview(file) {
       console.log(file)
       this.previewImage = file.thumbUrl;
       this.previewVisible = true;
     },
    async onPreview(file) {
      console.log(file)
      this.previewImage = file.url;
      this.previewVisible = true;
    },
    //选择房屋//
    chooseHouse() {
      console.log(this.projectId);
      if (this.projectId == "") {
        return this.$message.error("请选择项目");
      }
      this.visible = true;
      this.periodOption=[];
      this.buildingOption=[];     
      this.onQueryResult=[];
      this.rooming="";
      this.period = "";
      this.periodName="";
      this.buildingId = "";
      this.buildingName ="";
	  //点击"选择房屋"时，spaceId spaceName不应该置空 ，可能点击 选择房屋 右上角关闭，"取消"
      //this.spaceId = "",
      //this.spaceName = "",
      this.ownerInfo = [],
      this.form.setFieldsValue({
          ownerInfo: ""
      });
      this.spaceSelect();
    },

    //房屋查询//TODO
    onHouseSearch(e) {
      const value = e.target.value;
      console.log(this.projectId);
      // const para = {
      //   projectId: this.projectId,
      //   pageIndex: 1,
      //   pageSize: 10
      // };
      // api.getDecorationSpaceingList(para).then(res => {
      //   if (res.code === 200) {
      //     this.houseList = res.data.records;
      //     console.log(res.data);
      //   }
      // });
    },
    //房屋Changes//TODO
    onHouseChange(value) {
      this.spaceId = value;
      let obj = {};
      obj = this.houseList.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      console.log(obj.blockName);
      console.log(obj.buildingName);
      console.log(obj.roomName);
      this.spaceName = obj.blockName + obj.buildingName + obj.roomName;
    },
    //查询
    onQuery() {
      //
      const para = {
        projectId: this.projectId,
        projectName:this.projectName,
        period:this.period,
        periodName: this.periodName,
        buildingId: this.buildingId,
        buildingName: this.buildingName,
        rooming: this.rooming
      };
      console.log(para);
      api.getDecorationSpaceingList(para).then(res => {
        if (res.code === 200) {
          this.onQueryResult = res.data;
          console.log(res.data);
          if (this.onQueryResult.length == 0) {
            this.$message.error("暂无房间");
          }
        }
      });
    },
    onCheckOwnerInfoChange: function(value) {
      let obj = {};
      obj = this.ownerInfoData.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.name === value; //筛选出匹配数据
      });
      this.userId = obj.id;
      this.ownerInfo = obj.name;
      console.log(this.ownerInfo);
    },
    spaceSelect() {
      const para = {
        pid: this.projectId
      };
      api.getDecorationSpaceingHouseList(para).then(res => {
        if (res.code === 200) {
          console.log(res.data);

          this.periodOption = res.data;
          console.log(res.data);
        }
      });
    },
    indexPeriodSelect01: function(value) {
      let obj = {};
      obj = this.periodOption.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      this.period = obj.id;
      this.periodName = obj.name;
      this.getBuildingOption(obj.id);
    },
    getBuildingOption(value) {
      const para = {
        pid: value
      };
      api.getDecorationSpaceingHouseList(para).then(res => {
        if (res.code === 200) {
          console.log(res.data);
          this.buildingOption = res.data;
        }
      });
    },
    indexBuildingSelect01: function(value) {
      let obj = {};
      obj = this.buildingOption.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      this.buildingId = obj.id;
      this.buildingName = obj.name;
      //this.getBuildingOption(obj.id)
    },

    getRadioVal(e) {
      console.log(e.target.value);
      let obj = {};
      console.log(this.onQueryResult);
      obj = this.onQueryResult.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.id === e.target.value; //筛选出匹配数据
      });
      // this.spaceId = obj.id;
      // this.spaceName = obj.name;
      // console.log(this.spaceId);
      // console.log(this.spaceName);
	  this.spaceIdSelected = obj.id;
	  this.spaceNameSelected = obj.name;
    },
    //确定按钮
    onConfirm(e) {
	  this.spaceId = this.spaceIdSelected;
	  this.spaceName = this.spaceNameSelected;
	  
      this.visible = false;
      //空间下的业主列表
      const para = {
        personTypes: 1,
        roomId: this.spaceId
      };
      api.getDecorationOwnInfoList(para).then(res => {
        if (res.code === 200) {
          console.log(res.data);
          const newArr = res.data.map(item => ({
              id: item.custId,
              name: item.custName+" "+item.phone,
            }));
          this.ownerInfoData = newArr;
        }
      });
    },
    //取消按钮
    onCancel() {
      this.visible = false;
      // this.targetKeys = this.oriTargetKeys;
      // this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
      // this.checkAll = this.targetKeys.length === this.total;
      // this.form.setFieldsValue({
      //   id: this.targetKeys
      // });
    },
    //获取详情
    getData() {
		// 新建/申请待提交时  项目 房屋 业主可以编辑
		if(!this.applicationId){
			this.optionDisabled=false;
			this.houseFlg=true;
		}
		
      console.log(this.id);
      if (this.applicationId) {
        api
          .getDecorateApplyDetail({ applicationId: this.applicationId })
          .then(res => {
            if (res.code === 200) {
              const data = res.data;
              console.log(data);
			  // 新建/申请待提交时  项目 房屋 业主可以编辑
			  if(data.decorationStatus == "01"){
			  	this.optionDisabled=false;
			  	this.houseFlg=true;
			   }
			  
              //保存按钮
              if (data.decorationStatus != "01") {
                this.commitBtn = true;
              }
              this.projectId = res.data.projectId;
              this.projectName = res.data.projectName;
              if (res.data.identityCardFace) {
                this.fileList1.push({
                    uid: "-1",
                    fileName: res.data.identityCardFace.fileName,
	                  fileSize: res.data.identityCardFace.fileSize,
	                  documentId: res.data.identityCardFace.documentId,
	                  fileExt: res.data.identityCardFace.fileExt,
	                  url: res.data.identityCardFace.url,
                    fileId: res.data.identityCardFace.fileId, 
					          thumbUrl: res.data.identityCardFace.url,
                }); //图片
                this.form.setFieldsValue({
                  fileList1: {
                    uid: "-1",
                    fileName: res.data.identityCardFace.fileName,
	                  fileSize: res.data.identityCardFace.fileSize,
	                  documentId: res.data.identityCardFace.documentId,
	                  fileExt: res.data.identityCardFace.fileExt,
	                  url: res.data.identityCardFace.url ? res.data.identityCardFace.url : "",
                    fileId: res.data.identityCardFace.fileId, 
                  }
                })
              }
              if (res.data.identityCardBack) {
                this.fileList2.push({
                  uid: "-1",
                  fileName: res.data.identityCardBack.fileName,
	                  fileSize: res.data.identityCardBack.fileSize,
	                  documentId: res.data.identityCardBack.documentId,
	                  fileExt: res.data.identityCardBack.fileExt,
	                  url: res.data.identityCardBack.url,
	                  fileId: res.data.identityCardBack.fileId, 
					          thumbUrl: res.data.identityCardBack.url,
                });
                this.form.setFieldsValue({
                  fileList2: {
                    uid: "-1",
                    fileName: res.data.identityCardBack.fileName,
	                  fileSize: res.data.identityCardBack.fileSize,
	                  documentId: res.data.identityCardBack.documentId,
	                  fileExt: res.data.identityCardBack.fileExt,
	                  url: res.data.identityCardBack.url ? res.data.identityCardBack.url : "",
	                  fileId: res.data.identityCardBack.fileId, 
                  }
                })
              }
              if (res.data.companyPhoto) {
                this.fileList3.push(
                  { uid: "-1", 
                    fileName: res.data.companyPhoto.fileName,
	                  fileSize: res.data.companyPhoto.fileSize,
	                  documentId: res.data.companyPhoto.documentId,
	                  fileExt: res.data.companyPhoto.fileExt,
	                  url: res.data.companyPhoto.url,
	                  fileId: res.data.companyPhoto.fileId, 
					          thumbUrl: res.data.companyPhoto.url,
                  });
                this.form.setFieldsValue({
                  fileList3: {
                  uid: "-1",
                  fileName: res.data.companyPhoto.fileName,
	                  fileSize: res.data.companyPhoto.fileSize,
	                  documentId: res.data.companyPhoto.documentId,
	                  fileExt: res.data.companyPhoto.fileExt,
	                  url: res.data.companyPhoto.url ? res.data.companyPhoto.url : "",
	                  fileId: res.data.companyPhoto.fileId, 
                 }
                })
              }
              if (res.data.certificatePhoto) {
                this.fileList4.push({
                  uid: "-1",
                  fileName: res.data.certificatePhoto.fileName,
	                  fileSize: res.data.certificatePhoto.fileSize,
	                  documentId: res.data.certificatePhoto.documentId,
	                  fileExt: res.data.certificatePhoto.fileExt,
	                  url: res.data.certificatePhoto.url,
	                  fileId: res.data.certificatePhoto.fileId, 
					          thumbUrl: res.data.certificatePhoto.url,
                });
                this.form.setFieldsValue({
                  fileList4: {
                  uid: "-1",
                  fileName: res.data.certificatePhoto.fileName,
	                  fileSize: res.data.certificatePhoto.fileSize,
	                  documentId: res.data.certificatePhoto.documentId,
	                  fileExt: res.data.certificatePhoto.fileExt,
	                  url: res.data.certificatePhoto.url ? res.data.certificatePhoto.url : "",
	                  fileId: res.data.certificatePhoto.fileId, 
                 }
                })
              }

              if (res.data.designImage) {
                console.log(res.data.designImage);

                var designImage = res.data.designImage;
                for (var i = 0; i < designImage.length; i++) {
                  this.fileList5.push({
                    uid: this.uuid(),
                    fileName: designImage[i].fileName,
	                  fileSize: designImage[i].fileSize,
	                  documentId: designImage[i].documentId,
	                  fileExt: designImage[i].fileExt,
	                  url: designImage[i].url ? designImage[i].url : "",
	                  fileId: designImage[i].fileId, 
                  });
                }
				if (this.fileList5.length && this.fileList5.length > 0) {
					this.beforeUpload5Count = this.fileList5.length;
				}
              }
              if (res.data.mainWallImage) {
                var mainWallImage = res.data.mainWallImage;
                for (var i = 0; i < mainWallImage.length; i++) {
                  this.fileList6.push({
                    uid: this.uuid(),
                    fileName: mainWallImage[i].fileName,
	                  fileSize: mainWallImage[i].fileSize,
	                  documentId: mainWallImage[i].documentId,
	                  fileExt: mainWallImage[i].fileExt,
	                  url: mainWallImage[i].url ? mainWallImage[i].url : "",
	                  fileId: mainWallImage[i].fileId, 
                  });
                }
				if (this.fileList6.length && this.fileList6.length > 0) {
					this.beforeUpload6Count = this.fileList6.length;
				}
              }
              if (res.data.exteriorWallImage) {
                var exteriorWallImage = res.data.exteriorWallImage;
                for (var i = 0; i < exteriorWallImage.length; i++) {
                  this.fileList7.push({
                    uid: this.uuid(),
                    fileName: exteriorWallImage[i].fileName,
	                  fileSize: exteriorWallImage[i].fileSize,
	                  documentId: exteriorWallImage[i].documentId,
	                  fileExt: exteriorWallImage[i].fileExt,
	                  url: exteriorWallImage[i].url ? exteriorWallImage[i].url : "",
	                  fileId: exteriorWallImage[i].fileId, 
                  });
                }
				if (this.fileList7.length && this.fileList7.length > 0) {
					this.beforeUpload7Count = this.fileList7.length;
				}
              }
              if (res.data.planeSolidImage) {
                var planeSolidImage = res.data.planeSolidImage;
                for (var i = 0; i < planeSolidImage.length; i++) {
                  this.fileList8.push({
                    uid: this.uuid(),
                    fileName: planeSolidImage[i].fileName,
	                  fileSize: planeSolidImage[i].fileSize,
	                  documentId: planeSolidImage[i].documentId,
	                  fileExt: planeSolidImage[i].fileExt,
	                  url: planeSolidImage[i].url ? planeSolidImage[i].url : "",
	                  fileId: planeSolidImage[i].fileId, 
                  });
                }
				if (this.fileList8.length && this.fileList8.length > 0) {
					this.beforeUpload8Count = this.fileList8.length;
				}
              }
              if (res.data.electricPowerImage) {
                var electricPowerImage = res.data.electricPowerImage;
                for (var i = 0; i < electricPowerImage.length; i++) {
                  this.fileList9.push({
                    uid: this.uuid(),
                    fileName: electricPowerImage[i].fileName,
	                  fileSize: electricPowerImage[i].fileSize,
	                  documentId: electricPowerImage[i].documentId,
	                  fileExt: electricPowerImage[i].fileExt,
	                  url: electricPowerImage[i].url ? electricPowerImage[i].url : "",
	                  fileId: electricPowerImage[i].fileId, 
                  });
                }
				if (this.fileList9.length && this.fileList9.length > 0) {
					this.beforeUpload9Count = this.fileList9.length;
				}
              }
              if (res.data.airConditionerImage) {
                var airConditionerImage = res.data.airConditionerImage;
                for (var i = 0; i < airConditionerImage.length; i++) {
                  this.fileList10.push({
                    uid: this.uuid(),
                    fileName: airConditionerImage[i].fileName,
	                  fileSize: airConditionerImage[i].fileSize,
	                  documentId: airConditionerImage[i].documentId,
	                  fileExt: airConditionerImage[i].fileExt,
	                  url: airConditionerImage[i].url ? airConditionerImage[i].url : "",
	                  fileId: airConditionerImage[i].fileId, 
                  });
                }
				if (this.fileList10.length && this.fileList10.length > 0) {
					this.beforeUpload10Count = this.fileList10.length;
				}
              }
              if (res.data.waterSupplyImage) {
                var waterSupplyImage = res.data.waterSupplyImage;
                for (var i = 0; i < waterSupplyImage.length; i++) {
                  this.fileList11.push({
	                  uid: this.uuid(),
	                  fileName: waterSupplyImage[i].fileName,
	                  fileSize: waterSupplyImage[i].fileSize,
	                  documentId: waterSupplyImage[i].documentId,
	                  fileExt: waterSupplyImage[i].fileExt,
	                  url: waterSupplyImage[i].url ?waterSupplyImage[i].url : "",
	                  fileId: waterSupplyImage[i].fileId,  
	               });
                }
				if (this.fileList11.length && this.fileList11.length > 0) {
					this.beforeUpload11Count = this.fileList11.length;
				}
              }
			  if (res.data.fireContrlImage) {
			    var fireContrlImage = res.data.fireContrlImage;
			    for (var i = 0; i < fireContrlImage.length; i++) {
			        this.fileList12.push({
	                uid: this.uuid(),
	                fileName: fireContrlImage[i].fileName,
	                fileSize: fireContrlImage[i].fileSize,
	                documentId: fireContrlImage[i].documentId,
	                fileExt: fireContrlImage[i].fileExt,
	                url: fireContrlImage[i].url ? fireContrlImage[i].url : "",
	                fileId: fireContrlImage[i].fileId,  
	            });
			    }
				if (this.fileList12.length && this.fileList12.length > 0) {
					this.beforeUpload12Count = this.fileList12.length;
				}
			  }
			  if (res.data.otherImage) {
			    var otherImage = res.data.otherImage;
			    for (var i = 0; i < otherImage.length; i++) {
            this.fileList13.push({
	                uid: this.uuid(),
	                fileName: otherImage[i].fileName,
	                fileSize: otherImage[i].fileSize,
	                documentId: otherImage[i].documentId,
	                fileExt: otherImage[i].fileExt,
	                url: otherImage[i].url ? otherImage[i].url : "",
	                fileId: otherImage[i].fileId,  
	          });
			    }
				if (this.fileList13.length && this.fileList13.length > 0) {
					this.beforeUpload13Count = this.fileList13.length;
				}
			  }
              //const entrustFlag = "0";
              if (data.entrustFlag) {
                this.entrustFlag = "1";
                this.decorationBtn = true;
              } else {
                this.entrustFlag = "0";
                this.decorationBtn = false;
              }
              //土建
              for (let m = 0; m < this.engineeringOptions.length; m++) {
                for (let i = 0; i < data.engineeringArr.length; i++) {
                  if (
                    this.engineeringOptions[m].codeId == data.engineeringArr[i]
                  ) {
                    this.engineeringOptions[m].checked = true;
                  }
                }
              }
              console.log();
              //电器
              for (let m = 0; m < this.electricalOptions.length; m++) {
                for (let i = 0; i < data.electricalArr.length; i++) {
                  if (
                    this.electricalOptions[m].codeId == data.electricalArr[i]
                  ) {
                    this.electricalOptions[m].checked = true;
                  }
                }
              }
              this.spaceId = data.spaceId;
              this.spaceName = data.spaceName;
              this.userId = data.userId;
              this.ownerInfo = data.ownerInfo;
              console.log(JSON.stringify(this.fileList1));

              this.decorationDateStr = data.decorationDateStart+"-"+data.decorationDateEnd;
              (this.engineeringlist = data.engineeringArr),
                (this.electricallist = data.electricalArr),
                this.$nextTick(() => {
                  this.form.setFieldsValue({
                    projectId: data.projectId, //项目id
                    projectName: data.projectName, //项目id
                    spaceId: data.spaceId, //房屋id
                    spaceName: data.spaceName, //房屋id
                    ownerInfo: data.ownerInfo, //业主//
                    decorationDate: [
                      moment(data.decorationDateStart).format("YYYY-MM-DD"),
                      moment(data.decorationDateEnd).format("YYYY-MM-DD")
                    ], //装修时间
                    //entrustFlag:data.entrustFlag,//是否
                    entrustFlag: Number(this.entrustFlag),
                    decorationCompany: data.decorationCompany,
                    decorationDirector: data.decorationDirector,
                    directorTel: data.directorTel,
                    // imageUrl1: data.identityCardFace.url , //图片url删除
                    // imageUrl2: data.identityCardBack,
                    // imageUrl3: data.companyPhoto,
                    // imageUrl4: data.certificatePhoto,
                    // imageUrl5: data.designImage,
                    // imageUrl6: data.mainWallImage,
                    // imageUrl7: data.exteriorWallImage,
                    // imageUrl8: data.planeSolidImage,
                    // imageUrl9: data.electricPowerImage,
                    // imageUrl10: data.airConditionerImage,
                    // imageUrl11: data.waterSupplyImage,
					          // imageUrl12: data.fireContrlImage,
					          // imageUrl13: data.otherImage,
                    engineeringlist: data.engineeringArr,
                    electricallist: data.electricalArr,
                    other: data.other
                  });
                });
              console.log(data);
            }
          });
      }
    },
    //获取工程列表
    getProjectList() {
      api.decorationPersonProject().then(res => {
        if (res.code === 200) {
          this.projectData = res.data;
        }
      });
    },
    getEngineeringOptions() {
      const para = {
        parentId: 5
      };
      api.getDeCommonCodeList(para).then(res => {
        if (res.code === 200) {
          this.engineeringOptions = res.data.list;
        }
      });
    },
    getElectricalOptions() {
      const para = {
        parentId: 6
      };
      api.getDeCommonCodeList(para).then(res => {
        if (res.code === 200) {
          this.electricalOptions = res.data.list;
        }
      });
    },

    //保存
    onSubmit(e) {
		if(e){
			e.preventDefault();
		}
      var _this = this;
      if(!_this.spaceName){
        _this.$message.error("房屋不能为空");
        return
      }
      if(_this.ownerInfo == ""){
        _this.$message.error("业主不能为空");
        return
      }
      if(_this.decorationDateStr == ""){
        _this.$message.error("装修日期不能为空");
        return
      }
      if(this.decorationBtn == true && (_this.fileList1.length < 1 || _this.fileList2.length < 1)){
        _this.$message.error("装修负责人身份证不能为空");
        return
      } 
      if(this.decorationBtn == true && _this.fileList3.length < 1){
        _this.$message.error("装修公司营业执照不能为空");
        return
      }
      if(this.decorationBtn == true && _this.fileList4.length < 1){
        _this.$message.error("装修公司资质证书不能为空");
        return
      }

      this.$confirm({
        title: "提示",
        content: "确定要保存？",
        onOk() {
          //
          const isAdd = !_this.applicationId;
          _this.form.validateFields((err, values) => {
            if (!err) {
              _this.btnLoading = true;
              values = {
                applicationId: !isAdd ? _this.applicationId : "",
                projectId: values.projectId, //项目
                projectName: _this.projectName,
                spaceId: _this.spaceId,
                spaceName: _this.spaceName,
                userId: _this.userId,//业主
                ownerInfo: values.ownerInfo,//业主
                other: values.other, //其他
                decorationDateStart: values.decorationDate
                  ? moment(values.decorationDate[0]).format("YYYY-MM-DD")
                  : undefined,
                decorationDateEnd: values.decorationDate
                  ? moment(values.decorationDate[1]).format("YYYY-MM-DD")
                  : undefined,

                entrustFlag: values.entrustFlag, //状态
                decorationCompany: values.decorationCompany, //装修公司
                decorationDirector: values.decorationDirector,
                directorTel: values.directorTel,

                identityCardFace: _this.fileList1[0],

                identityCardBack:_this.fileList2[0],
                companyPhoto:_this.fileList3[0],
                certificatePhoto:_this.fileList4[0],

                engineeringlist: _this.engineeringlist,
                electricallist: _this.electricallist,
                designImage: _this.fileList5,
                mainWallImage: _this.fileList6,
                exteriorWallImage: _this.fileList7,
                planeSolidImage: _this.fileList8,
                electricPowerImage: _this.fileList9,
                airConditionerImage:_this.fileList10,
                waterSupplyImage: _this.fileList11,
				fireContrlImage: _this.fileList12,
				otherImage: _this.fileList13,
              };
              console.log(JSON.stringify(values));
              api[isAdd ? "addDecorateApply" : "editDecorateApply"](values)
                .then(res => {
                  if (res.code === 200) {
                    _this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                    _this.$router.push({ name: "decorateManagement" });
                  }
                })
                .catch(err => {
                  console.log(err);
                })
                .finally(() => {
                  _this.btnLoading = false;
                });
            }
          });
        }
      });
    },

    //
    onCommit(e) {
      e.preventDefault();
      var _this = this;
       if(this.decorationBtn == true && (_this.fileList1.length < 1 || _this.fileList2.length < 1)){
        _this.$message.error("装修负责人身份证不能为空");
        return
      } 
      if(this.decorationBtn == true && _this.fileList3.length < 1){
        _this.$message.error("装修公司营业执照不能为空");
        return
      }
      this.$confirm({
        title: "提示",
        content: "确定要提交？",
        onOk() {
          //
          const isAdd = !_this.applicationId;
          _this.form.validateFields((err, values) => {
            if (!err) {
              console.log(values.decorationDate);
              _this.btnLoading = true;
              values = {
                applicationId: !isAdd ? _this.applicationId : "",
                projectId: values.projectId, //项目
                projectName: _this.projectName,
                spaceId: _this.spaceId,
                spaceName: _this.spaceName,
                userId: _this.userId,//业主
                ownerInfo: values.ownerInfo,//业主
                other: values.other, //其他
                decorationDateStart: values.decorationDate
                  ? moment(values.decorationDate[0]).format("YYYY-MM-DD")
                  : undefined,
                decorationDateEnd: values.decorationDate
                  ? moment(values.decorationDate[1]).format("YYYY-MM-DD")
                  : undefined,

                entrustFlag: values.entrustFlag, //状态
                decorationCompany: values.decorationCompany, //装修公司
                decorationDirector: values.decorationDirector,
                directorTel: values.directorTel,

                engineeringlist: _this.engineeringlist,
                electricallist: _this.electricallist,
                identityCardFace: _this.fileList1[0],
                identityCardBack:_this.fileList2[0],
                companyPhoto:_this.fileList3[0],
                certificatePhoto:_this.fileList4[0],

                engineeringlist: _this.engineeringlist,
                electricallist: _this.electricallist,
                designImage: _this.fileList5,
                mainWallImage: _this.fileList6,
                exteriorWallImage: _this.fileList7,
                planeSolidImage: _this.fileList8,
                electricPowerImage: _this.fileList9,
                airConditionerImage:_this.fileList10,
                waterSupplyImage: _this.fileList11,
				fireContrlImage: _this.fileList12,
				otherImage: _this.fileList13,
              };
              console.log(values);
              api[
                isAdd ? "commitAddDecorateApply" : "commitUpdateDecorateApply"
              ](values)
                .then(res => {
                  if (res.code === 200) {
                    _this.$message.success("提交成功");
                    _this.$router.push({ name: "decorateManagement" });
                  }
                })
                .catch(err => {
                  console.log(err);
                })
                .finally(() => {
                  _this.btnLoading = false;
                });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" >
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
.img-div {
  width: 335px;
  height: auto;
}
.ant-upload.ant-upload-select-picture-card {
  display: table;
  float: left;
  width: 335px;
  height: 115px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}
.ant-upload-list-picture-card-container {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
  /*text-align: center;*/
}
.ant-upload-list-picture-card .ant-upload-list-item {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
}
.ant-modal-close-x {
  display: block;
  width: 30px;
  height: 30px;
  font-size: 16px;
  font-style: normal;
  line-height: 30px;
  text-align: center;
  text-transform: none;
  text-rendering: auto;
}
</style>

<style lang="less" scoped>
/deep/ .ant-upload-list-item-actions a {
  pointer-events: auto !important;
  opacity: 1 !important;
}


.item-title{
  font-size: 16px;
  font-weight: bold;
  color:rgb(146, 146, 146);
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 30px;
  margin-top: 20px;
}
.item-title::before{
  width: 4px;
  height: 20px;
  background: rgb(75, 122, 251);
  display: block;
  content:" ";
  margin-right: 7px;
}

.radio-wrap{
  width: 100%;
  height: 350px;
  overflow: auto;
}
</style>