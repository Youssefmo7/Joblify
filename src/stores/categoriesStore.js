import { defineStore } from 'pinia';
import client from '@/api/client';

const MOCK_CATEGORIES = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Data Science' },
    { id: 4, name: 'Technical Writing' },
    { id: 5, name: 'Security' },
    { id: 6, name: 'Marketing' },
    { id: 7, name: 'Product' },
    { id: 8, name: 'Sales' },
];

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: MOCK_CATEGORIES,
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
