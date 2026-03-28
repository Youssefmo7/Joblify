<template>
    <div class="home">
        <!-- ── LEFT: Profile + Filters sidebar ──────────────────── -->
        <aside class="sidebar">
            <!-- Candidate profile card -->
            <div v-if="authStore.isCandidate" class="profile-card">
                <div class="profile-card__banner" />
                <div class="profile-card__body">
                    <img
                        class="profile-card__avatar"
                        :src="user.avatar || '/avatars/default.png'"
                        :alt="user.name"
                    />
                    <p class="profile-card__name">{{ user.name }}</p>
                    <p class="profile-card__title">
                        {{ user.title || 'Add your job title' }}
                    </p>
                    <div class="profile-card__stats">
                        <div class="profile-card__stat">
                            <span class="label">Profile views</span>
                            <span class="value">
                                {{ user.profileViews || 0 }}
                            </span>
                        </div>
                        <div class="profile-card__stat">
                            <span class="label">Post reach</span>
                            <span class="value">
                                {{ user.savedJobs?.length * 3 || 0 }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filter-box">
                <h3 class="filter-box__title">Filters</h3>

                <!-- Work type -->
                <div class="filter-group">
                    <p class="filter-group__label">Work type</p>
                    <label
                        v-for="type in workTypes"
                        :key="type.value"
                        class="checkbox-label"
                    >
                        <input
                            type="checkbox"
                            :value="type.value"
                            :checked="jobsStore.filters.workType === type.value"
                            @change="toggleWorkType(type.value)"
                        />
                        {{ type.label }}
                    </label>
                </div>

                <!-- Category -->
                <div class="filter-group">
                    <p class="filter-group__label">Category</p>
                    <select
                        class="filter-select"
                        :value="jobsStore.filters.category"
                        @change="
                            jobsStore.setFilter('category', $event.target.value)
                        "
                    >
                        <option value="">All categories</option>
                        <option
                            v-for="cat in categories"
                            :key="cat.value"
                            :value="cat.value"
                        >
                            {{ cat.label }}
                        </option>
                    </select>
                </div>

                <!-- Experience level -->
                <div class="filter-group">
                    <p class="filter-group__label">Experience level</p>
                    <select
                        class="filter-select"
                        :value="jobsStore.filters.experienceLevel"
                        @change="
                            jobsStore.setFilter(
                                'experienceLevel',
                                $event.target.value
                            )
                        "
                    >
                        <option value="">Any</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-level</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>

                <!-- Sort -->
                <div class="filter-group">
                    <p class="filter-group__label">Sort by</p>
                    <select
                        class="filter-select"
                        :value="jobsStore.filters.sortBy"
                        @change="
                            jobsStore.setFilter('sortBy', $event.target.value)
                        "
                    >
                        <option value="createdAt">Most recent</option>
                        <option value="salaryMin">Highest salary</option>
                        <option value="applicantsCount">Most applicants</option>
                    </select>
                </div>

                <button class="filter-reset" @click="jobsStore.resetFilters">
                    Reset filters
                </button>
            </div>
        </aside>

        <!-- ── CENTER: Job feed ───────────────────────────────────── -->
        <main class="feed">
            <!-- Search bar -->
            <div class="search-bar">
                <input
                    class="search-bar__input"
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    :value="jobsStore.filters.keyword"
                    @input="jobsStore.setFilter('keyword', $event.target.value)"
                />
                <input
                    class="search-bar__input search-bar__input--location"
                    type="text"
                    placeholder="Location"
                    :value="jobsStore.filters.location"
                    @input="
                        jobsStore.setFilter('location', $event.target.value)
                    "
                />
            </div>

            <!-- Loading -->
            <div v-if="jobsStore.loading" class="feed__state">
                Loading jobs…
            </div>

            <!-- Error -->
            <div
                v-else-if="jobsStore.error"
                class="feed__state feed__state--error"
            >
                {{ jobsStore.error }}
            </div>

            <!-- Empty -->
            <div
                v-else-if="jobsStore.filteredJobs.length === 0"
                class="feed__state"
            >
                No jobs found. Try adjusting your filters.
            </div>

            <!-- Job cards -->
            <div v-else class="feed__list">
                <template v-for="job in jobsStore.filteredJobs" :key="job.id">
                    <JobCard
                        :job="job"
                        @apply="openApplyPanel"
                        @deleted="handleDeleted"
                    />
                    <!-- Apply panel opens inline directly below the card that was clicked -->
                    <ApplyModal
                        v-if="applyTarget?.id === job.id"
                        :job="job"
                        @close="applyTarget = null"
                        @success="handleApplySuccess"
                    />
                </template>
            </div>
        </main>

        <!-- ── RIGHT: Sidebar widgets ─────────────────────────────── -->
        <aside class="widgets">
            <!-- Top skills -->
            <div class="widget">
                <h3 class="widget__title">Top skills for you</h3>
                <div
                    v-for="skill in topSkills"
                    :key="skill.name"
                    class="skill-row"
                >
                    <div>
                        <p class="skill-row__name">{{ skill.name }}</p>
                        <p class="skill-row__count">{{ skill.count }}+ jobs</p>
                    </div>
                    <button
                        class="skill-row__add"
                        @click="jobsStore.setFilter('keyword', skill.name)"
                    >
                        +
                    </button>
                </div>
            </div>

            <!-- Employer CTA -->
            <div
                v-if="!authStore.isLoggedIn || authStore.isEmployer"
                class="widget widget--cta"
            >
                <div class="widget__avatar-placeholder">HI</div>
                <p class="widget__cta-title">Hire top talent easily</p>
                <p class="widget__cta-sub">
                    Post a job and reach thousands of professionals.
                </p>
                <RouterLink to="/employer/post-job" class="widget__cta-btn">
                    Post a job
                </RouterLink>
            </div>
        </aside>

        <!-- Apply modal removed — now renders inline below each job card -->
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import JobCard from '@/components/JobCard.vue';
import ApplyModal from '@/components/ApplyModal.vue';

const authStore = useAuthStore();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();

const applyTarget = ref(null);
const user = computed(() => authStore.currentUser || {});

const workTypes = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' },
];

