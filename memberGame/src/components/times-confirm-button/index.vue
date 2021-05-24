<template>
  <div class="travel-submit">
    <div class="bottom-button" @click="submit">
      <div class="confirm-button">{{ buttonText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "times-confirm-button",
  props: {
    buttonText: {
      type: String,
      default: "确定"
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
.bottom-button {
  width: 375px;
  height: 98px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  position: fixed;
  bottom: 0;
  .confirm-button {
    margin-top: 13px;
    width: 324px;
    height: 49px;
    background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
    border-radius: 12px;
    margin-left: 25px;
    text-align: center;
    line-height: 49px;
    color: #ffffff;
    font-size: 14px;
  }
}
</style>
