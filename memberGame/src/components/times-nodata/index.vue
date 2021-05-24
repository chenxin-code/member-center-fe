<template>
  <div
    class="times-no-data"
    :style="{ 'margin-top': topPx, 'margin-bottom': bottomPx }"
  >
    <div class="times-content">
      <img class="img-default" :src="defaultLogo" alt="" />
    </div>
    <div class="times-describe" :style="{ color: fontColor }">
      {{ describe }}
    </div>
  </div>
</template>

<script>
export default {
  name: "times-no-data",
  props: {
    describe: {
      type: String,
      default: "暂无数据"
    },
    defaultLogo: {
      type: String,
      default: () => require("@assets/images/global/img_local_default.png")
    },
    top: {
      type: [String, Number],
      default: () => {}
    },
    bottom: {
      type: [String, Number],
      default: () => {}
    },
    fontColor: {
      type: String,
      default: "#666"
    }
  },
  data() {
    return {};
  },
  computed: {
    topPx() {
      const top = this.top;
      return !isNaN(top) ? top + "px" : top;
    },
    bottomPx() {
      const bottom = this.bottom;
      return !isNaN(bottom) ? bottom + "px" : bottom;
    }
  },
  methods: {
    cancle() {
      this.$emit("cancle-click");
    }
  }
};
</script>

<style scoped lang="less">
.times-no-data {
  padding: 35px 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .times-describe {
    padding-top: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666;
    line-height: 14px;
  }
  .times-content {
    img {
      display: block;
      width: 145px;
      height: 166px;
    }
  }
}
</style>
