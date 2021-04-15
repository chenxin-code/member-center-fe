<template>
  <a-result status="500" title="500" sub-title="Sorry, the server is reporting an error.">
    <template #extra>
      <a-button type="primary" @click="toLogin">
        Go Back
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception500',
  methods: {
    toLogin() {
      // this.$router.replace({ path: '/' });
      this.$router.go(-1);
    }
  }
};
</script>
