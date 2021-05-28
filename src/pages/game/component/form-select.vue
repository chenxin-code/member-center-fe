<template>
  <div class="times-form-main">
    <div calss="times-form-title">
      {{ title }}
      <slot name="title"></slot>
    </div>
    <div class="times-form-content">
      <a-select style="width: 200px" @change="handleChange" v-bind="$attrs">
        <a-select-option :value="opt.value" v-for="(opt, index) in optionObj" :key="index">
          {{ opt.name }}
        </a-select-option>
      </a-select>
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
    optionObj: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('select-option', val);
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
