<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Active Job Listings</h1>
    </div>

    <div class="bg-white rounded-xl border overflow-hidden" style="border-color: #e8ecf1">
      <ul class="divide-y" style="border-color: #e8ecf1">
        <li v-for="job in store.activeJobs" :key="job.id" class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="mb-4 md:mb-0">
              <h4 class="text-base font-bold text-gray-900">{{ job.title }}</h4>
              <div class="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                <span>{{ job.category }} &bull; {{ job.location }} ({{ job.workType }})</span>
                <span>&bull;</span>
                <span class="text-green-600 font-medium capitalize">{{ job.status }}</span>
              </div>
              <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ job.description }}</p>
            </div>
            <div class="flex items-center space-x-4 flex-shrink-0">
              <div class="text-center px-4 border-r" style="border-color: #e8ecf1">
                <p class="text-xl font-bold text-gray-900">{{ getNewApplicants(job.id) }}</p>
                <p class="text-xs text-gray-500 uppercase tracking-wide">New</p>
              </div>
              <div class="text-center px-4 border-r" style="border-color: #e8ecf1">
                <p class="text-xl font-bold text-gray-900">{{ job.applicantsCount }}</p>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Total</p>
              </div>
              <div class="pl-2 flex space-x-2">
                <button @click="$emit('navigate', 'candidates')" class="px-3 py-1.5 text-white text-sm font-medium rounded-lg hover:opacity-90" style="background-color: #fd366e">Review</button>
                <button class="px-3 py-1.5 border text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50" style="border-color: #e8ecf1">Edit</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="store.activeJobs.length === 0" class="p-12 text-center text-gray-500">
        <p class="text-lg font-medium">No active jobs found.</p>
        <p class="text-sm mt-1">Post your first job to get started!</p>
        <router-link to="/create-job" class="mt-4 inline-block px-4 py-2 text-white rounded-lg text-sm font-medium" style="background-color: #fd366e">Post a Job</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '@/store';

export default {
  name: 'EmployerActiveJobs',
  emits: ['navigate'],

  data() {
    return { store: useAppStore() };
  },

  methods: {
    getNewApplicants(jobId) {
      return this.store.applications.filter(
        (a) => a.jobId === jobId && a.status === 'pending'
      ).length;
    },
  },
};
</script>
