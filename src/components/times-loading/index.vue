<template>
  <div class="times-loading" v-show="isShow">
    <div class="loading-content">
      <div class="loading-block">
        <img src="./loading-icon.png" alt="" class="loading" />
        <span class="loading-text">正在加载</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.times-loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading-content {
    width: 120px;
    height: 120px;
    background: #121212;
    opacity: 0.8;
    .loading-block {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .loading {
        width: 24px;
        height: 24px;
        animation: rotate 1s infinite linear;
      }
      .loading-text {
        color: #ffffff;
        font-size: 14px;
        margin-top: 15px;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
