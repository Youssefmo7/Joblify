import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useApplicationsStore = defineStore('applications', {
    state: () => ({
        applications: [],
        payments: [],
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

        paymentsForEmployer: (state) => (employerId) =>
            state.payments.filter((p) => p.employerId == employerId),

        // FIX: use == (loose equality) so "1" == 1 also matches legacy numeric IDs
        hasApplied: (state) => (jobId, candidateId) =>
            state.applications.some(
                (a) => a.jobId == jobId && a.candidateId == candidateId
            ),
    },

    actions: {
        // ── FETCH: candidate's own applications ───────────────────
        async fetchMyApplications(candidateId) {
            this.loading = true;
            this.error = null;
            try {
                // FIX: don't cast to Number — candidateId can be a string like "dP-EB-0SqhA"
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
                    else {
                        // Update existing with potential new status/paid info
                        const idx = this.applications.findIndex(a => a.id === incoming.id);
                        this.applications[idx] = incoming;
                    }
                });
            } catch (err) {
                this.error = 'Could not load applications for this job.';
            } finally {
                this.loading = false;
            }
        },

        // ── FETCH: payments for employer ──────────────────────────
        async fetchPayments() {
            this.loading = true;
            try {
                // To avoid json-server type-sensitive query issues, fetch all and filter via getter.
                const { data } = await axios.get(`${BASE_URL}/payments`);
                this.payments = data;
            } catch (err) {
                console.error('Could not load payments', err);
            } finally {
                this.loading = false;
            }
        },

        // ── APPLY ─────────────────────────────────────────────────
        async applyToJob(jobId, candidateId, employerId, applyMethod, payload) {
            this.loading = true;
            this.error = null;
            try {
                // FIX: keep IDs as their original type (string or number).
                // Do NOT wrap in Number() — json-server stores them as-is.
                const { data: existing } = await axios.get(
                    `${BASE_URL}/applications?jobId=${jobId}&candidateId=${candidateId}`
                );
                if (existing.length > 0) {
                    this.error = 'You have already applied to this job.';
                    return false;
                }

                const newApplication = {
                    // FIX: store the raw values without coercion
                    jobId,
                    candidateId,
                    employerId,
                    applyMethod,
                    status: 'pending',
                    paid: false,
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

                const merged = {
                    ...this.applications[index],
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                };

                const { data: updated } = await axios.put(
                    `${BASE_URL}/applications/${applicationId}`,
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

        // ── PROCESS PAYMENT ───────────────────────────────────────
        async processPayment(paymentData) {
            this.loading = true;
            this.error = null;
            try {
                const { data: createdPayment } = await axios.post(`${BASE_URL}/payments`, {
                    ...paymentData,
                    status: 'completed',
                    createdAt: new Date().toISOString(),
                });
                this.payments.push(createdPayment);

                // Update application as paid
                if (paymentData.applicationId) {
                    const idx = this.applications.findIndex(a => a.id === paymentData.applicationId);
                    if (idx !== -1) {
                        const updatedApp = {
                            ...this.applications[idx],
                            paid: true,
                            updatedAt: new Date().toISOString()
                        };
                        const { data: savedApp } = await axios.put(`${BASE_URL}/applications/${updatedApp.id}`, updatedApp);
                        this.applications[idx] = savedApp;
                    }
                }
                return true;
            } catch (err) {
                this.error = 'Payment processing failed.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── INTERNAL: bump applicantsCount on job ─────────────────
        async _incrementApplicantsCount(jobId) {
            try {
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${jobId}`
                );
                await axios.put(`${BASE_URL}/jobs/${jobId}`, {
                    ...job,
                    applicantsCount: (job.applicantsCount || 0) + 1,
                });
            } catch (e) {
                console.warn('Could not increment applicantsCount', e);
            }
        },

        async _decrementApplicantsCount(jobId) {
            try {
                const { data: job } = await axios.get(
                    `${BASE_URL}/jobs/${jobId}`
                );
                await axios.put(`${BASE_URL}/jobs/${jobId}`, {
                    ...job,
                    applicantsCount: Math.max(
                        0,
                        (job.applicantsCount || 1) - 1
                    ),
                });
            } catch (e) {
                console.warn('Could not decrement applicantsCount', e);
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
                console.warn('Could not send notification', e);
            }
        },
    },
});
