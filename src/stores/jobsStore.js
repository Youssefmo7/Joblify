import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeJob(apiJob) {
    return {
        ...apiJob,
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
        _raw: apiJob,
    };
}

const MOCK_JOBS = [
    {
        id: 1, title: 'Senior Frontend Engineer', description: 'We are looking for an experienced Frontend Engineer to join our team. You will be responsible for building scalable web applications using Vue.js and modern JavaScript.', requirements: '5+ years of experience with Vue.js or React. Strong understanding of CSS, HTML, and browser rendering.', benefits: 'Remote work, health insurance, stock options, annual bonus.', salary_min: 90000, salary_max: 140000, location: 'San Francisco, CA', work_type: 'remote', experience_level: 'senior', deadline: '2026-06-15', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 1, name: 'Vue.js'}, {id: 2, name: 'JavaScript'}, {id: 3, name: 'TypeScript'}], company: {id: 1, name: 'TechCorp', logo: null, user: {id: 10}}, applications_count: 12, created_at: '2026-05-08T10:00:00Z'
    },
    {
        id: 2, title: 'Full Stack Developer', description: 'Join our startup as a Full Stack Developer. Work on exciting projects with React and Laravel.', requirements: '3+ years full stack experience. Proficiency in React and PHP/Laravel.', benefits: 'Flexible hours, remote friendly, equity package.', salary_min: 70000, salary_max: 110000, location: 'New York, NY', work_type: 'hybrid', experience_level: 'mid', deadline: '2026-06-20', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 4, name: 'React'}, {id: 5, name: 'Laravel'}, {id: 6, name: 'MySQL'}], company: {id: 2, name: 'StartupXYZ', logo: null, user: {id: 11}}, applications_count: 8, created_at: '2026-05-07T14:30:00Z'
    },
    {
        id: 3, title: 'Product Designer', description: 'We need a creative Product Designer to lead our design system and create beautiful user interfaces.', requirements: 'Portfolio demonstrating strong UI/UX skills. Experience with Figma and design systems.', benefits: 'Creative environment, conference budget, latest equipment.', salary_min: 80000, salary_max: 120000, location: 'Austin, TX', work_type: 'onsite', experience_level: 'mid', deadline: '2026-06-10', status: 'approved', categories: [{id: 2, name: 'Design'}], skills: [{id: 7, name: 'Figma'}, {id: 8, name: 'UI/UX'}, {id: 9, name: 'Prototyping'}], company: {id: 3, name: 'DesignStudio', logo: null, user: {id: 12}}, applications_count: 5, created_at: '2026-05-06T09:15:00Z'
    },
    {
        id: 4, title: 'DevOps Engineer', description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines.', requirements: 'Experience with AWS, Docker, Kubernetes. Strong scripting skills.', benefits: 'Remote, learning budget, certification reimbursement.', salary_min: 95000, salary_max: 150000, location: 'Remote', work_type: 'remote', experience_level: 'senior', deadline: '2026-07-01', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 10, name: 'AWS'}, {id: 11, name: 'Docker'}, {id: 12, name: 'Kubernetes'}], company: {id: 4, name: 'CloudScale', logo: null, user: {id: 13}}, applications_count: 3, created_at: '2026-05-05T11:00:00Z'
    },
    {
        id: 5, title: 'Data Scientist', description: 'Join our data team to build machine learning models and derive insights from large datasets.', requirements: 'MS/PhD in CS or related field. Experience with Python, TensorFlow, SQL.', benefits: 'Research time, publication support, competitive salary.', salary_min: 100000, salary_max: 160000, location: 'Boston, MA', work_type: 'hybrid', experience_level: 'senior', deadline: '2026-06-25', status: 'approved', categories: [{id: 3, name: 'Data Science'}], skills: [{id: 13, name: 'Python'}, {id: 14, name: 'TensorFlow'}, {id: 15, name: 'SQL'}], company: {id: 5, name: 'DataDriven', logo: null, user: {id: 14}}, applications_count: 7, created_at: '2026-05-04T16:45:00Z'
    },
    {
        id: 6, title: 'Junior Web Developer', description: 'Great opportunity for a junior developer to learn and grow with mentorship.', requirements: 'Basic HTML, CSS, JavaScript. Eagerness to learn.', benefits: 'Mentorship program, training budget, career growth.', salary_min: 45000, salary_max: 65000, location: 'Chicago, IL', work_type: 'onsite', experience_level: 'entry', deadline: '2026-06-05', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 1, name: 'Vue.js'}, {id: 2, name: 'JavaScript'}], company: {id: 6, name: 'WebAgency', logo: null, user: {id: 15}}, applications_count: 15, created_at: '2026-05-03T08:30:00Z'
    },
    {
        id: 7, title: 'Mobile Developer (iOS)', description: 'Build native iOS applications using Swift and SwiftUI.', requirements: '3+ years iOS development. Published apps on App Store.', benefits: 'Remote, Apple equipment, health insurance.', salary_min: 85000, salary_max: 130000, location: 'Remote', work_type: 'remote', experience_level: 'mid', deadline: '2026-06-18', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 16, name: 'Swift'}, {id: 17, name: 'iOS'}], company: {id: 7, name: 'AppWorks', logo: null, user: {id: 16}}, applications_count: 4, created_at: '2026-05-02T13:20:00Z'
    },
    {
        id: 8, title: 'QA Engineer', description: 'Ensure quality of our products through automated and manual testing.', requirements: 'Experience with Selenium, Cypress, or Playwright. Strong attention to detail.', benefits: 'Flexible schedule, training, team events.', salary_min: 60000, salary_max: 90000, location: 'Denver, CO', work_type: 'hybrid', experience_level: 'mid', deadline: '2026-06-12', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 18, name: 'Selenium'}, {id: 19, name: 'Cypress'}], company: {id: 8, name: 'QualityFirst', logo: null, user: {id: 17}}, applications_count: 2, created_at: '2026-05-01T10:00:00Z'
    },
    {
        id: 9, title: 'Backend Engineer (Go)', description: 'Build high-performance microservices in Go.', requirements: 'Strong Go experience. Knowledge of gRPC, Kafka, PostgreSQL.', benefits: 'Remote, latest hardware, learning budget.', salary_min: 110000, salary_max: 170000, location: 'Remote', work_type: 'remote', experience_level: 'senior', deadline: '2026-07-10', status: 'approved', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 20, name: 'Go'}, {id: 21, name: 'gRPC'}, {id: 22, name: 'PostgreSQL'}], company: {id: 9, name: 'MicroSystems', logo: null, user: {id: 18}}, applications_count: 6, created_at: '2026-04-30T09:00:00Z'
    },
    {
        id: 10, title: 'UI/UX Designer', description: 'Create intuitive user experiences for our SaaS platform.', requirements: 'Portfolio required. Experience with user research and prototyping.', benefits: 'Creative freedom, remote, design tools budget.', salary_min: 75000, salary_max: 115000, location: 'Portland, OR', work_type: 'remote', experience_level: 'mid', deadline: '2026-06-22', status: 'approved', categories: [{id: 2, name: 'Design'}], skills: [{id: 7, name: 'Figma'}, {id: 8, name: 'UI/UX'}], company: {id: 10, name: 'SaaSCreative', logo: null, user: {id: 19}}, applications_count: 9, created_at: '2026-04-29T15:30:00Z'
    },
    {
        id: 11, title: 'Machine Learning Engineer', description: 'Develop and deploy ML models for production.', requirements: 'Python, PyTorch/TensorFlow, MLOps experience.', benefits: 'GPU access, research papers, conferences.', salary_min: 120000, salary_max: 180000, location: 'Seattle, WA', work_type: 'hybrid', experience_level: 'senior', deadline: '2026-07-15', status: 'pending', categories: [{id: 3, name: 'Data Science'}], skills: [{id: 13, name: 'Python'}, {id: 14, name: 'TensorFlow'}], company: {id: 11, name: 'AI Labs', logo: null, user: {id: 20}}, applications_count: 0, created_at: '2026-05-10T08:00:00Z'
    },
    {
        id: 12, title: 'Technical Writer', description: 'Create documentation for our developer APIs and SDKs.', requirements: 'Strong writing skills. Technical background preferred.', benefits: 'Remote, flexible hours, competitive pay.', salary_min: 55000, salary_max: 85000, location: 'Remote', work_type: 'remote', experience_level: 'mid', deadline: '2026-06-30', status: 'pending', categories: [{id: 4, name: 'Technical Writing'}], skills: [{id: 23, name: 'Documentation'}, {id: 24, name: 'APIs'}], company: {id: 12, name: 'DocuTeam', logo: null, user: {id: 21}}, applications_count: 0, created_at: '2026-05-10T09:30:00Z'
    },
    {
        id: 13, title: 'Lead Software Architect', description: 'Define architecture for our next-generation platform.', requirements: '10+ years experience. Deep system design knowledge.', benefits: 'Executive compensation, remote, strategic influence.', salary_min: 150000, salary_max: 220000, location: 'San Francisco, CA', work_type: 'hybrid', experience_level: 'lead', deadline: '2026-07-20', status: 'pending', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 25, name: 'System Design'}, {id: 26, name: 'Architecture'}], company: {id: 13, name: 'EnterpriseSoft', logo: null, user: {id: 22}}, applications_count: 0, created_at: '2026-05-10T11:00:00Z'
    },
    {
        id: 14, title: 'Blockchain Developer', description: 'Build decentralized applications on Ethereum and Solana.', requirements: 'Solidity or Rust experience. Understanding of DeFi protocols.', benefits: 'Token allocation, remote, cutting-edge tech.', salary_min: 100000, salary_max: 160000, location: 'Remote', work_type: 'remote', experience_level: 'senior', deadline: '2026-07-05', status: 'pending', categories: [{id: 1, name: 'Engineering'}], skills: [{id: 27, name: 'Solidity'}, {id: 28, name: 'Rust'}], company: {id: 14, name: 'BlockChainX', logo: null, user: {id: 23}}, applications_count: 0, created_at: '2026-05-10T12:00:00Z'
    },
    {
        id: 15, title: 'Cybersecurity Analyst', description: 'Protect our infrastructure and conduct security audits.', requirements: 'Security certifications (CISSP, CEH). Penetration testing experience.', benefits: 'Security training budget, remote, competitive salary.', salary_min: 90000, salary_max: 140000, location: 'Washington, DC', work_type: 'onsite', experience_level: 'senior', deadline: '2026-06-28', status: 'pending', categories: [{id: 5, name: 'Security'}], skills: [{id: 29, name: 'Security'}, {id: 30, name: 'Penetration Testing'}], company: {id: 15, name: 'SecureNet', logo: null, user: {id: 24}}, applications_count: 0, created_at: '2026-05-10T13:30:00Z'
    },
];

const MOCK_EMPLOYER_JOBS = MOCK_JOBS.slice(0, 8);

export const useJobsStore = defineStore('jobs', {
    state: () => ({
        jobs: MOCK_JOBS.map(normalizeJob),
        currentJob: null,
        employerJobs: MOCK_EMPLOYER_JOBS.map(normalizeJob),
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
        meta: {
            current_page: 1,
            last_page: 2,
            per_page: 10,
            total: 15,
        },
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
                Object.keys(query).forEach((k) => {
                    if (query[k] === '' || query[k] === null) delete query[k];
                });

                const data = await client.get('/jobs', { params: query });
                this.jobs = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeJob
                );
                this.meta = data._meta || this.meta;
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
