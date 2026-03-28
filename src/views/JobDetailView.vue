<template>
    <div class="detail-page" v-if="job">
        <!-- Header -->
        <div class="detail-header">
            <div class="detail-header__logo">
                <img
                    v-if="job.companyLogo"
                    :src="job.companyLogo"
                    :alt="job.company"
                />
                <span v-else class="detail-header__logo-fallback">
                    {{ job.company[0] }}
                </span>
            </div>
            <div class="detail-header__meta">
                <h1 class="detail-header__title">{{ job.title }}</h1>
                <p class="detail-header__company">{{ job.company }}</p>
                <div class="detail-header__tags">
                    <span class="tag tag--location">{{ job.location }}</span>
                    <span :class="['tag', `tag--${job.workType}`]">
                        {{ formatWorkType(job.workType) }}
                    </span>
                    <span class="tag tag--exp">{{ job.experienceLevel }}</span>
                    <span v-if="job.salaryMin" class="tag tag--salary">
                        ${{ formatSalary(job.salaryMin) }} – ${{
                            formatSalary(job.salaryMax)
                        }}/yr
                    </span>
                </div>
                <p class="detail-header__posted">
                    Posted {{ timeAgo(job.createdAt) }} ·
                    {{ job.applicantsCount }} applicants · Deadline
                    {{ formatDate(job.deadline) }}
                </p>
            </div>

            <!-- Apply actions -->
            <div class="detail-header__actions">
                <button
                    v-if="authStore.isCandidate && !hasApplied"
                    class="btn-primary"
                    @click="showApply = true"
                >
                    Apply now
                </button>
                <button
                    v-if="authStore.isCandidate && hasApplied"
                    class="btn-applied"
                    disabled
                >
                    Applied
                </button>
                <button
                    v-if="authStore.isCandidate"
                    :class="['btn-save', { saved: isSaved }]"
                    @click="authStore.toggleSaveJob(job.id)"
                >
                    {{ isSaved ? 'Saved' : 'Save' }}
                </button>
            </div>
        </div>

        <!-- Apply panel — renders inline below the header, no overlay -->
        <ApplyModal
            v-if="showApply"
            :job="job"
            @close="showApply = false"
            @success="handleApplySuccess"
        />

        <!-- Body -->
        <div class="detail-body">
            <div class="detail-main">
                <!-- Description -->
                <section class="detail-section">
                    <h2 class="detail-section__title">About the role</h2>
                    <p class="detail-section__text">{{ job.description }}</p>
                </section>

                <!-- Responsibilities -->
                <section class="detail-section">
                    <h2 class="detail-section__title">Responsibilities</h2>
                    <ul class="detail-list">
                        <li v-for="item in job.responsibilities" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <!-- Requirements -->
                <section class="detail-section">
                    <h2 class="detail-section__title">Requirements</h2>
                    <ul class="detail-list">
                        <li v-for="item in job.requirements" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <!-- Benefits -->
                <section v-if="job.benefits?.length" class="detail-section">
                    <h2 class="detail-section__title">Benefits</h2>
                    <div class="detail-chips">
                        <span v-for="b in job.benefits" :key="b" class="chip">
                            {{ b }}
                        </span>
                    </div>
                </section>

                <!-- Skills -->
                <section class="detail-section">
                    <h2 class="detail-section__title">Skills</h2>
                    <div class="detail-chips">
                        <span
                            v-for="s in job.skills"
                            :key="s"
                            class="chip chip--skill"
                        >
                            {{ s }}
                        </span>
                    </div>
                </section>

                <!-- Comments -->
                <section class="detail-section">
                    <h2 class="detail-section__title">Comments</h2>

                    <!-- Post comment -->
                    <div v-if="authStore.isLoggedIn" class="comment-form">
                        <textarea
                            v-model="newComment"
                            class="comment-form__input"
                            rows="2"
                            placeholder="Ask a question or leave a comment…"
                        />
                        <button
                            class="btn-primary btn-sm"
                            :disabled="!newComment.trim() || postingComment"
                            @click="postComment"
                        >
                            {{ postingComment ? 'Posting…' : 'Post' }}
                        </button>
                    </div>
                    <p v-else class="comment-guest">
                        <RouterLink to="/login">Sign in</RouterLink>
                        to leave a comment.
                    </p>

                    <!-- Comment list -->
                    <div class="comment-list">
                        <div
                            v-if="visibleComments.length === 0"
                            class="comment-empty"
                        >
                            No comments yet. Be the first!
                        </div>
                        <div
                            v-for="c in visibleComments"
                            :key="c.id"
                            class="comment-item"
                        >
                            <div class="comment-item__header">
                                <span class="comment-item__name">
                                    {{ c.userName }}
                                </span>
                                <span
                                    :class="[
                                        'comment-item__role',
                                        `role--${c.userRole}`,
                                    ]"
                                >
                                    {{ c.userRole }}
                                </span>
                                <span class="comment-item__time">
                                    {{ timeAgo(c.createdAt) }}
                                </span>
                                <!-- Admin: hide button -->
                                <button
                                    v-if="authStore.isAdmin"
                                    class="comment-item__hide"
                                    @click="hideComment(c.id)"
                                >
                                    Hide
                                </button>
                            </div>
                            <p class="comment-item__text">{{ c.text }}</p>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Sidebar -->
            <aside class="detail-sidebar">
                <div class="detail-sidebar__card">
                    <h3 class="detail-sidebar__title">Job overview</h3>
                    <div class="overview-row">
                        <span class="overview-row__label">Category</span>
                        <span class="overview-row__value">
                            {{ job.category }}
                        </span>
                    </div>
                    <div class="overview-row">
                        <span class="overview-row__label">Work type</span>
                        <span class="overview-row__value">
                            {{ formatWorkType(job.workType) }}
                        </span>
                    </div>
                    <div class="overview-row">
                        <span class="overview-row__label">Experience</span>
                        <span class="overview-row__value">
                            {{ job.experienceLevel }}
                        </span>
                    </div>
                    <div class="overview-row">
                        <span class="overview-row__label">Deadline</span>
                        <span class="overview-row__value">
                            {{ formatDate(job.deadline) }}
                        </span>
                    </div>
                    <div v-if="job.salaryMin" class="overview-row">
                        <span class="overview-row__label">Salary</span>
                        <span class="overview-row__value">
                            ${{ formatSalary(job.salaryMin) }} – ${{
                                formatSalary(job.salaryMax)
                            }}/yr
                        </span>
                    </div>
                </div>
            </aside>
        </div>
    </div>

    <!-- Loading / not found -->
    <div v-else class="detail-loading">
        {{ jobsStore.loading ? 'Loading…' : 'Job not found.' }}
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import ApplyModal from '@/components/ApplyModal.vue';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const route = useRoute();
const authStore = useAuthStore();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();

