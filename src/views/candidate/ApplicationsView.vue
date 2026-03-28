<template>
    <div class="apps-page">
        <div class="apps-page__header">
            <h1 class="apps-page__title">My applications</h1>
            <p class="apps-page__sub">
                {{ applications.length }} application{{
                    applications.length !== 1 ? 's' : ''
                }}
            </p>
        </div>

        <!-- Filter tabs -->
        <div class="filter-tabs">
            <button
                v-for="tab in tabs"
                :key="tab.value"
                :class="['filter-tab', { active: activeTab === tab.value }]"
                @click="activeTab = tab.value"
            >
                {{ tab.label }}
                <span class="filter-tab__count">
                    {{ countByStatus(tab.value) }}
                </span>
            </button>
        </div>

        <!-- Loading -->
        <div v-if="appsStore.loading" class="state">
            Loading your applications…
        </div>

        <!-- Empty -->
        <div v-else-if="filtered.length === 0" class="state">
            <p>
                No {{ activeTab === 'all' ? '' : activeTab }} applications yet.
            </p>
            <RouterLink to="/" class="state__link">Browse jobs</RouterLink>
        </div>

        <!-- Application cards -->
        <div v-else class="apps-list">
            <div v-for="app in filtered" :key="app.id" class="app-card">
                <!-- Job info (loaded lazily from jobsStore) -->
                <div class="app-card__job">
                    <div class="app-card__logo">
                        <img
                            v-if="getJob(app.jobId)?.companyLogo"
                            :src="getJob(app.jobId).companyLogo"
                            :alt="getJob(app.jobId).company"
                        />
                        <span v-else class="app-card__logo-fallback">
                            {{ getJob(app.jobId)?.company?.[0] || '?' }}
                        </span>
                    </div>
                    <div class="app-card__info">
                        <RouterLink
                            :to="`/jobs/${app.jobId}`"
                            class="app-card__title"
                        >
                            {{
                                getJob(app.jobId)?.title || `Job #${app.jobId}`
                            }}
                        </RouterLink>
                        <p class="app-card__company">
                            {{ getJob(app.jobId)?.company || '—' }}
                            <span v-if="getJob(app.jobId)?.location">
                                · {{ getJob(app.jobId).location }}
                            </span>
                        </p>
                    </div>
                </div>

                <!-- Status + method -->
                <div class="app-card__meta">
                    <span :class="['status-badge', `status--${app.status}`]">
                        {{ app.status }}
                    </span>
                    <span class="app-card__method">
                        via
                        {{
                            app.applyMethod === 'resume'
                                ? 'Resume'
                                : 'Contact info'
                        }}
                    </span>
                    <span class="app-card__date">
                        Applied {{ formatDate(app.createdAt) }}
                    </span>
                </div>

                <!-- Cover note preview -->
                <p v-if="app.coverNote" class="app-card__note">
                    "{{ truncate(app.coverNote, 120) }}"
                </p>

                <!-- Status message -->
                <div
                    v-if="app.status === 'accepted'"
                    class="app-card__alert app-card__alert--success"
                >
                    Congratulations! Your application was accepted. The employer
                    may contact you soon.
                </div>
                <div
                    v-if="app.status === 'rejected'"
                    class="app-card__alert app-card__alert--error"
                >
                    Unfortunately this application was not selected.
                </div>

                <!-- Actions -->
                <div class="app-card__actions">
                    <RouterLink :to="`/jobs/${app.jobId}`" class="btn-view">
                        View job
                    </RouterLink>
                    <button
                        v-if="app.status === 'pending'"
                        class="btn-cancel"
                        :disabled="appsStore.loading"
                        @click="cancelApp(app)"
                    >
                        Withdraw application
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const authStore = useAuthStore();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();

const activeTab = ref('all');

const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
];

const applications = computed(() =>
    appsStore.myApplications(authStore.currentUser?.id)
);

const filtered = computed(() => {
    if (activeTab.value === 'all') return applications.value;
    return applications.value.filter((a) => a.status === activeTab.value);
});

