<template>
  <div id="propertyDetail">
    <div class="content-header">
      查看公告详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="overflow-y: scroll">
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:30px 10px;">
        <a-form-model-item label="项目">
          {{project.name}}
        </a-form-model-item>
        <a-form-model-item label="标题">
          {{data.title}}
        </a-form-model-item>
        <a-form-model-item label="发布方">
          {{data.publisher}}
        </a-form-model-item>
        <a-form-model-item label="发布时间">
          {{data.publishedAt ? moment(data.publishedAt).format("YYYY-MM-DD HH:mm") : "" }}
        </a-form-model-item>
        <a-form-model-item label="类型">
          {{data.typeName}}
        </a-form-model-item>
        <a-form-model-item label="公告等级">
          {{data.grade === 1 ? "非常紧急" : data.grade === 2 ? "紧急" : data.grade === 3 ? "重要" : data.grade === 4 ? "提示" : "普通"}}
        </a-form-model-item>
        <a-form-model-item label="通知方式">
          {{data.pushModes === 0 ? "APP提醒（全部住户）" : data.pushModes === 1 ? "APP提醒（仅业主）": "不通知"}}
        </a-form-model-item>
        <a-form-model-item label="详细内容">
          <div v-for="(item, index) in data.details" :key="index">
            <span v-if="item.type==='text'" style="color:#666666;font-size:12px;word-break: break-all">{{item.content}}</span>
            <img v-else :src="item.content" style="max-width: 100%;width:150px;height:auto;margin-top:10px;" />
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment"
  export default {
    name: "propertyDetail",
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
      this.getNoticeDetail()
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      //获取详情
      getNoticeDetail() {
        const para = {
          id: this.notice.id
        };
        api.getPropertyNoticeInfo(para).then((res) => {
          if (res.code === 200) {
            this.data = res.data
          }
        });
      },
    },
  }
</script>

<style lang="less" scoped>
  #propertyDetail{
    height: 100%;
    overflow: hidden;
  }
</style>
