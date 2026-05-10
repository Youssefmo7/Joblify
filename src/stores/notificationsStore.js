import { defineStore } from 'pinia';
import client from '@/api/client';

const MOCK_NOTIFICATIONS = [
    { id: 1, user_id: 1, type: 'job_approved', message: 'Your job posting "Senior Frontend Engineer" has been approved and is now live.', is_read: false, created_at: '2026-05-10T09:00:00Z', updated_at: '2026-05-10T09:00:00Z' },
    { id: 2, user_id: 1, type: 'application_received', message: 'You have a new application for "Full Stack Developer" from Bob Smith.', is_read: false, created_at: '2026-05-09T14:30:00Z', updated_at: '2026-05-09T14:30:00Z' },
    { id: 3, user_id: 1, type: 'job_rejected', message: 'Your job "Blockchain Developer" was rejected. Reason: Insufficient details.', is_read: true, created_at: '2026-05-08T11:00:00Z', updated_at: '2026-05-08T11:00:00Z' },
    { id: 4, user_id: 1, type: 'comment', message: 'Alice Johnson commented on your job "DevOps Engineer".', is_read: false, created_at: '2026-05-07T16:45:00Z', updated_at: '2026-05-07T16:45:00Z' },
    { id: 5, user_id: 1, type: 'application_status', message: 'Your application for "Data Scientist" at DataDriven has been accepted!', is_read: true, created_at: '2026-05-06T10:00:00Z', updated_at: '2026-05-06T10:00:00Z' },
];

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: MOCK_NOTIFICATIONS,
        loading: false,
        error: null,
    }),

    getters: {
        unreadCount: (state) =>
            state.notifications.filter((n) => !n.is_read).length,
    },

    actions: {
        async fetchNotifications() {
            this.loading = true;
            this.error = null;
            try {
                const data = await client.get('/notifications');
                if (data.notifications && Array.isArray(data.notifications.data)) {
                    this.notifications = data.notifications.data;
                } else if (Array.isArray(data)) {
                    this.notifications = data;
                } else {
                    this.notifications = [];
                }
                return this.notifications;
            } catch (err) {
                this.error = err.message || 'Could not load notifications.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async markRead(notificationId) {
            try {
                await client.patch(`/notifications/${notificationId}/read`);
                const n = this.notifications.find((x) => x.id === notificationId);
                if (n) n.is_read = true;
                return true;
            } catch (err) {
                this.error = err.message || 'Could not mark as read.';
                return false;
            }
        },

        async markAllRead() {
            try {
                await client.post('/notifications/read-all');
                this.notifications.forEach((n) => (n.is_read = true));
                return true;
            } catch (err) {
                this.error = err.message || 'Could not mark all as read.';
                return false;
            }
        },
    },
});
