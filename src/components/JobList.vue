<template>
    <div class="job-list">
        <h2>Available Jobs</h2>
        <ul>
            <li v-for="job in jobs" :key="job.id">{{ job.title }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'JobList',
    data() {
        return {
            jobs: [], // Fetch from API
        };
    },
};
</script>

<style scoped>
.job-list {
    padding: 20px;
}
</style>
