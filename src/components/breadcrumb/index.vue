<template>
  <a-breadcrumb style="line-height: 64px">
    <a-breadcrumb-item v-for="(item, index) in routers" :key="index">
      <router-link :to="item.path">{{ item.name }}</router-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      routers: []
    };
  },
  props: {
    //暂时没用
    msg: String
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      this.routers = this.$route.meta.bread;
    }
  },
  watch: {
    $route() {
      this.routers = this.$route.meta.bread;
    },
    // routers: {
    //   handler(newVal) {
    //     console.log('routers newVal:>> ', newVal);
    //   },
    //   immediate: true, //刷新加载 立马触发一次handler
    //   deep: true // 可以深度检测到 ownerList 对象的属性值的变化
    // }
  }
};
</script>
<style scoped></style>
