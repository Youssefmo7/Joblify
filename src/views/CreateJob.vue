<template>
    <div class="create-job-view">
        <CreateJob />
    </div>
</template>

<script>
import CreateJob from '@/components/CreateJob.vue';

export default {
    name: 'CreateJobView',
    components: {
        CreateJob,
    },
};
</script>
