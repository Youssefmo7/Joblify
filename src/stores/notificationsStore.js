import { defineStore } from 'pinia';
import client from '@/api/client';

function normalizeNotification(apiNotif) {
    return {
        ...apiNotif,
        isRead: apiNotif.is_read,
        createdAt: apiNotif.created_at,
    };
}

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [],
        unreadCount: 0,
        meta: null,
        loading: false,
        error: null,
    }),

    getters: {
        unreadNotifications: (state) =>
            state.notifications.filter((n) => !n.isRead),
    },

    actions: {
        async fetchNotifications(unreadOnly = false) {
            this.loading = true;
            this.error = null;
            try {
                const params = unreadOnly ? { unread: 1 } : {};
                const data = await client.get('/notifications', { params });
                const notifsData = data.notifications || data;
                this.notifications = (
                    Array.isArray(notifsData) ? notifsData : notifsData.data || []
                ).map(normalizeNotification);
                this.meta = notifsData.current_page ? notifsData : null;
                this.unreadCount = data.unread_count || 0;
                return this.notifications;
            } catch (err) {
                this.error = err.message || 'Could not load notifications.';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async markAllRead() {
            try {
                await client.post('/notifications/read-all');
                this.notifications.forEach((n) => (n.isRead = true));
                this.unreadCount = 0;
                return true;
            } catch (err) {
                this.error = err.message || 'Could not mark all as read.';
                return false;
            }
        },

        async markRead(id) {
            try {
                const data = await client.patch(`/notifications/${id}/read`);
                const index = this.notifications.findIndex((n) => n.id === id);
                if (index !== -1) {
                    this.notifications[index] = normalizeNotification(data);
                }
                this.unreadCount = Math.max(0, this.unreadCount - 1);
                return true;
            } catch (err) {
                this.error = err.message || 'Could not mark as read.';
                return false;
            }
        },

        async deleteNotification(id) {
            try {
                await client.delete(`/notifications/${id}`);
                const removed = this.notifications.find((n) => n.id === id);
                this.notifications = this.notifications.filter(
                    (n) => n.id !== id
                );
                if (removed && !removed.isRead) {
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                }
                return true;
            } catch (err) {
                this.error = err.message || 'Could not delete notification.';
                return false;
            }
        },
    },
});
