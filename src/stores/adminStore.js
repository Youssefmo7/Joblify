import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        pendingJobs: [], // jobs awaiting approval
        allUsers: [], // for platform monitoring
        allComments: [], // for comment moderation
        stats: {
            totalUsers: 0,
            totalJobs: 0,
            totalApplications: 0,
            pendingCount: 0,
        },
        loading: false,
        error: null,
    }),

    getters: {
        visibleComments: (state) =>
            state.allComments.filter((c) => c.status === 'visible'),

        candidateCount: (state) =>
            state.allUsers.filter((u) => u.role === 'candidate').length,

        employerCount: (state) =>
            state.allUsers.filter((u) => u.role === 'employer').length,
    },

    actions: {
        // ── LOAD DASHBOARD DATA ───────────────────────────────────
        async loadDashboard() {
            this.loading = true;
            this.error = null;
            try {
                const [jobsRes, usersRes, appsRes, commentsRes] =
                    await Promise.all([
                        axios.get(`${BASE_URL}/jobs`),
                        axios.get(`${BASE_URL}/users`),
                        axios.get(`${BASE_URL}/applications`),
                        axios.get(`${BASE_URL}/comments`),
                    ]);

                const allJobs = jobsRes.data;
                this.pendingJobs = allJobs.filter(
                    (j) => j.status === 'pending'
                );
                this.allUsers = usersRes.data.filter((u) => u.role !== 'admin');
                this.allComments = commentsRes.data;

                this.stats = {
                    totalUsers: this.allUsers.length,
                    totalJobs: allJobs.length,
                    totalApplications: appsRes.data.length,
                    pendingCount: this.pendingJobs.length,
                };
            } catch (err) {
                this.error = 'Could not load admin dashboard.';
            } finally {
                this.loading = false;
            }
        },

        // ── APPROVE JOB ───────────────────────────────────────────
        async approveJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.patch(`${BASE_URL}/jobs/${jobId}`, {
                    status: 'approved',
                });
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => j.id !== jobId
                );
                this.stats.pendingCount = this.pendingJobs.length;

                // Notify the employer
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${jobId}`
                );
                await axios.post(`${BASE_URL}/notifications`, {
                    userId: job.employerId,
                    type: 'job_approved',
                    message: `Your job posting "${job.title}" has been approved and is now live.`,
                    read: false,
                    createdAt: new Date().toISOString(),
                });
                return true;
            } catch (err) {
                this.error = 'Could not approve job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── REJECT JOB ────────────────────────────────────────────
        async rejectJob(jobId, reason = '') {
            this.loading = true;
            this.error = null;
            try {
                await axios.patch(`${BASE_URL}/jobs/${jobId}`, {
                    status: 'rejected',
                    rejectionReason: reason,
                });
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => j.id !== jobId
                );
                this.stats.pendingCount = this.pendingJobs.length;

                // Notify the employer
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${jobId}`
                );
                await axios.post(`${BASE_URL}/notifications`, {
                    userId: job.employerId,
                    type: 'job_rejected',
                    message: `Your job posting "${
                        job.title
                    }" was not approved. Reason: ${
                        reason || 'No reason provided.'
                    }`,
                    read: false,
                    createdAt: new Date().toISOString(),
                });
                return true;
            } catch (err) {
                this.error = 'Could not reject job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── REMOVE COMMENT (bonus) ────────────────────────────────
        async hideComment(commentId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.patch(`${BASE_URL}/comments/${commentId}`, {
                    status: 'hidden',
                });
                const index = this.allComments.findIndex(
                    (c) => c.id === commentId
                );
                if (index !== -1) this.allComments[index].status = 'hidden';
                return true;
            } catch (err) {
                this.error = 'Could not hide comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── RESTORE COMMENT ───────────────────────────────────────
        async restoreComment(commentId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.patch(`${BASE_URL}/comments/${commentId}`, {
                    status: 'visible',
                });
                const index = this.allComments.findIndex(
                    (c) => c.id === commentId
                );
                if (index !== -1) this.allComments[index].status = 'visible';
                return true;
            } catch (err) {
                this.error = 'Could not restore comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH ALL COMMENTS (for moderation panel) ─────────────
        async fetchComments() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`${BASE_URL}/comments`);
                this.allComments = data;
            } catch (err) {
                this.error = 'Could not load comments.';
            } finally {
                this.loading = false;
            }
        },
    },
});
