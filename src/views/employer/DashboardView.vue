<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <!-- ── LEFT: Sidebar ───────────────────────────────────── -->
      <aside class="dashboard-sidebar">
        <!-- Company profile card (matching HomeView profile-card) -->
        <div class="employer-profile">
          <div class="employer-profile__banner" />
          <div class="employer-profile__body">
            <div class="employer-profile__avatar-container">
              <div class="employer-profile__avatar">
                {{ companyInitial }}
              </div>
            </div>
            <h2 class="employer-profile__name">
              {{ authStore.currentUser?.companyName || authStore.currentUser?.name }}
            </h2>
            <p class="employer-profile__role">Employer Account</p>
            <button class="edit-profile-btn">Edit Company Profile</button>
          </div>
        </div>

        <!-- Navigation (matching HomeView filter-box look) -->
        <nav class="dashboard-nav">
          <h3 class="dashboard-nav__title">Menu</h3>
          <button
            v-for="item in sidebarItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeSection === item.key }"
            @click="activeSection = item.key"
          >
            <span class="nav-item__icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
              </svg>
            </span>
            <span class="nav-item__label">{{ item.label }}</span>
            <span v-if="item.badge != null" class="nav-item__badge">
              {{ item.badge }}
            </span>
          </button>
        </nav>
      </aside>

      <!-- ── MAIN CONTENT ────────────────────────────────────── -->
      <main class="dashboard-main">
        <!-- Overview Section -->
        <div v-if="activeSection === 'overview'" class="overview-section">
          <header class="section-header">
            <h1 class="section-title">Dashboard Overview</h1>
          </header>

          <!-- Metrics Grid -->
          <div class="metrics-grid">
            <div class="metric-card" @click="activeSection = 'jobs'">
              <span class="metric-label">Active Jobs</span>
              <span class="metric-value">{{ approvedJobs.length }}</span>
            </div>
            <div class="metric-card secondary" @click="activeSection = 'analytics'">
              <span class="metric-label">Total Applicants</span>
              <span class="metric-value">{{ totalApplicants }}</span>
            </div>
            <div class="metric-card highlight" @click="activeSection = 'candidates'">
              <span class="metric-label">Pending Review</span>
              <span class="metric-value">{{ pendingCount }}</span>
            </div>
            <div class="metric-card" @click="activeSection = 'jobs'">
              <span class="metric-label">All Jobs</span>
              <span class="metric-value">{{ myJobs.length }}</span>
            </div>
          </div>

          <!-- Quick Actions/Lists Grid -->
          <div class="dashboard-content-grid">
            <!-- Recent Jobs -->
            <section class="content-block">
              <div class="content-block__header">
                <h3 class="content-block__title">Active Job Listings</h3>
                <button class="text-link" @click="activeSection = 'jobs'">View All</button>
              </div>
              <div class="content-block__body">
                <div v-if="approvedJobs.length === 0" class="empty-state">
                  <p>No active jobs yet.</p>
                  <RouterLink to="/employer/post-job" class="cta-btn small">Post a Job</RouterLink>
                </div>
                <div v-else class="item-list">
                  <div v-for="job in approvedJobs.slice(0, 3)" :key="job.id" class="list-item">
                    <div class="list-item__info">
                      <h4 class="list-item__title">{{ job.title }}</h4>
                      <p class="list-item__sub">
                        {{ job.category }} &bull; {{ job.location }}
                      </p>
                    </div>
                    <div class="list-item__stats">
                      <div class="stat-bubble">
                        <span class="stat-bubble__val">{{ getNewApplicants(job.id) }}</span>
                        <span class="stat-bubble__label">New</span>
                      </div>
                      <RouterLink :to="`/employer/jobs/${job.id}/applicants`" class="icon-link">
                        Review →
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Recent Candidates -->
            <section class="content-block">
              <div class="content-block__header">
                <h3 class="content-block__title">Candidates to Review</h3>
                <button class="text-link" @click="activeSection = 'candidates'">View All</button>
              </div>
              <div class="content-block__body">
                <div v-if="pendingApps.length === 0" class="empty-state">
                  <p>No pending candidates.</p>
                </div>
                <div v-else class="item-list">
                  <div v-for="app in pendingApps.slice(0, 3)" :key="app.id" class="list-item">
                    <div class="list-item__info flex-row">
                      <div class="avatar-sm">C</div>
                      <div class="ml-3">
                        <h4 class="list-item__title">Candidate #{{ app.candidateId }}</h4>
                        <p class="list-item__sub">For: {{ getJobTitle(app.jobId) }}</p>
                      </div>
                    </div>
                    <div class="list-item__actions">
                      <button class="btn-sm reject" @click="respondToApp(app.id, 'rejected')">×</button>
                      <button class="btn-sm accept" @click="respondToApp(app.id, 'accepted')">✓</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Section Components -->
        <EmployerActiveJobs v-if="activeSection === 'jobs'" />
        <EmployerCandidates v-if="activeSection === 'candidates'" />
        <EmployerAnalytics v-if="activeSection === 'analytics'" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import EmployerActiveJobs from '@/components/employer/EmployerActiveJobs.vue';
