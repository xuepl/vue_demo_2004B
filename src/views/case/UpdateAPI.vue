<template>
  <div>修改接口</div>
</template>

<script>
export default {
  name: 'APIResult',
  data() {
    return {
      apiId: null
    }
  },
  created() {
    this.apiId = this.$route.params.api_id
  }
}
</script>

<style scoped>

</style>
