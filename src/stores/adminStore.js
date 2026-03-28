import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        pendingJobs: [],
        allUsers: [],
        allComments: [],
        stats: {
            totalUsers: 0,
            activeCount: 0,
            totalJobs: 0,
            totalApplications: 0,
            pendingCount: 0,
        },
        approvedJobs: [],
        rejectedJobs: [],
        activityLog: [],
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

        activeJobsCount: (state) => state.stats.activeCount || 0,
        usersGrowth: () => '+0% this month',
        jobsGrowth: () => '+0% this month',
        
        approvalRatePercent: (state) => {
            const total = state.approvedJobs.length + state.rejectedJobs.length;
            return total === 0 ? 0 : Math.round((state.approvedJobs.length / total) * 100);
        },
        
        actionsLast24h: (state) => state.activityLog.length,
    },

    actions: {
        _logActivity(type, title, meta) {
            this.activityLog.unshift({
                id: Date.now() + Math.random(),
                type,
                title,
                meta,
                createdAt: new Date().toISOString()
            });
        },

        // ── LOAD DASHBOARD ────────────────────────────────────────
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
            activeCount: allJobs.filter(j => j.status === 'active' || j.status === 'approved').length,
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
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${jobId}`
                );

                // PUT: send full job object with updated status
                await axios.put(`${BASE_URL}/jobs/${jobId}`, {
                    ...job,
                    id: jobId,
                    status: 'approved',
                });

                this.pendingJobs = this.pendingJobs.filter(
                    (j) => j.id !== jobId
                );
                this.stats.pendingCount = this.pendingJobs.length;
                this.approvedJobs.push(jobId);
                this._logActivity('job_approved', job.title, `Company: ${job.company}`);

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
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${jobId}`
                );

                // PUT: send full job object with updated status + reason
                await axios.put(`${BASE_URL}/jobs/${jobId}`, {
                    ...job,
                    id: jobId,
                    status: 'rejected',
                    rejectionReason: reason,
                });

                this.pendingJobs = this.pendingJobs.filter(
                    (j) => j.id !== jobId
                );
                this.stats.pendingCount = this.pendingJobs.length;
                this.rejectedJobs.push(jobId);
                this._logActivity('job_rejected', job.title, `Reason: ${reason || 'None'}`);

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

        // ── HIDE COMMENT ──────────────────────────────────────────
        async hideComment(commentId) {
            this.loading = true;
            this.error = null;
            try {
                const index = this.allComments.findIndex(
                    (c) => c.id === commentId
                );
                if (index === -1) throw new Error('Comment not found');

                const merged = {
                    ...this.allComments[index],
                    id: commentId,
                    status: 'hidden',
                };
                await axios.put(
                    `${BASE_URL}/comments/${commentId}`,
                    merged
                );
                this.allComments[index].status = 'hidden';
                this._logActivity('comment_removed', 'Hidden comment', `By ${merged.userName}`);
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
                const index = this.allComments.findIndex(
                    (c) => c.id === commentId
                );
                if (index === -1) throw new Error('Comment not found');

                const merged = {
                    ...this.allComments[index],
                    id: commentId,
                    status: 'visible',
                };
                await axios.put(
                    `${BASE_URL}/comments/${commentId}`,
                    merged
                );
                this.allComments[index].status = 'visible';
                this._logActivity('comment_restored', 'Restored comment', `By ${merged.userName}`);
                return true;
            } catch (err) {
                this.error = 'Could not restore comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH COMMENTS ────────────────────────────────────────
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

        // ── BAN / UNBAN USER ──────────────────────────────────────────────
        async banUser(userId) {
            this.loading = true;
            this.error = null;
            try {
                const index = this.allUsers.findIndex((u) => u.id === userId);
                if (index === -1) throw new Error('User not found');

                const merged = {
                    ...this.allUsers[index],
                    id: userId,
                    banned: true,
                };

                await axios.put(`${BASE_URL}/users/${userId}`, merged);
                this.allUsers[index].banned = true;
                this._logActivity('user_banned', `Banned user: ${merged.name}`, `Role: ${merged.role}`);
                return true;
            } catch (err) {
                this.error = 'Could not ban user.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async unbanUser(userId) {
            this.loading = true;
            this.error = null;
            try {
                const index = this.allUsers.findIndex((u) => u.id === userId);
                if (index === -1) throw new Error('User not found');

                const merged = {
                    ...this.allUsers[index],
                    id: userId,
                    banned: false,
                };

                await axios.put(`${BASE_URL}/users/${userId}`, merged);
                this.allUsers[index].banned = false;
                this._logActivity('user_unbanned', `Unbanned user: ${merged.name}`, `Role: ${merged.role}`);
                return true;
            } catch (err) {
                this.error = 'Could not unban user.';
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});
