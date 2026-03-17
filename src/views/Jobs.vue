<template>
  <div class="jobs">
    <JobList />
  </div>
</template>

<script>
import JobList from '@/components/JobList.vue'

export default {
  name: 'Jobs',
  components: {
    JobList
  }
}
</script>

<style scoped>
.jobs {
  padding: 20px;
}
</style>