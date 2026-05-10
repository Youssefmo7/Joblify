import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeComment(apiComment) {
    return {
        ...apiComment,
        text: apiComment.content,
        userName: apiComment.user?.name || 'Unknown',
        userId: apiComment.user_id,
        createdAt: apiComment.created_at,
        _raw: apiComment,
    };
}

export const useCommentsStore = defineStore('comments', {
    state: () => ({
        comments: [],
        loading: false,
        error: null,
    }),

    getters: {
        commentsForJob: (state) => (jobId) =>
            state.comments.filter((c) => c.job_id == jobId),
    },

    actions: {
        // ── FETCH COMMENTS FOR A JOB ──────────────────────────────
        async fetchForJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get(`/jobs/${jobId}/comments`);
                this.comments = (Array.isArray(data) ? data : data.data || []).map(
                    normalizeComment
                );
                return this.comments;
            } catch (err) {
                this.error = err.message || 'Could not load comments.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // ── POST A COMMENT ────────────────────────────────────────
        async postComment(jobId, content) {
            if (!content?.trim()) return false;
            this.loading = true;
            this.error = null;
            try {
                const data = await client.post(`/jobs/${jobId}/comments`, {
                    content: content.trim(),
                });
                this.comments.push(normalizeComment(data));
                return true;
            } catch (err) {
                this.error = err.message || 'Could not post comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── DELETE OWN COMMENT ────────────────────────────────────
        async deleteComment(commentId) {
            this.loading = true;
            this.error = null;
            try {
                await client.delete(`/comments/${commentId}`);
                this.comments = this.comments.filter((c) => c.id !== commentId);
                return true;
            } catch (err) {
                this.error = err.message || 'Could not delete comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});
