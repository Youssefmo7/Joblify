<template>
    <div v-if="meta && meta.last_page > 1" class="pagination">
        <button
            class="pagination__btn"
            :disabled="meta.current_page <= 1"
            @click="$emit('change', meta.current_page - 1)"
        >
            Prev
        </button>

        <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination__btn"
            :class="{ active: page === meta.current_page }"
            @click="$emit('change', page)"
        >
            {{ page }}
        </button>

        <button
            class="pagination__btn"
            :disabled="meta.current_page >= meta.last_page"
            @click="$emit('change', meta.current_page + 1)"
        >
            Next
        </button>

        <span class="pagination__info">
            Showing {{ meta.from }}–{{ meta.to }} of {{ meta.total }}
        </span>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    name: 'AdminPagination',
    props: {
        meta: { type: Object, default: null },
    },
    emits: ['change'],
    setup(props) {
        const visiblePages = computed(() => {
            if (!props.meta) return [];
            const current = props.meta.current_page;
            const last = props.meta.last_page;
            const pages = [];
            const start = Math.max(1, current - 2);
            const end = Math.min(last, current + 2);
            for (let i = start; i <= end; i++) pages.push(i);
            return pages;
        });
        return { visiblePages };
    },
};
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 0;
    flex-wrap: wrap;
}
.pagination__btn {
    padding: 6px 12px;
    font-size: 13px;
    border: 1px solid var(--color-border-secondary);
    background: var(--color-background-primary);
    color: var(--color-text-secondary);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all 0.15s;
}
.pagination__btn:hover:not(:disabled) {
    border-color: #534ab7;
    color: #534ab7;
}
.pagination__btn:disabled {
    opacity: 0.4;
    cursor: default;
}
.pagination__btn.active {
    background: #534ab7;
    color: #fff;
    border-color: #534ab7;
}
.pagination__info {
    margin-left: auto;
    font-size: 13px;
    color: var(--color-text-tertiary);
}
</style>
