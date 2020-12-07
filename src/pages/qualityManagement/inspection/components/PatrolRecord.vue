<template>
  <a-table :columns="columns" :data-source="list" :pagination="false" rowKey="id">
    <template slot="checkStatus" slot-scope="operation">
      <div class="editable-row-operations">
          <span v-if="operation.checkStatus === '0'">未完成</span>
          <span v-if="operation.checkStatus === '1'">已完成</span>
      </div>
    </template>
    <template slot="completeTime" slot-scope="completeTime">
      <span>{{completeTime?moment(completeTime).format('YYYY-MM-DD HH:mm'):''}}</span>
    </template> 
    <span slot="action" slot-scope="action">
      <a @click="goDetail(action)">查看</a>
    </span>
  </a-table>
</template>
<script>
import moment from "moment";
export default {
  name: "PatrolRecord",
  props: {
    list: {
      type: Array,
      default: new Array()
    }
  },
  data() {
    return {
      columns: [
        {
          title: "巡检点",
          dataIndex: "inspectionPointName",
          key: "inspectionPointName"
        },
        {
          title: "所在区域",
          dataIndex: "areaName",
          key: "areaName"
        },
        {
          title: "状态",
          key: "checkStatus",
          scopedSlots: { customRender: "checkStatus" }
        },
        {
          title: "完成时间",
          dataIndex: "completeTime",
          key: "completeTime",
          scopedSlots: { customRender: "completeTime" }
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  methods: {
    moment,
    goDetail(item) {
      this.$router.push({
        name: "inspectionDetailRecord",
        params:{
          id:item.id
        }
      });
    }
  }
};
</script>