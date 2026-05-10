import { defineStore } from 'pinia';
import client from '@/api/client';

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        analytics: null,
        loading: false,
        error: null,
    }),

    getters: {
        totalJobs: (state) => state.analytics?.total_jobs || 0,
        totalApplications: (state) => state.analytics?.total_applications || 0,
        applicationsByStatus: (state) =>
            state.analytics?.applications_by_status || {},
        topJobs: (state) => state.analytics?.top_jobs || [],
        recentApplications: (state) =>
            state.analytics?.recent_applications || [],
    },

    actions: {
        async fetchAnalytics(dateRange = {}) {
            this.loading = true;
            this.error = null;
            try {
                const params = {};
                if (dateRange.from) params.from = dateRange.from;
                if (dateRange.to) params.to = dateRange.to;
                const data = await client.get('/employer/analytics', {
                    params,
                });
                this.analytics = data;
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
