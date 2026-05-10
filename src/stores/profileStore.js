import { defineStore } from 'pinia';
import client from '@/api/client';

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: null,
        loading: false,
        error: null,
    }),

    getters: {
        hasResume: (state) => state.profile?.has_resume || false,
        applicationsCount: (state) => state.profile?.applications_count || 0,
    },

    actions: {
        async fetchProfile() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/profile');
                this.profile = data;
                return data;
            } catch (err) {
                this.error = err.message || 'Could not load profile.';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateProfile({ name, phone, linkedin_url, resume }) {
            this.loading = true;
            this.error = null;
            try {
                const formData = new FormData();
                if (name !== undefined) formData.append('name', name);
                if (phone !== undefined) formData.append('phone', phone);
                if (linkedin_url !== undefined)
                    formData.append('linkedin_url', linkedin_url);
                if (resume) formData.append('resume', resume);

                await client.post('/profile', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // Refresh profile after update
                await this.fetchProfile();
                return true;
            } catch (err) {
                this.error = err.message || 'Could not update profile.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async downloadResume() {
            try {
                const response = await client.get('/profile/resume', {
                    responseType: 'blob',
                });
                const blob = new Blob([response]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
                return true;
            } catch (err) {
                this.error = err.message || 'Could not download resume.';
                return false;
            }
        },
    },
});
