import { defineStore } from "pinia";
import client from "@/api/client";

const TOKEN_KEY = "access_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        loading: false,
        error: null,
    }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isCandidate: (state) => state.user?.role === "candidate",
    isEmployer: (state) => state.user?.role === "employer",
    isAdmin: (state) => state.user?.role === "admin",
    isVerified: (state) => !!state.user?.email_verified_at,
    currentUser: (state) => state.user,
  },

  actions: {
    // ── REGISTER ──────────────────────────────────────────────
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await client.post("/register", {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.password,
          role: payload.role,
          phone: payload.phone || null,
          linkedin_url: payload.linkedin_url || null,
        });
        setToken(response.access_token);
        this.user = response.user;
        return true;
      } catch (err) {
        this.error = err.message || "Registration failed. Please try again.";
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
        const response = await client.post("/login", { email, password });
        setToken(response.access_token);
        this.user = response.user;
        return true;
      } catch (err) {
        this.error = err.message || "Invalid email or password.";
        return false;
      } finally {
        this.loading = false;
      }
    },

    // ── LOGOUT ────────────────────────────────────────────────
    async logout() {
      try {
        await client.post("/logout");
      } catch (e) {
        // ignore — token may already be invalid
      }
      this.user = null;
      clearToken();
    },

    // ── FETCH CURRENT USER ────────────────────────────────────
    async fetchUser() {
      const token = getToken();
      if (!token) return false;
      try {
        const user = await client.get("/user");
        this.user = user;
        return true;
      } catch (err) {
        clearToken();
        this.user = null;
        return false;
      }
    },
    async handleSocialCallback(token) {
      this.loading = true;
      try {
        setToken(token);
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const success = await this.fetchUser();
        return success;
      } catch (err) {
        console.error("Social Callback Error:", err);
        this.error = "Social authentication failed";
        return false;
      } finally {
        this.loading = false;
      }
    },

    // ── SOCIAL AUTH ───────────────────────────────────────────
    loginWithGoogle(role = "candidate") {
      const url = new URL("/api/auth/google/redirect", client.defaults.baseURL);
      if (role) url.searchParams.set("role", role);
      window.location.href = url.toString();
    },

    loginWithGitHub(role = "candidate") {
      const url = new URL("/api/auth/github/redirect", client.defaults.baseURL);
      if (role) url.searchParams.set("role", role);
      window.location.href = url.toString();
    },

    // ── EMAIL VERIFICATION ────────────────────────────────────
    async resendVerification() {
      try {
        await client.post("/email/verification-notification");
        return true;
      } catch (err) {
        this.error = err.message || "Could not resend verification email.";
        return false;
      }
    },

    // ── PASSWORD RESET ────────────────────────────────────────
    async forgotPassword(email) {
      this.loading = true;
      this.error = null;
      try {
        await client.post("/forgot-password", { email });
        return true;
      } catch (err) {
        this.error = err.message || "Could not send reset link.";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(payload) {
      this.loading = true;
      this.error = null;
      try {
        await client.post("/reset-password", payload);
        return true;
      } catch (err) {
        this.error = err.message || "Could not reset password.";
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
