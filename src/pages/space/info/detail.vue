<template>
  <div>
    <h4>路由信息: {{ routesInfo }}</h4>
  </div>
</template>

<script>
export default {
  computed: {
    routesInfo() {
      const { fullPath, path, name, params, query, meta } = this.$route;
      const obj = {
        fullPath,
        path,
        name,
        params,
        query,
        meta
      };
      return obj;
    }
  }
};
</script>

<style lang="less" scoped></style>
