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
    if (responseData && responseData._meta) return responseData._meta;
    return null;
}

const MOCK_PENDING_JOBS = [
    { id: 11, title: 'Machine Learning Engineer', description: 'Develop and deploy ML models for production.', requirements: 'Python, PyTorch/TensorFlow, MLOps experience.', benefits: 'GPU access, research papers, conferences.', salary_min: 120000, salary_max: 180000, location: 'Seattle, WA', work_type: 'hybrid', experience_level: 'senior', deadline: '2026-07-15', status: 'pending', categories: [{id: 3, name: 'Data Science'}], skills: [{id: 13, name: 'Python'}, {id: 14, name: 'TensorFlow'}], company: {id: 11, name: 'AI Labs', logo: null, user: {id: 20}}, created_at: '2026-05-10T08:00:00Z' },
    { id: 12, title: 'Technical Writer', description: 'Create documentation for our developer APIs and SDKs.', requirements: 'Strong writing skills. Technical background preferred.', benefits: 'Remote, flexible hours, competitive pay.', salary_min: 55000, salary_max: 85000, location: 'Remote', work_type: 'remote', experience_level: 'mid', deadline: '2026-06-30', status: 'pending', categories: [{id: 4, name: 'Technical Writing'}], skills: [{id: 23, name: 'Documentation'}, {id: 24, name: 'APIs'}], company: {id: 12, name: 'DocuTeam', logo: null, user: {id: 21}}, created_at: '2026-05-10T09:30:00Z' },
    { id: 13, title: 'Lead Software Architect', description: 'Define architecture for our next-generation platform.', requirements: '10+ years experience. Deep system design knowledge.', benefits: 'Executive compensation, remote, strategic influence.', salary_min: 150000, salary_max: 220000, location: 'San Francisco, CA', work_type: 'hybrid', experience_level: 'lead', deadline: '2026-07-20', status: 'pending', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 25, name: 'System Design'}, {id: 26, name: 'Architecture'}], company: {id: 13, name: 'EnterpriseSoft', logo: null, user: {id: 22}}, created_at: '2026-05-10T11:00:00Z' },
    { id: 14, title: 'Blockchain Developer', description: 'Build decentralized applications on Ethereum and Solana.', requirements: 'Solidity or Rust experience. Understanding of DeFi protocols.', benefits: 'Token allocation, remote, cutting-edge tech.', salary_min: 100000, salary_max: 160000, location: 'Remote', work_type: 'remote', experience_level: 'senior', deadline: '2026-07-05', status: 'pending', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 27, name: 'Solidity'}, {id: 28, name: 'Rust'}], company: {id: 14, name: 'BlockChainX', logo: null, user: {id: 23}}, created_at: '2026-05-10T12:00:00Z' },
    { id: 15, title: 'Cybersecurity Analyst', description: 'Protect our infrastructure and conduct security audits.', requirements: 'Security certifications (CISSP, CEH). Penetration testing experience.', benefits: 'Security training budget, remote, competitive salary.', salary_min: 90000, salary_max: 140000, location: 'Washington, DC', work_type: 'onsite', experience_level: 'senior', deadline: '2026-06-28', status: 'pending', categories: [{id: 5, name: 'Security'}], skills: [{id: 29, name: 'Security'}, {id: 30, name: 'Penetration Testing'}], company: {id: 15, name: 'SecureNet', logo: null, user: {id: 24}}, created_at: '2026-05-10T13:30:00Z' },
    { id: 16, title: 'UX Researcher', description: 'Conduct user research to inform product decisions.', requirements: 'Experience with usability testing, interviews, and surveys.', benefits: 'Research budget, remote, conference attendance.', salary_min: 80000, salary_max: 120000, location: 'Remote', work_type: 'remote', experience_level: 'mid', deadline: '2026-07-01', status: 'pending', categories: [{id: 2, name: 'Design'}], skills: [{id: 31, name: 'User Research'}, {id: 32, name: 'Usability Testing'}], company: {id: 16, name: 'UserFirst', logo: null, user: {id: 25}}, created_at: '2026-05-10T14:00:00Z' },
    { id: 17, title: 'SRE (Site Reliability Engineer)', description: 'Ensure reliability and performance of our production systems.', requirements: 'Experience with monitoring, incident response, and automation.', benefits: 'On-call pay, latest tools, learning budget.', salary_min: 110000, salary_max: 170000, location: 'Remote', work_type: 'remote', experience_level: 'senior', deadline: '2026-07-10', status: 'pending', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 33, name: 'SRE'}, {id: 34, name: 'Monitoring'}], company: {id: 17, name: 'ReliableOps', logo: null, user: {id: 26}}, created_at: '2026-05-10T15:00:00Z' },
    { id: 18, title: 'Marketing Manager', description: 'Lead our digital marketing strategy and campaigns.', requirements: '5+ years marketing experience. Strong analytics background.', benefits: 'Remote, marketing budget, performance bonuses.', salary_min: 75000, salary_max: 115000, location: 'New York, NY', work_type: 'hybrid', experience_level: 'mid', deadline: '2026-06-25', status: 'pending', categories: [{id: 6, name: 'Marketing'}], skills: [{id: 35, name: 'Digital Marketing'}, {id: 36, name: 'Analytics'}], company: {id: 18, name: 'GrowthHackers', logo: null, user: {id: 27}}, created_at: '2026-05-10T16:00:00Z' },
];

