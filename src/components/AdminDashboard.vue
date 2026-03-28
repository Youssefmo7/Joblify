<template>
  <div class="text-gray-800 font-sans min-h-screen" style="background-color: var(--color-bg, #f4f5f7);">
    <!-- Navbar -->
    <nav class="bg-surface border-b border-border sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <RouterLink to="/" class="text-2xl font-bold tracking-tight text-gray-900 border-r border-border pr-4 mr-4">Joblify</RouterLink>
                    <span class="text-lg font-semibold text-red-600">Admin Panel</span>
                </div>
                <div class="flex items-center">
                    <span class="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded-full mr-4">ADMIN</span>
                    <div class="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center border border-border cursor-pointer" @click="logout">
                        <span class="font-bold text-white text-sm">A</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
        <!-- Left Sidebar -->
        <div class="w-64 hidden md:block flex-shrink-0">
            <div class="bg-surface rounded-xl border border-border overflow-hidden">
                <div class="p-4 border-b border-border">
                    <h2 class="text-lg font-bold text-gray-900">Admin Panel</h2>
                </div>
                <nav class="p-2 space-y-1">
                    <a href="#" @click.prevent="activeTab = 'overview'" 
                       :class="activeTab === 'overview' ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-gray-50'"
                       class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                        <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> 
                        Overview
                    </a>
                    <a href="#" @click.prevent="activeTab = 'jobs'" 
                       :class="activeTab === 'jobs' ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-gray-50'"
                       class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                        <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
                        Pending Jobs 
                        <span class="ml-auto bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs font-bold">{{ store.stats.pendingCount }}</span>
                    </a>
                    <a href="#" @click.prevent="activeTab = 'users'" 
                       :class="activeTab === 'users' ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-gray-50'"
                       class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                        <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 
                        Users
                    </a>
                    <a href="#" @click.prevent="activeTab = 'comments'" 
                       :class="activeTab === 'comments' ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-gray-50'"
                       class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                        <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg> 
                        Comments 
                        <span class="ml-auto bg-red-100 text-red-700 py-0.5 px-2 rounded-full text-xs font-bold">{{ store.allComments.length }}</span>
                    </a>
                    <a href="#" @click.prevent="activeTab = 'activity'" 
                       :class="activeTab === 'activity' ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-gray-50'"
                       class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                        <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> 
                        Platform Activity
                    </a>
                </nav>
            </div>
        </div>

        <!-- Main Content (Dynamic Child Components) -->
        <div class="flex-1 space-y-6 min-w-0">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900 capitalize" v-if="activeTab !== 'overview'">
                    {{ activeTab.replace('jobs', 'pending jobs') }}
                </h1>
                <h1 class="text-2xl font-bold text-gray-900" v-else>Admin Overview</h1>
            </div>

            <!-- Child Views -->
            <AdminOverview v-show="activeTab === 'overview'" />
            <AdminJobs v-if="activeTab === 'jobs'" />
            <AdminUsers v-if="activeTab === 'users'" />
            <AdminComments v-if="activeTab === 'comments'" />
            <AdminActivity v-if="activeTab === 'activity'" />

        </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

// Import Custom Child Components
import AdminOverview from "./admin/AdminOverview.vue";
import AdminJobs from "./admin/AdminJobs.vue";
import AdminUsers from "./admin/AdminUsers.vue";
import AdminComments from "./admin/AdminComments.vue";
import AdminActivity from "./admin/AdminActivity.vue";

export default {
  name: "AdminDashboard",
  components: {
      AdminOverview,
      AdminJobs,
      AdminUsers,
      AdminComments,
      AdminActivity
  },
  setup() {
    const store = useAdminStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const activeTab = ref('overview');

    onMounted(() => {
      // Load all required data initially
      store.loadDashboard();
    });

    const logout = () => {
      authStore.logout();
      router.push("/");
    };

    return {
      store,
      activeTab,
      logout,
    };
  },
};
</script>
