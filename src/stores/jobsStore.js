import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeJob(apiJob) {
    return {
        ...apiJob,
        // Component-friendly aliases
        company: apiJob.company?.name || 'Unknown',
        companyLogo: apiJob.company?.logo || null,
        employerId: apiJob.company?.user?.id || apiJob.company?.user_id || null,
        skills: (apiJob.skills || []).map((s) =>
            typeof s === 'string' ? s : s.name
        ),
        categories: (apiJob.categories || []).map((c) =>
            typeof c === 'string' ? c : c.name
        ),
        category: (apiJob.categories?.[0]?.name) || '',
        workType: apiJob.work_type,
        experienceLevel: apiJob.experience_level,
        salaryMin: apiJob.salary_min,
        salaryMax: apiJob.salary_max,
        createdAt: apiJob.created_at,
        applicantsCount: apiJob.applications_count || 0,
        // Keep original nested objects for detail views
        _raw: apiJob,
    };
}

export const useJobsStore = defineStore('jobs', {
    state: () => ({
        jobs: [],
        currentJob: null,
        employerJobs: [],
        loading: false,
        error: null,
        filters: {
            search: '',
            location: '',
            category_id: '',
            work_type: '',
            experience_level: '',
            salary_min: null,
            salary_max: null,
            posted_within: '',
            sort: 'date',
            per_page: 10,
        },
        meta: null,
        validationErrors: {},
    }),

    getters: {
        filteredJobs: (state) => state.jobs,
        myJobs: (state) => state.employerJobs,
        pendingJobs: (state) =>
            state.employerJobs.filter((j) => j.status === 'pending'),
    },

    actions: {
        // ── FETCH PUBLIC JOBS (paginated) ─────────────────────────
        async fetchJobs(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const query = { ...this.filters, ...params };
                // Remove empty values
                Object.keys(query).forEach((k) => {
                    if (query[k] === '' || query[k] === null) delete query[k];
                });

                const data = await client.get('/jobs', { params: query });
                this.jobs = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeJob
                );
                this.meta = data._meta || null;
                return this.jobs;
            } catch (err) {
                this.error = err.message || 'Could not load jobs.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH SINGLE JOB ──────────────────────────────────────
        async fetchJob(id) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get(`/jobs/${id}`);
                this.currentJob = normalizeJob(data);
                return this.currentJob;
            } catch (err) {
                this.error = err.message || 'Job not found.';
                this.currentJob = null;
                return null;
            } finally {
                this.loading = false;
            }
        },

        // ── POST NEW JOB ──────────────────────────────────────────
        async postJob(jobData) {
            this.loading = true;
            this.error = null;
            try {
                const payload = {
                    title: jobData.title,
                    description: jobData.description,
                    requirements: jobData.requirements,
                    benefits: jobData.benefits,
                    salary_min: jobData.salary_min,
                    salary_max: jobData.salary_max,
                    location: jobData.location,
                    work_type: jobData.work_type,
                    experience_level: jobData.experience_level,
                    deadline: jobData.deadline,
                    categories: jobData.categories || [],
                    skills: jobData.skills || [],
                    company_id: jobData.company_id,
                };
                const data = await client.post('/jobs', payload);
                const normalized = normalizeJob(data);
                this.jobs.unshift(normalized);
                return normalized;
            } catch (err) {
                this.error = err.message || 'Could not post job.';
                this.validationErrors = err.errors || {};
                return null;
            } finally {
                this.loading = false;
            }
        },

        // ── UPDATE JOB ────────────────────────────────────────────
        async updateJob(id, updates) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.patch(`/jobs/${id}`, updates);
                const normalized = normalizeJob(data);
                const index = this.jobs.findIndex((j) => j.id === id);
                if (index !== -1) this.jobs[index] = normalized;
                if (this.currentJob?.id === id) this.currentJob = normalized;
                return normalized;
            } catch (err) {
                this.error = err.message || 'Could not update job.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // ── DELETE JOB ────────────────────────────────────────────
        async deleteJob(id) {
            this.loading = true;
            this.error = null;
            try {
                await client.delete(`/jobs/${id}`);
                this.jobs = this.jobs.filter((j) => j.id !== id);
                this.employerJobs = this.employerJobs.filter((j) => j.id !== id);
                return true;
            } catch (err) {
                this.error = err.message || 'Could not delete job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH EMPLOYER'S OWN JOBS ─────────────────────────────
        async fetchEmployerJobs() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/employer/jobs');
                this.employerJobs = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeJob
                );
                return this.employerJobs;
            } catch (err) {
                this.error = err.message || 'Could not load your jobs.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── FILTERS ───────────────────────────────────────────────
        setFilter(key, value) {
            this.filters[key] = value;
        },

        resetFilters() {
            this.filters = {
                search: '',
                location: '',
                category_id: '',
                work_type: '',
                experience_level: '',
                salary_min: null,
                salary_max: null,
                posted_within: '',
                sort: 'date',
                per_page: 10,
            };
        },
    },
});
