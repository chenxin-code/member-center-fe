<template>
  <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">行为详情</p>
            <p class="detail-header-btn" @click="goBack()">返回</p>
        </div>
        <div class="detail-main">
            <p class="detail-main-title">
                <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                基础信息
            </p>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为名称：</span>
                <span class="detail-main-items-value">行为名称</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为来源：</span>
                <span class="detail-main-items-value">邻里邦pro</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为类型：</span>
                <span class="detail-main-items-value">消费</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为描述：</span>
                <span class="detail-main-items-value">我是xXXXXX</span>
            </div>
            <div class="detail-main-items" style="display: flex;">
                <span class="detail-main-items-label">关联的任务：</span>
                <span class="detail-main-items-value"><a-table :style="{ width: '1000px' }" :columns="columns" :data-source="tableDataList" :loading="tableLoading" :scroll="{ y: scrollY }"></a-table></span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为状态：</span>
                <span class="detail-main-items-value">启用</span>
            </div>
        </div>
  </div>
</template>
<script>
import api from '@/api';
import moment from 'moment';
export default {
  name: "detial",
  data() {
    return{
        scrollY: 300,
        pageSize: 10,
        current: 1,
        total: null,
        tableLoading: false,
        tableDataList: [],
        columns: [
        {
          title: '任务名称',
          key: 'taskName',
          dataIndex: 'taskName'
        },
        {
          title: '任务描述',
          key: 'memo',
          dataIndex: 'memo'
        },
        {
          title: '奖励类型',
          key: 'taskCondition',
          dataIndex: 'taskCondition',
        }
      ],
    }
  },
  methods:{
    goBack() {
      this.$router.push({ name: 'taskCenter-behavior' });
    },
  }
}
</script>
<style lang="less" scoped>
.detail {
  height: 100%;
  &-header {
    display: flex;
    justify-content: space-between;
    line-height: 56px;
    border-bottom: 2px solid #dadada;
    &-title,
    &-btn {
      margin: 0;
      padding: 0 40px;
    }
    &-btn {
      color: #4c79fa;
      cursor: pointer;
    }
  }
  &-main {
    height: calc(100% - 58px);
    overflow: auto;
    padding: 20px;
    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 35px;
      line-height: 50px;
      margin: 0;
    }
    &-items {
      color: #666;
      margin-bottom: 20px;
      &-label {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #333;
      }
    }
  }
}
</style>