const MOCK_USERS = [
    { id: 101, name: 'Alice Johnson', email: 'alice@example.com', role: 'candidate', suspended: false, created_at: '2026-05-01T10:00:00Z' },
    { id: 102, name: 'Bob Smith', email: 'bob@example.com', role: 'candidate', suspended: false, created_at: '2026-04-28T14:30:00Z' },
    { id: 103, name: 'Carol White', email: 'carol@example.com', role: 'candidate', suspended: false, created_at: '2026-04-25T09:15:00Z' },
    { id: 104, name: 'David Lee', email: 'david@example.com', role: 'candidate', suspended: true, created_at: '2026-04-20T11:00:00Z' },
    { id: 105, name: 'Emma Brown', email: 'emma@example.com', role: 'candidate', suspended: false, created_at: '2026-04-18T16:45:00Z' },
    { id: 106, name: 'Frank Miller', email: 'frank@example.com', role: 'candidate', suspended: false, created_at: '2026-04-15T10:00:00Z' },
    { id: 107, name: 'Grace Davis', email: 'grace@example.com', role: 'candidate', suspended: false, created_at: '2026-04-12T13:20:00Z' },
    { id: 108, name: 'Henry Wilson', email: 'henry@example.com', role: 'candidate', suspended: false, created_at: '2026-04-10T08:30:00Z' },
    { id: 109, name: 'Ivy Chen', email: 'ivy@example.com', role: 'candidate', suspended: false, created_at: '2026-04-08T15:00:00Z' },
    { id: 110, name: 'Jack Taylor', email: 'jack@example.com', role: 'candidate', suspended: false, created_at: '2026-04-05T11:30:00Z' },
    { id: 201, name: 'Sarah Parker', email: 'sarah@techcorp.com', role: 'employer', suspended: false, created_at: '2026-03-20T09:00:00Z' },
    { id: 202, name: 'Mike Roberts', email: 'mike@startupxyz.com', role: 'employer', suspended: false, created_at: '2026-03-18T14:00:00Z' },
    { id: 203, name: 'Lisa Nguyen', email: 'lisa@designstudio.com', role: 'employer', suspended: false, created_at: '2026-03-15T10:30:00Z' },
    { id: 204, name: 'Tom Anderson', email: 'tom@cloudscale.com', role: 'employer', suspended: true, created_at: '2026-03-10T16:00:00Z' },
    { id: 205, name: 'Nina Patel', email: 'nina@datadriven.com', role: 'employer', suspended: false, created_at: '2026-03-05T08:00:00Z' },
];

const MOCK_COMMENTS = [
    { id: 1, job_id: 1, user_id: 101, user: { id: 101, name: 'Alice Johnson' }, content: 'Great job posting! The requirements are very clear.', created_at: '2026-05-10T09:00:00Z', updated_at: '2026-05-10T09:00:00Z', deleted_at: null },
    { id: 2, job_id: 1, user_id: 102, user: { id: 102, name: 'Bob Smith' }, content: 'Is this position open to international candidates?', created_at: '2026-05-09T14:30:00Z', updated_at: '2026-05-09T14:30:00Z', deleted_at: null },
    { id: 3, job_id: 2, user_id: 103, user: { id: 103, name: 'Carol White' }, content: 'The salary range seems low for NYC.', created_at: '2026-05-08T11:00:00Z', updated_at: '2026-05-08T11:00:00Z', deleted_at: null },
    { id: 4, job_id: 3, user_id: 104, user: { id: 104, name: 'David Lee' }, content: 'Love the company culture! Applied immediately.', created_at: '2026-05-07T16:45:00Z', updated_at: '2026-05-07T16:45:00Z', deleted_at: null },
    { id: 5, job_id: 4, user_id: 105, user: { id: 105, name: 'Emma Brown' }, content: 'Remote position is perfect. What timezone do you work in?', created_at: '2026-05-06T10:00:00Z', updated_at: '2026-05-06T10:00:00Z', deleted_at: null },
    { id: 6, job_id: 5, user_id: 106, user: { id: 106, name: 'Frank Miller' }, content: 'The requirements mention TensorFlow. Is PyTorch also acceptable?', created_at: '2026-05-05T13:20:00Z', updated_at: '2026-05-05T13:20:00Z', deleted_at: null },
    { id: 7, job_id: 6, user_id: 107, user: { id: 107, name: 'Grace Davis' }, content: 'Great opportunity for juniors! Excited to apply.', created_at: '2026-05-04T08:30:00Z', updated_at: '2026-05-04T08:30:00Z', deleted_at: null },
    { id: 8, job_id: 7, user_id: 108, user: { id: 108, name: 'Henry Wilson' }, content: 'Do you provide MacBook Pro for remote work?', created_at: '2026-05-03T15:00:00Z', updated_at: '2026-05-03T15:00:00Z', deleted_at: null },
    { id: 9, job_id: 8, user_id: 109, user: { id: 109, name: 'Ivy Chen' }, content: 'What testing frameworks do you use besides Cypress?', created_at: '2026-05-02T11:30:00Z', updated_at: '2026-05-02T11:30:00Z', deleted_at: null },
    { id: 10, job_id: 9, user_id: 110, user: { id: 110, name: 'Jack Taylor' }, content: 'Go microservices sounds interesting. Any gRPC experience required?', created_at: '2026-05-01T09:00:00Z', updated_at: '2026-05-01T09:00:00Z', deleted_at: null },
];

