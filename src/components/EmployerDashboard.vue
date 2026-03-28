<template>
  <div class="text-gray-800 font-sans min-h-screen" style="background-color: #f4f5f7">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50" style="border-color: #e8ecf1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold tracking-tight text-gray-900 border-r pr-4 mr-4" style="border-color: #e8ecf1">Joblify</router-link>
            <span class="text-lg font-semibold text-gray-600">Employer Center</span>
          </div>
          <div class="flex items-center">
            <router-link to="/create-job" class="text-white text-sm font-medium py-2 px-4 rounded-lg mr-6" style="background-color: #fd366e">Post a Job</router-link>
            <div class="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center border" style="border-color: #e8ecf1">
              <span class="font-bold text-gray-600">{{ companyInitial }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
      <!-- Left Sidebar -->
      <div class="w-64 hidden md:block flex-shrink-0">
        <div class="bg-white rounded-xl border overflow-hidden" style="border-color: #e8ecf1">
          <div class="p-6 border-b text-center" style="border-color: #e8ecf1">
            <div class="h-16 w-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-2xl font-bold text-gray-600 mb-3 border" style="border-color: #e8ecf1">{{ companyInitial }}</div>
            <h2 class="text-lg font-bold text-gray-900">{{ store.currentUser.name }}</h2>
            <a href="#" class="text-xs font-medium hover:underline" style="color: #fd366e">Edit Company Profile</a>
          </div>
          <nav class="p-2 space-y-1">
            <a v-for="item in sidebarItems" :key="item.key"
               href="#" @click.prevent="activeSection = item.key"
               class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
               :class="activeSection === item.key ? 'bg-pink-50' : 'text-gray-600 hover:bg-gray-50'"
               :style="activeSection === item.key ? 'color: #fd366e' : ''">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path></svg>
              {{ item.label }}
              <span v-if="item.badge !== null" class="ml-auto py-0.5 px-2 rounded-full text-xs"
                :class="item.badgeClass"
                :style="item.badgeStyle || ''">{{ item.badge }}</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Overview (default) -->
        <div v-if="activeSection === 'overview'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <select class="text-sm border-gray-300 rounded-md shadow-sm px-3 py-1.5 border focus:outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>All Time</option>
            </select>
          </div>

          <!-- Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow" style="border-color: #e8ecf1" @click="activeSection = 'jobs'">
              <p class="text-sm font-medium text-gray-500">Active Jobs</p>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ store.activeJobs.length }}</p>
            </div>
            <div class="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow" style="border-color: #e8ecf1" @click="activeSection = 'analytics'">
              <p class="text-sm font-medium text-gray-500">Total Views</p>
              <p class="mt-2 text-3xl font-bold text-blue-600">8,409</p>
            </div>
            <div class="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow" style="border-color: #e8ecf1" @click="activeSection = 'candidates'">
              <p class="text-sm font-medium text-gray-500">Total Applicants</p>
              <p class="mt-2 text-3xl font-bold" style="color: #fd366e">{{ store.totalApplicants }}</p>
            </div>
            <div class="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow" style="border-color: #e8ecf1" @click="activeSection = 'candidates'">
              <p class="text-sm font-medium text-gray-500">Unreviewed</p>
              <p class="mt-2 text-3xl font-bold text-yellow-600">{{ store.unreviewedCount }}</p>
            </div>
          </div>

          <!-- Quick listings -->
          <div class="bg-white rounded-xl border overflow-hidden" style="border-color: #e8ecf1">
            <div class="px-6 py-4 border-b flex justify-between items-center" style="border-color: #e8ecf1">
              <h3 class="text-lg font-bold text-gray-900">Active Job Listings</h3>
              <a href="#" @click.prevent="activeSection = 'jobs'" class="text-sm font-medium hover:underline" style="color: #fd366e">View All</a>
            </div>
            <ul class="divide-y" style="border-color: #e8ecf1">
              <li v-for="job in store.activeJobs.slice(0, 2)" :key="job.id" class="p-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between">
                  <div class="mb-4 md:mb-0">
                    <h4 class="text-base font-bold text-gray-900">{{ job.title }}</h4>
                    <div class="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                      <span>{{ job.category }} &bull; {{ job.location }} ({{ job.workType }})</span>
                      <span>&bull;</span>
                      <span class="text-green-600 font-medium capitalize">{{ job.status }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="text-center px-4 border-r" style="border-color: #e8ecf1">
                      <p class="text-xl font-bold text-gray-900">{{ getNewApplicants(job.id) }}</p>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">New</p>
                    </div>
                    <div class="text-center px-4 border-r" style="border-color: #e8ecf1">
                      <p class="text-xl font-bold text-gray-900">{{ job.applicantsCount }}</p>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                    </div>
                    <div class="pl-2 flex space-x-2">
                      <button @click="activeSection = 'candidates'" class="px-3 py-1.5 text-white text-sm font-medium rounded-lg hover:opacity-90" style="background-color: #fd366e">Review</button>
                      <button class="px-3 py-1.5 border text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50" style="border-color: #e8ecf1">Edit</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Quick candidates -->
          <div class="bg-white rounded-xl border overflow-hidden" style="border-color: #e8ecf1">
            <div class="px-6 py-4 border-b flex justify-between items-center" style="border-color: #e8ecf1">
              <h3 class="text-lg font-bold text-gray-900">
                Candidates to Review
                <span v-if="store.unreviewedCount > 0" class="ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{{ store.unreviewedCount }} New</span>
              </h3>
            </div>
            <div class="divide-y" style="border-color: #e8ecf1">
              <div v-for="app in store.pendingApplications.slice(0, 2)" :key="app.id" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center">
                  <img :src="app.avatar" class="h-10 w-10 rounded-full border border-gray-200" :alt="app.candidateName" />
                  <div class="ml-3">
                    <p class="text-sm font-bold text-gray-900">{{ app.candidateName }}</p>
                    <p class="text-xs text-gray-500">Applied for: {{ app.jobTitle }}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button @click="store.rejectApplication(app.id)" class="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Reject</button>
                  <button @click="store.acceptApplication(app.id)" class="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">Accept</button>
                </div>
              </div>
              <div v-if="store.pendingApplications.length > 2" class="p-4 text-center bg-gray-50">
                <a href="#" @click.prevent="activeSection = 'candidates'" class="text-sm font-medium hover:underline" style="color: #fd366e">View {{ store.pendingApplications.length - 2 }} more candidates</a>
              </div>
              <div v-if="store.pendingApplications.length === 0" class="p-8 text-center text-gray-500">
                <p class="text-sm">No pending candidates to review.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-components for other sections -->
        <EmployerActiveJobs v-if="activeSection === 'jobs'" @navigate="activeSection = $event" />
        <EmployerCandidates v-if="activeSection === 'candidates'" />
        <EmployerAnalytics v-if="activeSection === 'analytics'" />
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '@/store';
import EmployerActiveJobs from '@/components/employer/EmployerActiveJobs.vue';
import EmployerCandidates from '@/components/employer/EmployerCandidates.vue';
import EmployerAnalytics from '@/components/employer/EmployerAnalytics.vue';

export default {
  name: 'EmployerDashboard',
  components: { EmployerActiveJobs, EmployerCandidates, EmployerAnalytics },

  data() {
    return {
      store: useAppStore(),
      activeSection: 'overview',
    };
  },

  computed: {
    companyInitial() {
      return this.store.currentUser.name.charAt(0).toUpperCase();
    },
    sidebarItems() {
      return [
        { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: null, badgeClass: '' },
        { key: 'jobs', label: 'Active Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', badge: this.store.activeJobs.length, badgeClass: 'bg-gray-100 text-gray-600' },
        { key: 'candidates', label: 'Candidates', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', badge: this.store.unreviewedCount > 0 ? this.store.unreviewedCount : null, badgeClass: 'text-white', badgeStyle: 'background-color: #fd366e' },
        { key: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', badge: null, badgeClass: '' },
      ];
    },
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