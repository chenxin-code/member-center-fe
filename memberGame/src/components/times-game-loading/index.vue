<template>
  <div class="loading-page" v-if="isShow">
    <van-overlay :show="isShow" :custom-style="defaultConfig.style">
      <div class="vant-loading">
        <van-loading size="50px" vertical>
          {{ defaultConfig.title }}
        </van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "lucky-loading",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    defaultConfig: {
      type: Object,
      default: () => {
        return {
          title: "启动中...",
          style: {}
        };
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.loading-page {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  .vant-loading {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 120px;
    height: 120px;
  }
}
</style>
