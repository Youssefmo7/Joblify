<template>
    <div class="applicants-page">
        <div class="applicants-header">
            <RouterLink to="/employer/dashboard" class="back-link">
                ← Back
            </RouterLink>
            <h1 class="applicants-title">Applicants for: {{ jobTitle }}</h1>
        </div>

        <div v-if="appsStore.loading" class="state">Loading applicants…</div>

        <div v-else-if="applications.length === 0" class="state">
            No applications yet for this job.
        </div>

        <div v-else class="applicants-list">
            <div
                v-for="app in applications"
                :key="app.id"
                class="applicant-card"
            >
                <div class="applicant-card__header">
                    <div>
                        <p class="applicant-name">
                            Candidate #{{ app.candidateId }}
                        </p>
                        <p class="applicant-method">
                            Applied via {{ app.applyMethod }}
                        </p>
                    </div>
                    <span :class="['status-badge', `status--${app.status}`]">
                        {{ app.status }}
                    </span>
                </div>

                <!-- Contact info (contact method) -->
                <div
                    v-if="app.applyMethod === 'contact'"
                    class="applicant-contact"
                >
                    <p>
                        <strong>Email:</strong>
                        {{ app.contactEmail }}
                    </p>
                    <p>
                        <strong>Phone:</strong>
                        {{ app.contactPhone }}
                    </p>
                </div>

                <!-- Resume link -->
                <div v-if="app.resumeUrl" class="applicant-resume">
                    <a
                        href="https://writing.colostate.edu/guides/documents/resume/functionalsample.pdf"
                        target="_blank"
                        class="resume-link"
                    >
                        View resume →
                    </a>
                </div>

                <!-- Cover note -->
                <p v-if="app.coverNote" class="applicant-note">
                    "{{ app.coverNote }}"
                </p>

                <p class="applicant-date">
                    Applied {{ formatDate(app.createdAt) }}
                </p>

                <!-- Actions -->
                <div v-if="app.status === 'pending'" class="applicant-actions">
                    <button
                        class="btn-accept"
                        :disabled="appsStore.loading"
                        @click="respond(app.id, 'accepted')"
                    >
                        Accept
                    </button>
                    <button
                        class="btn-reject"
                        :disabled="appsStore.loading"
                        @click="respond(app.id, 'rejected')"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const route = useRoute();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();

const jobId = computed(() => Number(route.params.id));

const jobTitle = computed(
    () => jobsStore.currentJob?.title || `Job #${jobId.value}`
);

const applications = computed(() => appsStore.applicationsForJob(jobId.value));

async function respond(appId, status) {
    await appsStore.respondToApplication(appId, status);
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

onMounted(async () => {
    await jobsStore.fetchJob(jobId.value);
    await appsStore.fetchApplicationsForJob(jobId.value);
});
</script>

<style scoped>
.applicants-page {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 16px;
}
.applicants-header {
    margin-bottom: 24px;
}
.back-link {
    font-size: 13px;
    color: #534ab7;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
}
.applicants-title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.state {
    text-align: center;
    padding: 60px;
    color: var(--color-text-secondary);
    font-size: 14px;
}
.applicants-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.applicant-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.applicant-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.applicant-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 2px;
}
.applicant-method {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
    text-transform: capitalize;
}
.applicant-contact p {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0 0 4px;
}
.resume-link {
    font-size: 13px;
    color: #534ab7;
}
.applicant-note {
    font-size: 13px;
    color: var(--color-text-secondary);
    font-style: italic;
    margin: 0;
}
.applicant-date {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.applicant-actions {
    display: flex;
    gap: 10px;
}
.status-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 99px;
    text-transform: capitalize;
}
.status--pending {
    background: #faeeda;
    color: #854f0b;
}
.status--accepted {
    background: #eaf3de;
    color: #3b6d11;
}
.status--rejected {
    background: #fcebeb;
    color: #a32d2d;
}
.btn-accept {
    padding: 7px 18px;
    background: #1d9e75;
    color: #fff;
    border: none;
    border-radius: var(--border-radius-md);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}
.btn-accept:hover {
    opacity: 0.88;
}
.btn-reject {
    padding: 7px 18px;
    background: none;
    color: var(--color-text-danger);
    border: 1px solid var(--color-border-danger);
    border-radius: var(--border-radius-md);
    font-size: 13px;
    cursor: pointer;
}
.btn-reject:hover {
    background: #fcebeb;
}
</style>
