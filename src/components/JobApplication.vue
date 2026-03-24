<template>
    <div class="job-application">
        <h2>Apply for Job</h2>
        <form @submit.prevent="submitApplication">
            <input v-model="application.resume" placeholder="Resume" />
            <button type="submit">Apply</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'JobApplication',
    data() {
        return {
            application: { resume: '' },
        };
    },
    methods: {
        submitApplication() {
            // Submit logic
        },
    },
};
</script>

<style scoped>
.job-application {
    padding: 20px;
}
</style>
