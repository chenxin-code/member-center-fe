<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
];
const scale = [
  {
    dataKey: 'x',
    min: 2
  },
  {
    dataKey: 'y',
    title: '时间',
    min: 1,
    max: 22
  }
];

export default {
  name: 'MiniArea',
  data() {
    return {
      data: [],
      tooltip,
      scale,
      height: 120
    };
  },
  props: {
    useData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {},
  watch: {
    useData: {
      handler(newVal) {
        for (let i = 0; i < newVal.length; i++) {
          this.data.push({
            x: newVal[i].date,
            y: newVal[i].memberCount
          });
        }
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 ownerList 对象的属性值的变化
    }
  }
};
</script>

<style lang="less" scoped>
@import 'chart';
</style>
