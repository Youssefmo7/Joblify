<template>
  <div class="active-jobs">
    <header class="section-header">
      <h1 class="section-title">Active Job Listings</h1>
      <RouterLink to="/employer/post-job" class="cta-btn">
        + Post a Job
      </RouterLink>
    </header>

    <div v-if="jobsStore.loading" class="state-msg">Loading jobs…</div>

    <div v-else-if="myJobs.length === 0" class="state-msg empty">
      <p class="main">No jobs found.</p>
      <p class="sub">Post your first job to get started!</p>
    </div>

    <div v-else class="jobs-list">
      <div v-for="job in myJobs" :key="job.id" class="job-item">
        <div class="job-item__main">
          <div class="job-item__info">
            <h4 class="job-item__title">{{ job.title }}</h4>
            <div class="job-item__meta">
              <span>{{ job.category }}</span>
              <span class="dot">&bull;</span>
              <span>{{ job.location }}</span>
              <span class="dot">&bull;</span>
              <span :class="['badge', `badge--${job.workType}`]">
                {{ formatWorkType(job.workType) }}
              </span>
              <span class="dot">&bull;</span>
              <span :class="['status-text', job.status]">
                {{ job.status }}
              </span>
            </div>
          </div>

          <div class="job-item__stats">
            <div class="stat-box">
              <span class="stat-box__val">{{ getNewApplicants(job.id) }}</span>
              <span class="stat-box__label">New</span>
            </div>
            <div class="stat-box divider">
              <span class="stat-box__val">{{ job.applicantsCount }}</span>
              <span class="stat-box__label">Total</span>
            </div>
          </div>
        </div>

        <div class="job-item__actions">
          <RouterLink :to="`/employer/jobs/${job.id}/applicants`" class="action-btn primary">
            Review Applicants
          </RouterLink>
          <button @click="deleteJob(job.id)" class="action-btn outline">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const authStore = useAuthStore();
const jobsStore = useJobsStore();
const appsStore = useApplicationsStore();

const myJobs = computed(() => jobsStore.myJobs(authStore.currentUser?.id));

function getNewApplicants(jobId) {
  return appsStore.applicationsForJob(jobId).filter(a => a.status === 'pending').length;
}

function formatWorkType(t) {
  return { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' }[t] || t;
}

async function deleteJob(id) {
  if (confirm('Delete this job posting?')) {
    await jobsStore.deleteJob(id);
  }
}
</script>

<style scoped>
.active-jobs {
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

/* ── List ── */
.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.job-item {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s;
}
.job-item:hover { border-color: var(--color-border-secondary); }

.job-item__main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.job-item__info { flex: 1; }
.job-item__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}
.job-item__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
  flex-wrap: wrap;
}
.dot { color: var(--color-border-tertiary); }

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 99px;
  font-weight: 500;
}
.badge--remote { background: #e1f5ee; color: #0f6e56; }
.badge--onsite { background: #e6f1fb; color: #185fa5; }
.badge--hybrid { background: #faeeda; color: #854f0b; }

.status-text {
  font-weight: 600;
  text-transform: capitalize;
}
.status-text.approved { color: #22c55e; }
.status-text.pending { color: #f59e0b; }
.status-text.rejected { color: #ef4444; }

.job-item__stats {
  display: flex;
  align-items: center;
  gap: 0;
}
.stat-box {
  padding: 0 16px;
  text-align: center;
}
.stat-box.divider { border-left: 1px solid var(--color-border-tertiary); }
.stat-box__val {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.stat-box__label {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
}

.job-item__actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-tertiary);
}

.action-btn {
  padding: 8px 16px;
  border-radius: var(--border-radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.action-btn.primary {
  background: #e8246a;
  color: #fff;
  border: none;
}
.action-btn.primary:hover { opacity: 0.9; }
.action-btn.outline {
  background: none;
  border: 1px solid var(--color-border-tertiary);
  color: var(--color-text-secondary);
}
.action-btn.outline:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}

.cta-btn {
  padding: 8px 20px;
  background: #e8246a;
  color: #fff;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.state-msg {
  padding: 60px 20px;
  text-align: center;
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
}
.state-msg.empty .main {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}
.state-msg.empty .sub {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
