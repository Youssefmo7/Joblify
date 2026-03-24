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
          v-if="store.flaggedCommentsCount"
          class="divide-y divide-slate-200"
        >
          <article
            v-for="comment in store.moderationQueue"
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
          No flagged comments remaining.
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
    </main>
  </div>
</template>

<script>
import { useAppStore } from "@/store";

export default {
  name: "AdminDashboard",
  setup() {
    const store = useAppStore();

    const approveJob = (jobId) => {
      store.approveJob(jobId);
    };

    const rejectJob = (jobId) => {
      store.rejectJob(jobId);
    };

    const removeComment = (commentId) => {
      store.removeFlaggedComment(commentId);
    };

    return {
      store,
      approveJob,
      rejectJob,
      removeComment,
    };
  },
};
</script>
