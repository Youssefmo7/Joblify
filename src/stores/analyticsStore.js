import { defineStore } from 'pinia';
import client from '@/api/client';

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        data: {
            company: { id: 1, name: 'TechCorp' },
            total_jobs: 8,
            total_applications: 45,
            applications_by_status: {
                pending: 20,
                accepted: 15,
                rejected: 10,
            },
            top_jobs: [
                { id: 1, title: 'Senior Frontend Engineer', status: 'approved', applications_count: 12, views: 340, conversion_rate: 0.035 },
                { id: 2, title: 'Full Stack Developer', status: 'approved', applications_count: 8, views: 210, conversion_rate: 0.038 },
                { id: 3, title: 'Product Designer', status: 'approved', applications_count: 5, views: 180, conversion_rate: 0.028 },
            ],
            recent_applications: [
                { id: 1, user: { name: 'Alice Johnson' }, job: { title: 'Senior Frontend Engineer' }, status: 'pending', created_at: '2026-05-10T08:00:00Z' },
                { id: 2, user: { name: 'Bob Smith' }, job: { title: 'Full Stack Developer' }, status: 'pending', created_at: '2026-05-09T14:30:00Z' },
                { id: 3, user: { name: 'Carol White' }, job: { title: 'Product Designer' }, status: 'accepted', created_at: '2026-05-08T09:15:00Z' },
            ],
        },
        loading: false,
        error: null,
    }),

    actions: {
        async fetchAnalytics(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/employer/analytics', {
                    params,
                });
                this.data = data;
                return data;
            } catch (err) {
                this.error = err.message || 'Could not load analytics.';
                return null;
            } finally {
                this.loading = false;
            }
        },
    },
});
