import { defineStore } from 'pinia';
import client from '@/api/client';

// ── Normalize raw API job → component-friendly shape ─────────────────────────
function normalizeJob(apiJob) {
    return {
        ...apiJob,
        company: apiJob.company?.name || 'Unknown',
        companyId: apiJob.company?.id || null,
        companyLogo: apiJob.company?.logo || null,
        employerId: apiJob.company?.user?.id || apiJob.company?.user_id || null,
        skills: (apiJob.skills || []).map((s) =>
            typeof s === 'string' ? s : s.name
        ),
        categories: (apiJob.categories || []).map((c) =>
            typeof c === 'string' ? c : c.name
        ),
        category: apiJob.categories?.[0]?.name || '',
        workType: apiJob.work_type,
        experienceLevel: apiJob.experience_level,
        salaryMin: apiJob.salary_min,
        salaryMax: apiJob.salary_max,
        createdAt: apiJob.created_at,
        applicantsCount: apiJob.applications_count || 0,
        _raw: apiJob,
    };
}

const DEFAULT_FILTERS = {
    search: '',
    location: '',
    category_id: '',
    work_type: '',
    experience_level: '',
    salary_min: null,
    salary_max: null,
    posted_within: '',
    sort: 'date',
};

export const useJobsStore = defineStore('jobs', {
    state: () => ({
        // allJobs holds every job fetched from the API — never mutated by filters
        allJobs: [],
        currentJob: null,
        employerJobs: [],
        loading: false,
        error: null,
        filters: { ...DEFAULT_FILTERS },
        validationErrors: {},
    }),

    getters: {
        // ── All filtering and sorting happens here, purely in JS ─────────────
        filteredJobs: (state) => {
            let jobs = [...state.allJobs];
            const f = state.filters;

            // Search: title, company name, skills, categories
            if (f.search.trim()) {
                const term = f.search.trim().toLowerCase();
                jobs = jobs.filter(
                    (j) =>
                        j.title?.toLowerCase().includes(term) ||
                        j.company?.toLowerCase().includes(term) ||
                        j.skills?.some((s) => s.toLowerCase().includes(term)) ||
                        j.categories?.some((c) =>
                            c.toLowerCase().includes(term)
                        )
                );
            }

            // Location
            if (f.location.trim()) {
                const loc = f.location.trim().toLowerCase();
                jobs = jobs.filter((j) =>
                    j.location?.toLowerCase().includes(loc)
                );
            }

            // Work type
            if (f.work_type) {
                jobs = jobs.filter((j) => j.workType === f.work_type);
            }

            // Category (match by name since we have names after normalization)
            if (f.category_id) {
                jobs = jobs.filter((j) =>
                    j._raw?.categories?.some(
                        (c) => String(c.id) === String(f.category_id)
                    )
                );
            }

            // Experience level
            if (f.experience_level) {
                jobs = jobs.filter(
                    (j) => j.experienceLevel === f.experience_level
                );
            }

            // Salary range — job overlaps the requested range
            if (f.salary_min !== null && f.salary_min !== '') {
                jobs = jobs.filter(
                    (j) =>
                        j.salaryMax === null ||
                        j.salaryMax >= Number(f.salary_min)
                );
            }
            if (f.salary_max !== null && f.salary_max !== '') {
                jobs = jobs.filter(
                    (j) =>
                        j.salaryMin === null ||
                        j.salaryMin <= Number(f.salary_max)
                );
            }

            // Posted within
            if (f.posted_within) {
                const cutoff = {
                    '24h': () => new Date(Date.now() - 86_400_000),
                    week: () => new Date(Date.now() - 7 * 86_400_000),
                    month: () => new Date(Date.now() - 30 * 86_400_000),
                }[f.posted_within]?.();

                if (cutoff) {
                    jobs = jobs.filter((j) => new Date(j.createdAt) >= cutoff);
                }
            }

            // Sort
            if (f.sort === 'date') {
                jobs.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
            }

            return jobs;
        },

        myJobs: (state) => state.employerJobs,
        pendingJobs: (state) =>
            state.employerJobs.filter((j) => j.status === 'pending'),
    },

    actions: {
        // ── FETCH ALL JOBS once (no filter params sent to backend) ────────────
        async fetchJobs() {
            this.loading = true;
            this.error = null;
            try {
                // Fetch all approved jobs — backend just paginates by default,
                // so request a large per_page to get everything in one shot,
                // or loop pages. For most job boards one request is fine.
                const response = await client.get('/jobs', {
                    params: { per_page: 100 },
                });

                const list =
                    response?.data ?? (Array.isArray(response) ? response : []);
                this.allJobs = list.map(normalizeJob);
                return this.allJobs;
            } catch (err) {
                this.error = err.message || 'Could not load jobs.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH SINGLE JOB ──────────────────────────────────────────────────
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

        // ── POST NEW JOB ──────────────────────────────────────────────────────
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
                };
                const data = await client.post('/jobs', payload);
                const normalized = normalizeJob(data);
                this.allJobs.unshift(normalized);
                return normalized;
            } catch (err) {
                this.error = err.message || 'Could not post job.';
                this.validationErrors = err.errors || {};
                return null;
            } finally {
                this.loading = false;
            }
        },

        // ── UPDATE JOB ────────────────────────────────────────────────────────
        async updateJob(id, updates) {
            this.loading = true;
            this.error = null;
            this.validationErrors = {};
            try {
                const data = await client.patch(`/jobs/${id}`, updates);
                const normalized = normalizeJob(data);
                const index = this.allJobs.findIndex((j) => j.id === id);
                if (index !== -1) this.allJobs[index] = normalized;
                
                const empIndex = this.employerJobs.findIndex((j) => j.id === id);
                if (empIndex !== -1) this.employerJobs[empIndex] = normalized;

                if (this.currentJob?.id === id) this.currentJob = normalized;
                return normalized;
            } catch (err) {
                this.error = err.message || 'Could not update job.';
                this.validationErrors = err.errors || {};
                return null;
            } finally {
                this.loading = false;
            }
        },

        // ── DELETE JOB ────────────────────────────────────────────────────────
        async deleteJob(id) {
            this.loading = true;
            this.error = null;
            try {
                await client.delete(`/jobs/${id}`);
                this.allJobs = this.allJobs.filter((j) => j.id !== id);
                this.employerJobs = this.employerJobs.filter(
                    (j) => j.id !== id
                );
                return true;
            } catch (err) {
                this.error = err.message || 'Could not delete job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH EMPLOYER'S OWN JOBS ─────────────────────────────────────────
        async fetchEmployerJobs() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/employer/jobs');
                this.employerJobs = (
                    Array.isArray(data) ? data : data.data || []
                ).map(normalizeJob);
                return this.employerJobs;
            } catch (err) {
                this.error = err.message || 'Could not load your jobs.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── FILTER HELPERS ────────────────────────────────────────────────────
        setFilter(key, value) {
            this.filters[key] = value;
        },

        resetFilters() {
            this.filters = { ...DEFAULT_FILTERS };
        },
    },
});
