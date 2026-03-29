import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useCommentsStore = defineStore('comments', {
    state: () => ({
        comments: [], // all comments fetched for the current job
        loading: false,
        error: null,
    }),

    getters: {
        // Only show comments whose status is 'visible'
        visibleComments: (state) =>
            state.comments.filter((c) => c.status === 'visible'),

        // All comments for a specific job (already filtered by fetchForJob)
        commentsForJob: (state) => (jobId) =>
            state.comments.filter((c) => c.jobId == jobId),
    },

    actions: {
        // ── FETCH comments for a single job ───────────────────────
        async fetchForJob(jobId) {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await axios.get(
                    `${BASE_URL}/comments?jobId=${jobId}`
                );
                this.comments = data;
            } catch (err) {
                this.error = 'Could not load comments.';
            } finally {
                this.loading = false;
            }
        },

        // ── POST a new comment ────────────────────────────────────
        // user: the currentUser object from authStore
        // text: the comment text string
        async postComment(jobId, user, text) {
            if (!text?.trim()) return false;
            this.loading = true;
            this.error = null;
            try {
                const newComment = {
                    jobId, // keep original type (string or number)
                    userId: user.id,
                    userRole: user.role,
                    userName: user.name,
                    text: text.trim(),
                    status: 'visible', // candidates post as visible by default
                    createdAt: new Date().toISOString(),
                };

                const { data: created } = await axios.post(
                    `${BASE_URL}/comments`,
                    newComment
                );
                this.comments.push(created);
                return true;
            } catch (err) {
                this.error = 'Could not post comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── DELETE own comment ────────────────────────────────────
        async deleteComment(commentId) {
            this.loading = true;
            this.error = null;
            try {
                await axios.delete(`${BASE_URL}/comments/${commentId}`);
                this.comments = this.comments.filter((c) => c.id !== commentId);
                return true;
            } catch (err) {
                this.error = 'Could not delete comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── ADMIN: hide a comment ─────────────────────────────────
        async hideComment(commentId) {
            return this._setStatus(commentId, 'hidden');
        },

        // ── ADMIN: restore a comment ──────────────────────────────
        async restoreComment(commentId) {
            return this._setStatus(commentId, 'visible');
        },

        async _setStatus(commentId, status) {
            this.loading = true;
            this.error = null;
            try {
                const index = this.comments.findIndex(
                    (c) => c.id === commentId
                );
                if (index === -1) throw new Error('Comment not found');

                const merged = { ...this.comments[index], status };
                await axios.put(`${BASE_URL}/comments/${commentId}`, merged);
                this.comments[index].status = status;
                return true;
            } catch (err) {
                this.error = 'Could not update comment.';
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});
