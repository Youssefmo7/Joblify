<template>
  <div class="layout-page">
    <iframe :src="layoutSrc" class="layout-frame" title="Layout page"></iframe>
  </div>
</template>

<script>
export default {
  name: "LayoutPage",
  computed: {
    layoutSrc() {
      const file = this.$route.meta.layoutFile || "index.html";
      return `/layout/${file}`;
    },
  },
};
</script>

<style scoped>
.layout-page {
  width: 100%;
  min-height: 100vh;
}

.layout-frame {
  width: 100%;
  height: calc(100vh - 2px);
  border: 0;
  display: block;
}
</style>
