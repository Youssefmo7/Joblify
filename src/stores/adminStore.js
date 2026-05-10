import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeJob(apiJob) {
    return {
        ...apiJob,
        company: apiJob.company?.name || 'Unknown',
        createdAt: apiJob.created_at,
    };
}

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
        activityLog: [],
        loading: false,
        error: null,
    }),

    getters: {
        visibleComments: (state) => state.allComments,
        candidateCount: (state) =>
            state.allUsers.filter((u) => u.role === 'candidate').length,
        employerCount: (state) =>
            state.allUsers.filter((u) => u.role === 'employer').length,
        activeJobsCount: (state) => state.stats.activeCount || 0,
        usersGrowth: () => '+0% this month',
        jobsGrowth: () => '+0% this month',
        approvalRatePercent: (state) => {
            const reviewed =
                (state.stats.totalJobs || 0) - (state.stats.pendingCount || 0);
            if (!state.stats.totalJobs) return 0;
            return Math.round((reviewed / state.stats.totalJobs) * 100);
        },
        actionsLast24h: (state) => state.activityLog.length,
    },

    actions: {
        // ── LOAD DASHBOARD ────────────────────────────────────────
        async loadDashboard() {
            this.loading = true;
            this.error = null;
            try {
                const [dashRes, activityRes] = await Promise.all([
                    client.get('/admin/dashboard'),
                    client.get('/admin/dashboard/activity'),
                ]);

                const dash = dashRes.data || dashRes;
                this.stats = {
                    totalUsers: dash.users?.total || 0,
                    activeCount: dash.jobs?.approved || 0,
                    totalJobs: dash.jobs?.total || 0,
                    totalApplications: dash.applications?.total || 0,
                    pendingCount: dash.jobs?.pending || 0,
                };

                // Build activity log from recent activity
                const activity = activityRes.data || activityRes;
                const logs = [];
                (activity.recent_users || []).forEach((u) => {
                    logs.push({
                        id: `user-${u.id}`,
                        type: 'user_registered',
                        title: `New user: ${u.name}`,
                        meta: u.role,
                        createdAt: u.created_at,
                    });
                });
                (activity.recent_jobs || []).forEach((j) => {
                    logs.push({
                        id: `job-${j.id}`,
                        type: j.status === 'pending' ? 'job_pending' : 'job_approved',
                        title: `Job: ${j.title}`,
                        meta: j.status,
                        createdAt: j.created_at,
                    });
                });
                this.activityLog = logs.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
            } catch (err) {
                this.error = err.message || 'Could not load admin dashboard.';
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH PENDING JOBS ────────────────────────────────────
        async fetchPendingJobs() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/admin/jobs?status=pending');
                this.pendingJobs = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeJob
                );
                this.stats.pendingCount = this.pendingJobs.length;
                return this.pendingJobs;
            } catch (err) {
                this.error = err.message || 'Could not load pending jobs.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── APPROVE JOB ───────────────────────────────────────────
        async approveJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                await client.patch(`/admin/jobs/${jobId}/approve`);
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => j.id !== jobId
                );
                this.stats.pendingCount = this.pendingJobs.length;
                this.activityLog.unshift({
                    id: Date.now(),
                    type: 'job_approved',
                    title: 'Approved job',
                    meta: jobId,
                    createdAt: new Date().toISOString(),
                });
                return true;
            } catch (err) {
                this.error = err.message || 'Could not approve job.';
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
                await client.patch(`/admin/jobs/${jobId}/reject`, {
                    reason,
                });
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => j.id !== jobId
                );
                this.stats.pendingCount = this.pendingJobs.length;
                this.activityLog.unshift({
                    id: Date.now(),
                    type: 'job_rejected',
                    title: 'Rejected job',
                    meta: reason || 'No reason',
                    createdAt: new Date().toISOString(),
                });
                return true;
            } catch (err) {
                this.error = err.message || 'Could not reject job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH USERS ───────────────────────────────────────────
        async fetchUsers(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/admin/users', { params });
                this.allUsers = (Array.isArray(data) ? data : data.data || []).filter(
                    (u) => u.role !== 'admin'
                );
                this.stats.totalUsers = this.allUsers.length;
                return this.allUsers;
            } catch (err) {
                this.error = err.message || 'Could not load users.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── SUSPEND USER ──────────────────────────────────────────
        async suspendUser(userId) {
            this.loading = true;
            this.error = null;
            try {
                await client.patch(`/admin/users/${userId}/suspend`);
                const user = this.allUsers.find((u) => u.id === userId);
                if (user) user.suspended = true;
                return true;
            } catch (err) {
                this.error = err.message || 'Could not suspend user.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── ACTIVATE USER ─────────────────────────────────────────
        async activateUser(userId) {
            this.loading = true;
            this.error = null;
            try {
                await client.patch(`/admin/users/${userId}/activate`);
                const user = this.allUsers.find((u) => u.id === userId);
                if (user) user.suspended = false;
                return true;
            } catch (err) {
                this.error = err.message || 'Could not activate user.';
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
                const data = await client.get('/admin/comments');
                this.allComments = Array.isArray(data) ? data : data.data || [];
                return this.allComments;
            } catch (err) {
                this.error = err.message || 'Could not load comments.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── REMOVE COMMENT ────────────────────────────────────────
        async removeComment(commentId, reason = '') {
            this.loading = true;
            this.error = null;
            try {
                await client.delete(`/admin/comments/${commentId}`, {
                    data: { reason },
                });
                this.allComments = this.allComments.filter(
                    (c) => c.id !== commentId
                );
                return true;
            } catch (err) {
                this.error = err.message || 'Could not remove comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH ACTIVITY LOGS ───────────────────────────────────
        async fetchActivityLogs(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/admin/activity-logs', {
                    params,
                });
                const logs = Array.isArray(data) ? data : data.data || [];
                this.activityLog = logs.map((log) => ({
                    id: log.id,
                    type: log.action,
                    title: `${log.action} on ${log.subject_type}`,
                    meta: log.meta ? JSON.stringify(log.meta) : '',
                    createdAt: log.created_at,
                }));
                return this.activityLog;
            } catch (err) {
                this.error = err.message || 'Could not load activity logs.';
                return [];
            } finally {
                this.loading = false;
            }
        },
    },
});
