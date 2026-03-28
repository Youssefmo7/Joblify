<template>
    <div class="dashboard">
        <div class="dashboard__header">
            <h1 class="dashboard__title">My job postings</h1>
            <RouterLink to="/employer/post-job" class="btn-primary">
                + Post a job
            </RouterLink>
        </div>

        <div v-if="jobsStore.loading" class="state">Loading…</div>

        <div v-else-if="myJobs.length === 0" class="state">
            You haven't posted any jobs yet.
            <RouterLink to="/employer/post-job">
                Post your first job →
            </RouterLink>
        </div>

        <div v-else class="jobs-table">
            <div class="jobs-table__head">
                <span>Job title</span>
                <span>Status</span>
                <span>Applicants</span>
                <span>Posted</span>
                <span>Actions</span>
            </div>
            <div v-for="job in myJobs" :key="job.id" class="jobs-table__row">
                <div class="jobs-table__cell jobs-table__cell--title">
                    <p class="job-title">{{ job.title }}</p>
                    <p class="job-sub">
                        {{ job.location }} · {{ formatWorkType(job.workType) }}
                    </p>
                </div>
                <div class="jobs-table__cell">
                    <span :class="['status-badge', `status--${job.status}`]">
                        {{ job.status }}
                    </span>
                </div>
                <div class="jobs-table__cell">
                    <span class="applicant-count">
                        {{ job.applicantsCount }}
                    </span>
                </div>
                <div class="jobs-table__cell text-muted">
                    {{ formatDate(job.createdAt) }}
                </div>
                <div class="jobs-table__cell jobs-table__cell--actions">
                    <RouterLink
                        :to="`/employer/jobs/${job.id}/applicants`"
                        class="action-btn"
                    >
                        Applicants
                    </RouterLink>
                    <RouterLink
                        :to="`/employer/jobs/${job.id}/edit`"
                        class="action-btn"
                    >
                        Edit
                    </RouterLink>
                    <button
                        class="action-btn action-btn--danger"
                        @click="deleteJob(job.id)"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';

const authStore = useAuthStore();
const jobsStore = useJobsStore();

const myJobs = computed(() => jobsStore.myJobs(authStore.currentUser?.id));

async function deleteJob(id) {
    if (confirm('Delete this job posting?')) {
        await jobsStore.deleteJob(id);
    }
}

function formatWorkType(t) {
    return { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' }[t] || t;
}
function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

onMounted(() => jobsStore.fetchJobs());
</script>

<style scoped>
.dashboard {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 16px;
}
.dashboard__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
.dashboard__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.btn-primary {
    padding: 9px 20px;
    background: #e8246a;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    text-decoration: none;
}
.state {
    text-align: center;
    padding: 60px;
    color: var(--color-text-secondary);
    font-size: 14px;
}
.state a {
    color: #534ab7;
}
.jobs-table {
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
}
.jobs-table__head {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
    padding: 12px 20px;
    background: var(--color-background-secondary);
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    gap: 12px;
}
.jobs-table__row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
    padding: 16px 20px;
    border-top: 1px solid var(--color-border-tertiary);
    align-items: center;
    gap: 12px;
    background: var(--color-background-primary);
}
.jobs-table__row:hover {
    background: var(--color-background-secondary);
}
.job-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 2px;
}
.job-sub {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.status-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 99px;
    text-transform: capitalize;
}
.status--approved {
    background: #eaf3de;
    color: #3b6d11;
}
.status--pending {
    background: #faeeda;
    color: #854f0b;
}
.status--rejected {
    background: #fcebeb;
    color: #a32d2d;
}
.applicant-count {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
}
.text-muted {
    font-size: 13px;
    color: var(--color-text-secondary);
}
.jobs-table__cell--actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}
.action-btn {
    font-size: 12px;
    padding: 5px 12px;
    border-radius: 6px;
    border: 1px solid var(--color-border-secondary);
    background: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
}
.action-btn:hover {
    border-color: #534ab7;
    color: #534ab7;
}
.action-btn--danger:hover {
    border-color: var(--color-border-danger);
    color: var(--color-text-danger);
}
</style>
