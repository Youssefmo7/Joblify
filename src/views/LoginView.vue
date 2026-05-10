<template>
    <div class="auth-page">
        <div class="auth-card">
            <RouterLink to="/" class="auth-card__logo">Joblify</RouterLink>
            <h1 class="auth-card__title">Welcome back</h1>
            <p class="auth-card__sub">Sign in to your account</p>

            <form class="auth-form" @submit.prevent="handleLogin" novalidate>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input
                        v-model="email"
                        class="form-input"
                        :class="{ 'input-error': errors.email }"
                        @input="clearErrors"
                        type="email"
                        placeholder="you@example.com"
                    />
                    <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="password-wrapper">
                        <input
                            v-model="password"
                            @input="clearErrors"
                            class="form-input"
                            :class="{ 'input-error': errors.password }"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            class="password-toggle" 
                            @click="showPassword = !showPassword"
                        >
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                    </div>
                    <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
                </div>

                <p v-if="authStore.error" class="form-error">
                    {{ authStore.error }}
                </p>

                <button
                    class="btn-primary"
                    type="submit"
                    :disabled="authStore.loading"
                >
                    {{ authStore.loading ? 'Signing in…' : 'Sign in' }}
                </button>
            </form>

            <div class="divider">
                <span class="divider__line" />
                <span class="divider__text">or</span>
                <span class="divider__line" />
            </div>

            <div class="social-btns">
                <button type="button" class="social-btn social-btn--google" @click="authStore.loginWithGoogle()">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>
                <button type="button" class="social-btn social-btn--github" @click="authStore.loginWithGitHub()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                </button>
            </div>

            <p class="auth-card__footer">
                <RouterLink to="/forgot-password">Forgot password?</RouterLink>
            </p>
            <p class="auth-card__footer">
                Don't have an account? <RouterLink to="/register">Create one</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { onUnmounted } from 'vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const errors = ref({
    email: '',
    password: '',
});

onUnmounted(() => {
    authStore.error = null;
});

function clearErrors() {
    authStore.error = null;
    errors.value.email = '';
    errors.value.password = '';
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm() {
    let isValid = true;
    const nextErrors = { email: '', password: '' };

    // Email validation
    if (!email.value.trim()) {
        nextErrors.email = 'Email is required.';
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        nextErrors.email = 'Please enter a valid email address.';
        isValid = false;
    }

    // Password validation (just checking presence for login)
    if (!password.value) {
        nextErrors.password = 'Password is required.';
        isValid = false;
    }

    errors.value = nextErrors;
    return isValid;
}

async function handleLogin() {
    authStore.error = null;
    errors.value = { email: '', password: '' };

    if (!validateForm()) return;

    const ok = await authStore.login(email.value, password.value);
    if (!ok) return;

    if (!authStore.isVerified) {
        router.push({ name: 'verify-email-notice' });
        return;
    }

    const redirect = route.query.redirect || roleHome(authStore.user?.role);
    router.push(redirect);
}

function roleHome(role) {
    if (role === 'employer') return '/employer/dashboard';
    if (role === 'admin') return '/admin';
    return '/';
}
</script>

<style scoped>
.password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.password-wrapper .form-input {
    width: 100%;
    padding-right: 40px;
}

.password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-error {
    border-color: var(--color-text-danger) !important;
}

.field-error {
    font-size: 12px;
    color: var(--color-text-danger);
    margin: 4px 0 0;
}

.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-tertiary);
    padding: 24px;
}
.auth-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 40px;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.auth-card__logo {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    text-decoration: none;
    margin-bottom: 8px;
}
.auth-card__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.auth-card__sub {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0 0 16px;
}
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.form-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
}
.form-input {
    padding: 9px 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    outline: none;
    transition: border-color 0.15s;
}
.form-input:focus {
    border-color: #534ab7;
}
.form-error {
    font-size: 13px;
    color: var(--color-text-danger);
    margin: 0;
}
.btn-primary {
    width: 100%;
    padding: 10px;
    background: #e8246a;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: opacity 0.15s;
    margin-top: 4px;
}
.btn-primary:hover:not(:disabled) {
    opacity: 0.88;
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: default;
}
.auth-card__footer {
    font-size: 13px;
    color: var(--color-text-secondary);
    text-align: center;
    margin-top: 8px;
}
.auth-card__footer a {
    color: #534ab7;
    text-decoration: none;
}

.divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 4px 0;
}
.divider__line {
    flex: 1;
    height: 1px;
    background: var(--color-border-tertiary);
}
.divider__text {
    font-size: 12px;
    color: var(--color-text-tertiary);
}

.social-btns {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    background: var(--color-background-primary);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: background 0.15s;
}
.social-btn:hover {
    background: var(--color-background-secondary);
}
</style>
