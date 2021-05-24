<template>
  <div class="times-button">
    <slot></slot>
    <div class="own-button">
      <div class="right" @click="submit">{{ rightText }}</div>
      <div class="left" @click="cancle" v-if="hasCancle">{{ leftText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "times-button",
  props: {
    rightText: {
      type: String,
      default: "去付款"
    },
    leftText: {
      type: String,
      default: "取消订单"
    },
    // 是否有取消订单按钮
    hasCancle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    cancle() {
      this.$emit("cancle-click");
    },
    submit() {
      this.$emit("submit-click");
    }
  }
};
</script>

<style scoped lang="less">
.times-button {
  display: flex;
  align-items: center;
  .own-button {
    width: 70%;
    display: flex;
    align-items: flex-end;
    flex-direction: row-reverse;
    .right {
      width: 80px;
      height: 38px;
      background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
      border-radius: 8px;
      text-align: center;
      color: #ffffff;
      line-height: 38px;
      margin-left: 20px;
    }
    .left {
      width: 80px;
      height: 38px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e5e5;
      text-align: center;
      line-height: 38px;
    }
  }
}
</style>
