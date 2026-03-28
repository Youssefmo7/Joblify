<template>
    <nav class="navbar">
        <div class="navbar__inner">
            <!-- Logo -->
            <RouterLink to="/" class="navbar__logo">Joblify</RouterLink>

            <!-- Search (center) -->
            <div class="navbar__search">
                <span class="navbar__search-icon">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    class="navbar__search-input"
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    :value="jobsStore.filters.keyword"
                    @input="jobsStore.setFilter('keyword', $event.target.value)"
                    @keyup.enter="$router.push('/')"
                />
            </div>

            <!-- Right side -->
            <div class="navbar__right">
                <!-- Guest -->
                <template v-if="!authStore.isLoggedIn">
                    <RouterLink to="/login" class="navbar__link">
                        Sign in
                    </RouterLink>
                    <RouterLink to="/register" class="navbar__btn">
                        Get started
                    </RouterLink>
                </template>

                <!-- Logged in -->
                <template v-else>
                    <!-- Employer: post job shortcut -->
                    <RouterLink
                        v-if="authStore.isEmployer"
                        to="/employer/post-job"
                        class="navbar__btn"
                    >
                        Post a job
                    </RouterLink>

                    <!-- Notification bell -->
                    <button
                        class="navbar__icon-btn"
                        @click.stop="toggleNotifications"
                        aria-label="Notifications"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                            />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span v-if="unreadCount > 0" class="navbar__badge">
                            {{ unreadCount }}
                        </span>
                    </button>

                    <!-- Notifications dropdown -->
                    <div
                        v-if="showNotifications"
                        class="navbar__dropdown navbar__dropdown--notifs"
                        @click.stop
                    >
                        <div class="navbar__dropdown-header">
                            <span>Notifications</span>
                            <button class="link-btn" @click="markAllRead">
                                Mark all read
                            </button>
                        </div>
                        <div
                            v-if="notifications.length === 0"
                            class="navbar__dropdown-empty"
                        >
                            No notifications yet
                        </div>
                        <div
                            v-for="n in notifications"
                            :key="n.id"
                            :class="['notif-item', { unread: !n.read }]"
                            @click="markRead(n)"
                        >
                            <span class="notif-item__dot" v-if="!n.read" />
                            <p class="notif-item__msg">{{ n.message }}</p>
                            <p class="notif-item__time">
                                {{ timeAgo(n.createdAt) }}
                            </p>
                        </div>
                    </div>

                    <!-- 
                    <button class="navbar__logout-btn" @click="handleLogout">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                    </button> -->

                    <!-- Avatar + user menu -->
                    <div class="navbar__avatar-wrap">
                        <button
                            class="navbar__avatar"
                            @click.stop="toggleUserMenu"
                            aria-label="User menu"
                        >
                            <img
                                v-if="authStore.currentUser?.avatar"
                                :src="authStore.currentUser.avatar"
                                :alt="authStore.currentUser.name"
                            />
                            <span v-else class="navbar__avatar-fallback">
                                {{ initials }}
                            </span>
                        </button>

                        <transition name="dropdown">
                            <div
                                v-if="showUserMenu"
                                class="navbar__dropdown"
                                @click.stop
                            >
                                <div class="navbar__dropdown-header">
                                    <span>
                                        {{ authStore.currentUser?.name }}
                                    </span>
                                    <span class="role-badge">
                                        {{ authStore.currentUser?.role }}
                                    </span>
                                </div>

                                <!-- Candidate links -->
                                <template v-if="authStore.isCandidate">
                                    <RouterLink
                                        to="/profile"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        My profile
                                    </RouterLink>

                                    <RouterLink
                                        to="/my-applications"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        My applications
                                    </RouterLink>
                                </template>

                                <!-- Employer links -->
                                <template v-if="authStore.isEmployer">
                                    <RouterLink
                                        to="/employer/dashboard"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        My dashboard
                                    </RouterLink>

                                    <RouterLink
                                        to="/employer/post-job"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        Post a job
                                    </RouterLink>
                                </template>

                                <!-- Admin links -->
                                <template v-if="authStore.isAdmin">
                                    <RouterLink
                                        to="/admin"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        Admin dashboard
                                    </RouterLink>

                                    <RouterLink
                                        to="/admin/pending-jobs"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        Pending jobs
                                    </RouterLink>

                                    <RouterLink
                                        to="/admin/moderation"
                                        class="navbar__dropdown-item"
                                        @click="closeUserMenu"
                                    >
                                        Moderation
                                    </RouterLink>
                                </template>

                                <div class="navbar__dropdown-divider" />

                                <button
                                    class="navbar__dropdown-item danger"
                                    @click="handleLogout"
                                >
                                    Sign out
                                </button>
                            </div>
                        </transition>
                    </div>
                </template>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const router = useRouter();
