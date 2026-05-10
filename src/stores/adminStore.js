import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeJob(apiJob) {
    return {
        ...apiJob,
        company: apiJob.company?.name || 'Unknown',
        createdAt: apiJob.created_at,
    };
}

function extractMeta(responseData) {
    // response from our interceptor may have _meta attached
    if (responseData && responseData._meta) return responseData._meta;
    // Fallback: if the raw response shape is still available somehow
    return null;
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
        // Pagination meta
        usersMeta: null,
        jobsMeta: null,
        commentsMeta: null,
        logsMeta: null,
    }),

    getters: {
        visibleComments: (state) => state.allComments,
        candidateCount: (state) =>
            state.allUsers.filter((u) => u.role === 'candidate').length,
        employerCount: (state) =>
            state.allUsers.filter((u) => u.role === 'employer').length,
        activeJobsCount: (state) => state.stats.activeCount || 0,
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
        async fetchPendingJobs({ page = 1, per_page = 20 } = {}) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/admin/jobs', {
                    params: { status: 'pending', page, per_page },
                });
                this.pendingJobs = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeJob
                );
                this.jobsMeta = extractMeta(data);
                this.stats.pendingCount = this.jobsMeta?.total ?? this.pendingJobs.length;
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
                this.stats.pendingCount = Math.max(0, this.stats.pendingCount - 1);
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
                this.stats.pendingCount = Math.max(0, this.stats.pendingCount - 1);
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

        // ── BULK APPROVE ──────────────────────────────────────────
        async bulkApprove(jobIds) {
            this.loading = true;
            this.error = null;
            try {
                await client.post('/admin/jobs/bulk-approve', { ids: jobIds });
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => !jobIds.includes(j.id)
                );
                this.stats.pendingCount = Math.max(
                    0,
                    this.stats.pendingCount - jobIds.length
                );
                return true;
            } catch (err) {
                this.error = err.message || 'Could not bulk approve jobs.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── BULK REJECT ───────────────────────────────────────────
        async bulkReject(jobIds, reason = '') {
            this.loading = true;
            this.error = null;
            try {
                await client.post('/admin/jobs/bulk-reject', {
                    ids: jobIds,
                    reason,
                });
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => !jobIds.includes(j.id)
                );
                this.stats.pendingCount = Math.max(
                    0,
                    this.stats.pendingCount - jobIds.length
                );
                return true;
            } catch (err) {
                this.error = err.message || 'Could not bulk reject jobs.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH USERS ───────────────────────────────────────────
        async fetchUsers({ page = 1, q = '', role = '', per_page = 20 } = {}) {
            this.loading = true;
            this.error = null;
            try {
                const params = { page, per_page };
                if (q) params.q = q;
                if (role) params.role = role;
                const data = await client.get('/admin/users', { params });
                this.allUsers = Array.isArray(data) ? data : data.data || [];
                this.usersMeta = extractMeta(data);
                this.stats.totalUsers = this.usersMeta?.total ?? this.allUsers.length;
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
        async fetchComments({ page = 1, job_id = '', per_page = 20 } = {}) {
            this.loading = true;
            this.error = null;
            try {
                const params = { page, per_page };
                if (job_id) params.job_id = job_id;
                const data = await client.get('/admin/comments', { params });
                this.allComments = Array.isArray(data)
                    ? data
                    : data.data || [];
                this.commentsMeta = extractMeta(data);
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
        async fetchActivityLogs({ page = 1, action = '', per_page = 20 } = {}) {
            this.loading = true;
            this.error = null;
            try {
                const params = { page, per_page };
                if (action) params.action = action;
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
                this.logsMeta = extractMeta(data);
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
