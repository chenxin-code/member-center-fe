<template>
  <div style="margin-bottom: 20px;">
    <div class="btn-wrapper">
      <a-button style="width: 408px;height: 35px;border: 1px dashed #D9D9D9;font-size: 12px;color: #666666;" @click="addText">+ 添加放行物品</a-button>
    </div>
    <div v-for="(item, index) in list" :key="index" style="display: flex;margin-top:20px;align-items: center">
      <div style="width:408px;display: flex;align-items: center;justify-content: space-between">
        <a-input v-model="item.name" style="width:197px;" placeholder="请输入物品名称"></a-input>
        <a-input v-model="item.count" style="width:197px;" placeholder="请输入物品数量"></a-input>
      </div>
      <a-icon type="minus-circle" style="margin-left: 20px;font-size: 24px;color: #999999" @click="deleteItem(index)"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "releaseGoods",
    props: ['value'],
    data() {
      return {
        list: this.value || [],
      };
    },
    created() {

    },
    watch: {
      value: function (val) {
        try {
          if (typeof val === 'string') {
            this.list = JSON.parse(val);
            console.log(this.list);
          }
        } catch (e) {
          console.error('JSON序列化失败');
        }
      }
    },
    methods: {
      text() {
        this.triggerChange(this.list);
      },
      addText() {
        this.list.push({ name: '',count:'' });
        this.triggerChange(this.list);
      },
      deleteItem(index) {
        this.list.splice(index, 1);
        this.triggerChange(this.list);
      },
      triggerChange(changedValue) {
        this.$emit('change', changedValue);
      },
    }
  }
</script>

<style lang="less" scoped>
  .btn-wrapper {
    display: flex;
    align-items: center;
  }

  .operate-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;

    .ant-btn {
      padding: 6px;

      &.hidden {
        visibility: hidden;
        cursor: default;
      }
    }
  }

</style>