const authStore = useAuthStore();
const jobsStore = useJobsStore();

const showNotifications = ref(false);
const showUserMenu = ref(false);
const notifications = ref([]);

const initials = computed(() => {
    const name = authStore.currentUser?.name || '';
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
});

const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length
);

// ── Notifications ─────────────────────────────────────────────
async function loadNotifications() {
    if (!authStore.isLoggedIn) return;
    try {
        const { data } = await axios.get(
            `${BASE_URL}/notifications?userId=${authStore.currentUser.id}`
        );
        notifications.value = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    } catch (_) {
        return;
    }
}

async function markRead(notif) {
    if (notif.read) return;
    notif.read = true;
    await axios.patch(`${BASE_URL}/notifications/${notif.id}`, { read: true });
}

async function markAllRead() {
    for (const n of notifications.value.filter((n) => !n.read)) {
        n.read = true;
        await axios.patch(`${BASE_URL}/notifications/${n.id}`, { read: true });
    }
}

function toggleNotifications() {
    showNotifications.value = !showNotifications.value;
    showUserMenu.value = false;
    if (showNotifications.value) loadNotifications();
}

// function closeNotifications() {
//     showNotifications.value = false;
// }

// ── User menu ─────────────────────────────────────────────────
function toggleUserMenu() {
    showUserMenu.value = !showUserMenu.value;
    showNotifications.value = false;
}

function closeUserMenu() {
    showUserMenu.value = false;
}

async function handleLogout() {
    authStore.logout();
    closeUserMenu();
    router.push('/');
}

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// ── Click outside handling ───────────────────────────────────
function handleClickOutside(event) {
    // Close dropdowns if clicking outside of them
    const target = event.target;

    // Check if click is outside notifications
    if (showNotifications.value) {
        const notifDropdown = document.querySelector(
            '.navbar__dropdown--notifs'
        );
        const notifButton = document.querySelector('.navbar__icon-btn');
        if (
            notifDropdown &&
            !notifDropdown.contains(target) &&
            notifButton &&
            !notifButton.contains(target)
        ) {
            showNotifications.value = false;
        }
    }

    // Check if click is outside user menu
    if (showUserMenu.value) {
        const userDropdown = document.querySelector(
            '.navbar__avatar-wrap .navbar__dropdown'
        );
        const avatarButton = document.querySelector('.navbar__avatar');
        if (
            userDropdown &&
            !userDropdown.contains(target) &&
            avatarButton &&
            !avatarButton.contains(target)
        ) {
            showUserMenu.value = false;
        }
    }
}

onMounted(() => {
    loadNotifications();
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--color-background-primary);
    border-bottom: 1px solid var(--color-border-tertiary);
}
.navbar__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 16px;
}

/* Logo */
.navbar__logo {
    font-size: 20px;
    font-weight: 500;
    color: var(--color-text-primary);
    text-decoration: none;
    flex-shrink: 0;
}

