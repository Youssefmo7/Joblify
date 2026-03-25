<template>
    <div class="job-list space-y-4">
        <JobCard v-for="job in jobs" :key="job.id" :job="job" />
    </div>
</template>

<script>
import { useAppStore } from '@/store';
import JobCard from '@/components/job/JobCard.vue';

export default {
    name: 'JobList',
    components: {
        JobCard
    },
    computed: {
        jobs() {
            const store = useAppStore();
            return store.jobs.filter(job => job.status === 'active');
        }
    }
};
</script>

<style scoped>
.job-list {
    padding: 20px;
}
</style>
