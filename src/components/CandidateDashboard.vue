<template>
    <div class="min-h-screen bg-[#f4f5f7] font-sans text-gray-800">
        <!--Navbar-->
        <nav class="bg-white border-b border-[#e8ecf1] sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <span
                            class="text-2xl font-bold tracking-tight text-gray-900"
                        >
                            Joblify
                        </span>
                    </div>
                    <div class="flex items-center gap-6">
                        <a
                            href="/"
                            class="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            Find Jobs
                        </a>
                        <div
                            class="rounded-full bg-gray-200 h-8 w-8 overflow-hidden border border-[#e8ecf1]"
                        >
                            <img
                                src="https://i.pravatar.cc/150?img=68"
                                alt="Profile"
                                class="h-8 w-8 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <!-- ── Body layout -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
            <!-- Sidebar -->
            <aside class="w-64 hidden md:block flex-shrink-0">
                <div
                    class="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden"
                >
                    <div class="p-4 border-b border-[#e8ecf1]">
                        <h2 class="text-lg font-bold text-gray-900">
                            Dashboard
                        </h2>
                    </div>
                    <nav class="p-2 space-y-1">
                        <button
                            v-for="item in navItems"
                            :key="item.key"
                            :class="[
                                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer',
                                activeSection === item.key
                                    ? 'bg-pink-50 text-[#fd366e]'
                                    : 'text-gray-600 hover:bg-gray-50',
                            ]"
                            @click="activeSection = item.key"
                        >
                            <span
                                class="h-5 w-5 mr-3 flex-shrink-0"
                                v-html="item.icon"
                            />
                            {{ item.label }}
                            <span
                                v-if="item.badge"
                                class="ml-auto bg-[#fd366e] text-white text-xs font-bold rounded-full px-2 py-0.5 leading-none"
                            >
                                {{ item.badge }}
                            </span>
                        </button>
                    </nav>
                </div>
            </aside>
            <!-- Main content -->
            <div class="flex-1 min-w-0 space-y-6">
                <!-- OVERVIEW  -->
                <template v-if="activeSection === 'overview'">
                    <h1 class="text-2xl font-bold text-gray-900">
                        Welcome back, {{ store.candidateProfile.first_name }}!
                    </h1>

                    <!-- Stat cards -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            class="bg-white rounded-xl border border-[#e8ecf1] p-5"
                        >
                            <p class="text-sm font-medium text-gray-500">
                                Total Applications
                            </p>
                            <p class="mt-2 text-3xl font-bold text-gray-900">
                                {{ store.candidateApplications.length }}
                            </p>
                        </div>
                        <div
                            class="bg-white rounded-xl border border-[#e8ecf1] p-5"
                        >
                            <p class="text-sm font-medium text-gray-500">
                                Pending Review
                            </p>
                            <p class="mt-2 text-3xl font-bold text-yellow-600">
                                {{ store.pendingCount }}
                            </p>
                        </div>
                        <div
                            class="bg-white rounded-xl border border-[#e8ecf1] p-5"
                        >
                            <p class="text-sm font-medium text-gray-500">
                                Accepted
                            </p>
                            <p class="mt-2 text-3xl font-bold text-[#fd366e]">
                                {{ store.acceptedApplications.length }}
                            </p>
                        </div>
                    </div>
                    <!-- Recent applications table -->
                    <div
                        class="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden"
                    >
                        <div
                            class="px-6 py-4 border-b border-[#e8ecf1] flex justify-between items-center"
                        >
                            <h3 class="text-lg font-bold text-gray-900">
                                Recent Applications
                            </h3>
                            <button
                                class="text-sm text-[#fd366e] font-medium hover:underline"
                                @click="activeSection = 'applications'"
                            >
                                View All
                            </button>
                        </div>

                        <ul class="divide-y divide-[#e8ecf1]">
                            <li
                                v-for="app in recentApplications"
                                :key="app.id"
                                class="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div
                                    class="flex items-center justify-between gap-4"
                                >
                                    <!-- Company logo + info -->
                                    <div
                                        class="flex items-center gap-4 flex-1 min-w-0"
                                    >
                                        <div
                                            class="h-10 w-10 rounded text-xl flex items-center justify-center font-bold flex-shrink-0"
                                            :style="logoStyle(app.company_name)"
                                        >
                                            {{ app.company_name[0] }}
                                        </div>
                                        <div class="min-w-0">
                                            <p
                                                class="text-sm font-medium text-gray-900 truncate"
                                            >
                                                {{ app.job_title }}
                                            </p>
                                            <p class="text-xs text-gray-500">
                                                {{ app.company_name }} • Applied
                                                {{ formatDate(app.applied_at) }}
                                            </p>
                                        </div>
                                    </div>
                                    <!-- Status badge -->
                                    <span
                                        :class="[
                                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                            badgeClass(app.status),
                                        ]"
                                    >
                                        {{ badgeLabel(app.status) }}
                                    </span>
                                    <!-- Action -->
                                    <div class="flex-shrink-0 w-20 text-right">
                                        <button
                                            v-if="app.status === 'pending'"
                                            class="text-sm text-red-500 hover:underline"
                                            @click="cancelApp(app.id)"
                                        >
                                            Withdraw
                                        </button>
                                        <span
                                            v-else
                                            class="text-sm text-gray-300"
                                        >
                                            —
                                        </span>
                                    </div>
                                </div>
                            </li>

                            <li
                                v-if="!recentApplications.length"
                                class="p-8 text-center text-sm text-gray-400"
                            >
                                No applications yet.
                                <button
                                    class="text-[#fd366e] underline ml-1"
                                    @click="activeSection = 'jobs'"
                                >
                                    Browse jobs
                                </button>
                            </li>
                        </ul>
                    </div>
                    <!-- Profile completion widget -->
                    <div
                        class="bg-white rounded-xl border border-[#e8ecf1] p-6 shadow-sm"
                    >
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-lg font-bold text-gray-900">
                                    Profile Completion
                                </h3>
                                <p class="text-sm text-gray-500 mt-1">
                                    Add your resume and skills to boost your
                                    ranking.
                                </p>
                            </div>
                            <span class="text-2xl font-bold text-[#fd366e]">
                                {{ completionPct }}%
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div
                                class="bg-[#fd366e] h-2 rounded-full transition-all duration-500"
                                :style="{ width: completionPct + '%' }"
                            />
                        </div>
                        <div class="mt-4 flex gap-3 flex-wrap">
                            <button
                                class="px-4 py-2 border border-[#0077b5] text-[#0077b5] text-sm font-medium rounded-lg hover:bg-blue-50 flex items-center gap-2"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                    />
                                </svg>
                                Connect LinkedIn
                            </button>
                            <button
                                class="px-4 py-2 border border-[#e8ecf1] text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                                @click="activeSection = 'profile'"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </template>
                <!-- ── PROFILE  -->
                <UserProfile v-else-if="activeSection === 'profile'" />

                <!-- ── MY APPLICATIONS  -->
                <JobApplication
                    v-else-if="activeSection === 'applications'"
                    @navigate="activeSection = $event"
                />

                <!-- ── SAVED / BROWSE JOBS  -->
                <JobList v-else-if="activeSection === 'jobs'" />
            </div>
        </div>
        <!-- Withdraw Modal -->
        <div
            v-if="showConfirmModal"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
            <div
                class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                @click="showConfirmModal = false"
            ></div>

            <div
                class="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e8ecf1]"
            >
                <div class="text-center">
                    <div
                        class="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">
                        Are you sure?
                    </h3>
                    <p class="text-sm text-gray-500 mt-2">
                        Do you really want to withdraw this application? This
                        action cannot be undone.
                    </p>
                </div>

                <div class="flex gap-3 mt-6">
                    <button
                        @click="showConfirmModal = false"
                        class="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Keep it
                    </button>
                    <button
                        @click="confirmWithdraw"
                        class="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                    >
                        Yes, Withdraw
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useAppStore } from '../store/candidateAppstore';
import UserProfile from './UserProfile.vue';
import JobApplication from './JobApplication.vue';
import JobList from './JobList.vue';

