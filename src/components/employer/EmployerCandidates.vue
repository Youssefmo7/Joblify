<template>
  <div class="candidates-section">
    <header class="section-header">
      <h1 class="section-title">
        Candidates to Review
        <span v-if="pendingCount > 0" class="count-badge">{{ pendingCount }} New</span>
      </h1>
    </header>

    <!-- Filter Tabs (matching HomeView filter aesthetics) -->
    <div class="tabs-container">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: filter === tab.value }"
          @click="filter = tab.value"
        >
          {{ tab.label }}
          <span v-if="getCount(tab.value) > 0" class="tab-count">
            {{ getCount(tab.value) }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="appsStore.loading" class="state-msg">Loading candidates…</div>

    <div v-else class="candidates-list">
      <div v-for="app in filteredApplications" :key="app.id" class="candidate-item">
        <div class="candidate-item__main">
          <div class="avatar">{{ getInitial(app) }}</div>
          <div class="info">
            <h4 class="name">Candidate #{{ app.candidateId }}</h4>
            <p class="job-title">Applied for: {{ getJobTitle(app.jobId) }}</p>
            <p class="date">{{ formatDate(app.createdAt) }}</p>
          </div>
        </div>

        <div class="candidate-item__actions">
          <span v-if="app.status === 'accepted'" class="status-badge accepted">Accepted</span>
          <span v-else-if="app.status === 'rejected'" class="status-badge rejected">Rejected</span>
          <template v-else>
            <button
              class="action-btn reject"
              :disabled="appsStore.loading"
              @click="respond(app.id, 'rejected')"
            >
              Reject
            </button>
            <button
              class="action-btn accept"
              :disabled="appsStore.loading"
              @click="respond(app.id, 'accepted')"
            >
              Accept
            </button>
          </template>
        </div>
      </div>

      <div v-if="filteredApplications.length === 0" class="empty-msg">
        No {{ filter === 'all' ? '' : filter }} candidates found.
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

const filter = ref('pending');
const tabs = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
];

const employerId = computed(() => authStore.currentUser?.id);

const allApplications = computed(() =>
  appsStore.applicationsForEmployer(employerId.value)
);

const filteredApplications = computed(() => {
  if (filter.value === 'all') return allApplications.value;
  return allApplications.value.filter(a => a.status === filter.value);
});

const pendingCount = computed(() =>
  allApplications.value.filter(a => a.status === 'pending').length
);

function getCount(status) {
  if (status === 'all') return allApplications.value.length;
  return allApplications.value.filter(a => a.status === status).length;
}

function getJobTitle(jobId) {
  const job = jobsStore.jobs.find(j => j.id === jobId || j.id === String(jobId));
  return job?.title || `Job #${jobId}`;
}

function getInitial(app) {
  return `C${String(app.candidateId).charAt(0)}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function respond(appId, status) {
  await appsStore.respondToApplication(appId, status);
}

onMounted(async () => {
  const jobs = jobsStore.myJobs(employerId.value);
  for (const job of jobs) {
    await appsStore.fetchApplicationsForJob(job.id);
  }
});
</script>

<style scoped>
.candidates-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}
.count-badge {
  background: #faeeda;
  color: #854f0b;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
}

/* ── Tabs ── */
.tabs-container {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 4px;
}
.tabs {
  display: flex;
  gap: 4px;
}
.tab {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: calc(var(--border-radius-lg) - 4px);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.tab:hover { background: var(--color-background-secondary); }
.tab.active {
  background: var(--color-background-tertiary);
  color: var(--color-text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.tab-count {
  font-size: 10px;
  background: var(--color-border-tertiary);
  color: var(--color-text-secondary);
  padding: 1px 5px;
  border-radius: 8px;
}

/* ── List ── */
.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.candidate-item {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  transition: border-color 0.2s;
}
.candidate-item:hover { border-color: var(--color-border-secondary); }

.candidate-item__main {
  display: flex;
  align-items: center;
  gap: 16px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-background-secondary);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  border: 1px solid var(--color-border-tertiary);
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.job-title {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}
.date {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.candidate-item__actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn.accept {
  background: #22c55e;
  color: #fff;
  border: none;
}
.action-btn.accept:hover { opacity: 0.9; }
.action-btn.reject {
  background: none;
  border: 1px solid var(--color-border-tertiary);
  color: var(--color-text-secondary);
}
.action-btn.reject:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 99px;
  text-transform: uppercase;
}
.status-badge.accepted { background: #dcfce7; color: #166534; }
.status-badge.rejected { background: #fee2e2; color: #991b1b; }

.state-msg, .empty-msg {
  text-align: center;
  padding: 40px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}
</style>
