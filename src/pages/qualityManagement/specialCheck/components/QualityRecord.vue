<template>
<div>
  <a-table :columns="columns" :data-source="list" :pagination="false" rowKey="id">
      <template slot="status" slot-scope="operation">
        <div class="editable-row-operations">
          <span v-if="operation.status === '0'">未完成</span>
          <span v-if="operation.status === '1'">已完成</span>
          <span v-if="operation.status === '2'">已跳过</span>
        </div>
    </template>
    <template slot="standardCode" slot-scope="standardCode,record">
      <a-button type="link" @click="open_dialog(record)">{{standardCode}}</a-button>
    </template>

    <template slot="checkTime" slot-scope="checkTime,checkInfo">
      <span v-if="checkInfo.status === '1'">{{checkTime?moment(checkTime).format('YYYY-MM-DD HH:mm'):''}}</span>
    </template>

    <template slot="checkName" slot-scope="checkName,checkInfo">
      <span v-if="checkInfo.status === '1'">{{checkName}} - {{checkInfo.checkPhone}}</span>
    </template>

	  <template slot="resultScore" slot-scope="resultScore,score">
	    <span v-if="score.status === '1'">{{resultScore?resultScore:'0'}}/{{score.totalScore?score.totalScore:'0'}}</span>
    </template>

    <span slot="action" slot-scope="action">    
      <a @click="checkDetil(action)">查看</a>
      <a-divider type="vertical" />
      <a @click="checkEdit(action)">编辑</a>
      <a-divider type="vertical" />
      <a @click="checkEdit(action)">开始登记</a>
      <a-divider type="vertical" />
      <a @click="initiateCorrective(action)">发起整改</a>
    </span>

    <!-- <span slot="action" slot-scope="action">
      <div v-if="action.taskStatus =='0' || action.taskStatus =='1' ">
        <div v-if="action.status =='0'">
          <div v-if="action.roleCode =='0'">
            <a  @click="checkEdit(action)">开始登记</a>
            <a-divider type="vertical" />
              <a @click="initiateCorrective(action)">发起整改</a> 
          </div>
          <div v-if="action.roleCode !='0'">
            <a @click="checkDetil(action)">查看</a>
            <a-divider type="vertical" />
            <a @click="initiateCorrective(action)">发起整改</a> 
          </div>
        </div> 
        <div v-if="action.status =='1'"> 
            <a  @click="checkEdit(action)">编辑</a>
            <a-divider type="vertical" />
            <a  @click="initiateCorrective(action)">发起整改</a> 
        </div>
      </div>

      <div v-if="action.taskStatus =='2'">
        <a  @click="checkEdit(action)">编辑</a>
        <a-divider type="vertical" />
        <a  @click="initiateCorrective(action)">发起整改</a> 
      </div>
    </span> -->
  </a-table>

  <StandardDetailsModal :visible="visible" :checkId="checkId" @closeModal="visible = false" />
</div>
</template>

<script>
import moment from "moment";
import StandardDetailsModal from './StandardDetailsModal'

export default {
  name: "QualityRecord",
  components:{
    StandardDetailsModal
  },
  props: {
    list: {
      type: Array,
      default: new Array()
    }
  },
  data() {
    return {
      visible: false,
      checkId:"",
      columns: [
        {
          title: "标准代码",
          dataIndex: "standardCode",
          key: "standardCode",
          scopedSlots: { customRender: "standardCode" }
        },
        {
          title: "得分",
          dataIndex: "resultScore",
          key: "resultScore",
		  scopedSlots: { customRender: "resultScore"}
        },
        {
          title: "状态",
          key: "status",
          scopedSlots: { customRender: "status" }
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

    goDetail(item) {
      this.$router.push({
        name: "inspectionDetailRecord",
        params: {
          id: item.id
        }
      });
    },
    checkDetil(item){
      this.$emit('checkDetil',item)
    },
    checkEdit(item){
      this.$emit('checkEdit',item)
    },
    initiateCorrective(item){
       this.$emit('initiateCorrective',item)
    }
  }
};
</script>