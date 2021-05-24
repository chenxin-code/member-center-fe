<template>
  <div class="times-nav-bar">
    <van-nav-bar left-arrow class="van-nav--self">
      <template #left>
        <div class="van-nav-left" @click="onBack">
          <van-icon name="arrow-left" size="18" color="#333333" />
          <div class="title">
            {{ title }}
          </div>
        </div>
      </template>
      <template #right>
        <slot name="right"></slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "times-nav-bar",
  props: {
    title: {
      type: String,
      default: "暂无数据"
    },
    iconTitle: {
      type: String,
      default: "定位"
    },
    localLogo: {
      type: String,
      default: () => require("@assets/images/global/img_local_icon.png")
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    //取消
    onLocation() {
      this.$emit("onLocation");
    },
    //回退
    onBack() {
      this.$emit("onBack");
    }
  }
};
</script>

<style lang="less" scoped>
.van-nav--self {
  .van-nav-left{
    display: flex;
    align-items: center;
  }
  .title {
    margin-left: 6px;
    .item-location {
      position: relative;
      .icon-location {
        display: block;
        width: 204px/2;
        height: 64px/2;
      }
      span {
        position: absolute;
        top: 5px;
        right: 40px;
      }
    }
  }
}
</style>
