<template>
  <div class="times-form-main">
    <div calss="times-form-title">
      {{ title }}:
      <slot name="title"></slot>
    </div>
    <div class="times-form-content">
      <a-input v-model="currentValue" v-bind="$attrs" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String || Number,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    currentValue: {
      set(v) {
        this.$emit('input', v);
      },
      get() {
        return this.value;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.times-form-main {
  display: flex;
  align-items: center;
  .times-form-content {
    margin-left: 15px;
  }
}
</style>
