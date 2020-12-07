<template>
  <div style="height: 100%;overflow: hidden;">
    <a-tabs class="tabs-with-padding" default-active-key="1" @change="changeTab" :animated="true">
      <a-tab-pane key="1" tab="行政 ">
        <hcmUserComponent tabKey="1" :tableRefresh="tableRefresh" :pageRefresh="pageRefresh"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="项目">
        <hcmUserComponent tabKey="2"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import hcmUserComponent from "./hcmUserComponent";

  export default {
    name: "hcmUser",
    components: {
      hcmUserComponent
    },
    data: () => ({
      tabKey: "1",
      tableRefresh: false,
      pageRefresh: true
    }),
    beforeRouteLeave(to, from, next) {
      if (to.name === "addHcmUser" || to.name === "authorizeHcmUser") {
        this.tableRefresh = true;
        this.pageRefresh = false
      }else {
        this.pageRefresh = true
      }
      next();
    },
    methods: {
      changeTab(key) {
        this.tabKey = key;
      }
    }
  }
</script>

<style lang="less">
  .ant-input-search .ant-input-suffix {
    right: 18px;
  }

  .ant-tabs, .ant-tabs .ant-tabs-top-content, .ant-tabs .ant-tabs-bottom-content {
    height: 100%;
  }

  .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane, .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
    transition: none;
  }

  .ant-tabs .ant-tabs-top-content.ant-tabs-content-animated, .ant-tabs .ant-tabs-bottom-content.ant-tabs-content-animated {
    transition: none;
  }
</style>
