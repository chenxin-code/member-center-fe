<template>
  <a-form
    id="form-container"
    :form="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    style="height: 100%;overflow: auto;"
  >
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

    <a-card v-if="data.entrustFlag" style="margin-bottom:20px">
      <a-form-item label="装修负责人身份证" style="margin-top:16px;">
        <div v-if="data.identityCardBack || data.identityCardFace">
          <img
            style="width:320px;height:190px;border-radius:4px;margin-right:20px"
            :src="data.identityCardBack.url"
            v-if="data.identityCardBack"
            @click="handleClick(data.identityCardBack.url)"
          />
          <img
            style="width:320px;height:190px;border-radius:4px"
            :src="data.identityCardFace.url"
            v-if="data.identityCardFace"
            @click="handleClick(data.identityCardFace.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>

      <a-form-item label="装修公司营业执照" style="margin-top:16px;">
          <img
              style="width:320px;height:190px;border-radius:4px;margin-right:20px"
              :src="data.companyPhoto.url"
               v-if="data.companyPhoto"
            @click="handleClick(data.companyPhoto.url)"
            />
          <span v-else>-</span>
      </a-form-item>

      <a-form-item label="装修公司资质证书" style="margin-top:16px;">
          <img
            style="width:320px;height:190px;border-radius:4px;margin-right:20px"
            :src="data.certificatePhoto.url"
             v-if="data.certificatePhoto"
            @click="handleClick(data.certificatePhoto.url)"
          />
          <span v-else>-</span>
      </a-form-item>
    </a-card>

    <a-card style="margin-bottom:16px;">
      <div class="card_header">
        <div class="card_line"></div>
        <div class="card_title">主要装修项目</div>
      </div>
      <a-form-model-item label="土建部分">
        <div v-if="data.engineeringlist.length">
          <!-- <span v-for="(item,index) in data.engineeringlist" :key="index">{{item}}</span> -->
		  <span>{{data.engineeringlist.join("、")}}</span>
        </div>
        <span v-else>-</span>
      </a-form-model-item>
      <a-form-model-item label="电气部分">
        <div v-if="data.electricallist.length">
          <!-- <span v-for="(item,index) in data.electricallist" :key="index">{{item+" "}}</span> -->
		  <span>{{data.electricallist.join("、")}}</span>
		</div>
        <span v-else>-</span>
      </a-form-model-item>
      <a-form-model-item label="其他">
        <span v-if="data.other">{{data.other}}</span>
        <span v-else>-</span>
      </a-form-model-item>
    </a-card>

    <a-card style="margin-bottom:16px;">
      <div class="card_header">
        <div class="card_line"></div>
        <div class="card_title">装修图纸</div>
      </div>
      <a-form-item label="原设计图" style="margin-top:16px;">
        <div v-if="data.designImage&&data.designImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.designImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item label="承重墙图" style="margin-top:16px;">
        <div v-if="data.mainWallImage&&data.mainWallImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.mainWallImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item label="外观墙面图" style="margin-top:16px;">
        <div v-if="data.exteriorWallImage&&data.exteriorWallImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.exteriorWallImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item label="平面/立体图" style="margin-top:16px;">
        <div v-if="data.planeSolidImage&&data.planeSolidImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.planeSolidImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item label="电力图" style="margin-top:16px;">
        <div v-if="data.electricPowerImage&&data.electricPowerImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.electricPowerImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>   
        <span v-else>-</span>     
      </a-form-item>
      <a-form-item label="空调图" style="margin-top:16px;">
        <div v-if="data.airConditionerImage&&data.airConditionerImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.airConditionerImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>
      <a-form-item label="给排水图" style="margin-top:16px;">
        <div v-if="data.waterSupplyImage&&data.waterSupplyImage.length">
          <img
            class="img-style"
            :src="item.url"
            v-for="item in data.waterSupplyImage"
            :key="item.url"
            @click="handleClick(item.url)"
          />
        </div>
        <span v-else>-</span>
      </a-form-item>
	  <a-form-item label="消防图" style="margin-top:16px;">
	    <div v-if="data.fireContrlImage&&data.fireContrlImage.length">
	      <img
	        class="img-style"
	        :src="item.url"
	        v-for="item in data.fireContrlImage"
	        :key="item.url"
	        @click="handleClick(item.url)"
	      />
	    </div>
	    <span v-else>-</span>
	  </a-form-item>
	  <a-form-item label="其他图纸" style="margin-top:16px;">
	    <div v-if="data.otherImage&&data.otherImage.length">
	      <img
	        class="img-style"
	        :src="item.url"
	        v-for="item in data.otherImage"
	        :key="item.url"
	        @click="handleClick(item.url)"
	      />
	    </div>
	    <span v-else>-</span>
	  </a-form-item>
    </a-card>
  </a-form>
</template>
<script>
export default {
  name: "DetailedInformation",
  props: ["data"],
  data() {
    return {
      form: {},
      previewVisible: false,
      previewImage: ""
    };
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    handleClick(url) {
      console.log(url)
      this.previewImage = url;
	  this.previewVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
#form-container {
  /deep/ .ant-form-item-label > label {
    color: #666;
  }
  .card_header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .card_line {
      width: 4px;
      height: 18px;
      background: #5371dd;
    }
    .card_title {
      font-size: 16px;
      margin-left: 5px;
      font-weight: bold;
    }
  }

  .img-style{
    width:250px;
    height:150px;
    border-radius:4px;
    margin-right:10px;
    margin-bottom: 10px;
    border:1px solid #eee
  }
}
</style>