import EmployerCandidates from '@/components/employer/EmployerCandidates.vue';
import EmployerAnalytics from '@/components/employer/EmployerAnalytics.vue';

const authStore = useAuthStore();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();

const activeSection = ref('overview');

const employerId = computed(() => authStore.currentUser?.id);
const companyInitial = computed(() => {
  const name = authStore.currentUser?.companyName || authStore.currentUser?.name || '?';
  return name.charAt(0).toUpperCase();
});

const myJobs = computed(() => jobsStore.myJobs(employerId.value));
const approvedJobs = computed(() => myJobs.value.filter(j => j.status === 'approved'));
const totalApplicants = computed(() => myJobs.value.reduce((sum, j) => sum + (j.applicantsCount || 0), 0));

const pendingApps = computed(() =>
  appsStore.applicationsForEmployer(employerId.value).filter(a => a.status === 'pending')
);
const pendingCount = computed(() => pendingApps.value.length);

const sidebarItems = computed(() => [
  { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: null },
  { key: 'jobs', label: 'Active Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', badge: myJobs.value.length },
  { key: 'candidates', label: 'Candidates', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', badge: pendingCount.value > 0 ? pendingCount.value : null },
  { key: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', badge: null },
]);

function getJobTitle(jobId) {
  const job = jobsStore.jobs.find(j => j.id === jobId || j.id === String(jobId));
  return job?.title || `Job #${jobId}`;
}

function getNewApplicants(jobId) {
  return appsStore.applicationsForJob(jobId).filter(a => a.status === 'pending').length;
}

async function respondToApp(appId, status) {
  await appsStore.respondToApplication(appId, status);
}

onMounted(async () => {
  await jobsStore.fetchJobs();
  const jobs = jobsStore.myJobs(employerId.value);
  for (const job of jobs) {
    await appsStore.fetchApplicationsForJob(job.id);
  }
});
</script>

<style scoped>
.dashboard-page {
  background: var(--color-background-tertiary);
  min-height: calc(100vh - 56px);
}
.dashboard-container {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  align-items: start;
}

@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 220px 1fr;
  }
}
@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  .dashboard-sidebar {
    display: none;
  }
}

/* ── Sidebar & Profile ── */
.employer-profile {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  margin-bottom: 20px;
}
.employer-profile__banner {
  height: 64px;
  background: var(--color-background-secondary);
}
.employer-profile__body {
  padding: 0 16px 20px;
  text-align: center;
}
.employer-profile__avatar-container {
  display: flex;
  justify-content: center;
  margin-top: -32px;
  margin-bottom: 12px;
}
.employer-profile__avatar {
  width: 64px;
  height: 64px;
  background: var(--color-background-primary);
  border: 3px solid var(--color-background-primary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.employer-profile__name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}
.employer-profile__role {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}
.edit-profile-btn {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-md);
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.edit-profile-btn:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}

/* ── Nav ── */
.dashboard-nav {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dashboard-nav__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: none;
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.nav-item:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}
.nav-item.active {
  background: #e8246a10;
  color: #e8246a;
}
.nav-item__badge {
  margin-left: auto;
  background: #e8246a;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 10px;
}

/* ── Metrics ── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.metric-card {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.metric-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}
.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.metric-card.highlight .metric-value { color: #e8246a; }
.metric-card.secondary .metric-value { color: #534ab7; }

/* ── Content Grid ── */
.dashboard-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 900px) {
  .dashboard-content-grid {
    grid-template-columns: 1fr;
  }
}

.content-block {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}
.content-block__header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-tertiary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-block__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.text-link {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #e8246a;
  cursor: pointer;
}
.text-link:hover { text-decoration: underline; }

.item-list {
  display: flex;
  flex-direction: column;
}
.list-item {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-tertiary);
  transition: background 0.2s;
}
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: var(--color-background-secondary); }

.list-item__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.list-item__sub {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.list-item__stats {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-bubble {
  text-align: center;
  min-width: 40px;
}
.stat-bubble__val {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.stat-bubble__label {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
}

.icon-link {
  font-size: 13px;
  font-weight: 500;
  color: #e8246a;
  text-decoration: none;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}
.flex-row { display: flex; align-items: center; }
.ml-3 { margin-left: 12px; }

.list-item__actions {
  display: flex;
  gap: 8px;
}
.btn-sm {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-sm.reject {
  background: #fee2e2;
  color: #ef4444;
}
.btn-sm.reject:hover { background: #fecaca; }
.btn-sm.accept {
  background: #dcfce7;
  color: #22c55e;
}
.btn-sm.accept:hover { background: #bbf7d0; }

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 14px;
}
.cta-btn.small {
  margin-top: 12px;
  display: inline-block;
  padding: 6px 16px;
  background: #e8246a;
  color: #fff;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}
</style>