const showApply = ref(false);
const newComment = ref('');
const postingComment = ref(false);
const comments = ref([]);

const job = computed(() => jobsStore.currentJob);

const isSaved = computed(() =>
    authStore.currentUser?.savedJobs?.includes(job.value?.id)
);

const hasApplied = computed(
    () =>
        authStore.isCandidate &&
        appsStore.hasApplied(job.value?.id, authStore.currentUser?.id)
);

const visibleComments = computed(() =>
    comments.value.filter((c) => c.status === 'visible')
);

// ── Data loading ──────────────────────────────────────────────
async function loadComments() {
    // Cast to Number — json-server stores jobId as a number,
    // route.params.id is always a string, causing a type mismatch with no results.
    const { data } = await axios.get(
        `${BASE_URL}/comments?jobId=${Number(route.params.id)}`
    );
    comments.value = data;
}

async function postComment() {
    if (!newComment.value.trim()) return;
    postingComment.value = true;
    try {
        const { data } = await axios.post(`${BASE_URL}/comments`, {
            jobId: Number(job.value.id), // always store as number
            userId: authStore.currentUser.id,
            userRole: authStore.currentUser.role,
            userName: authStore.currentUser.name,
            text: newComment.value.trim(),
            status: 'visible',
            createdAt: new Date().toISOString(),
        });
        comments.value.push(data);
        newComment.value = '';
    } catch (err) {
        console.error('Failed to post comment', err);
    } finally {
        postingComment.value = false;
    }
}

async function hideComment(commentId) {
    const c = comments.value.find((c) => c.id === commentId);
    if (!c) return;
    await axios.put(`${BASE_URL}/comments/${Number(commentId)}`, {
        ...c,
        id: Number(commentId),
        status: 'hidden',
    });
    c.status = 'hidden';
}

function handleApplySuccess() {
    showApply.value = false;
}

