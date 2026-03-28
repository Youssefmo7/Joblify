<template>
    <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Admin Activity Log</h3>
            <span class="text-xs text-gray-600 font-medium bg-white border border-border px-3 py-1 rounded-full shadow-sm">{{ store.activityLog.length }} Local Records</span>
        </div>
        <ul class="divide-y divide-border bg-white" v-if="store.activityLog.length > 0">
            <li class="p-5 flex items-start space-x-4 hover:bg-gray-50 transition-colors" v-for="entry in store.activityLog" :key="entry.id">
                <div class="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" :class="{
                    'bg-green-100 text-green-600': entry.type === 'job_approved',
                    'bg-red-100 text-red-600': entry.type === 'job_rejected' || entry.type === 'user_banned',
                    'bg-blue-100 text-blue-600': entry.type === 'user_unbanned',
                    'bg-gray-100 text-gray-600': entry.type.includes('comment')
                }">
                   <svg v-if="entry.type.includes('job')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                   <svg v-else-if="entry.type.includes('user')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
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
    </div>
</template>

<script>
import { useAdminStore } from "@/stores/adminStore";

export default {
  name: "AdminActivity",
  setup() {
    const store = useAdminStore();

    const formatDate = (value) => {
      if (!value) return "Unknown";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "Unknown";
      return date.toLocaleString();
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
      formatDate,
      formatActivityTitle
    };
  }
};
</script>
