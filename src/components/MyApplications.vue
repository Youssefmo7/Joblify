<template>
    <div
        class="text-gray-800 font-sans min-h-screen"
        style="background-color: #f4f5f7"
    >
        <!-- Navbar -->
        <nav
            class="bg-white border-b sticky top-0 z-50"
            style="border-color: #e8ecf1"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a
                            href="/"
                            class="text-2xl font-bold tracking-tight text-gray-900 mr-6"
                        >
                            Joblify
                        </a>
                    </div>
                    <div class="flex items-center gap-4">
                        <a
                            href="/jobs"
                            class="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            Find Jobs
                        </a>
                        <div
                            class="rounded-full h-8 w-8 overflow-hidden border"
                            style="border-color: #e8ecf1"
                        >
                            <img
                                :src="currentUser.avatar"
                                alt="Profile"
                                class="h-8 w-8 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Toast -->
        <transition name="toast">
            <div
                v-if="toast.show"
                class="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
                :style="{
                    backgroundColor:
                        toast.type === 'success' ? '#16a34a' : '#dc2626',
                }"
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                {{ toast.message }}
            </div>
        </transition>

        <!-- Withdraw confirm modal -->
        <transition name="fade">
            <div
                v-if="confirmWithdraw"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                @click.self="confirmWithdraw = null"
            >
                <div
                    class="bg-white rounded-xl border p-6 w-full max-w-sm shadow-xl"
                    style="border-color: #e8ecf1"
                >
                    <h3 class="text-base font-bold text-gray-900 mb-2">
                        Withdraw Application?
                    </h3>
                    <p class="text-sm text-gray-500 mb-6">
                        You are about to withdraw your application for
                        <span class="font-medium text-gray-800">
                            {{ confirmWithdraw.jobTitle }}
                        </span>
                        at
                        <span class="font-medium text-gray-800">
                            {{ confirmWithdraw.company }}
                        </span>
                        . This cannot be undone.
                    </p>
                    <div class="flex gap-3">
                        <button
                            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            @click="confirmWithdraw = null"
                        >
                            Cancel
                        </button>
                        <button
                            class="flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-opacity hover:opacity-90"
                            style="background-color: #dc2626"
                            @click="doWithdraw"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Page content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900">
                    My Applications
                </h1>
                <p class="text-sm text-gray-500 mt-1">
                    Track and manage all your job applications in one place.
                </p>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div
                    class="bg-white rounded-xl border p-4 text-center"
                    style="border-color: #e8ecf1"
                >
                    <p class="text-2xl font-bold text-gray-900">
                        {{ allApplications.length }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Total</p>
                </div>
                <div
                    class="bg-white rounded-xl border p-4 text-center"
                    style="border-color: #e8ecf1"
                >
                    <p class="text-2xl font-bold text-yellow-600">
                        {{ countByStatus('pending') }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">In Review</p>
                </div>
                <div
                    class="bg-white rounded-xl border p-4 text-center"
                    style="border-color: #e8ecf1"
                >
                    <p class="text-2xl font-bold text-green-600">
                        {{ countByStatus('accepted') }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Accepted</p>
                </div>
                <div
                    class="bg-white rounded-xl border p-4 text-center"
                    style="border-color: #e8ecf1"
                >
                    <p class="text-2xl font-bold text-gray-400">
                        {{ countByStatus('rejected') }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Rejected</p>
                </div>
            </div>

            <!-- Filter tabs -->
            <div class="flex gap-2 mb-4 border-b" style="border-color: #e8ecf1">
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
                    :class="
                        activeFilter === tab.value
                            ? 'border-pink-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    "
                    style="margin-bottom: -1px"
                    @click="activeFilter = tab.value"
                >
                    {{ tab.label }}
                    <span
                        class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                        :class="
                            activeFilter === tab.value
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-gray-100 text-gray-500'
                        "
                    >
                        {{
                            tab.value === 'all'
                                ? allApplications.length
                                : countByStatus(tab.value)
                        }}
                    </span>
                </button>
            </div>

            <!-- Application list -->
            <div class="space-y-3">
                <!-- Empty state -->
                <div
                    v-if="filteredApplications.length === 0"
                    class="bg-white rounded-xl border p-12 text-center"
                    style="border-color: #e8ecf1"
                >
                    <svg
                        class="mx-auto h-12 w-12 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p class="text-gray-500 font-medium">
                        No applications here
                    </p>
                    <p class="text-sm text-gray-400 mt-1">
                        {{
                            activeFilter === 'all'
                                ? "You haven't applied to any jobs yet."
                                : `No ${activeFilter} applications.`
                        }}
                    </p>
                    <a
                        href="/jobs-details"
                        class="inline-block mt-4 px-5 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        style="background-color: #fd366e"
                    >
                        Browse Jobs
                    </a>
                </div>

                <!-- Application cards -->
                <transition-group name="list" tag="div" class="space-y-3">
                    <div
                        v-for="app in filteredApplications"
                        :key="app.id"
                        class="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition-shadow"
                        style="border-color: #e8ecf1"
                    >
                        <div class="p-5">
                            <div class="flex items-start justify-between gap-4">
                                <!-- Company logo + job info -->
                                <div
                                    class="flex items-start gap-4 flex-1 min-w-0"
                                >
                                    <div
                                        class="h-12 w-12 flex-shrink-0 rounded-lg border flex items-center justify-center text-lg font-bold"
                                        :class="[
                                            app.companyBg,
                                            app.companyText,
                                        ]"
                                        style="border-color: #e8ecf1"
                                    >
                                        {{ app.companyInitial }}
                                    </div>

                                    <div class="flex-1 min-w-0">
                                        <div
                                            class="flex items-start justify-between gap-2"
                                        >
                                            <div>
                                                <h3
                                                    class="text-base font-bold text-gray-900 truncate"
                                                >
                                                    {{ app.jobTitle }}
                                                </h3>
                                                <p
                                                    class="text-sm text-gray-600"
                                                >
                                                    {{ app.company }}
                                                </p>
                                                <p
                                                    class="text-xs text-gray-400 mt-0.5"
                                                >
                                                    {{ app.location }} &bull;
                                                    {{ app.workType }}
                                                </p>
                                            </div>
                                            <!-- Status badge -->
                                            <span
                                                class="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                                                :class="
                                                    statusStyle(app.status)
                                                        .badge
                                                "
                                            >
                                                <span
                                                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                                                    :class="
                                                        statusStyle(app.status)
                                                            .dot
                                                    "
                                                ></span>
                                                {{
                                                    statusStyle(app.status)
                                                        .label
                                                }}
                                            </span>
                                        </div>

                                        <!-- Submission details -->
                                        <div
                                            class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400"
                                        >
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <svg
                                                    class="h-3.5 w-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Applied {{ app.submittedAt }}
                                            </span>
                                            <span
                                                v-if="app.resumeFileName"
                                                class="flex items-center gap-1"
                                            >
                                                <svg
                                                    class="h-3.5 w-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                    />
                                                </svg>
                                                {{ app.resumeFileName }}
                                            </span>
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <svg
                                                    class="h-3.5 w-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                {{ app.email }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action bar -->
                            <div
                                class="mt-4 pt-3 border-t flex items-center justify-between"
                                style="border-color: #e8ecf1"
                            >
                                <a
                                    :href="`/job-details/${app.jobId}`"
                                    class="text-sm font-medium flex items-center gap-1 hover:underline"
                                    style="color: #fd366e"
                                >
                                    View Job
                                    <svg
                                        class="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>

                                <button
                                    v-if="app.status === 'pending'"
                                    class="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                    @click="confirmWithdraw = app"
                                >
                                    <!-- <svg
                                        class="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg> -->
                                    Withdraw
                                </button>

                                <span
                                    v-else-if="app.status === 'accepted'"
                                    class="text-sm text-green-600 font-medium flex items-center gap-1"
                                >
                                    <svg
                                        class="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Accepted — check your email
                                </span>

                                <span
                                    v-else-if="app.status === 'rejected'"
                                    class="text-sm text-gray-400 font-medium"
                                >
                                    Not selected this time
                                </span>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, reactive } from 'vue';
import { useAppStore } from '@/store';

export default {
    name: 'MyApplications',

    setup() {
        const store = useAppStore();

        const currentUser = computed(() => store.currentUser);
        const allApplications = computed(() => store.myApplications);

        //Filter tabs
        const tabs = [
            { label: 'All', value: 'all' },
            { label: 'In Review', value: 'pending' },
            { label: 'Accepted', value: 'accepted' },
            { label: 'Rejected', value: 'rejected' },
        ];
        const activeFilter = ref('all');

        const filteredApplications = computed(() => {
            if (activeFilter.value === 'all') return allApplications.value;
            return allApplications.value.filter(
                (a) => a.status === activeFilter.value
            );
        });

        function countByStatus(status) {
            return allApplications.value.filter((a) => a.status === status)
                .length;
        }

        //Status styles
        function statusStyle(status) {
            const map = {
                pending: {
                    label: 'In Review',
                    badge: 'bg-yellow-100 text-yellow-800',
                    dot: 'bg-yellow-500',
                },
                accepted: {
                    label: 'Accepted',
                    badge: 'bg-green-100 text-green-800',
                    dot: 'bg-green-500',
                },
                rejected: {
                    label: 'Rejected',
                    badge: 'bg-gray-100 text-gray-600',
                    dot: 'bg-gray-400',
                },
            };
            return map[status] || map.pending;
        }

        //  Withdraw
        const confirmWithdraw = ref(null);

        function doWithdraw() {
            if (!confirmWithdraw.value) return;
            store.withdrawApplication(confirmWithdraw.value.id);
            showToast(`Withdrawn from ${confirmWithdraw.value.jobTitle}`);
            confirmWithdraw.value = null;
        }

        // Toast
        const toast = reactive({ show: false, message: '', type: 'success' });
        function showToast(message, type = 'success') {
            toast.message = message;
            toast.type = type;
            toast.show = true;
            setTimeout(() => (toast.show = false), 3000);
        }

        return {
            currentUser,
            allApplications,
            filteredApplications,
            countByStatus,
            activeFilter,
            tabs,
            statusStyle,
            confirmWithdraw,
            doWithdraw,
            toast,
        };
    },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-enter-active {
    transition: all 0.3s ease;
}
.list-leave-active {
    transition: all 0.2s ease;
}
.list-enter-from {
    opacity: 0;
    transform: translateY(8px);
}
.list-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}
</style>
