<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">
        Candidates to Review
        <span v-if="store.unreviewedCount > 0" class="ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{{ store.unreviewedCount }} New</span>
      </h1>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
      <button v-for="tab in tabs" :key="tab.value" @click="filter = tab.value"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="filter === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
        <span v-if="getCount(tab.value) > 0" class="ml-1 text-xs px-1.5 py-0.5 rounded-full"
          :class="filter === tab.value ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-500'">{{ getCount(tab.value) }}</span>
      </button>
    </div>

    <div class="bg-white rounded-xl border overflow-hidden" style="border-color: #e8ecf1">
      <div class="divide-y" style="border-color: #e8ecf1">
        <div v-for="app in filteredApplications" :key="app.id" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div class="flex items-center">
            <img :src="app.avatar" class="h-10 w-10 rounded-full border border-gray-200" :alt="app.candidateName" />
            <div class="ml-3">
              <p class="text-sm font-bold text-gray-900">{{ app.candidateName }}</p>
              <p class="text-xs text-gray-500">Applied for: {{ app.jobTitle }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ app.submittedAt }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="app.status === 'accepted'" class="px-2.5 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">Accepted</span>
            <span v-else-if="app.status === 'rejected'" class="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">Rejected</span>
            <template v-else>
              <button @click="store.rejectApplication(app.id)" class="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Reject</button>
              <button @click="store.acceptApplication(app.id)" class="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">Accept</button>
            </template>
          </div>
        </div>
        <div v-if="filteredApplications.length === 0" class="p-8 text-center text-gray-500">
          <p class="text-sm">No {{ filter === 'all' ? '' : filter }} candidates found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '@/store';

export default {
  name: 'EmployerCandidates',

  data() {
    return {
      store: useAppStore(),
      filter: 'pending',
      tabs: [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'All', value: 'all' },
      ],
    };
  },

  computed: {
    allApplications() {
      return this.store.applications.map((a) => {
        const job = this.store.jobs.find((j) => j.id === a.jobId);
        return {
          ...a,
          jobTitle: job?.title || 'Unknown Position',
          avatar: `https://i.pravatar.cc/150?img=${(a.id % 50) + 1}`,
        };
      });
    },
    filteredApplications() {
      if (this.filter === 'all') return this.allApplications;
      return this.allApplications.filter((a) => a.status === this.filter);
    },
  },

  methods: {
    getCount(status) {
      if (status === 'all') return this.store.applications.length;
      return this.store.applications.filter((a) => a.status === status).length;
    },
  },
};
</script>
