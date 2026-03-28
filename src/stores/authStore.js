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
            // payload: { name, email, password, role, ...extras }
            this.loading = true;
            this.error = null;
            try {
                // Check if email already exists
                const { data: existing } = await axios.get(
                    `${BASE_URL}/users?email=${payload.email}`
                );
                if (existing.length > 0) {
                    this.error = 'An account with this email already exists.';
                    return false;
                }

                const newUser = {
                    ...payload,
                    avatar: '',
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
                    `${BASE_URL}/users?email=${email}&password=${password}`
                );
                // NOTE: json-server has no real auth — password check is naive.
                // In production, use hashed passwords + a real backend.
                if (users.length === 0) {
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
                const { data: updated } = await axios.patch(
                    `${BASE_URL}/users/${this.user.id}`,
                    updates
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

        // ── SAVE JOB (candidate bookmarks) ───────────────────────
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
            this.user = user;
            localStorage.setItem('joblify_user', JSON.stringify(user));
        },
    },
});
