import { defineStore } from 'pinia';
import client from '@/api/client';

export const useCompanyStore = defineStore('company', {
    state: () => ({
        company: {
            id: 1,
            user_id: 10,
            name: 'TechCorp',
            description: 'We build scalable web applications and innovative tech solutions for enterprises worldwide.',
            logo: null,
            website: 'https://techcorp.example.com',
            location: 'San Francisco, CA',
            created_at: '2026-01-15T10:00:00Z',
            updated_at: '2026-05-01T14:30:00Z',
        },
        loading: false,
        error: null,
        hasCompany: true,
    }),

    actions: {
        async fetchCompany() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/company');
                this.company = data;
                this.hasCompany = true;
                return data;
            } catch (err) {
                if (err.status === 404) {
                    this.company = null;
                    this.hasCompany = false;
                    return null;
                }
                this.error = err.message || 'Could not load company profile.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async saveCompany({ name, description, website, location, logo }) {
            this.loading = true;
            this.error = null;
            try {
                const formData = new FormData();
                formData.append('name', name);
                if (description !== undefined)
                    formData.append('description', description);
                if (website !== undefined) formData.append('website', website);
                if (location !== undefined) formData.append('location', location);
                if (logo) formData.append('logo', logo);

                const data = await client.post('/company', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                this.company = data;
                this.hasCompany = true;
                return data;
            } catch (err) {
                this.error = err.message || 'Could not save company profile.';
                return null;
            } finally {
                this.loading = false;
            }
        },
    },
});