const MOCK_STATS = {
    totalUsers: 152,
    activeCount: 87,
    totalJobs: 156,
    totalApplications: 423,
    pendingCount: 8,
};

const MOCK_ACTIVITY_LOG = [
    { id: 1, type: 'job.approve', title: 'Approved job: Senior Frontend Engineer', meta: 'Job ID: 1', createdAt: '2026-05-10T10:00:00Z' },
    { id: 2, type: 'job.reject', title: 'Rejected job: Blockchain Developer', meta: 'Reason: Insufficient details', createdAt: '2026-05-10T09:30:00Z' },
    { id: 3, type: 'user.suspend', title: 'Suspended user: David Lee', meta: 'Spam reports', createdAt: '2026-05-10T09:00:00Z' },
    { id: 4, type: 'comment.delete', title: 'Removed comment', meta: 'Spam', createdAt: '2026-05-10T08:45:00Z' },
    { id: 5, type: 'job.approve', title: 'Approved job: Full Stack Developer', meta: 'Job ID: 2', createdAt: '2026-05-10T08:00:00Z' },
    { id: 6, type: 'user.activate', title: 'Activated user: Tom Anderson', meta: 'Appeal approved', createdAt: '2026-05-09T16:00:00Z' },
    { id: 7, type: 'job.reject', title: 'Rejected job: Technical Writer', meta: 'Reason: Wrong category', createdAt: '2026-05-09T14:30:00Z' },
    { id: 8, type: 'job.approve', title: 'Approved job: Product Designer', meta: 'Job ID: 3', createdAt: '2026-05-09T11:00:00Z' },
    { id: 9, type: 'user.suspend', title: 'Suspended user: SpamBot_99', meta: 'Automated detection', createdAt: '2026-05-09T10:00:00Z' },
    { id: 10, type: 'comment.delete', title: 'Removed comment', meta: 'Offensive language', createdAt: '2026-05-09T09:15:00Z' },
    { id: 11, type: 'job.approve', title: 'Approved job: DevOps Engineer', meta: 'Job ID: 4', createdAt: '2026-05-08T15:00:00Z' },
    { id: 12, type: 'job.approve', title: 'Approved job: Data Scientist', meta: 'Job ID: 5', createdAt: '2026-05-08T11:00:00Z' },
];

export const useAdminStore = defineStore('admin', {
    state: () => ({
        pendingJobs: MOCK_PENDING_JOBS.map(normalizeJob),
        allUsers: MOCK_USERS,
        allComments: MOCK_COMMENTS,
        stats: MOCK_STATS,
        activityLog: MOCK_ACTIVITY_LOG,
        loading: false,
        error: null,
        usersMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: MOCK_USERS.length,
            from: 1,
            to: MOCK_USERS.length,
        },
        jobsMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: MOCK_PENDING_JOBS.length,
            from: 1,
            to: MOCK_PENDING_JOBS.length,
        },
        commentsMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: MOCK_COMMENTS.length,
            from: 1,
            to: MOCK_COMMENTS.length,
        },
        logsMeta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: MOCK_ACTIVITY_LOG.length,
            from: 1,
            to: MOCK_ACTIVITY_LOG.length,
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
                    title: `${log.action} on ${log.subject_type}`,
                    meta: log.meta ? JSON.stringify(log.meta) : '',
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
