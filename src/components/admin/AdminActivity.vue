<template>
    <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center flex-wrap gap-3">
            <h3 class="text-lg font-bold text-gray-900">Admin Activity Log</h3>
            <div class="flex items-center gap-3">
                <select v-model="actionFilter" class="px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" @change="applyFilter">
                    <option value="">All actions</option>
                    <option value="job.approve">Job Approvals</option>
                    <option value="job.reject">Job Rejections</option>
                    <option value="user.suspend">User Suspensions</option>
                    <option value="user.activate">User Activations</option>
                    <option value="comment.delete">Comment Removals</option>
                </select>
                <span class="text-xs text-gray-600 font-medium bg-white border border-border px-3 py-1 rounded-full shadow-sm">{{ store.logsMeta?.total || store.activityLog.length }} Records</span>
            </div>
        </div>

        <div v-if="store.loading && store.activityLog.length === 0" class="p-12 text-center text-sm text-gray-500 bg-white">
            <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading activity logs…
        </div>

        <div v-if="store.error" class="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-600 flex items-center justify-between">
            <span>{{ store.error }}</span>
            <button class="text-red-700 font-medium underline" @click="applyFilter">Retry</button>
        </div>

        <ul class="divide-y divide-border bg-white" v-if="store.activityLog.length > 0">
            <li class="p-5 flex items-start space-x-4 hover:bg-gray-50 transition-colors" v-for="entry in store.activityLog" :key="entry.id">
                <div class="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" :class="iconClass(entry)">
                   <svg v-if="entry.type && entry.type.includes('job')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                   <svg v-else-if="entry.type && entry.type.includes('user')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                   <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900">{{ formatActivityTitle(entry) }}</p>
                    <p class="text-xs text-gray-500 mt-1" v-if="entry.meta">{{ entry.meta }}</p>
                </div>
                <span class="ml-4 text-xs text-gray-400 flex-shrink-0 whitespace-nowrap bg-gray-50 px-2 py-1 border border-border rounded">{{ formatDate(entry.createdAt) }}</span>
            </li>
        </ul>
        <div v-else class="p-12 text-center text-sm text-gray-500 bg-white flex flex-col items-center">
            <div class="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p class="text-lg font-bold text-gray-900 mb-1">No activity yet</p>
            <p>Actions you perform during this session will appear here.</p>
        </div>

        <AdminPagination :meta="store.logsMeta" @change="goToPage" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import AdminPagination from "./AdminPagination.vue";

export default {
  name: "AdminActivity",
  components: { AdminPagination },
  setup() {
    const store = useAdminStore();
    const actionFilter = ref("");

    onMounted(() => {
      store.fetchActivityLogs({ per_page: 20 });
    });

    const formatDate = (value) => {
      if (!value) return "Unknown";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "Unknown";
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatActivityTitle = (entry) => {
      const type = entry.type || '';
      const title = entry.title || '';
      if (type === 'job_approved' || type === 'job.approve') return `Approved job: ${title}`;
      if (type === 'job_rejected' || type === 'job.reject') return `Rejected job: ${title}`;
      if (type === 'job_pending') return `New pending job: ${title}`;
      if (type === 'user_registered') return `New user: ${title}`;
      if (type === 'user.suspend') return `Suspended user: ${title}`;
      if (type === 'user.activate') return `Activated user: ${title}`;
      if (type === 'comment.delete') return `Removed comment`;
      return title || 'Admin action';
    };

    const iconClass = (entry) => {
      const type = entry.type || '';
      if (type.includes('job') || type.includes('approve') || type.includes('reject')) {
        return type.includes('reject') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
      }
      if (type.includes('user')) {
        return type.includes('suspend') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600';
      }
      if (type.includes('comment')) return 'bg-gray-100 text-gray-600';
      return 'bg-gray-100 text-gray-600';
    };

    const applyFilter = () => {
      store.fetchActivityLogs({ page: 1, action: actionFilter.value, per_page: 20 });
    };

    const goToPage = (page) => {
      store.fetchActivityLogs({ page, action: actionFilter.value, per_page: 20 });
    };

    return {
      store,
      actionFilter,
      formatDate,
      formatActivityTitle,
      iconClass,
      applyFilter,
      goToPage
    };
  }
};
</script>
