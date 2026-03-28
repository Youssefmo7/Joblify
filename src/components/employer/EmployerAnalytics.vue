<template>
  <div class="analytics-section">
    <header class="section-header">
      <h1 class="section-title">Analytics</h1>
      <div class="period-selector">
        <select v-model="period" class="select-field">
          <option value="30">Last 30 Days</option>
          <option value="7">Last 7 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card__icon blue">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        <div class="metric-card__content">
          <p class="label">Total Jobs</p>
          <p class="value">{{ myJobs.length }}</p>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-card__icon pink">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div class="metric-card__content">
          <p class="label">Total Applicants</p>
          <p class="value brand">{{ totalApplicants }}</p>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-card__icon green">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="metric-card__content">
          <p class="label">Approved Jobs</p>
          <p class="value success">{{ approvedCount }}</p>
        </div>
      </div>
    </div>

    <!-- Per-Job Breakdown Table -->
    <section class="content-block">
      <div class="content-block__header">
        <h3 class="content-block__title">Performance by Job</h3>
      </div>
      <div class="table-container">
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th class="text-center">Applicants</th>
              <th class="text-center">Status</th>
              <th class="text-center">Posted Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in myJobs" :key="job.id">
              <td>
                <div class="job-info">
                  <p class="job-title">{{ job.title }}</p>
                  <p class="job-sub">{{ job.category }} &bull; {{ job.location }}</p>
                </div>
              </td>
              <td class="text-center font-bold">{{ job.applicantsCount }}</td>
              <td class="text-center">
                <span :class="['status-badge', job.status]">{{ job.status }}</span>
              </td>
              <td class="text-center date-col">{{ formatDate(job.createdAt) }}</td>
            </tr>
            <tr v-if="myJobs.length === 0">
              <td colspan="4" class="empty-msg">No jobs to analyze.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';

const authStore = useAuthStore();
const jobsStore = useJobsStore();

const period = ref('30');

const myJobs = computed(() => jobsStore.myJobs(authStore.currentUser?.id));

const totalApplicants = computed(() =>
  myJobs.value.reduce((sum, j) => sum + (j.applicantsCount || 0), 0)
);

const approvedCount = computed(() =>
  myJobs.value.filter(j => j.status === 'approved').length
);

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<style scoped>
.analytics-section {
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
}

/* ── Period Selector ── */
.select-field {
  padding: 8px 12px;
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-md);
  font-size: 13px;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  outline: none;
}

/* ── Metrics ── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.metric-card {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.metric-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.metric-card__icon svg { width: 24px; height: 24px; }

.metric-card__icon.blue { background: #eff6ff; color: #3b82f6; }
.metric-card__icon.pink { background: #fff1f2; color: #e8246a; }
.metric-card__icon.green { background: #f0fdf4; color: #22c55e; }

.metric-card__content .label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}
.metric-card__content .value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.metric-card__content .value.brand { color: #e8246a; }
.metric-card__content .value.success { color: #22c55e; }

/* ── Content Block & Table ── */
.content-block {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}
.content-block__header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-tertiary);
}
.content-block__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.table-container { overflow-x: auto; }
.analytics-table {
  width: 100%;
  border-collapse: collapse;
}
.analytics-table th {
  background: var(--color-background-secondary);
  padding: 12px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  border-bottom: 1px solid var(--color-border-tertiary);
}
.analytics-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-tertiary);
  vertical-align: middle;
}
.analytics-table tr:last-child td { border-bottom: none; }
.analytics-table tr:hover { background: var(--color-background-secondary); }

.job-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}
.job-sub {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.text-center { text-align: center; }
.font-bold { font-weight: 700; color: var(--color-text-primary); }

.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
  text-transform: uppercase;
}
.status-badge.approved { background: #dcfce7; color: #166534; }
.status-badge.pending { background: #fef3c7; color: #92400e; }
.status-badge.rejected { background: #fee2e2; color: #991b1b; }

.date-col { font-size: 13px; color: var(--color-text-secondary); }
.empty-msg {
  padding: 60px;
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 14px;
}
</style>
