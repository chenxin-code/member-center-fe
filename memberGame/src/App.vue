<template>
  <div id="app">
    <!-- <van-nav-bar
      class="nav-bar"
      :title="$route.meta.title"
      left-arrow
      @click-left="onClickLeft"
      v-if="$route.meta.previous"
    /> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "APP",
  data() {
    return {};
  },
  created() {
    const sessionStorge = this.$util.storages();
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // beforeunload事件在页面刷新时先触发
    window.addEventListener("beforeunload", () => {
      // sessionStorage.setItem("refreshflag", "1");
      // sessionStorage.setItem("store", JSON.stringify(this.$store.state));
      sessionStorge.set("refreshflag", 1);
      sessionStorge.set("store", this.$store.state);
    });
  },
  methods: {
    //返回页面
    onClickLeft() {
      this.$router.back();
    }
  }
};
</script>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f9f9f9 !important;
  background-color: #f3f3f3 !important;
}

.wx-style {
  margin-top: -52px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  word-break: break-all;

  /* rem style*/
  font-size: 0.24rem;

  /* viewport style */
  /* font-size: 12px; */
  max-width: 750px;
  margin: auto;
}

input,
textarea {
  -webkit-appearance: none;
}
</style>
