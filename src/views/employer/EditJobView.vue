<template>
  <div class="edit-job-view">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading job details...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <div class="error-card">
        <h2>Access Denied</h2>
        <p>{{ error }}</p>
        <router-link to="/employer/dashboard" class="btn-primary">Back to Dashboard</router-link>
      </div>
    </div>
    <CreateJob v-else :jobId="jobId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useJobsStore } from '@/stores/jobsStore';
import { useAuthStore } from '@/stores/authStore';
import CreateJob from '@/components/CreateJob.vue';

const route = useRoute();
//const router = useRouter();
const jobsStore = useJobsStore();
const authStore = useAuthStore();

const jobId = route.params.id;
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const job = await jobsStore.fetchJob(jobId);
    if (!job) {
      error.value = "Job listing not found.";
      return;
    }

    // Security check: only the owner (or admin) can edit
    const currentUserId = authStore.currentUser?.id;
    const ownerId = job._raw.company?.user_id || job._raw.company?.user?.id;

    if (currentUserId !== ownerId && authStore.currentUser?.role !== 'admin') {
      error.value = "You do not have permission to edit this job.";
      return;
    }

  } catch (err) {
    error.value = "An error occurred while checking permissions.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.edit-job-view {
  min-height: 100vh;
  background-color: #f4f5f7;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.error-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.error-card h2 {
  color: #ef4444;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.error-card p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-block;
  background-color: #fd366e;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #e11d48;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fd366e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
