import { defineStore } from 'pinia';
import client from '@/api/client';

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        data: null,
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
