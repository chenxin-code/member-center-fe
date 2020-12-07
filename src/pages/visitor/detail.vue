<template>
  <div id="visitorDetail">
    <div class="content-header">
      访客详情
      <span class="fallback" @click="FALLBACK">返回</span>
    </div>
    <div class="content-main" style="overflow-y: auto">
      <div style="width:100%;display: flex;align-items:center;padding: 20px 20px;">
        <div style="width:3px;height:16px;background: #4B7AFB;"></div>
        <span style="color:#666666;margin-left:5px;">来访信息</span>
      </div>
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:0 10px;">
        <a-form-model-item label="房屋">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="业主">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="类型">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="到访日期">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="访客姓名">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="访客手机号">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="访客身份证号">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="车牌号">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="到访事由">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="创建时间">
          <span class="info"></span>
        </a-form-model-item>
        <a-form-model-item label="创建人员">
          <span class="info"></span>
        </a-form-model-item>
      </a-form-model>
      <div style="width:100%;display: flex;align-items:center;padding: 20px 20px;">
        <div style="width:3px;height:16px;background: #4B7AFB;"></div>
        <span style="color:#666666;margin-left:5px;">放行信息</span>
      </div>
      <div style="width:523px;padding:0 0 20px 40px;">
        <a-table
          :columns="tableColumns"
          :row-key="(r,i) => i"
          :data-source="tableData"
          :pagination="false"
        >
        </a-table>
        <!-- 分页 -->
        <a-pagination
          :total="total"
          :show-total="total => `共 ${total} 条`"
          show-quick-jumper
          show-size-changer
          v-model="current"
          :default-current="current"
          :page-size.sync="pageSize"
          :pageSizeOptions="['10','20','50','100']"
          @change="onShowSizeChange"
          @showSizeChange="onShowSizeChange"
          style="margin-top:30px;width:100%;text-align: right;"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment"
  export default {
    name: "visitorDetail",
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
        tableColumns: [
          {
            title: "出入时间",
            dataIndex: "time",
            key: "time",
          },
          {
            title: "方式",
            dataIndex: "way",
            key: "way",
          },
        ],
        tableData: [
          {
            id: 1,
            time: "2020-03-15 12:00:00",
            way: "自助开门"
          },
          {
            id: 2,
            time: "2020-03-15 12:00:00",
            way: "门岗核验"
          },
        ],
        total: 2,
        current: 1,
        pageSize: 10,
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
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
      },
      //下载放行条
      downLoad() {
        console.log("下载放行条")
      }
    },
  }
</script>

<style lang="less" scoped>
  #visitorDetail{
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
