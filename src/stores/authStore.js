import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('joblify_user')) || null,
        loading: false,
        error: null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        isCandidate: (state) => state.user?.role === 'candidate',
        isEmployer: (state) => state.user?.role === 'employer',
        isAdmin: (state) => state.user?.role === 'admin',
        currentUser: (state) => state.user,
    },

    actions: {
        // ── REGISTER ──────────────────────────────────────────────
        async register(payload) {
            this.loading = true;
            this.error = null;
            try {
                const { data: existing } = await axios.get(
                    `${BASE_URL}/users?email=${encodeURIComponent(
                        payload.email
                    )}`
                );
                if (existing.length > 0) {
                    this.error = 'An account with this email already exists.';
                    return false;
                }

                const newUser = {
                    ...payload,
                    avatar: '/pics/pp.png',
                    skills: [],
                    savedJobs: [],
                    profileViews: 0,
                    createdAt: new Date().toISOString(),
                };

                const { data: created } = await axios.post(
                    `${BASE_URL}/users`,
                    newUser
                );
                this._saveSession(created);
                return true;
            } catch (err) {
                this.error = 'Registration failed. Please try again.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── LOGIN ─────────────────────────────────────────────────
        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const { data: users } = await axios.get(
                    `${BASE_URL}/users?email=${encodeURIComponent(email)}`
                );
                if (users.length === 0 || users[0].password !== password) {
                    this.error = 'Invalid email or password.';
                    return false;
                }
                this._saveSession(users[0]);
                return true;
            } catch (err) {
                this.error = 'Login failed. Please try again.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── LOGOUT ────────────────────────────────────────────────
        logout() {
            this.user = null;
            localStorage.removeItem('joblify_user');
        },

        // ── UPDATE PROFILE ────────────────────────────────────────
        async updateProfile(updates) {
            this.loading = true;
            this.error = null;
            try {
                const userId = Number(this.user.id);

                // Merge current user data with updates first,
                // then use PUT to replace the full record.
                // json-server v1 dropped PATCH support — PUT is the safe choice.
                const merged = { ...this.user, ...updates, id: userId };

                const { data: updated } = await axios.put(
                    `${BASE_URL}/users/${userId}`,
                    merged
                );
                this._saveSession(updated);
                return true;
            } catch (err) {
                this.error = 'Could not update profile.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── SAVE JOB (candidate bookmarks) ────────────────────────
        async toggleSaveJob(jobId) {
            if (!this.user) return;
            const saved = this.user.savedJobs || [];
            const alreadySaved = saved.includes(jobId);
            const updatedSaved = alreadySaved
                ? saved.filter((id) => id !== jobId)
                : [...saved, jobId];

            await this.updateProfile({ savedJobs: updatedSaved });
        },

        // ── INTERNAL: persist session ─────────────────────────────
        _saveSession(user) {
            // Normalize id to Number so all requests use a clean numeric value
            const normalized = { ...user, id: Number(user.id) };
            this.user = normalized;
            localStorage.setItem('joblify_user', JSON.stringify(normalized));
        },
    },
});
