<template>
<div>
  <a-table :columns="columns" :data-source="list" :pagination="false" 	:rowKey="(r,i) => i">
    <template slot="applyName" slot-scope="scope,row">
      {{scope}} - {{row.applyPhone}}
    </template>
    <template slot="rectificationNo" slot-scope="scope,row">
      <a-button type="link" @click="open_detail(row)">{{scope}}</a-button>
    </template>
    <template slot="standardCode" slot-scope="scope,row">
      <a-button type="link"  @click="open_dialog(row)">{{scope}}</a-button>
    </template>
    <template slot="applyTime" slot-scope="applyTime">
      <span>{{moment(applyTime).format('YYYY-MM-DD HH:mm')}}</span>
    </template>
  </a-table>
  <StandardDetailsModal :visible="visible" :checkId="checkId" @closeModal="visible = false" />
</div>
</template>

<script>
import moment from "moment";
import StandardDetailsModal from './StandardDetailsModal'
import api from "@/api";

export default {
  name: "RectificationRecord",
  props: {
    list: {
      type: Array,
      default: new Array()
    }
  },
  components:{
    StandardDetailsModal
  },
  data() {
    return {
      visible: false,
      checkId:"",
      columns: [
        {
          title: "整改单编号",
          dataIndex: "rectificationNo",
          key: "rectificationNo",
          scopedSlots: { customRender: "rectificationNo" }
        },
        {
          title: "标准代码",
          dataIndex: "standardCode",
          key: "standardCode",
          scopedSlots: { customRender: "standardCode" }
        },
        {
          title: "发起人",
          dataIndex: "applyName",
          key: "applyName",
          scopedSlots: { customRender: "applyName" }
        },
		{
		  title: "发起时间",
		  dataIndex: "applyTime",
		  key: "applyTime",
		  scopedSlots: { customRender: "applyTime" }
		},
        {
          title: "整改状态",
          dataIndex: "statusName",
          key: "statusName"
        }
      ]
    };
  },
  methods: {
    moment,

    open_dialog(row){
      console.log(row)  
      this.visible = true
      this.checkId = row.standardId
    },
     // 整改详情
    open_detail(row){
        console.log(row)
        api.getrectification({
          recordId: row.id
        }).then(res => {
        if (res.code === 200) {
          let tokenStr = localStorage.getItem("SD_ACCESS_TOKEN");
          // window.open("http://58.62.172.142:28080/PropertySite/#/rectification-detail?stepID=0&isPost=false&taskID="+res.data + "&token=" + tokenStr)
          window.open(`${res.data.url}?stepID=0&isPost=false&taskID=${res.data.taskId}&token=${tokenStr}`)
        }
      })
    }
  }
};
</script>