/* Search */
.navbar__search {
    flex: 1;
    max-width: 480px;
    position: relative;
}
.navbar__search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-tertiary);
    display: flex;
}
.navbar__search-input {
    width: 100%;
    padding: 8px 12px 8px 38px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 99px;
    font-size: 14px;
    background: var(--color-background-secondary);
    color: var(--color-text-primary);
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
}
.navbar__search-input:focus {
    border-color: #534ab7;
    background: var(--color-background-primary);
}

/* Right side */
.navbar__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}
.navbar__link {
    font-size: 14px;
    color: var(--color-text-secondary);
    text-decoration: none;
}
.navbar__link:hover {
    color: var(--color-text-primary);
}
.navbar__btn {
    font-size: 13px;
    font-weight: 500;
    padding: 7px 16px;
    border-radius: 8px;
    background: #e8246a;
    color: #fff;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
}
.navbar__btn:hover {
    opacity: 0.88;
}

/* Logout button */
.navbar__logout-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
    background: var(--color-background-secondary);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}
.navbar__logout-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    transition: width 0.3s ease;
    z-index: 0;
}
.navbar__logout-btn:hover::before {
    width: 100%;
}
.navbar__logout-btn:hover {
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
}
.navbar__logout-btn svg,
.navbar__logout-btn span {
    position: relative;
    z-index: 1;
}
.navbar__logout-btn svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
}
.navbar__logout-btn:hover svg {
    transform: translateX(2px);
}
.navbar__logout-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
}

/* Icon button (bell) */
.navbar__icon-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    padding: 6px;
    border-radius: 8px;
}
.navbar__icon-btn:hover {
    background: var(--color-background-secondary);
}
.navbar__badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    background: #e8246a;
    color: #fff;
    font-size: 10px;
    font-weight: 500;
    border-radius: 99px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
}

/* Avatar */
.navbar__avatar-wrap {
    position: relative;
}
.navbar__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1.5px solid var(--color-border-secondary);
    overflow: hidden;
    cursor: pointer;
    background: var(--color-background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}
.navbar__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.navbar__avatar-fallback {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
}

/* Dropdown */
.navbar__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #534ab7;
    color: white;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-lg);
    min-width: 220px;
    z-index: 100;
    overflow: hidden;
    border-radius: 5px;
}
.navbar__dropdown--notifs {
    min-width: 300px;
    max-height: 380px;
    overflow-y: auto;
}
.navbar__dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    border-bottom: 1px solid var(--color-border-tertiary);
}
.navbar__dropdown-divider {
    height: 1px;
    background: var(--color-border-tertiary);
    margin: 4px 0;
}
.navbar__dropdown-item {
    display: block;
    width: 100%;
    padding: 10px 16px;
    font-size: 13px;
    color: var(--color-text-primary);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    box-sizing: border-box;
}
.navbar__dropdown-item:hover {
    background: var(--color-background-secondary);
}
.navbar__dropdown-item.danger {
    color: var(--color-text-danger);
}
.navbar__dropdown-empty {
    padding: 24px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--color-text-tertiary);
}

/* Role badge */
.role-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 99px;
    background: #eeedfe;
    color: #534ab7;
    text-transform: capitalize;
}

/* Notification items */
.notif-item {
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border-tertiary);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
}
.notif-item:hover {
    background: var(--color-background-secondary);
}
.notif-item.unread {
    background: #eeedfe22;
}
.notif-item__dot {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e8246a;
}
.notif-item__msg {
    font-size: 13px;
    color: var(--color-text-primary);
    margin: 0;
    padding-left: 8px;
}
.notif-item__time {
    font-size: 11px;
    color: var(--color-text-tertiary);
    margin: 0;
    padding-left: 8px;
}
.link-btn {
    background: none;
    border: none;
    color: #534ab7;
    font-size: 12px;
    cursor: pointer;
    padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .navbar__logout-btn span {
        display: none;
    }
    .navbar__logout-btn {
        padding: 8px;
        min-width: 36px;
        justify-content: center;
    }
}
</style>
