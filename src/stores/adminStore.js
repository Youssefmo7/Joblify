import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeJob(apiJob) {
    return {
        ...apiJob,
        companyName: apiJob.company?.name || 'Unknown',
        createdAt: apiJob.created_at,
    };
}

function formatLogMeta(log) {
    if (!log.meta || typeof log.meta !== 'object') return '';
    if (log.meta.reason) return `Reason: ${log.meta.reason}`;
    if (log.meta.job_id) return `Job ID: ${log.meta.job_id}`;
    if (log.meta.user_id) return `User ID: ${log.meta.user_id}`;
    return Object.entries(log.meta).map(([k, v]) => `${k}: ${v}`).join(', ');
}

function extractMeta(responseData) {
    if (responseData && responseData._meta) return responseData._meta;
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
        usersMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
            from: 0,
            to: 0,
        },
        jobsMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
            from: 0,
            to: 0,
        },
        commentsMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
            from: 0,
            to: 0,
        },
        logsMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0,
            from: 0,
            to: 0,
        },
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
                    totalUsers: dash.users?.total || this.stats.totalUsers,
                    activeCount: dash.jobs?.approved || this.stats.activeCount,
                    totalJobs: dash.jobs?.total || this.stats.totalJobs,
                    totalApplications: dash.applications?.total || this.stats.totalApplications,
                    pendingCount: dash.jobs?.pending || this.stats.pendingCount,
                };

                const activity = activityRes.data || activityRes;
                const logs = [];
                (activity.recent_users || []).forEach((u) => {
                    logs.push({
                        id: `user-${u.id}`,
                        type: 'user_registered',
                        title: u.name || 'Unknown',
                        meta: u.role,
                        createdAt: u.created_at,
                    });
                });
                (activity.recent_jobs || []).forEach((j) => {
                    logs.push({
                        id: `job-${j.id}`,
                        type: j.status === 'pending' ? 'job_pending' : 'job_approved',
                        title: j.title || 'Unknown',
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
                this.jobsMeta = extractMeta(data) || this.jobsMeta;
                this.stats.pendingCount = this.jobsMeta?.total ?? this.pendingJobs.length;
                return this.pendingJobs;
            } catch (err) {
                this.error = err.message || 'Could not load pending jobs.';
                return [];
            } finally {
                this.loading = false;
            }
        },

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

        async rejectJob(jobId, reason = '') {
            this.loading = true;
            this.error = null;
            try {
                const payload = {};
                if (reason && reason.trim()) payload.reason = reason.trim();
                await client.patch(`/admin/jobs/${jobId}/reject`, payload);
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

        async bulkApprove(jobIds) {
            this.loading = true;
            this.error = null;
            try {
                try {
                    await client.post('/admin/jobs/bulk-approve', { ids: jobIds });
                } catch (err) {
                    if (err.status === 404) {
                        for (const id of jobIds) {
                            await client.patch(`/admin/jobs/${id}/approve`);
                        }
                    } else {
                        throw err;
                    }
                }
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => !jobIds.includes(j.id)
                );
                this.stats.pendingCount = Math.max(
                    0,
                    this.stats.pendingCount - jobIds.length
                );
                this.activityLog.unshift({
                    id: Date.now(),
                    type: 'job_approved',
                    title: `Bulk approved ${jobIds.length} jobs`,
                    meta: `Job IDs: ${jobIds.join(', ')}`,
                    createdAt: new Date().toISOString(),
                });
                return true;
            } catch (err) {
                this.error = err.message || 'Could not bulk approve jobs.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async bulkReject(jobIds, reason = '') {
            this.loading = true;
            this.error = null;
            try {
                const payload = { ids: jobIds };
                if (reason && reason.trim()) payload.reason = reason.trim();
                try {
                    await client.post('/admin/jobs/bulk-reject', payload);
                } catch (err) {
                    if (err.status === 404) {
                        for (const id of jobIds) {
                            const singlePayload = {};
                            if (reason && reason.trim()) singlePayload.reason = reason.trim();
                            await client.patch(`/admin/jobs/${id}/reject`, singlePayload);
                        }
                    } else {
                        throw err;
                    }
                }
                this.pendingJobs = this.pendingJobs.filter(
                    (j) => !jobIds.includes(j.id)
                );
                this.stats.pendingCount = Math.max(
                    0,
                    this.stats.pendingCount - jobIds.length
                );
                this.activityLog.unshift({
                    id: Date.now(),
                    type: 'job_rejected',
                    title: `Bulk rejected ${jobIds.length} jobs`,
                    meta: reason || 'No reason',
                    createdAt: new Date().toISOString(),
                });
                return true;
            } catch (err) {
                this.error = err.message || 'Could not bulk reject jobs.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchUsers({ page = 1, q = '', role = '', per_page = 20 } = {}) {
            this.loading = true;
            this.error = null;
            try {
                const params = { page, per_page };
                if (q) params.q = q;
                if (role) params.role = role;
                const data = await client.get('/admin/users', { params });
                this.allUsers = Array.isArray(data) ? data : data.data || [];
                this.usersMeta = extractMeta(data) || this.usersMeta;
                this.stats.totalUsers = this.usersMeta?.total ?? this.allUsers.length;
                return this.allUsers;
            } catch (err) {
                this.error = err.message || 'Could not load users.';
                return [];
            } finally {
                this.loading = false;
            }
        },

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
                this.commentsMeta = extractMeta(data) || this.commentsMeta;
                return this.allComments;
            } catch (err) {
                this.error = err.message || 'Could not load comments.';
                return [];
            } finally {
                this.loading = false;
            }
        },

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
                    title: log.properties?.title || log.subject?.title || `${log.action}`,
                    meta: formatLogMeta(log),
                    createdAt: log.created_at,
                }));
                this.logsMeta = extractMeta(data) || this.logsMeta;
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
