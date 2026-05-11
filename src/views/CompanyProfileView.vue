<template>
  <div class="company-profile">
    <!-- Header / Banner -->
    <header class="profile-header">
      <div class="container">
        <div class="profile-header__content">
          <div class="company-brand">
            <div class="company-logo">
              <img v-if="company?.logo" :src="company.logo" :alt="company.name" />
              <span v-else class="logo-fallback">{{ company?.name?.charAt(0) }}</span>
            </div>
            <div class="company-info">
              <h1 class="company-name">{{ company?.name || 'Loading...' }}</h1>
              <div class="company-meta">
                <span v-if="company?.location" class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {{ company.location }}
                </span>
                <a v-if="company?.website" :href="company.website" target="_blank" class="meta-item link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  {{ displayWebsite(company.website) }}
                </a>
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  {{ companyJobs.length }} Active Jobs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container profile-main">
      <div class="grid">
        <!-- About Section -->
        <section class="section about-section">
          <h2 class="section-title">About {{ company?.name }}</h2>
          <div class="about-content" v-if="company?.description">
            <p v-for="(p, i) in company.description.split('\n')" :key="i">{{ p }}</p>
          </div>
          <p v-else class="empty-msg">No description available for this company.</p>
        </section>

        <!-- Jobs Section -->
        <section class="section jobs-section">
          <h2 class="section-title">Open Opportunities</h2>
          
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading jobs...</p>
          </div>

          <div v-else-if="companyJobs.length === 0" class="empty-state">
            <p>This company currently has no open job listings.</p>
          </div>

          <div v-else class="jobs-list">
            <JobCard 
              v-for="job in companyJobs" 
              :key="job.id" 
              :job="job"
              @apply="openApplyModal"
            />
          </div>
        </section>
      </div>
    </main>

    <!-- Apply Modal -->
    <ApplyModal 
      v-if="selectedJob" 
      :job="selectedJob" 
      @close="selectedJob = null"
      @success="handleApplySuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import client from '@/api/client';
import JobCard from '@/components/JobCard.vue';
import ApplyModal from '@/components/ApplyModal.vue';

const route = useRoute();
const loading = ref(true);
const company = ref(null);
const companyJobs = ref([]);
const selectedJob = ref(null);

function displayWebsite(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function openApplyModal(job) {
  selectedJob.value = job;
}

function handleApplySuccess() {
  selectedJob.value = null;
  // Could show a toast here
}

async function fetchCompanyData() {
  loading.value = true;
  try {
    const companyId = route.params.id;
    
    // 1. Fetch jobs for this company
    // We assume the API supports company_id filter on /jobs
    const jobsData = await client.get('/jobs', {
      params: { company_id: companyId, per_page: 50 }
    });
    
    const jobs = Array.isArray(jobsData) ? jobsData : jobsData.data || [];
    
    // 2. Normalize jobs using standard normalization (if we had access to the store function)
    // For now we'll do it manually to match JobCard requirements
    companyJobs.value = jobs.map(j => ({
      ...j,
      company: j.company?.name || 'Unknown',
      companyId: j.company?.id,
      companyLogo: j.company?.logo,
      employerId: j.company?.user_id,
      skills: (j.skills || []).map(s => typeof s === 'string' ? s : s.name),
      categories: (j.categories || []).map(c => typeof c === 'string' ? c : c.name),
      category: j.categories?.[0]?.name || '',
      workType: j.work_type,
      experienceLevel: j.experience_level,
      salaryMin: j.salary_min,
      salaryMax: j.salary_max,
      createdAt: j.created_at,
      applicantsCount: j.applications_count || 0
    }));

    // 3. Extract company info from the first job if available
    if (companyJobs.value.length > 0) {
      const firstJob = jobs[0];
      company.value = firstJob.company;
    } else {
      // If no jobs, we might need to fetch company info from a dedicated endpoint
      // Let's try /companies/{id} just in case
      try {
        const compData = await client.get(`/companies/${companyId}`);
        company.value = compData;
      } catch (err) {
        console.error("No jobs found and no public company endpoint", err);
      }
    }
  } catch (err) {
    console.error("Failed to fetch company data", err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCompanyData);
</script>

<style scoped>
.company-profile {
  min-height: 100vh;
  background-color: var(--color-background-tertiary);
}

.profile-header {
  background: white;
  border-bottom: 1px solid var(--color-border-tertiary);
  padding: 60px 0 40px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 32px;
}

.company-logo {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  background: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--color-border-tertiary);
  flex-shrink: 0;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-fallback {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.company-name {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px;
}

.company-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-item.link {
  color: #534ab7;
  text-decoration: none;
}

.meta-item.link:hover {
  text-decoration: underline;
}

.profile-main {
  padding-top: 40px;
  padding-bottom: 60px;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background: white;
  border: 1px solid var(--color-border-tertiary);
  border-radius: 16px;
  padding: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px;
  color: var(--color-text-primary);
}

.about-content {
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-size: 16px;
}

.about-content p {
  margin-bottom: 16px;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: #e8246a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state, .empty-msg {
  text-align: center;
  padding: 40px;
  color: var(--color-text-tertiary);
  font-style: italic;
}

@media (max-width: 640px) {
  .company-brand {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .company-meta {
    justify-content: center;
  }
  
  .profile-header {
    padding: 40px 0 30px;
  }
}
</style>
