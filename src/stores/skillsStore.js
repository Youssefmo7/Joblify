import { defineStore } from 'pinia';
import client from '@/api/client';

const MOCK_SKILLS = [
    { id: 1, name: 'Vue.js' },
    { id: 2, name: 'JavaScript' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'React' },
    { id: 5, name: 'Laravel' },
    { id: 6, name: 'MySQL' },
    { id: 7, name: 'Figma' },
    { id: 8, name: 'UI/UX' },
    { id: 9, name: 'Prototyping' },
    { id: 10, name: 'AWS' },
    { id: 11, name: 'Docker' },
    { id: 12, name: 'Kubernetes' },
    { id: 13, name: 'Python' },
    { id: 14, name: 'TensorFlow' },
    { id: 15, name: 'SQL' },
];

export const useSkillsStore = defineStore('skills', {
    state: () => ({
        skills: MOCK_SKILLS,
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
