import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeApplication(apiApp) {
    return {
        ...apiApp,
        jobId: apiApp.job?.id,
        jobTitle: apiApp.job?.title,
        company: apiApp.job?.company?.name,
        candidateId: apiApp.user?.id,
        candidateName: apiApp.user?.name,
        coverNote: apiApp.cover_letter,
        resumeUrl: apiApp.resume_url,
        createdAt: apiApp.created_at,
        status: apiApp.status,
        rejectionReason: apiApp.rejection_reason,
        _raw: apiApp,
    };
}

const MOCK_APPLICATIONS = [
    { id: 1, job: { id: 1, title: 'Senior Frontend Engineer', company: { id: 1, name: 'TechCorp', logo: null } }, user: { id: 101, name: 'Alice Johnson' }, cover_letter: 'I have 6 years of Vue.js experience and am excited about this role.', resume_url: 'https://example.com/resumes/alice.pdf', status: 'pending', created_at: '2026-05-10T08:00:00Z', rejection_reason: null },
    { id: 2, job: { id: 2, title: 'Full Stack Developer', company: { id: 2, name: 'StartupXYZ', logo: null } }, user: { id: 102, name: 'Bob Smith' }, cover_letter: 'Full stack developer with React and Laravel experience.', resume_url: 'https://example.com/resumes/bob.pdf', status: 'accepted', created_at: '2026-05-09T14:30:00Z', rejection_reason: null },
    { id: 3, job: { id: 3, title: 'Product Designer', company: { id: 3, name: 'DesignStudio', logo: null } }, user: { id: 103, name: 'Carol White' }, cover_letter: 'Portfolio attached. Love your product!', resume_url: 'https://example.com/resumes/carol.pdf', status: 'rejected', created_at: '2026-05-08T09:15:00Z', rejection_reason: 'Position filled internally' },
    { id: 4, job: { id: 1, title: 'Senior Frontend Engineer', company: { id: 1, name: 'TechCorp', logo: null } }, user: { id: 104, name: 'David Lee' }, cover_letter: 'Senior frontend engineer with React and Vue experience.', resume_url: 'https://example.com/resumes/david.pdf', status: 'pending', created_at: '2026-05-07T11:00:00Z', rejection_reason: null },
    { id: 5, job: { id: 4, title: 'DevOps Engineer', company: { id: 4, name: 'CloudScale', logo: null } }, user: { id: 105, name: 'Emma Brown' }, cover_letter: 'AWS certified with 4 years DevOps experience.', resume_url: 'https://example.com/resumes/emma.pdf', status: 'pending', created_at: '2026-05-06T16:45:00Z', rejection_reason: null },
    { id: 6, job: { id: 5, title: 'Data Scientist', company: { id: 5, name: 'DataDriven', logo: null } }, user: { id: 106, name: 'Frank Miller' }, cover_letter: 'PhD in Machine Learning. Excited about your data challenges.', resume_url: 'https://example.com/resumes/frank.pdf', status: 'accepted', created_at: '2026-05-05T10:00:00Z', rejection_reason: null },
    { id: 7, job: { id: 6, title: 'Junior Web Developer', company: { id: 6, name: 'WebAgency', logo: null } }, user: { id: 107, name: 'Grace Davis' }, cover_letter: 'Recent bootcamp grad eager to learn.', resume_url: 'https://example.com/resumes/grace.pdf', status: 'pending', created_at: '2026-05-04T13:20:00Z', rejection_reason: null },
    { id: 8, job: { id: 7, title: 'Mobile Developer (iOS)', company: { id: 7, name: 'AppWorks', logo: null } }, user: { id: 108, name: 'Henry Wilson' }, cover_letter: 'Published 3 apps on App Store.', resume_url: 'https://example.com/resumes/henry.pdf', status: 'rejected', created_at: '2026-05-03T08:30:00Z', rejection_reason: 'Not enough SwiftUI experience' },
];

export const useApplicationsStore = defineStore('applications', {
    state: () => ({
        applications: MOCK_APPLICATIONS.map(normalizeApplication),
        loading: false,
        error: null,
    }),

    getters: {
        myApplications: (state) => state.applications,
        applicationsForJob: (state) => (jobId) =>
            state.applications.filter((a) => a.jobId == jobId),
        applicationsForEmployer: (state) => (employerId) =>
            state.applications.filter(
                (a) => a._raw?.job?.company?.user_id == employerId ||
                       a._raw?.job?.company?.user?.id == employerId
            ),
        hasApplied: (state) => (jobId, candidateId) =>
            state.applications.some(
                (a) => a.jobId == jobId && a.candidateId == candidateId
            ),
    },

    actions: {
        async fetchMyApplications() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/applications');
                this.applications = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeApplication
                );
                return this.applications;
            } catch (err) {
                this.error = err.message || 'Could not load your applications.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async fetchApplicationsForJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get(`/jobs/${jobId}/applications`);
                const list = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeApplication
                );
                list.forEach((incoming) => {
                    const exists = this.applications.find(
                        (a) => a.id === incoming.id
                    );
                    if (!exists) this.applications.push(incoming);
                });
                return list;
            } catch (err) {
                this.error = err.message || 'Could not load applications.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async applyToJob(jobId, { resume, coverLetter }) {
            this.loading = true;
            this.error = null;
            try {
                const formData = new FormData();
                if (resume) formData.append('resume', resume);
                if (coverLetter) formData.append('cover_letter', coverLetter);

                const data = await client.post(`/jobs/${jobId}/apply`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const normalized = normalizeApplication(data);
                this.applications.push(normalized);
                return normalized;
            } catch (err) {
                this.error = err.message || 'Could not submit application.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async respondToApplication(applicationId, status, rejectionReason = '') {
            this.loading = true;
            this.error = null;
            try {
                const payload = { status };
                if (status === 'rejected' && rejectionReason) {
                    payload.rejection_reason = rejectionReason;
                }
                const data = await client.patch(
                    `/applications/${applicationId}/status`,
                    payload
                );
                const normalized = normalizeApplication(data);
                const index = this.applications.findIndex(
                    (a) => a.id === applicationId
                );
                if (index !== -1) this.applications[index] = normalized;
                return normalized;
            } catch (err) {
                this.error = err.message || 'Could not update status.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async cancelApplication(applicationId) {
            this.loading = true;
            this.error = null;
            try {
                await client.delete(`/applications/${applicationId}`);
                this.applications = this.applications.filter(
                    (a) => a.id !== applicationId
                );
                return true;
            } catch (err) {
                this.error = err.message || 'Could not withdraw application.';
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});