const categories = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'management', label: 'Management' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
];

const topSkills = [
    { name: 'Vue.js', count: '2,400' },
    { name: 'React', count: '5,100' },
    { name: 'Python', count: '4,200' },
    { name: 'Figma', count: '1,800' },
];

function toggleWorkType(value) {
    const current = jobsStore.filters.workType;
    jobsStore.setFilter('workType', current === value ? '' : value);
}

function openApplyPanel(job) {
    if (!authStore.isLoggedIn) return;
    // toggle: clicking Apply on the same job closes the panel
    applyTarget.value = applyTarget.value?.id === job.id ? null : job;
}

function handleApplySuccess() {
    applyTarget.value = null;
}

function handleDeleted(jobId) {
    // jobsStore already removed it locally
    console.log(jobId);
}

onMounted(async () => {
    await jobsStore.fetchJobs();
    // Load candidate's existing applications so hasApplied works
    if (authStore.isCandidate) {
        await appsStore.fetchMyApplications(authStore.currentUser.id);
    }
});
</script>

<style scoped>
.home {
    display: grid;
    grid-template-columns: 260px 1fr 240px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
    align-items: start;
}

@media (max-width: 1024px) {
    .home {
        grid-template-columns: 220px 1fr;
    }
    .widgets {
        display: none;
    }
}
@media (max-width: 700px) {
    .home {
        grid-template-columns: 1fr;
    }
    .sidebar {
        display: none;
    }
}

/* ── Search bar ── */
.search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
}
.search-bar__input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    outline: none;
}
.search-bar__input:focus {
    border-color: #534ab7;
}
.search-bar__input--location {
    max-width: 180px;
}

/* ── Feed ── */
.feed__list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.feed__state {
    text-align: center;
    padding: 48px 0;
    color: var(--color-text-secondary);
    font-size: 14px;
}
.feed__state--error {
    color: var(--color-text-danger);
}

/* ── Profile card ── */
.profile-card {
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    background: var(--color-background-primary);
    margin-bottom: 14px;
}
.profile-card__banner {
    height: 56px;
    background: var(--color-background-secondary);
}
.profile-card__body {
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.profile-card__avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid var(--color-background-primary);
    margin-top: -26px;
    object-fit: cover;
}
.profile-card__name {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 4px 0 0;
}
.profile-card__title {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin: 0 0 8px;
}
.profile-card__stats {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.profile-card__stat {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}
.profile-card__stat .label {
    color: var(--color-text-secondary);
}
.profile-card__stat .value {
    color: #e8246a;
    font-weight: 500;
}

/* ── Filter box ── */
.filter-box {
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    background: var(--color-background-primary);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.filter-box__title {
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    margin: 0;
}
.filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.filter-group__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-secondary);
    cursor: pointer;
}
.filter-select {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 13px;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
}
.filter-reset {
    font-size: 12px;
    color: var(--color-text-tertiary);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
    text-decoration: underline;
}

/* ── Right widgets ── */
.widgets {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.widget {
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    background: var(--color-background-primary);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.widget__title {
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    margin: 0;
}
.skill-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.skill-row__name {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 2px;
}
.skill-row__count {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.skill-row__add {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid var(--color-border-secondary);
    background: none;
    font-size: 16px;
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.widget--cta {
    align-items: center;
    text-align: center;
}
.widget__avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #534ab7;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}
.widget__cta-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.widget__cta-sub {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin: 0;
}
.widget__cta-btn {
    display: block;
    width: 100%;
    padding: 9px;
    border: 1.5px solid #e8246a;
    border-radius: var(--border-radius-md);
    color: #e8246a;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    transition: all 0.15s;
}
.widget__cta-btn:hover {
    background: #e8246a;
    color: #fff;
}
</style>
