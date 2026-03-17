<template>
  <div class="admin">
    <AdminDashboard />
  </div>
</template>

<script>
import AdminDashboard from '@/components/AdminDashboard.vue'

export default {
  name: 'Admin',
  components: {
    AdminDashboard
  }
}
</script>

<style scoped>
.admin {
  padding: 20px;
}
</style>