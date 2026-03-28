import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useApplicationsStore = defineStore('applications', {
    state: () => ({
        applications: [],
        loading: false,
        error: null,
    }),

    getters: {
        myApplications: (state) => (candidateId) =>
            state.applications.filter((a) => a.candidateId === candidateId),

        applicationsForJob: (state) => (jobId) =>
            state.applications.filter((a) => a.jobId === jobId),

        applicationsForEmployer: (state) => (employerId) =>
            state.applications.filter((a) => a.employerId === employerId),

        hasApplied: (state) => (jobId, candidateId) =>
            state.applications.some(
                (a) => a.jobId === jobId && a.candidateId === candidateId
            ),
    },

    actions: {
        // ── FETCH: candidate's own applications ───────────────────
        async fetchMyApplications(candidateId) {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(
                    `${BASE_URL}/applications?candidateId=${candidateId}`
                );
                this.applications = data;
            } catch (err) {
                this.error = 'Could not load your applications.';
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH: employer sees applicants for one job ───────────
        async fetchApplicationsForJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(
                    `${BASE_URL}/applications?jobId=${jobId}`
                );
                data.forEach((incoming) => {
                    const exists = this.applications.find(
                        (a) => a.id === incoming.id
                    );
                    if (!exists) this.applications.push(incoming);
                });
            } catch (err) {
                this.error = 'Could not load applications for this job.';
            } finally {
                this.loading = false;
            }
        },

        // ── APPLY ─────────────────────────────────────────────────
        async applyToJob(jobId, candidateId, employerId, applyMethod, payload) {
            this.loading = true;
            this.error = null;
            try {
                const { data: existing } = await axios.get(
                    `${BASE_URL}/applications?jobId=${jobId}&candidateId=${candidateId}`
                );
                if (existing.length > 0) {
                    this.error = 'You have already applied to this job.';
                    return false;
                }

                const newApplication = {
                    jobId: Number(jobId),
                    candidateId: Number(candidateId),
                    employerId: Number(employerId),
                    applyMethod,
                    status: 'pending',
                    coverNote: payload.coverNote || '',
                    resumeUrl:
                        applyMethod === 'resume' ? payload.resumeUrl : null,
                    contactEmail:
                        applyMethod === 'contact' ? payload.contactEmail : null,
                    contactPhone:
                        applyMethod === 'contact' ? payload.contactPhone : null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                const { data: created } = await axios.post(
                    `${BASE_URL}/applications`,
                    newApplication
                );
                this.applications.push(created);
                await this._incrementApplicantsCount(jobId);
                return true;
            } catch (err) {
                this.error = 'Could not submit application.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── CANCEL ────────────────────────────────────────────────
        async cancelApplication(applicationId, jobId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.delete(`${BASE_URL}/applications/${applicationId}`);
                this.applications = this.applications.filter(
                    (a) => a.id !== applicationId
                );
                await this._decrementApplicantsCount(jobId);
                return true;
            } catch (err) {
                this.error = 'Could not cancel application.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── RESPOND: employer accepts or rejects ──────────────────
        async respondToApplication(applicationId, newStatus) {
            this.loading = true;
            this.error = null;
            try {
                const index = this.applications.findIndex(
                    (a) => a.id === applicationId
                );
                if (index === -1)
                    throw new Error('Application not found in local state');

                // PUT requires the full object — merge current record with the update
                const merged = {
                    ...this.applications[index],
                    id: Number(applicationId),
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                };

                const { data: updated } = await axios.put(
                    `${BASE_URL}/applications/${Number(applicationId)}`,
                    merged
                );
                this.applications[index] = updated;
                await this._notifyCandidate(updated, newStatus);
                return true;
            } catch (err) {
                this.error = 'Could not update application status.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── INTERNAL: bump applicantsCount on job ─────────────────
        async _incrementApplicantsCount(jobId) {
            try {
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${Number(jobId)}`
                );
                await axios.put(`${BASE_URL}/jobs/${Number(jobId)}`, {
                    ...job,
                    id: Number(jobId),
                    applicantsCount: (job.applicantsCount || 0) + 1,
                });
            } catch (e) {
                console.log(e);
            }
        },

        async _decrementApplicantsCount(jobId) {
            try {
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${Number(jobId)}`
                );
                await axios.put(`${BASE_URL}/jobs/${Number(jobId)}`, {
                    ...job,
                    id: Number(jobId),
                    applicantsCount: Math.max(
                        0,
                        (job.applicantsCount || 1) - 1
                    ),
                });
            } catch (e) {
                console.log(e);
            }
        },

        // ── INTERNAL: notify candidate ────────────────────────────
        async _notifyCandidate(application, status) {
            const messageMap = {
                accepted: `Your application for job #${application.jobId} was accepted!`,
                rejected: `Your application for job #${application.jobId} was not selected.`,
            };
            try {
                await axios.post(`${BASE_URL}/notifications`, {
                    userId: application.candidateId,
                    type: `application_${status}`,
                    message: messageMap[status],
                    read: false,
                    createdAt: new Date().toISOString(),
                });
            } catch (e) {
                console.log(e);
            }
        },
    },
});
