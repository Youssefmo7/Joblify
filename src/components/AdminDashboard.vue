<template>
  <div class="bg-slate-100 min-h-screen text-slate-800">
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-16 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
              Joblify
            </h1>
            <span class="text-rose-600 font-semibold">Admin Panel</span>
          </div>
          <span
            class="text-xs bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full"
            >ADMIN</span
          >
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-slate-900">Platform Overview</h2>
        <p class="text-sm text-slate-500 mt-1">
          Review job quality and moderate flagged content before backend
          integration.
        </p>
        <div class="mt-3 flex items-center gap-3">
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md"
            @click="resetModeration"
          >
            Reset Admin State
          </button>
          <p v-if="actionMessage" class="text-xs font-medium text-emerald-700">
            {{ actionMessage }}
          </p>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p class="text-sm font-medium text-slate-500">Total Users</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">
            {{ store.usersCount.toLocaleString() }}
          </p>
          <p class="text-xs text-emerald-600 font-medium mt-1">
            {{ store.usersGrowth }}
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p class="text-sm font-medium text-slate-500">Active Jobs</p>
          <p class="mt-2 text-3xl font-bold text-sky-600">
            {{ store.activeJobsCount }}
          </p>
          <p class="text-xs text-emerald-600 font-medium mt-1">
            {{ store.jobsGrowth }}
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p class="text-sm font-medium text-slate-500">Pending Approval</p>
          <p class="mt-2 text-3xl font-bold text-amber-600">
            {{ store.pendingJobsCount }}
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p class="text-sm font-medium text-slate-500">Flagged Comments</p>
          <p class="mt-2 text-3xl font-bold text-rose-600">
            {{ store.flaggedCommentsCount }}
          </p>
        </article>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Approval Rate
          </p>
          <p class="mt-2 text-2xl font-bold text-emerald-700">
            {{ store.approvalRatePercent }}%
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Admin Actions (24h)
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ store.actionsLast24h }}
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Top Flag Reason
          </p>
          <p class="mt-2 text-sm font-semibold text-rose-700">
            {{ topFlagReason }}
          </p>
        </article>
      </section>

      <section
        class="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <header
          class="px-6 py-4 border-b border-slate-200 flex items-center justify-between"
        >
          <h3 class="text-lg font-bold text-slate-900">
            Pending Job Approvals
          </h3>
          <span
            class="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full"
            >{{ store.pendingJobsCount }}</span
          >
        </header>

        <div v-if="store.pendingJobsCount" class="divide-y divide-slate-200">
          <article
            v-for="job in store.pendingJobs"
            :key="job.id"
            class="p-5 hover:bg-slate-50 transition-colors"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h4 class="text-base font-bold text-slate-900">
                  {{ job.title }}
                </h4>
                <div
                  class="flex items-center gap-2 mt-1 text-sm text-slate-500"
                >
                  <span>
                    Submitted by:
                    <span class="font-medium text-slate-700">{{
                      job.company
                    }}</span>
                  </span>
                  <span>&bull;</span>
                  <span>{{ job.submittedTime }}</span>
                </div>
                <p class="mt-2 text-xs text-slate-600">
                  {{ job.location }} | {{ job.workType }} | {{ job.salary }}
                </p>
                <label
                  :for="`review-note-${job.id}`"
                  class="mt-3 block text-xs text-slate-500"
                >
                  Review note (optional)
                </label>
                <textarea
                  :id="`review-note-${job.id}`"
                  v-model="reviewNotes[job.id]"
                  rows="2"
                  class="mt-1 w-full max-w-lg rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Write a short admin note for this decision"
                ></textarea>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                  @click="rejectJob(job.id)"
                >
                  Reject
                </button>
                <button
                  type="button"
                  class="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                  @click="approveJob(job.id)"
                >
                  Approve
                </button>
              </div>
            </div>
          </article>
        </div>

        <p v-else class="p-6 text-sm text-slate-500">
          No pending jobs. All listings have been reviewed.
        </p>
      </section>

      <section
        class="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <header
          class="px-6 py-4 border-b border-slate-200 flex items-center justify-between"
        >
          <h3 class="text-lg font-bold text-slate-900">
            Flagged Comment Moderation
          </h3>
          <span
            class="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full"
            >{{ store.flaggedCommentsCount }}</span
          >
        </header>

        <div
          class="px-6 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2"
        >
          <label class="text-xs text-slate-500" for="reason-filter"
            >Reason</label
          >
          <select
            id="reason-filter"
            v-model="reasonFilter"
            class="text-xs rounded-md border border-slate-300 px-2 py-1 bg-white"
          >
            <option value="all">All reasons</option>
            <option
              v-for="reason in reasonOptions"
              :key="reason"
              :value="reason"
            >
              {{ reason }}
            </option>
          </select>

          <label class="text-xs text-slate-500 ml-2" for="window-filter"
            >Flagged</label
          >
          <select
            id="window-filter"
            v-model="timeFilter"
            class="text-xs rounded-md border border-slate-300 px-2 py-1 bg-white"
          >
            <option value="all">Any time</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>
        </div>

        <div
          v-if="filteredModerationQueue.length"
          class="divide-y divide-slate-200"
        >
          <article
            v-for="comment in filteredModerationQueue"
            :key="comment.id"
            class="p-5"
          >
            <p class="text-sm text-slate-700">"{{ comment.text }}"</p>
            <div
              class="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2"
            >
              <span>Author: {{ comment.author }}</span>
              <span>&bull;</span>
              <span>Job: {{ comment.jobTitle }}</span>
              <span>&bull;</span>
              <span>Flagged: {{ formatDate(comment.flaggedAt) }}</span>
              <span>&bull;</span>
              <span class="text-rose-600 font-medium"
                >Reason: {{ comment.flaggedReason }}</span
              >
            </div>
            <div class="mt-3">
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-black rounded-md"
                @click="removeComment(comment.id)"
              >
                Remove Comment
              </button>
            </div>
          </article>
        </div>

        <p v-else class="p-6 text-sm text-slate-500">
          No flagged comments match the current filters.
        </p>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Approved This Session
          </p>
          <p class="mt-2 text-2xl font-bold text-emerald-600">
            {{ store.approvedJobs.length }}
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Rejected This Session
          </p>
          <p class="mt-2 text-2xl font-bold text-rose-600">
            {{ store.rejectedJobs.length }}
          </p>
        </article>
        <article class="bg-white rounded-xl border border-slate-200 p-5">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Total Reviewed
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ store.totalReviewedJobs }}
          </p>
        </article>
      </section>

      <section class="bg-white rounded-xl border border-slate-200 p-5">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Scope Coverage
        </p>
        <ul class="mt-3 text-sm text-slate-700 list-disc list-inside space-y-1">
          <li>Quality control: approve and reject pending jobs.</li>
          <li>
            Platform oversight: key dashboard metrics and reviewed totals.
          </li>
          <li>Content moderation: remove flagged comments.</li>
        </ul>
      </section>

      <section class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between">
          <p
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Admin Activity Timeline
          </p>
          <p class="text-xs text-slate-500">
            {{ store.activityLog.length }} events
          </p>
        </div>

        <div v-if="store.activityLog.length" class="mt-4 space-y-3">
          <article
            v-for="entry in store.activityLog"
            :key="entry.id"
            class="rounded-lg border border-slate-200 p-3"
          >
            <p class="text-sm font-semibold text-slate-800">
              {{ formatActivityTitle(entry) }}
            </p>
            <p class="mt-1 text-xs text-slate-500">{{ entry.meta }}</p>
            <p class="mt-1 text-xs text-slate-400">
              {{ formatDate(entry.createdAt) }}
            </p>
          </article>
        </div>
        <p v-else class="mt-4 text-sm text-slate-500">
          No admin activity yet. Approve/reject jobs or remove comments to build
          timeline.
        </p>
      </section>
    </main>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/store";

