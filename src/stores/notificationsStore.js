import { defineStore } from 'pinia';
import client from '@/api/client';

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [],
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