function countByStatus(status) {
    if (status === 'all') return applications.value.length;
    return applications.value.filter((a) => a.status === status).length;
}

function getJob(jobId) {
    return jobsStore.jobs.find((j) => j.id === jobId) || null;
}

async function cancelApp(app) {
    if (!confirm('Withdraw this application?')) return;
    await appsStore.cancelApplication(app.id, app.jobId);
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function truncate(text, max) {
    return text?.length > max ? text.slice(0, max) + '…' : text;
}

onMounted(async () => {
    await appsStore.fetchMyApplications(authStore.currentUser?.id);
    // Load all jobs so we can show job titles/logos
    if (jobsStore.jobs.length === 0) await jobsStore.fetchJobs();
});
</script>

<style scoped>
.apps-page {
    max-width: 780px;
    margin: 0 auto;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Header */
.apps-page__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.apps-page__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.apps-page__sub {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
}

/* Filter tabs */
.filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}
.filter-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 99px;
    border: 1px solid var(--color-border-secondary);
    background: none;
    font-size: 13px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.filter-tab.active {
    background: #534ab7;
    color: #fff;
    border-color: #534ab7;
}
.filter-tab__count {
    font-size: 11px;
    background: rgba(255, 255, 255, 0.25);
    padding: 1px 6px;
    border-radius: 99px;
    min-width: 18px;
    text-align: center;
}
.filter-tab:not(.active) .filter-tab__count {
    background: var(--color-background-secondary);
    color: var(--color-text-tertiary);
}

/* State */
.state {
    text-align: center;
    padding: 60px 0;
    color: var(--color-text-secondary);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
.state__link {
    font-size: 14px;
    color: #534ab7;
    text-decoration: none;
}

/* Application cards */
.apps-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.app-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.15s;
}
.app-card:hover {
    border-color: var(--color-border-secondary);
}

/* Job info row */
.app-card__job {
    display: flex;
    gap: 14px;
    align-items: center;
}
.app-card__logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--color-background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
}
.app-card__logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.app-card__logo-fallback {
    font-size: 20px;
    font-weight: 500;
    color: var(--color-text-secondary);
}
.app-card__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.app-card__title {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    text-decoration: none;
}
.app-card__title:hover {
    text-decoration: underline;
}
.app-card__company {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0;
}

/* Meta row */
.app-card__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
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
.app-card__method {
    font-size: 12px;
    color: var(--color-text-tertiary);
    background: var(--color-background-secondary);
    padding: 3px 8px;
    border-radius: 99px;
}
.app-card__date {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin-left: auto;
}

/* Cover note */
.app-card__note {
    font-size: 13px;
    color: var(--color-text-secondary);
    font-style: italic;
    margin: 0;
    padding: 10px 14px;
    background: var(--color-background-secondary);
    border-radius: var(--border-radius-md);
    border-left: 3px solid var(--color-border-secondary);
}

/* Alert messages */
.app-card__alert {
    font-size: 13px;
    padding: 10px 14px;
    border-radius: var(--border-radius-md);
    line-height: 1.5;
}
.app-card__alert--success {
    background: #eaf3de;
    color: #27500a;
    border: 1px solid #c0dd97;
}
.app-card__alert--error {
    background: #fcebeb;
    color: #791f1f;
    border: 1px solid #f7c1c1;
}

/* Actions */
.app-card__actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}
.btn-view {
    font-size: 13px;
    padding: 7px 16px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    color: var(--color-text-secondary);
    text-decoration: none;
    background: none;
    transition: all 0.15s;
}
.btn-view:hover {
    border-color: #534ab7;
    color: #534ab7;
}
.btn-cancel {
    font-size: 13px;
    padding: 7px 16px;
    border: 1px solid var(--color-border-danger);
    border-radius: var(--border-radius-md);
    color: var(--color-text-danger);
    background: none;
    cursor: pointer;
    transition: all 0.15s;
}
.btn-cancel:hover {
    background: #fcebeb;
}
.btn-cancel:disabled {
    opacity: 0.5;
    cursor: default;
}
</style>
