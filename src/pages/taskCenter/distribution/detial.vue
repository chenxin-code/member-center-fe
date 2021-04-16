<template>
  <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">任务派发详情</p>
            <p class="detail-header-btn" @click="goBack()">返回</p>
        </div>
        <div class="detail-main">
            <p class="detail-main-title">
                <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                基础信息
            </p>
            <div class="detail-main-items">
                <span class="detail-main-items-label">任务名称：</span>
                <span class="detail-main-items-value">XXXX任务</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">任务执行人员：</span>
                <span class="detail-main-items-value">XXXXXXXXXXXXXXXXXXX1</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">指定会员：</span>
                <span class="detail-main-items-value"><a-button type="primary"><a-icon type="download" />下载会员列表</a-button></span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">业务发布范围：</span>
                <span class="detail-main-items-value">邻里pro+    L1级会员---L2级会员</span>
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

    }
  },
  methods:{
    goBack() {
      this.$router.push({ name: 'taskCenter-distribution' });
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