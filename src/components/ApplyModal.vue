<template>
    <div class="job-card">
        <!-- Header row -->
        <div class="job-card__header">
            <div class="job-card__logo">
                <img
                    v-if="job.companyLogo"
                    :src="job.companyLogo"
                    :alt="job.company"
                />
                <span v-else class="job-card__logo-fallback">
                    {{ job.company[0] }}
                </span>
            </div>

            <div class="job-card__meta">
                <h2 class="job-card__title" @click="goToJob">
                    {{ job.title }}
                </h2>
                <p class="job-card__company">{{ job.company }}</p>
                <p class="job-card__location">
                    {{ job.location }}
                    <span class="job-card__dot">•</span>
                    <span
                        :class="[
                            'job-card__badge',
                            `job-card__badge--${job.workType}`,
                        ]"
                    >
                        {{ formatWorkType(job.workType) }}
                    </span>
                    <span
                        v-if="job.promoted"
                        class="job-card__badge job-card__badge--promoted"
                    >
                        Promoted
                    </span>
                </p>
            </div>

            <!-- Options menu (employer only) -->
            <button
                v-if="isOwner"
                class="job-card__menu-btn"
                @click.stop="toggleMenu"
                aria-label="Job options"
            >
                ···
            </button>
            <div v-if="menuOpen && isOwner" class="job-card__dropdown">
                <button @click="$router.push(`/employer/jobs/${job.id}/edit`)">
                    Edit
                </button>
                <button
                    @click="$router.push(`/employer/jobs/${job.id}/applicants`)"
                >
                    View applicants
                </button>
                <button class="danger" @click="handleDelete">Delete</button>
            </div>
        </div>

        <!-- Salary + skill tags -->
        <div class="job-card__tags">
            <span v-if="job.salaryMin" class="job-card__salary">
                ${{ formatSalary(job.salaryMin) }} – ${{
                    formatSalary(job.salaryMax)
                }}/yr
            </span>
            <span
                v-for="skill in job.skills.slice(0, 3)"
                :key="skill"
                class="job-card__skill"
            >
                {{ skill }}
            </span>
        </div>

        <!-- Description preview -->
        <p class="job-card__description">
            {{ truncate(job.description, 140) }}
        </p>

        <!-- Footer row -->
        <div class="job-card__footer">
            <span class="job-card__posted">
                {{ timeAgo(job.createdAt) }} •
                {{ job.applicantsCount }} applicant{{
                    job.applicantsCount !== 1 ? 's' : ''
                }}
            </span>

            <div class="job-card__actions">
                <!-- Save button (candidate only) -->
                <button
                    v-if="authStore.isCandidate"
                    class="job-card__save"
                    :class="{ saved: isSaved }"
                    @click.stop="handleSave"
                >
                    {{ isSaved ? 'Saved' : 'Save' }}
                </button>

                <!-- Apply / Applied -->
                <button
                    v-if="authStore.isCandidate"
                    class="job-card__apply"
                    :class="{ applied: hasApplied }"
                    :disabled="hasApplied"
                    @click.stop="$emit('apply', job)"
                >
                    {{ hasApplied ? 'Applied' : 'Apply Now' }}
                </button>

                <!-- Employer: pending badge -->
                <span
                    v-if="isOwner && job.status === 'pending'"
                    class="job-card__status pending"
                >
                    Pending approval
                </span>
                <span
                    v-if="isOwner && job.status === 'rejected'"
                    class="job-card__status rejected"
                >
                    Rejected
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const props = defineProps({
    job: { type: Object, required: true },
});

const emit = defineEmits(['apply', 'deleted']);

const router = useRouter();
const authStore = useAuthStore();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();
const menuOpen = ref(false);

const isOwner = computed(
    () =>
        authStore.isEmployer &&
        authStore.currentUser?.id === props.job.employerId
);

const isSaved = computed(() =>
    authStore.currentUser?.savedJobs?.includes(props.job.id)
);

const hasApplied = computed(
    () =>
        authStore.isCandidate &&
        appsStore.hasApplied(props.job.id, authStore.currentUser?.id)
);

function goToJob() {
    router.push(`/jobs/${props.job.id}`);
}

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
}

