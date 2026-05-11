import { defineStore } from 'pinia';
import client from '@/api/client';

export const useCompanyStore = defineStore('company', {
    state: () => ({
        company: null,
        loading: false,
        error: null,
        hasCompany: false,
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
