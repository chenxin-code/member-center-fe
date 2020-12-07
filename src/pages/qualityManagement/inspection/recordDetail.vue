<template>
  <div id="form-container">
    <div class="content-header">
      记录详情
      <span class="fallback" @click="FALLBACK" style="cursor: pointer"
        >返回</span
      >
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding: 20px; height: 100%">
        <a-row style="margin-top: 10px">
          <div class="card_header">
            <div class="card_line"></div>
            <div class="card_title">巡检点</div>
          </div>
          <a-form-model
            :model="form"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="巡检点">{{
                  inspectionRecord.inspectionPointName
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="所在区域">{{
                  inspectionRecord.areaName
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="巡检单元">{{
                  inspectionRecord.inspectionUnitName
                }}</a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="位置描述">{{
                  inspectionRecord.position
                }}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="状态">
                  <span v-if="inspectionRecord.status === '0'">未完成</span>
                  <span v-if="inspectionRecord.status === '1'">已完成</span>
                  <span v-if="inspectionRecord.status === '2'">已跳过</span>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="完成时间">{{
                  inspectionRecord.completeTime
                    ? moment(inspectionRecord.completeTime).format(
                        "YYYY-MM-DD HH:mm"
                      )
                    : ""
                }}</a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-row>
        <a-divider />
        <a-row>
          <div class="card_header">
            <div class="card_line"></div>
            <div class="card_title">标准</div>
          </div>
        </a-row>
        <a-row :span="24" v-for="item in standardlist" :key="item.standardId">
          <a-col :span="22" style="margin-bottom: 20px">
            <a-card>
              <a-form-model
                :model="form"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                id="form-container"
              >
                <a-row>
                  <a-col :span="8">
                    <a-form-model-item label="标准代码">{{
                      item.standardCode
                    }}</a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="业态">{{
                      item.businessFormatName
                    }}</a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="服务模式">{{
                      item.serviceModeName
                    }}</a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8">
                    <a-form-model-item label="专业线">{{
                      item.specialLineName
                    }}</a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="指标属性">{{
                      item.dataAttributesName
                    }}</a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="总分值">{{
                      item.totalScore ? (Number(item.totalScore).toFixed(2)+"分") : "0.00分"
                    }}</a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8">
                    <a-form-model-item label="细项权重">{{
                      item.weight ? (Number(item.weight).toFixed(2)+"分") : "0.00分"
                    }}</a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="类别">{{
                      item.standardTypeName
                    }}</a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item label="类别描述">{{
                      item.typeDescriptionName
                    }}</a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8">
                    <a-form-model-item label="核查标准"></a-form-model-item>
                  </a-col>
                  <a-col :span="23" :offset="1">
                    {{ item.checkStandard }}
                  </a-col>

                  <a-col :span="8">
                    <a-form-model-item label="检查方法"></a-form-model-item>
                  </a-col>
                  <a-col :span="23" :offset="1">
                    {{ item.checkMethod }}
                  </a-col>
                  </a-row>
                  <a-row :span="24">
                    <a-col :span="8">
                      <a-form-model-item
                        label="整改期限"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 19 }"
                        >{{ item.rectificateLimit }}
                      </a-form-model-item>
                    </a-col>
                  </a-row>
              </a-form-model>
            </a-card>
          </a-col>
          <a-col :span="2" style="padding-left: 20px">
            <a @click="goAbarbeitung(item)">发起整改</a>
          </a-col>
        </a-row>
      </a-row>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import moment from "moment";
import api from "@/api";
export default {
  data() {
    return {
      form: {},
      id: this.$route.params.id, //记录唯一标示
      inspectionRecord: {}, //基础信息
      standardlist: [], //标准信息
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    moment,
    /**
     * 获取记录详情
     * @author Chen Kuo
     * @date 2020-11-04
     * @returns {any}
     */
    getDetail() {
      const params = {
        id: this.id,
      };
      console.log(this.id);
      api.detailInspectiontaskrecord(params).then((res) => {
        if (res.code === 200) {
          const { inspectionRecord, standardlist } = res.data;
          this.inspectionRecord = inspectionRecord;
          this.standardlist = standardlist;
          console.log(JSON.stringify(standardlist));
        }
      });
    },
    goAbarbeitung(item) {
      console.log(item.inspectionRecordId);
      console.log(item.standardId);
      const param = item.inspectionRecordId + "," + item.standardId;
      this.$router.push({
        name: "abarbeitungDetail",
        params: {
          id: item.inspectionRecordId,
          standardId: item.standardId,
          taskId: this.inspectionRecord.taskId
        },
      });
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
  /deep/ .ant-form-item-children {
    color: #777;
  }
  /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    width: 120px;
    text-align: center;
  }
  .card_header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .card_line {
      width: 4px;
      height: 18px;
      background: #5371dd;
    }
    .card_title {
      font-size: 16px;
      margin-left: 8px;
      font-weight: 400;
      color: #666;
    }
  }
  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>