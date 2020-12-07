<template>
  <div id="form-container">
    <div class="content-header">
      任务详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>

    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;">
        <a-row style="margin-top: 20px">
          <a-form-model :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" id="form-container">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="项目">{{info.projectName}}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="房屋">{{info.houseName}}</a-form-model-item>
              </a-col> 
              <a-col :span="8">
                <a-form-model-item
                  label="巡查日期"
                >{{info.inspectorDate?moment(info.inspectorDate).format('YYYY-MM-DD'):''}}</a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="任务状态">
                  <span v-if="info.status === '0'">待开始</span>
                  <span v-if="info.status === '1'">进行中</span>
                  <span v-if="info.status === '2'">已完成</span>
                  <span v-if="info.status === '3'">已过期</span>
                  <!-- {{info.status?info.status:'-'}} -->
                  </a-form-model-item>
              </a-col>
              <a-col :span="8">
               <a-form-model-item
                  label="完成日期"
                >{{info.completeTime?moment(info.completeTime).format('YYYY-MM-DD HH:mm:ss'):''}}</a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-row>

        <a-table
          :columns="columns"
          :data-source="checkRecordlist"
          :pagination="false"
          :rowKey="(r,i) => i"
        >
          <template slot="standardCode" slot-scope="standardCode,row">
            <a-button type="link" @click="open_dialog(row)">{{standardCode}}</a-button>
          </template>

          <template slot="checkName" slot-scope="scope,row">
            <span>{{scope}} - {{row.checkPhone}}</span>
          </template>

          <template slot="checkTime" slot-scope="checkTime">
            <span>{{checkTime?moment(checkTime).format('YYYY-MM-DD'):''}}</span>
          </template>

          <template slot="action" slot-scope="action,item">
            <a  v-if="action.status === '1'" @click="goDetail(item)">查看</a>
          </template>
        </a-table>
      </a-row>
    </div>

    <a-modal
      v-model="visible"
      :centered="true"
      :maskClosable="false"
      title="检查情况"
      width="800px"  
      :footer="null"
    >
      <div class="dialog-wrap">
        <div class="item">
          <div class="name">检查情况：</div>
          <div class="val">{{description}}</div>
        </div>
        <div class="item">
          <div class="name">照片：</div>
          <div class="val">
            <div class="img-box" v-if="picturePaths && picturePaths.length">
              <img :src="item"  v-for="item in picturePaths" :key="item"/>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <StandardDetailsModal :visible="visibleTwo" :checkId="checkId" @closeModal="visibleTwo = false" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
import api from "@/api";
import StandardDetailsModal from '@/pages/qualityManagement/specialCheck/components/StandardDetailsModal'

export default {
  data() {
    return {
      visibleTwo:false,
      checkId:"",
      info: {}, //任务详情数据
      checkRecordlist: [],
      id: this.$route.params.id,
      description:'',
      picturePaths:[],
      columns: [
        {
          title: "标准代码",
          dataIndex: "standardCode",
          key: "standardCode",
          scopedSlots: { customRender: "standardCode" }

        },
        {
          title: "状态",
          dataIndex:"statusName",
          key: "statusName",
        },
        {
          title: "检查时间",
          dataIndex: "checkTime",
          key: "checkTime",
          scopedSlots: { customRender: "checkTime" }
        },
        {
          title: "检查人",
          dataIndex: "checkName",
          key: "checkName",
          scopedSlots: { customRender: "checkName" }
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      visible:false,
    };
  },
  components:{
    StandardDetailsModal
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    moment,

    open_dialog(row){
      console.log(row)  
      this.visibleTwo = true
      this.checkId = row.standardId
    },

    goDetail(item) {
      this.visible = true;
      console.log(JSON.stringify(item));
      const params = {
        id: item.id
      };
      api.getDecorationinspectionChecKRecordDetail(params).then(res => {
        if (res.code === 200) {
          console.log(res.data);
          const { description, picturePaths } = res.data;
          this.description = description;
          this.picturePaths = picturePaths;
        }
      });
    },
    getDetail() {
      const params = {
        id: this.id
      };
      api.getDecorationinspectiontaskDetail(params).then(res => {
        if (res.code === 200) {
          const { checkRecordlist, checkTask } = res.data;
          this.checkRecordlist = checkRecordlist;
          this.info = checkTask || {};
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

 .item{
    display: flex;
    margin-bottom: 10px;
    .name{
      width:15%;
    }
    .val{
      width: 85%;
      .img-box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        img{
          width: 180px;
          height: 120px;
          border-radius: 8px;
          margin: 0 10px 10px 0;
        }
      }
    }
  }
</style>