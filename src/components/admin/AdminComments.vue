<template>
    <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center">
            <div>
                <h3 class="text-lg font-bold text-gray-900">Comments Moderation</h3>
                <p class="text-sm text-gray-500 mt-1">Review activity to ensure platform guidelines are met.</p>
            </div>
            <span class="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ store.allComments.length }} Total</span>
        </div>

        <div v-if="actionMessage" class="px-6 py-3 bg-green-50 border-b border-green-100 text-sm font-medium text-green-600 flex items-center transition-all">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ actionMessage }}
        </div>

        <div class="divide-y divide-border bg-white" v-if="store.allComments.length > 0">
            <div class="p-6 hover:bg-gray-50 transition-colors" v-for="comment in store.allComments" :key="comment.id">
                <div class="flex items-start justify-between flex-wrap gap-4">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2 flex-wrap">
                            <p class="text-sm font-bold text-gray-900">{{ comment.userName || 'Anonymous' }}</p>
                            <span class="text-xs px-2 bg-gray-100 text-gray-600 rounded">{{ comment.userRole }}</span>
                            <span class="text-xs text-gray-400">on Job #{{ comment.jobId }} &bull; {{ formatDate(comment.createdAt) }}</span>
                        </div>
                        <div class="mt-3 relative">
                            <div class="absolute inset-0 bg-gray-100 rounded-lg opacity-50" v-if="comment.status === 'hidden'"></div>
                            <p class="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-border italic break-words relative z-10" :class="{'text-gray-400': comment.status === 'hidden'}">"{{ comment.text }}"</p>
                        </div>
                        <div class="mt-2.5 flex items-center">
                            <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider" :class="comment.status === 'visible' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'">
                                Status: {{ comment.status === 'visible' ? 'Visible' : 'Hidden By Admin' }}
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2 flex-shrink-0 sm:ml-4">
                        <button v-if="comment.status === 'hidden'" @click="handleRestore(comment.id)" class="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Restore Comment</button>
                        <button v-if="comment.status === 'visible'" @click="handleHide(comment.id)" class="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors flex items-center">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                            Hide Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="p-12 text-center text-gray-500 bg-white">
            <svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <p class="font-medium text-lg text-gray-900">No Comments Yet</p>
            <p>There are no comments on any jobs to review right now.</p>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useAdminStore } from "@/stores/adminStore";

export default {
  name: "AdminComments",
  setup() {
    const store = useAdminStore();
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

    const handleHide = async (commentId) => {
      const ok = await store.hideComment(commentId);
      if (ok) showMessage("Comment hidden.");
    };

    const handleRestore = async (commentId) => {
      const ok = await store.restoreComment(commentId);
      if (ok) showMessage("Comment restored.");
    };

    return {
      store,
      actionMessage,
      formatDate,
      handleHide,
      handleRestore
    };
  }
};
</script>
