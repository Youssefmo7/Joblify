<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
      <select class="text-sm border-gray-300 rounded-md shadow-sm px-3 py-1.5 border focus:outline-none">
        <option>Last 30 Days</option>
        <option>Last 7 Days</option>
        <option>All Time</option>
      </select>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Views</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">8,409</p>
          </div>
          <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-green-600 font-medium">+12% vs last period</p>
      </div>
      <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Applications</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ store.totalApplicants }}</p>
          </div>
          <div class="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center">
            <svg class="h-6 w-6" style="color: #fd366e" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-green-600 font-medium">+8% vs last period</p>
      </div>
      <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Conversion Rate</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ conversionRate }}%</p>
          </div>
          <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-gray-500 font-medium">Views → Applications</p>
      </div>
    </div>

    <!-- Per-Job Breakdown -->
    <div class="bg-white rounded-xl border overflow-hidden" style="border-color: #e8ecf1">
      <div class="px-6 py-4 border-b" style="border-color: #e8ecf1">
        <h3 class="text-lg font-bold text-gray-900">Performance by Job</h3>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
          </tr>
        </thead>
        <tbody class="divide-y" style="border-color: #e8ecf1">
          <tr v-for="job in store.jobs" :key="job.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ job.title }}</p>
              <p class="text-xs text-gray-500">{{ job.category }} &bull; {{ job.location }}</p>
            </td>
            <td class="px-6 py-4 text-center font-bold text-gray-900">{{ job.applicantsCount }}</td>
            <td class="px-6 py-4 text-center">
              <span class="px-2 py-1 text-xs font-bold rounded-full capitalize"
                :class="job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">{{ job.status }}</span>
            </td>
            <td class="px-6 py-4 text-center text-gray-500">{{ job.postedAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '@/store';

export default {
  name: 'EmployerAnalytics',

  data() {
    return { store: useAppStore() };
  },

  computed: {
    conversionRate() {
      const views = 8409;
      const apps = this.store.totalApplicants;
      return views > 0 ? ((apps / views) * 100).toFixed(1) : 0;
    },
  },
};
</script>
