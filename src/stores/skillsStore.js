import { defineStore } from 'pinia';
import client from '@/api/client';

export const useSkillsStore = defineStore('skills', {
    state: () => ({
        skills: [],
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
    },
});
