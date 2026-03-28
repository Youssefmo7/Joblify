<template>
    <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">User Management</h3>
            <div class="flex gap-2">
                <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ store.allUsers.length }} Total</span>
            </div>
        </div>
        
        <div v-if="actionMessage" class="px-6 py-3 bg-green-50 border-b border-green-100 text-sm font-medium text-green-600 flex items-center transition-all">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ actionMessage }}
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-600">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-border">
                    <tr>
                        <th scope="col" class="px-6 py-4 font-semibold tracking-wider">User Details</th>
                        <th scope="col" class="px-6 py-4 font-semibold tracking-wider">Role</th>
                        <th scope="col" class="px-6 py-4 font-semibold tracking-wider">Joined Date</th>
                        <th scope="col" class="px-6 py-4 text-right font-semibold tracking-wider">Status / Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border bg-white">
                    <tr v-for="user in store.allUsers" :key="user.id" class="hover:bg-gray-50 transition-colors" :class="{'opacity-60 bg-red-50': user.banned}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 overflow-hidden">
                                    <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover">
                                    <span v-else>{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</span>
                                </div>
                                <div>
                                    <p class="font-bold text-gray-900">{{ user.name || 'Unknown' }} <span v-if="user.banned" class="ml-2 text-[10px] uppercase font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Banned</span></p>
                                    <p class="text-xs text-gray-500 font-mono mt-0.5">{{ user.email }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2.5 py-1 text-xs font-medium rounded-full uppercase" :class="user.role === 'employer' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'">
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                            {{ formatDate(user.createdAt) }}
                        </td>
                        <td class="px-6 py-4 text-right whitespace-nowrap">
                            <button v-if="!user.banned" @click="handleToggleBan(user)" class="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">Ban User</button>
                            <button v-else @click="handleToggleBan(user)" class="px-3 py-1.5 text-xs font-medium text-green-700 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">Unban User</button>
                        </td>
                    </tr>
                    <tr v-if="store.allUsers.length === 0">
                        <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                            No users found in the database.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useAdminStore } from "@/stores/adminStore";

export default {
  name: "AdminUsers",
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

    const handleToggleBan = async (user) => {
        if (!user.banned) {
            const ok = await store.banUser(user.id);
            if (ok) showMessage(`${user.name} has been banned.`);
        } else {
            const ok = await store.unbanUser(user.id);
            if (ok) showMessage(`${user.name} has been pardoned.`);
        }
    };

    return {
      store,
      actionMessage,
      formatDate,
      handleToggleBan
    };
  }
};
</script>
