<template>
  <div class="candidates">
    <CandidateDashboard />
  </div>
</template>

<script>
import CandidateDashboard from '@/components/CandidateDashboard.vue'

export default {
  name: 'Candidates',
  components: {
    CandidateDashboard
  }
}
</script>

<style scoped>
.candidates {
  padding: 20px;
}
</style>