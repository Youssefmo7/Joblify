<template>
    <div class="admin-page">
        <h1 class="admin-page__title">Pending job approvals</h1>
        <p class="admin-page__sub">
            {{ adminStore.stats.pendingCount }} job{{
                adminStore.stats.pendingCount !== 1 ? 's' : ''
            }}
            awaiting review
        </p>

        <div v-if="adminStore.loading" class="state">Loading…</div>
        <div
            v-else-if="adminStore.pendingJobs.length === 0"
            class="state state--empty"
        >
            All caught up! No pending jobs.
        </div>

        <div v-else class="pending-list">
            <div
                v-for="job in adminStore.pendingJobs"
                :key="job.id"
                class="pending-card"
            >
                <div class="pending-card__header">
                    <div>
                        <h2 class="pending-card__title">{{ job.title }}</h2>
                        <p class="pending-card__meta">
                            {{ job.company }} · {{ job.location }} ·
                            {{ formatWorkType(job.workType) }} ·
                            {{ job.category }}
                        </p>
                    </div>
                    <p class="pending-card__date">
                        Submitted {{ formatDate(job.createdAt) }}
                    </p>
                </div>

                <p class="pending-card__desc">
                    {{ truncate(job.description, 180) }}
                </p>

                <div class="pending-card__tags">
                    <span v-for="s in job.skills" :key="s" class="skill-chip">
                        {{ s }}
                    </span>
                    <span v-if="job.salaryMin" class="salary-chip">
                        ${{ formatSalary(job.salaryMin) }}–${{
                            formatSalary(job.salaryMax)
                        }}/yr
                    </span>
                </div>

                <!-- Rejection reason input -->
                <div v-if="rejectingId === job.id" class="reject-input">
                    <input
                        v-model="rejectReason"
                        class="form-input"
                        placeholder="Reason for rejection (shown to employer)…"
                    />
                    <div class="reject-actions">
                        <button
                            class="btn-confirm-reject"
                            @click="confirmReject(job.id)"
                        >
                            Confirm reject
                        </button>
                        <button class="btn-cancel" @click="rejectingId = null">
                            Cancel
                        </button>
                    </div>
                </div>

                <div v-else class="pending-card__actions">
                    <button class="btn-approve" @click="approve(job.id)">
                        Approve
                    </button>
                    <button class="btn-reject" @click="startReject(job.id)">
                        Reject
                    </button>
                    <RouterLink :to="`/jobs/${job.id}`" class="btn-view">
                        Preview
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();
const rejectingId = ref(null);
const rejectReason = ref('');

async function approve(jobId) {
    await adminStore.approveJob(jobId);
}

function startReject(jobId) {
    rejectingId.value = jobId;
    rejectReason.value = '';
}

async function confirmReject(jobId) {
    await adminStore.rejectJob(jobId, rejectReason.value);
    rejectingId.value = null;
}

function formatWorkType(t) {
    return { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' }[t] || t;
}
function formatSalary(n) {
    return n >= 1000 ? `${Math.round(n / 1000)}k` : n;
}
function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
function truncate(t, max) {
    return t?.length > max ? t.slice(0, max) + '…' : t;
}

onMounted(() => adminStore.loadDashboard());
</script>

<style scoped>
.admin-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 16px;
}
.admin-page__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 4px;
}
.admin-page__sub {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0 0 24px;
}
.state {
    text-align: center;
    padding: 60px;
    color: var(--color-text-secondary);
    font-size: 14px;
}
.state--empty {
    color: #3b6d11;
}
.pending-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.pending-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.pending-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 8px;
}
.pending-card__title {
    font-size: 17px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 4px;
}
.pending-card__meta {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0;
    text-transform: capitalize;
}
.pending-card__date {
    font-size: 12px;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
}
.pending-card__desc {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
}
.pending-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.skill-chip {
    font-size: 12px;
    background: #eeedfe;
    color: #534ab7;
    padding: 3px 10px;
    border-radius: 99px;
}
.salary-chip {
    font-size: 12px;
    background: #e1f5ee;
    color: #0f6e56;
    padding: 3px 10px;
    border-radius: 99px;
    font-weight: 500;
}
.pending-card__actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}
.btn-approve {
    padding: 8px 20px;
    background: #1d9e75;
    color: #fff;
    border: none;
    border-radius: var(--border-radius-md);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}
.btn-approve:hover {
    opacity: 0.88;
}
.btn-reject {
    padding: 8px 20px;
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
.btn-view {
    font-size: 13px;
    color: #534ab7;
    text-decoration: none;
    padding: 8px 16px;
    border: 1px solid #cecbf6;
    border-radius: var(--border-radius-md);
}
.reject-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.form-input {
    padding: 9px 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    outline: none;
    width: 100%;
    box-sizing: border-box;
}
.form-input:focus {
    border-color: #534ab7;
}
.reject-actions {
    display: flex;
    gap: 10px;
}
.btn-confirm-reject {
    padding: 7px 16px;
    background: #e24b4a;
    color: #fff;
    border: none;
    border-radius: var(--border-radius-md);
    font-size: 13px;
    cursor: pointer;
}
.btn-cancel {
    padding: 7px 16px;
    background: none;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 13px;
    color: var(--color-text-secondary);
    cursor: pointer;
}
</style>