const LOGO_COLORS = [
    { bg: '#dbeafe', color: '#1d4ed8' },
    { bg: '#dcfce7', color: '#15803d' },
    { bg: '#fef9c3', color: '#a16207' },
    { bg: '#fce7f3', color: '#be185d' },
    { bg: '#ede9fe', color: '#6d28d9' },
    { bg: '#ffedd5', color: '#c2410c' },
];
const NAV_ICONS = {
    overview: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    profile: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    applications: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    jobs: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`,
};
export default {
    name: 'CandidateDashboard',
    components: { UserProfile, JobApplication, JobList },
    data() {
        return {
            activeSection: 'overview',
            store: useAppStore(),
            showConfirmModal: false,
            selectedAppId: null,
        };
    },
    computed: {
        navItems() {
            return [
                {
                    key: 'overview',
                    label: 'Overview',
                    icon: NAV_ICONS.overview,
                },
                {
                    key: 'profile',
                    label: 'Profile Settings',
                    icon: NAV_ICONS.profile,
                },
                {
                    key: 'applications',
                    label: 'My Applications',
                    icon: NAV_ICONS.applications,
                    badge: this.store.pendingCount || null,
                },
                { key: 'jobs', label: 'Saved Jobs', icon: NAV_ICONS.jobs },
            ];
        },
        recentApplications() {
            return [...this.store.candidateApplications]
                .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
                .slice(0, 3);
        },
        completionPct() {
            const p = this.store.candidateProfile;
            const checks = [
                p.first_name,
                p.last_name,
                p.email,
                p.phone,
                p.bio,
                p.resume_url,
                p.skills?.length > 0,
            ];
            const filled = checks.filter(Boolean).length;
            return Math.round((filled / checks.length) * 100);
        },
    },
    methods: {
        formatDate(iso) {
            if (!iso) return '—';
            const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
            if (diff === 0) return 'today';
            if (diff === 1) return 'yesterday';
            if (diff < 7) return `${diff} days ago`;
            return new Date(iso).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
            });
        },

        logoStyle(name) {
            const c = LOGO_COLORS[name.charCodeAt(0) % LOGO_COLORS.length];
            return { backgroundColor: c.bg, color: c.color };
        },

        badgeClass(status) {
            return (
                {
                    pending: 'bg-yellow-100 text-yellow-800',
                    accepted: 'bg-green-100 text-green-800',
                    rejected: 'bg-gray-100 text-gray-800',
                }[status] ?? 'bg-gray-100 text-gray-600'
            );
        },
        badgeLabel(status) {
            return (
                {
                    pending: 'In Review',
                    accepted: 'Accepted',
                    rejected: 'Rejected',
                }[status] ?? status
            );
        },

        cancelApp(id) {
            this.selectedAppId = id;
            this.showConfirmModal = true;
        },
        confirmWithdraw() {
            if (this.selectedAppId) {
                this.store.cancelApplication(this.selectedAppId);
                this.showConfirmModal = false;
                this.selectedAppId = null;
            }
        },
    },
};
</script>
