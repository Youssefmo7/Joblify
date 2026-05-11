import { defineStore } from 'pinia';
import client from '@/api/client';

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchCategories() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/categories');
                this.categories = Array.isArray(data) ? data : data.data || [];
                return this.categories;
            } catch (err) {
                this.error = err.message || 'Could not load categories.';
                return [];
            } finally {
                this.loading = false;
            }
        },
    },
});
