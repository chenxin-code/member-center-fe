<template>
  <div id="releasePassDetail">
    <div class="content-header">
      放行条详情
      <span class="fallback" @click="FALLBACK">返回</span>
    </div>
    <div class="content-main" style="overflow-y: auto">
      <div style="width:100%;height:100px;display: flex;align-items: center;padding:0 20px 0 20px;border-bottom: 1px dashed #E9E9E9">
        <div style="height:60px;display: flex;flex-wrap: wrap;align-content: space-between">
          <span style="width:100%;">珠江花园一期5号楼2单元1201号</span>
          <span style="color:#E76811;">申请状态: 待审核</span>
<!--          <span style="color:#5DB103;">申请状态: 已通过</span>-->
<!--          <span style="color:#E02020;">申请状态: 已驳回</span>-->
        </div>
        <div style="width:60px;height:60px;background: #4B7AFB;"></div>
      </div>
      <div style="width:100%;display: flex;align-items:center;padding: 20px 20px;">
        <div style="width:3px;height:16px;background: #4B7AFB;"></div>
        <span style="color:#666666;margin-left:5px;">申请详细信息</span>
      </div>
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:0 10px;">
        <a-form-model-item label="业主">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="申请人">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="申请时间">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="放行日期">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="通行人">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <span class="info"></span>
        </a-form-model-item>
      </a-form-model>
      <div style="width:100%;display: flex;align-items:center;padding: 20px 20px;">
        <div style="width:3px;height:16px;background: #4B7AFB;"></div>
        <span style="color:#666666;margin-left:5px;">放行物品</span>
      </div>
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:0 10px;">
        <a-form-model-item label="业主">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="申请人">
          <span class="info"></span>
        </a-form-model-item>
      </a-form-model>
      <div style="width:100%;display: flex;align-items:center;padding: 20px 20px;">
        <div style="width:3px;height:16px;background: #4B7AFB;"></div>
        <span style="color:#666666;margin-left:5px;">审核信息</span>
      </div>
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:0 10px;">
        <a-form-model-item label="审核时间">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="审核人">
          <span class="info"></span>
        </a-form-model-item>
      </a-form-model>
      <div style="width:100%;display: flex;align-items:center;padding: 20px 20px;">
        <div style="width:3px;height:16px;background: #4B7AFB;"></div>
        <span style="color:#666666;margin-left:5px;">放行时间信息</span>
      </div>
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:0 10px;">
        <a-form-model-item label="放行时间">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="客助">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <span class="info"></span>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" @click="downLoad">下载放行条</a-button>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment"
  export default {
    name: "releasePassDetail",
    props: {
      project: {
        type: Object,
        default: () => ({})
      },
      notice: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        data: {},
      }
    },
    components: {

    },
    created () {
      this.getReleasePassDetail()
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      //获取详情
      getReleasePassDetail() {
        console.log("获取详情")
        // const para = {
        //   id: this.notice.id
        // };
        // api.getPropertyNoticeInfo(para).then((res) => {
        //   if (res.code === 200) {
        //     this.data = res.data
        //   }
        // });
      },
      //下载放行条
      downLoad() {
        console.log("下载放行条")
      }
    },
  }
</script>

<style lang="less" scoped>
  #releasePassDetail{
    height: 100%;
    overflow: hidden;
    .content-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .info{
      color: #666666;
    }
  }
</style>
