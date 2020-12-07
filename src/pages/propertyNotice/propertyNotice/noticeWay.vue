<template>
  <div>
    <a-checkbox v-model="checked" @change="triggerChange({ checked:$event.target.checked })">
      APP提醒
    </a-checkbox>
    <a-radio-group v-show="checked" v-model="radioValue" @change="triggerChange({ radioValue:$event.target.value })">
      <a-radio value="0">全部住户</a-radio>
      <a-radio value="1">仅业主</a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  name: "noticeWay",
  props: ["value"],
  data() {
    const value = this.value || {};
    return {
      checked: value.checked || false,
      radioValue: value.radioValue || "0"
    }
  },
  watch: {
    value: function (val) {
      this.checked = val.checked || false;
      this.radioValue = val.radioValue || "0";
      console.log(this.checked)
    }
  },
  methods: {
    triggerChange(changedValue) {
      this.$emit("change", Object.assign({}, this.$data, changedValue));
    },
  }
}
</script>

<style scoped>

</style>
