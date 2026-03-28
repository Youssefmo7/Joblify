<template>
  <div>
    <!-- Platform Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ store.stats.totalUsers.toLocaleString() }}</p>
            <p class="text-xs text-green-600 font-medium mt-1">{{ store.usersGrowth }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <p class="text-sm font-medium text-gray-500">Active Jobs</p>
            <p class="mt-2 text-3xl font-bold text-blue-600">{{ store.activeJobsCount }}</p>
            <p class="text-xs text-green-600 font-medium mt-1">{{ store.jobsGrowth }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <p class="text-sm font-medium text-gray-500">Pending Approval</p>
            <p class="mt-2 text-3xl font-bold text-yellow-600">{{ store.stats.pendingCount }}</p>
        </div>
        <div class="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <p class="text-sm font-medium text-gray-500">Flagged Comments</p>
            <p class="mt-2 text-3xl font-bold text-red-600">{{ store.allComments.length }}</p>
        </div>
    </div>

    <!-- Charts Area -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-surface rounded-xl border border-border p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-4 border-b border-border pb-3">Users Distribution</h3>
            <div class="h-64 flex justify-center items-center relative">
                <Pie v-if="chartData.datasets[0].data.length" id="users-chart" :options="chartOptions" :data="chartData" />
                <div v-else class="text-gray-400 text-sm">Loading chart data...</div>
            </div>
        </div>
        
        <!-- Quick Activity Summary -->
        <div class="bg-surface rounded-xl border border-border overflow-hidden flex flex-col">
            <div class="px-6 py-4 border-b border-border bg-gray-50">
                <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Recent Activity Shortcut</h3>
            </div>
            <ul class="divide-y divide-border overflow-y-auto max-h-64" v-if="store.activityLog.length > 0">
                <li class="p-4 flex items-center space-x-3 hover:bg-gray-50 text-sm" v-for="entry in Math.min(store.activityLog.length, 5)" :key="store.activityLog[entry - 1]?.id">
                    <span class="h-2 w-2 rounded-full flex-shrink-0 bg-primary"></span>
                    <span class="text-gray-700 font-medium truncate flex-1">{{ formatActivityTitle(store.activityLog[entry - 1]) }}</span>
                </li>
            </ul>
            <div v-else class="p-8 text-center text-sm text-gray-500 flex-1 flex flex-col justify-center items-center">
                <svg class="h-10 w-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4M12 20V4"></path></svg>
                No recent activity
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: "AdminOverview",
  components: { Pie },
  setup() {
    const store = useAdminStore();

    const chartData = computed(() => {
        return {
          labels: ['Candidates', 'Employers'],
          datasets: [
            {
              backgroundColor: ['#fd366e', '#3b82f6'],
              data: [store.candidateCount || 0, store.employerCount || 0]
            }
          ]
        };
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    };

    const formatActivityTitle = (entry) => {
      if (entry.type === "job_approved") return `Approved job: ${entry.title}`;
      if (entry.type === "job_rejected") return `Rejected job: ${entry.title}`;
      if (entry.type === "comment_removed") return `Hid comment`;
      if (entry.type === "comment_restored") return `Restored comment`;
      if (entry.type === "user_banned") return `Banned suspicious user`;
      if (entry.type === "user_unbanned") return `Pardoned & unbanned user`;
      return "Admin action";
    };

    return {
      store,
      chartData,
      chartOptions,
      formatActivityTitle
    };
  }
};
</script>
