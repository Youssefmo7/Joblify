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

export const useApplicationsStore = defineStore('applications', {
    state: () => ({
        applications: [],
        loading: false,
        error: null,
    }),

    getters: {
        myApplications: (state) => state.applications,
        applicationsForJob: (state) => (jobId) =>
            state.applications.filter((a) => a.jobId == jobId),
        applicationsForEmployer: (state) => (employerId) => {
            return state.applications.filter((a) => {
                const appEmployerId = a._raw?.job?.company?.user_id || a._raw?.job?.company?.user?.id;
                return !appEmployerId || appEmployerId == employerId;
            });
        },
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

        async applyToJob(jobId, { resume, coverLetter, useProfileCv }) {
            this.loading = true;
            this.error = null;
            try {
                const formData = new FormData();
                if (useProfileCv) {
                    formData.append('use_profile_cv', '1');
                } else if (resume) {
                    formData.append('resume', resume);
                }
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