async function handleSave() {
    await authStore.toggleSaveJob(props.job.id);
}

async function handleDelete() {
    if (confirm('Delete this job posting?')) {
        await jobsStore.deleteJob(props.job.id);
        emit('deleted', props.job.id);
    }
    menuOpen.value = false;
}

// ── Formatters ────────────────────────────────────────────────
function formatWorkType(type) {
    return (
        { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' }[type] || type
    );
}

function formatSalary(n) {
    return n >= 1000 ? `${Math.round(n / 1000)}k` : n;
}

function truncate(text, max) {
    return text?.length > max ? text.slice(0, max) + '…' : text;
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `Posted ${mins} minute${mins !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `Posted ${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `Posted ${days} day${days !== 1 ? 's' : ''} ago`;
}
</script>

<style scoped>
.job-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: box-shadow 0.15s;
    position: relative;
}
.job-card:hover {
    border-color: var(--color-border-secondary);
}

/* Header */
.job-card__header {
    display: flex;
    gap: 14px;
    align-items: flex-start;
}
.job-card__logo {
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
.job-card__logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.job-card__logo-fallback {
    font-size: 20px;
    font-weight: 500;
    color: var(--color-text-secondary);
}
.job-card__meta {
    flex: 1;
}
.job-card__title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-primary);
    cursor: pointer;
    margin: 0 0 2px;
    line-height: 1.3;
}
.job-card__title:hover {
    text-decoration: underline;
}
.job-card__company {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0 0 4px;
}
.job-card__location {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}
.job-card__dot {
    color: var(--color-border-secondary);
}

/* Badges */
.job-card__badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 99px;
    font-weight: 500;
}
.job-card__badge--remote {
    background: #e1f5ee;
    color: #0f6e56;
}
.job-card__badge--onsite {
    background: #e6f1fb;
    color: #185fa5;
}
.job-card__badge--hybrid {
    background: #faeeda;
    color: #854f0b;
}
.job-card__badge--promoted {
    background: #eeedfe;
    color: #534ab7;
}

/* Tags row */
.job-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}
.job-card__salary {
    font-size: 12px;
    font-weight: 500;
    background: #e1f5ee;
    color: #0f6e56;
    padding: 3px 10px;
    border-radius: 99px;
}
.job-card__skill {
    font-size: 12px;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    padding: 3px 10px;
    border-radius: 99px;
    border: 1px solid var(--color-border-tertiary);
}

/* Description */
.job-card__description {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
}

/* Footer */
.job-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
.job-card__posted {
    font-size: 12px;
    color: var(--color-text-tertiary);
}
.job-card__actions {
    display: flex;
    gap: 8px;
    align-items: center;
}
.job-card__save {
    font-size: 13px;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1px solid var(--color-border-secondary);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.job-card__save:hover,
.job-card__save.saved {
    border-color: #534ab7;
    color: #534ab7;
    background: #eeedfe;
}
.job-card__apply {
    font-size: 13px;
    font-weight: 500;
    padding: 7px 18px;
    border-radius: 8px;
    border: none;
    background: #e8246a;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.15s;
}
.job-card__apply:hover {
    opacity: 0.88;
}
.job-card__apply.applied {
    background: var(--color-background-secondary);
    color: var(--color-text-tertiary);
    cursor: default;
}
.job-card__apply:disabled {
    cursor: default;
}

/* Status badges */
.job-card__status {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 99px;
    font-weight: 500;
}
.job-card__status.pending {
    background: #faeeda;
    color: #854f0b;
}
.job-card__status.rejected {
    background: #fcebeb;
    color: #a32d2d;
}

/* Options menu */
.job-card__menu-btn {
    background: none;
    border: none;
    font-size: 18px;
    color: var(--color-text-tertiary);
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
}
.job-card__dropdown {
    position: absolute;
    top: 20px;
    right: 20px;
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    display: flex;
    flex-direction: column;
    z-index: 10;
    min-width: 160px;
    overflow: hidden;
}
.job-card__dropdown button {
    padding: 10px 16px;
    text-align: left;
    font-size: 13px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-primary);
}
.job-card__dropdown button:hover {
    background: var(--color-background-secondary);
}
.job-card__dropdown button.danger {
    color: var(--color-text-danger);
}
</style>
