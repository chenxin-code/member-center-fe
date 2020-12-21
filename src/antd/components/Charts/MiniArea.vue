<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="日期*数量" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

const tooltip = [
  '日期*数量',
  (日期, 数量) => ({
    日期: 日期,
    数量: 数量
  })
];
const scale = [
  {
    dataKey: '日期',
    min: 2
  },
  {
    dataKey: '数量',
    title: '会员数量',
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
            日期: newVal[i].date,
            数量: newVal[i].memberCount
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
