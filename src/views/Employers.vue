<template>
  <div class="employers">
    <EmployerDashboard />
  </div>
</template>

<script>
import EmployerDashboard from '@/components/EmployerDashboard.vue'

export default {
  name: 'Employers',
  components: {
    EmployerDashboard
  }
}
</script>

<style scoped>
.employers {
  padding: 20px;
}
</style>