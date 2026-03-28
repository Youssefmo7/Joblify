<template>
    <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Job Approvals</h3>
            <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">{{ store.stats.pendingCount }} Pending</span>
        </div>

        <div v-if="actionMessage" class="px-6 py-3 bg-green-50 border-b border-green-100 text-sm font-medium text-green-600 flex items-center transition-all">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ actionMessage }}
        </div>

        <div class="divide-y divide-border bg-white" v-if="store.stats.pendingCount > 0">
            <div class="p-5 hover:bg-gray-50 transition-colors" v-for="job in store.pendingJobs" :key="job.id">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h4 class="text-base font-bold text-gray-900 cursor-pointer hover:text-primary transition-colors">{{ job.title }}</h4>
                        <div class="flex items-center mt-1 space-x-3 text-sm text-gray-500">
                            <div class="flex items-center"><svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg> <span class="font-medium text-gray-700">{{ job.company }}</span></div>
                            <span class="text-gray-300">&bull;</span>
                            <span>{{ formatDate(job.createdAt) }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <input v-model="reviewNotes[job.id]" class="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto" placeholder="Rejection note (Optional)" />
                        <div class="flex gap-2">
                            <button @click="handleReject(job.id)" class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg transition-colors whitespace-nowrap">Reject</button>
                            <button @click="handleApprove(job.id)" class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors whitespace-nowrap">Approve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="p-12 text-center text-sm text-gray-500 bg-white flex flex-col items-center">
            <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p class="text-gray-900 font-bold text-lg mb-1">You're all caught up!</p>
            <p class="text-gray-500">There are no pending jobs to review right now.</p>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useAdminStore } from "@/stores/adminStore";

export default {
  name: "AdminJobs",
  setup() {
    const store = useAdminStore();
    const reviewNotes = ref({});
    const actionMessage = ref("");
    let messageTimer = null;

    const showMessage = (msg) => {
      actionMessage.value = msg;
      if (messageTimer) window.clearTimeout(messageTimer);
      messageTimer = window.setTimeout(() => {
        actionMessage.value = "";
      }, 3000);
    };

    const formatDate = (value) => {
      if (!value) return "Unknown";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "Unknown";
      return date.toLocaleString();
    };

    const handleApprove = async (jobId) => {
      const ok = await store.approveJob(jobId);
      if (ok) showMessage("Job approved successfully.");
    };

    const handleReject = async (jobId) => {
      const ok = await store.rejectJob(jobId, reviewNotes.value[jobId] || "");
      if (ok) showMessage(`Job rejected.`);
      delete reviewNotes.value[jobId];
    };

    return {
      store,
      reviewNotes,
      actionMessage,
      formatDate,
      handleApprove,
      handleReject
    };
  }
};
</script>
