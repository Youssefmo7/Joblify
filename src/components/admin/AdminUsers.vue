<template>
    <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center flex-wrap gap-3">
            <h3 class="text-lg font-bold text-gray-900">User Management</h3>
            <div class="flex gap-2">
                <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ store.usersMeta?.total || store.allUsers.length }} Total</span>
            </div>
        </div>

        <!-- Search & Filter -->
        <div class="px-6 py-3 bg-white border-b border-border flex gap-3 flex-wrap">
            <input
                v-model="searchQuery"
                class="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary flex-1 min-w-[200px]"
                placeholder="Search by name or email..."
                @keyup.enter="applySearch"
            />
            <select v-model="roleFilter" class="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" @change="applySearch">
                <option value="">All roles</option>
                <option value="candidate">Candidate</option>
                <option value="employer">Employer</option>
            </select>
            <button class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90" @click="applySearch">Search</button>
        </div>

        <div v-if="store.loading && store.allUsers.length === 0" class="p-12 text-center text-sm text-gray-500 bg-white">
            <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading users…
        </div>

        <div v-else-if="store.error" class="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-600 flex items-center justify-between">
            <span>{{ store.error }}</span>
            <button class="text-red-700 font-medium underline" @click="applySearch">Retry</button>
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
                    <tr v-for="user in store.allUsers" :key="user.id" class="hover:bg-gray-50 transition-colors" :class="{'opacity-60 bg-red-50': user.suspended}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 overflow-hidden">
                                    <span>{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</span>
                                </div>
                                <div>
                                    <p class="font-bold text-gray-900">{{ user.name || 'Unknown' }} <span v-if="user.suspended" class="ml-2 text-[10px] uppercase font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Suspended</span></p>
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
                            {{ formatDate(user.created_at) }}
                        </td>
                        <td class="px-6 py-4 text-right whitespace-nowrap">
                            <button v-if="!user.suspended" @click="handleToggleSuspend(user)" class="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">Suspend</button>
                            <button v-else @click="handleToggleSuspend(user)" class="px-3 py-1.5 text-xs font-medium text-green-700 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">Activate</button>
                        </td>
                    </tr>
                    <tr v-if="store.allUsers.length === 0 && !store.loading">
                        <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                            No users found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <AdminPagination :meta="store.usersMeta" @change="goToPage" />
    </div>
</template>

<script>
import { ref } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import AdminPagination from "./AdminPagination.vue";

export default {
  name: "AdminUsers",
  components: { AdminPagination },
  setup() {
    const store = useAdminStore();
    const actionMessage = ref("");
    const searchQuery = ref("");
    const roleFilter = ref("");
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const applySearch = () => {
      store.fetchUsers({ page: 1, q: searchQuery.value, role: roleFilter.value });
    };

    const goToPage = (page) => {
      store.fetchUsers({ page, q: searchQuery.value, role: roleFilter.value });
    };

    const handleToggleSuspend = async (user) => {
        if (!user.suspended) {
            const ok = await store.suspendUser(user.id);
            if (ok) showMessage(`${user.name} has been suspended.`);
        } else {
            const ok = await store.activateUser(user.id);
            if (ok) showMessage(`${user.name} has been activated.`);
        }
    };

    return {
      store,
      actionMessage,
      searchQuery,
      roleFilter,
      formatDate,
      applySearch,
      goToPage,
      handleToggleSuspend
    };
  }
};
</script>
