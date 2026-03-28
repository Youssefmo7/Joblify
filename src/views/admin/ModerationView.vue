<template>
    <div class="admin-page">
        <h1 class="admin-page__title">Comment moderation</h1>
        <p class="admin-page__sub">
            {{ adminStore.allComments.length }} total comments
        </p>

        <!-- Filter tabs -->
        <div class="mod-tabs">
            <button
                :class="['mod-tab', { active: filter === 'all' }]"
                @click="filter = 'all'"
            >
                All
            </button>
            <button
                :class="['mod-tab', { active: filter === 'visible' }]"
                @click="filter = 'visible'"
            >
                Visible
            </button>
            <button
                :class="['mod-tab', { active: filter === 'hidden' }]"
                @click="filter = 'hidden'"
            >
                Hidden
            </button>
        </div>

        <div v-if="adminStore.loading" class="state">Loading…</div>
        <div v-else-if="filtered.length === 0" class="state">
            No comments here.
        </div>

        <div v-else class="comment-list">
            <div
                v-for="c in filtered"
                :key="c.id"
                :class="['comment-card', { hidden: c.status === 'hidden' }]"
            >
                <div class="comment-card__header">
                    <span class="comment-card__user">{{ c.userName }}</span>
                    <span :class="['role-badge', `role--${c.userRole}`]">
                        {{ c.userRole }}
                    </span>
                    <span class="comment-card__job">Job #{{ c.jobId }}</span>
                    <span class="comment-card__time">
                        {{ formatDate(c.createdAt) }}
                    </span>
                    <span
                        :class="[
                            'status-pill',
                            c.status === 'visible'
                                ? 'pill--visible'
                                : 'pill--hidden',
                        ]"
                    >
                        {{ c.status }}
                    </span>
                </div>
                <p class="comment-card__text">{{ c.text }}</p>
                <div class="comment-card__actions">
                    <button
                        v-if="c.status === 'visible'"
                        class="btn-hide"
                        @click="adminStore.hideComment(c.id)"
                    >
                        Hide comment
                    </button>
                    <button
                        v-else
                        class="btn-restore"
                        @click="adminStore.restoreComment(c.id)"
                    >
                        Restore
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();
const filter = ref('all');

const filtered = computed(() => {
    if (filter.value === 'all') return adminStore.allComments;
    return adminStore.allComments.filter((c) => c.status === filter.value);
});

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

onMounted(() => adminStore.fetchComments());
</script>

<style scoped>
.admin-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 16px;
}
.admin-page__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 4px;
}
.admin-page__sub {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0 0 20px;
}
.mod-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}
.mod-tab {
    padding: 7px 16px;
    border-radius: 99px;
    border: 1px solid var(--color-border-secondary);
    background: none;
    font-size: 13px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.mod-tab.active {
    background: #534ab7;
    color: #fff;
    border-color: #534ab7;
}
.state {
    text-align: center;
    padding: 60px;
    color: var(--color-text-secondary);
    font-size: 14px;
}
.comment-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.comment-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.comment-card.hidden {
    opacity: 0.55;
}
.comment-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.comment-card__user {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
}
.role-badge {
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 99px;
    font-weight: 500;
}
.role--employer {
    background: #faece7;
    color: #993c1d;
}
.role--candidate {
    background: #eeedfe;
    color: #534ab7;
}
.comment-card__job {
    font-size: 12px;
    color: var(--color-text-tertiary);
}
.comment-card__time {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin-left: auto;
}
.status-pill {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 99px;
    font-weight: 500;
}
.pill--visible {
    background: #eaf3de;
    color: #3b6d11;
}
.pill--hidden {
    background: #f1efe8;
    color: #5f5e5a;
}
.comment-card__text {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
}
.comment-card__actions {
    display: flex;
    gap: 10px;
}
.btn-hide {
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid var(--color-border-danger);
    color: var(--color-text-danger);
    background: none;
    cursor: pointer;
}
.btn-hide:hover {
    background: #fcebeb;
}
.btn-restore {
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid #9fe1cb;
    color: #0f6e56;
    background: none;
    cursor: pointer;
}
.btn-restore:hover {
    background: #e1f5ee;
}
</style>