// ── Formatters ────────────────────────────────────────────────
function formatWorkType(t) {
    return { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' }[t] || t;
}
function formatSalary(n) {
    return n >= 1000 ? `${Math.round(n / 1000)}k` : n;
}
function formatDate(d) {
    return d
        ? new Date(d).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : '—';
}
function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

onMounted(async () => {
    await jobsStore.fetchJob(route.params.id);
    await loadComments();
    if (authStore.isCandidate) {
        await appsStore.fetchMyApplications(authStore.currentUser.id);
    }
});
</script>

<style scoped>
.detail-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px 16px;
}
.detail-loading {
    text-align: center;
    padding: 80px;
    color: var(--color-text-secondary);
}

/* Header */
.detail-header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 24px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}
.detail-header__logo {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--color-background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
}
.detail-header__logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.detail-header__logo-fallback {
    font-size: 24px;
    font-weight: 500;
    color: var(--color-text-secondary);
}
.detail-header__meta {
    flex: 1;
    min-width: 200px;
}
.detail-header__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 4px;
}
.detail-header__company {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0 0 10px;
}
.detail-header__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
}
.detail-header__posted {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.detail-header__actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-shrink: 0;
}

/* Tags */
.tag {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 99px;
    font-weight: 500;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
}
.tag--remote {
    background: #e1f5ee;
    color: #0f6e56;
}
.tag--onsite {
    background: #e6f1fb;
    color: #185fa5;
}
.tag--hybrid {
    background: #faeeda;
    color: #854f0b;
}
.tag--salary {
    background: #e1f5ee;
    color: #0f6e56;
}

/* Buttons */
.btn-primary {
    padding: 9px 20px;
    background: #e8246a;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
}
.btn-primary:hover:not(:disabled) {
    opacity: 0.88;
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: default;
}
.btn-sm {
    padding: 7px 16px;
    font-size: 13px;
}
.btn-applied {
    padding: 9px 20px;
    background: var(--color-background-secondary);
    color: var(--color-text-tertiary);
    font-size: 14px;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: default;
}
.btn-save {
    padding: 9px 16px;
    background: transparent;
    font-size: 14px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.btn-save.saved,
.btn-save:hover {
    border-color: #534ab7;
    color: #534ab7;
    background: #eeedfe;
}

/* Body layout */
.detail-body {
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 20px;
    align-items: start;
}
@media (max-width: 720px) {
    .detail-body {
        grid-template-columns: 1fr;
    }
}

/* Sections */
.detail-main {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.detail-section {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 24px;
    margin-bottom: 14px;
}
.detail-section__title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 14px;
}
.detail-section__text {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin: 0;
}
.detail-list {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.detail-list li {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
}
.detail-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.chip {
    font-size: 13px;
    padding: 4px 12px;
    border-radius: 99px;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border-tertiary);
}
.chip--skill {
    background: #eeedfe;
    color: #534ab7;
    border-color: transparent;
}

/* Comments */
.comment-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}
.comment-form__input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    resize: vertical;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    outline: none;
    box-sizing: border-box;
}
.comment-form__input:focus {
    border-color: #534ab7;
}
.comment-guest {
    font-size: 13px;
    color: var(--color-text-secondary);
}
.comment-guest a {
    color: #534ab7;
}
.comment-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.comment-empty {
    font-size: 13px;
    color: var(--color-text-tertiary);
    text-align: center;
    padding: 16px 0;
}
.comment-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--color-border-tertiary);
}
.comment-item:last-child {
    border-bottom: none;
}
.comment-item__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
}
.comment-item__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
}
.comment-item__role {
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 99px;
    font-weight: 500;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
}
.role--employer {
    background: #faece7;
    color: #993c1d;
}
.role--candidate {
    background: #eeedfe;
    color: #534ab7;
}
.comment-item__time {
    font-size: 11px;
    color: var(--color-text-tertiary);
    margin-left: auto;
}
.comment-item__hide {
    font-size: 11px;
    color: var(--color-text-danger);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}
.comment-item__text {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.6;
}

/* Sidebar */
.detail-sidebar__card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.detail-sidebar__title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.overview-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}
.overview-row__label {
    font-size: 13px;
    color: var(--color-text-secondary);
    text-transform: capitalize;
}
.overview-row__value {
    font-size: 13px;
    color: var(--color-text-primary);
    font-weight: 500;
    text-align: right;
    text-transform: capitalize;
}
</style>
