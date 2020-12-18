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
      height: 100
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
  mounted() {
    for (let i = 0; i < this.useData.length; i++) {
      this.data.push({
        x: this.useData[i].date,
        y: this.useData[i].num
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import 'chart';
</style>
