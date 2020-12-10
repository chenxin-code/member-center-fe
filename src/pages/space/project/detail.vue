<template>
  <div id="projectdetail">
    <div class="content-header">项目详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <a-form  layout="inline">
            <a-form-item label="项目名称">
              <span class="ant-form-text">
                {{ project.projectName }}
              </span>
            </a-form-item>
            <a-form-item label="所属公司">
              <span class="ant-form-text">
                {{ project.orgName }}
              </span>
            </a-form-item>
          </a-form>
          <!-- 表格 -->
          <a-table
            :columns="columns"
            :row-key="(r,i) => i"
            :data-source="data"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="loading"
            style="width:100%;margin-top:8px;"
          >
          </a-table>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex";

export default {
  name: "projectDetail",
  props: {
    project: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      //表格高度
      scrollY:100,
      //表头数据
      columns : [
        {
          title: "分期名称",
          dataIndex: "fname",
          key: "fname",
        },
        {
          title: "营销名称",
          dataIndex: "fSalesName",
          key: "fSalesName",
        }
      ],
      loading: true,
      //列表数据
      data : []
    }
  },
  components: {

  },
  mounted () {
    setTimeout(()=>{
      console.log(this.$refs.contentMain.offsetHeight);
      this.scrollY =  this.$refs.contentMain.offsetHeight - 204 + "px";
    },100)

  },
  created () {
    console.log(this.project)
    // this.id = this.$route.query.projectId;
    // this.projectName = window.localStorage.getItem("projectName");
    // this.orgName = window.localStorage.getItem("orgName");
    this.getProjectDetail();
  },
  methods:{
    ...mapActions([
      'FALLBACK'
    ]),
    //获取项目详情
    getProjectDetail() {
      const para = {
        id: this.project.projectId,
      }
      api.getProjectDetail(para).then(res => {
        if (res.code === 200) {
          this.data = res.data;
        }
      }).catch(() => {
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      });
    },
  },
  watch: {
    '$route'() {
    }
  }
}
</script>

<style lang="less" scoped>
  #projectdetail{
    height: 100%;
    overflow: hidden;
  }
</style>
