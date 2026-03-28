import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useJobsStore = defineStore('jobs', {
    state: () => ({
        jobs: [], // all fetched jobs
        currentJob: null, // single job being viewed
        loading: false,
        error: null,

        // Active filter state (mirrors the sidebar in the UI)
        filters: {
            keyword: '',
            location: '',
            category: '', // 'programming' | 'design' | 'management' | ...
            workType: '', // 'remote' | 'onsite' | 'hybrid'
            experienceLevel: '', // 'junior' | 'mid' | 'senior'
            salaryMin: null,
            salaryMax: null,
            sortBy: 'createdAt', // 'createdAt' | 'salaryMin' | 'applicantsCount'
        },
    }),

    getters: {
        // Candidates only see approved jobs, filtered by sidebar state
        filteredJobs: (state) => {
            let list = state.jobs.filter((j) => j.status === 'approved');
            const f = state.filters;

            if (f.keyword) {
                const kw = f.keyword.toLowerCase();
                list = list.filter(
                    (j) =>
                        j.title.toLowerCase().includes(kw) ||
                        j.description.toLowerCase().includes(kw) ||
                        j.company.toLowerCase().includes(kw) ||
                        j.skills.some((s) => s.toLowerCase().includes(kw))
                );
            }
            if (f.location) {
                list = list.filter((j) =>
                    j.location.toLowerCase().includes(f.location.toLowerCase())
                );
            }
            if (f.category) {
                list = list.filter((j) => j.category === f.category);
            }
            if (f.workType) {
                list = list.filter((j) => j.workType === f.workType);
            }
            if (f.experienceLevel) {
                list = list.filter(
                    (j) => j.experienceLevel === f.experienceLevel
                );
            }
            if (f.salaryMin) {
                list = list.filter((j) => j.salaryMax >= f.salaryMin);
            }
            if (f.salaryMax) {
                list = list.filter((j) => j.salaryMin <= f.salaryMax);
            }

            // Sort
            list = [...list].sort((a, b) => {
                if (f.sortBy === 'salaryMin') return b.salaryMin - a.salaryMin;
                if (f.sortBy === 'applicantsCount')
                    return b.applicantsCount - a.applicantsCount;
                // default: newest first
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            return list;
        },

        // Employer sees only their own postings (any status)
        myJobs: (state) => (employerId) =>
            state.jobs.filter((j) => j.employerId === employerId),

        // Admin sees all pending jobs
        pendingJobs: (state) =>
            state.jobs.filter((j) => j.status === 'pending'),

        // Analytics helper for employer dashboard
        jobAnalytics: (state) => (jobId) => {
            const job = state.jobs.find((j) => j.id === jobId);
            if (!job) return null;
            return {
                applicantsCount: job.applicantsCount,
                title: job.title,
                status: job.status,
                createdAt: job.createdAt,
            };
        },
    },

    actions: {
        // ── FETCH ALL JOBS ────────────────────────────────────────
        async fetchJobs() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`${BASE_URL}/jobs`);
                this.jobs = data;
            } catch (err) {
                this.error = 'Could not load jobs.';
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH SINGLE JOB ──────────────────────────────────────
        async fetchJob(id) {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(`${BASE_URL}/jobs/${id}`);
                this.currentJob = data;
            } catch (err) {
                this.error = 'Job not found.';
            } finally {
                this.loading = false;
            }
        },

        // ── POST NEW JOB (employer) ───────────────────────────────
        async postJob(jobData, employerId) {
            this.loading = true;
            this.error = null;
            try {
                const newJob = {
                    ...jobData,
                    employerId,
                    status: 'pending', // always starts as pending for admin approval
                    applicantsCount: 0,
                    promoted: false,
                    createdAt: new Date().toISOString(),
                };
                const { data } = await axios.post(`${BASE_URL}/jobs`, newJob);
                this.jobs.push(data);
                return data;
            } catch (err) {
                this.error = 'Could not post job.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // ── EDIT JOB (employer) ───────────────────────────────────
        async updateJob(jobId, updates) {
            this.loading = true;
            this.error = null;
            try {
                // Fetch the current job first so PUT sends the full object
                const { data: existing } = await axios.get(
                    `${BASE_URL}/jobs/${Number(jobId)}`
                );
                const merged = { ...existing, ...updates, id: Number(jobId) };
                const { data } = await axios.put(
                    `${BASE_URL}/jobs/${Number(jobId)}`,
                    merged
                );
                const index = this.jobs.findIndex((j) => j.id === jobId);
                if (index !== -1) this.jobs[index] = data;
                return true;
            } catch (err) {
                this.error = 'Could not update job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── DELETE JOB (employer) ─────────────────────────────────
        async deleteJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.delete(`${BASE_URL}/jobs/${jobId}`);
                this.jobs = this.jobs.filter((j) => j.id !== jobId);
                return true;
            } catch (err) {
                this.error = 'Could not delete job.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── UPDATE FILTERS (sidebar) ──────────────────────────────
        setFilter(key, value) {
            this.filters[key] = value;
        },

        resetFilters() {
            this.filters = {
                keyword: '',
                location: '',
                category: '',
                workType: '',
                experienceLevel: '',
                salaryMin: null,
                salaryMax: null,
                sortBy: 'createdAt',
            };
        },
    },
});
