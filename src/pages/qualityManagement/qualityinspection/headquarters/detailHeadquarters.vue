<template>
  <div id="form-container">
    <div class="content-header">
      任务详情
      <span class="fallback" @click="FALLBACK" style="cursor: pointer"
        >返回</span
      >
    </div>
    <StandardDetailsModal
      :visible="visible"
      :checkId="checkId"
      @closeModal="closeModal"
    />
    <div class="content-main" ref="contentMain">
      <a-row style="padding: 20px; height: 100%">
        <a-row style="margin-top: 20px">
          <a-form-model
            :model="form"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
            id="form-container"
          >
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="主题">{{
                  checkTask.themeName
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="专业线">{{
                  checkTask.specialLineName
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目">{{
                  checkTask.projectName
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="城市公司">{{
                  checkTask.cityName
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="年份">{{
                  checkTask.year
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="季度">
                  <span v-if="checkTask.quarter === '1'">第一季度</span>
                  <span v-if="checkTask.quarter === '2'">第二季度</span>
                  <span v-if="checkTask.quarter === '3'">第三季度</span>
                  <span v-if="checkTask.quarter === '4'">第四季度</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="任务状态">
                  <span v-if="checkTask.status === '0'">待开始</span>
                  <span v-if="checkTask.status === '1'">进行中</span>
                  <span v-if="checkTask.status === '2'">已完成</span>
                  <span v-if="checkTask.status === '3'">已过期</span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-row>
        <a-tabs type="card" @change="changeTab">
          <a-tab-pane key="1" tab="质检记录">
            <a-card>
              <span style="color: '#666'; margin-bottom: 10px; display: block"
                >分数：{{ scoreSum ? scoreSum : "0" }}/{{
                  totalScoreSum ? totalScoreSum : "0"
                }}</span
              >
              <QualityRecord
                :list="checkRecordlist"
                @checkDetil="checkDetil"
                @checkEdit="checkEdit"
                @initiateCorrective="initiateCorrective"
              />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2" tab="整改记录">
            <a-card>
              <RectificationRecord :list="rectificationRecordlist" />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import moment from "moment";
import api from "@/api";
import QualityRecord from "./components/QualityRecord";
import RectificationRecord from "./components/RectificationRecord";
import StandardDetailsModal from "./components/StandardDetailsModal";
export default {
  data() {
    return {
      form: {},
      visible: false,
      checkId: "",
      checkRecordlist: [],
      checkTask: {},
      rectificationRecordlist: [],
      scoreSum: 0,
      totalScoreSum: 0,
      id: this.$route.params.id, //任务唯一标示
    };
  },
  mounted() {
    this.getDetail();
  },
  components: {
    QualityRecord,
    RectificationRecord,
    StandardDetailsModal,
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    moment,
    /**
     * 切换tab
     * @author Chen Kuo
     * @date 2020-11-03
     * @returns {any}
     */
    changeTab() {},
    /**
     * 获取巡检详情
     * @author Chen Kuo
     * @date 2020-11-04
     * @returns {any}
     */
    getDetail() {
      const params = {
        id: this.id,
      };
      api.getSpotCheckDetail(params).then((res) => {
        if (res.code === 200) {
          const {
            checkRecordlist,
            checkTask,
            rectificationRecordlist,
            scoreSum,
            totalScoreSum,
          } = res.data;
          this.scoreSum = scoreSum;
          this.totalScoreSum = totalScoreSum;
          this.checkRecordlist = checkRecordlist;
          this.checkTask = checkTask || {};
          this.rectificationRecordlist = rectificationRecordlist;
        }
      });
    },
    //查看详情
    checkDetil(item) {
      //this.visible = true;
      //this.checkId = item.id;
      this.$router.push({
        name: "qualityControlHeadResultDetail",
        params: {
          id: item.id,
          standardId: item.standardId,
          taskId: item.taskId,
        },
      });
    },
    //编辑
    checkEdit(item) {
      console.log(JSON.stringify(item.standardId));
      this.$router.push({
        name: "qualityControlHeadResult",
        params: {
          id: item.id,
          standardId: item.standardId,
          taskId: item.taskId,
        },
      });
    },
    //发起整改
    initiateCorrective(item) {
      this.$router.push({
        name: "qualityControlHeadRectification",
        params: {
          id: item.id,
          standardId: item.standardId,
          taskId: item.taskId,
        },
      });
    },
    //关闭弹窗
    closeModal() {
      this.visible = false;
    },
  },
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
}
</style>