export default {
  name: "AdminDashboard",
  setup() {
    const store = useAppStore();
    const reviewNotes = ref({});
    const actionMessage = ref("");
    const reasonFilter = ref("all");
    const timeFilter = ref("all");
    let messageTimer = null;

    const reasonOptions = computed(() =>
      Object.keys(store.moderationReasonsCount),
    );

    const filteredModerationQueue = computed(() => {
      const now = Date.now();

      return store.moderationQueue.filter((comment) => {
        const reasonPass =
          reasonFilter.value === "all" ||
          comment.flaggedReason === reasonFilter.value;

        let timePass = true;
        if (timeFilter.value !== "all") {
          const createdAt = new Date(comment.flaggedAt || 0).getTime();
          if (!Number.isFinite(createdAt) || !createdAt) {
            timePass = false;
          } else if (timeFilter.value === "24h") {
            timePass = createdAt >= now - 24 * 60 * 60 * 1000;
          } else if (timeFilter.value === "7d") {
            timePass = createdAt >= now - 7 * 24 * 60 * 60 * 1000;
          }
        }

        return reasonPass && timePass;
      });
    });

    const topFlagReason = computed(() => {
      const entries = Object.entries(store.moderationReasonsCount);
      if (!entries.length) return "No active flags";

      const [reason, count] = entries.sort((a, b) => b[1] - a[1])[0];
      return `${reason} (${count})`;
    });

    const showMessage = (message) => {
      actionMessage.value = message;
      if (messageTimer) window.clearTimeout(messageTimer);
      messageTimer = window.setTimeout(() => {
        actionMessage.value = "";
      }, 2500);
    };

    onMounted(() => {
      store.initAdminState();
    });

    const formatDate = (value) => {
      if (!value) return "Unknown";

      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "Unknown";

      return date.toLocaleString();
    };

    const formatActivityTitle = (entry) => {
      if (entry.type === "job_approved") {
        return `Approved job: ${entry.title}`;
      }

      if (entry.type === "job_rejected") {
        return `Rejected job: ${entry.title}`;
      }

      if (entry.type === "comment_removed") {
        return `Removed flagged comment: ${entry.title}`;
      }

      return "Admin action";
    };

    const approveJob = (jobId) => {
      store.setJobReviewNote(jobId, reviewNotes.value[jobId] || "");
      store.approveJob(jobId);
      delete reviewNotes.value[jobId];
      showMessage("Job approved successfully.");
    };

    const rejectJob = (jobId) => {
      store.setJobReviewNote(jobId, reviewNotes.value[jobId] || "");
      store.rejectJob(jobId);
      delete reviewNotes.value[jobId];
      showMessage("Job rejected successfully.");
    };

    const removeComment = (commentId) => {
      store.removeFlaggedComment(commentId);
      showMessage("Flagged comment removed.");
    };

    const resetModeration = () => {
      reviewNotes.value = {};
      store.resetAdminModerationState();
      showMessage("Admin moderation state reset.");
    };

    return {
      store,
      reviewNotes,
      actionMessage,
      reasonFilter,
      timeFilter,
      reasonOptions,
      filteredModerationQueue,
      topFlagReason,
      approveJob,
      rejectJob,
      removeComment,
      resetModeration,
      formatDate,
      formatActivityTitle,
    };
  },
};
</script>
