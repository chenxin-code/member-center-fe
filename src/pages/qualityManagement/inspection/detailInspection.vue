<template>
  <div id="form-container">
    <div class="content-header">
      任务详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
        <a-row style="margin-top: 20px">
          <a-form-model
            :model="form"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 17 }"
            id="form-container"
          >
            <a-row>
              <a-col :span="8">
                <a-form-model-item
                  label="项目"
                >{{inspectionTask.projectName}}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="巡查人"
                >{{inspectionTask.inspectorName}} - {{inspectionTask.inspectorPhone}}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="状态">
                  <span v-if="inspectionTask.status === '0'">待开始</span>
                  <span v-if="inspectionTask.status === '1'">进行中</span>
                  <span v-if="inspectionTask.status === '2'">已完成</span>
                  <span v-if="inspectionTask.status === '3'">已过期</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="计划开始日期"
                >{{inspectionTask.planStart?moment(inspectionTask.planStart).format('YYYY-MM-DD'):''}}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="计划结束日期"
                >{{inspectionTask.planEnd?moment(inspectionTask.planStart).format('YYYY-MM-DD'):''}}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="完成时间"
                >{{inspectionTask.completeTime?moment(inspectionTask.completeTime).format('YYYY-MM-DD HH:mm'):''}}</a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-row>
        <a-tabs type="card" @change="changeTab">
          <a-tab-pane key="1" tab="巡查记录">
            <a-card>
              <PatrolRecord :list="inspectionlist" />
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
import PatrolRecord from "./components/PatrolRecord";
import RectificationRecord from "./components/RectificationRecord";
export default {
  data() {
    return {
      form: {},
      inspectionTask: {}, //任务详情数据
      inspectionlist: [], //巡查记录
      rectificationRecordlist: [], //整改记录列表
      id: this.$route.params.id //任务唯一标示
    };
  },
  mounted() {
    console.log(this.$route)
    this.getDetail();
  },
  components: {
    PatrolRecord,
    RectificationRecord
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
        id: this.id
      };
      console.log(this.id);
      api.detailInspectiontask(params).then(res => {
        if (res.code === 200) {
          console.log(JSON.stringify(res.data));

          const {
            inspectionTask,
            inspectionlist,
            rectificationRecordlist
          } = res.data;
          this.inspectionTask = inspectionTask;
          this.inspectionlist = inspectionlist;
          this.rectificationRecordlist = rectificationRecordlist;
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
}
</style>