import { defineStore } from 'pinia';
import client from '@/api/client';

export const useSkillsStore = defineStore('skills', {
    state: () => ({
        skills: [],
        suggestions: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchSkills() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/skills');
                this.skills = Array.isArray(data) ? data : data.data || [];
                return this.skills;
            } catch (err) {
                this.error = err.message || 'Could not load skills.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async suggestSkills(query) {
            if (!query || query.length < 2) {
                this.suggestions = [];
                return;
            }
            try {
                const data = await client.get('/skills/suggest', {
                    params: { search: query },
                });
                this.suggestions = Array.isArray(data) ? data : data.data || [];
            } catch (err) {
                this.suggestions = [];
            }
        },
    },
});
