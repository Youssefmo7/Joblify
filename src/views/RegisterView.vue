<template>
    <div class="auth-page">
        <div class="auth-card">
            <RouterLink to="/" class="auth-card__logo">Joblify</RouterLink>
            <h1 class="auth-card__title">Create your account</h1>

            <!-- Role picker -->
            <div class="role-tabs">
                <button
                    :class="['role-tab', { active: role === 'candidate' }]"
                    @click="role = 'candidate'"
                >
                    I'm a candidate
                </button>
                <button
                    :class="['role-tab', { active: role === 'employer' }]"
                    @click="role = 'employer'"
                >
                    I'm an employer
                </button>
            </div>

            <form class="auth-form" @submit.prevent="handleRegister">
                <!-- Shared fields -->
                <div class="form-group">
                    <label class="form-label">
                        {{ role === 'employer' ? 'Company name' : 'Full name' }}
                    </label>
                    <input
                        v-model="name"
                        class="form-input"
                        type="text"
                        placeholder="Jane Doe"
                        required
                    />
                    <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input
                        v-model="email"
                        class="form-input"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                    <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input
                        v-model="password"
                        class="form-input"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                    <p v-if="errors.password" class="field-error">
                        {{ errors.password }}
                    </p>
                </div>

                <!-- Optional fields -->
                <div class="form-group">
                    <label class="form-label">
                        Phone <span class="optional">(optional)</span>
                    </label>
                    <input
                        v-model="phone"
                        class="form-input"
                        type="tel"
                        placeholder="+201234567890"
                    />
                </div>
                <div class="form-group">
                    <label class="form-label">
                        LinkedIn URL <span class="optional">(optional)</span>
                    </label>
                    <input
                        v-model="linkedinUrl"
                        class="form-input"
                        type="url"
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>

                <p v-if="authStore.error" class="form-error">
                    {{ authStore.error }}
                </p>

                <button
                    class="btn-primary"
                    type="submit"
                    :disabled="authStore.loading"
                >
                    {{
                        authStore.loading
                            ? 'Creating account…'
                            : 'Create account'
                    }}
                </button>
            </form>

            <div class="divider">
                <span class="divider__line" />
                <span class="divider__text">or</span>
                <span class="divider__line" />
            </div>

            <div class="social-btns">
                <button
                    type="button"
                    class="social-btn social-btn--google"
                    @click="authStore.loginWithGoogle(role)"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>
                <button
                    type="button"
                    class="social-btn social-btn--github"
                    @click="authStore.loginWithGitHub(role)"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                        />
                    </svg>
                    Continue with GitHub
                </button>
            </div>

            <p class="auth-card__footer">
                Already have an account?
                <RouterLink to="/login">Sign in</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const role = ref('candidate');
const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const linkedinUrl = ref('');
const errors = ref({
    name: '',
    email: '',
    password: '',
});

function validateForm() {
    const nextErrors = {
        name: '',
        email: '',
        password: '',
    };

    const trimmedName = name.value.trim();
    if (!trimmedName) {
        nextErrors.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
        nextErrors.name = 'Name must be at least 2 characters.';
    }

    const trimmedEmail = email.value.trim();
    if (!trimmedEmail) {
        nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        nextErrors.email = 'Enter a valid email address.';
    }

    const passwordValue = password.value;
    if (!passwordValue) {
        nextErrors.password = 'Password is required.';
    } else if (passwordValue.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters.';
    }

    errors.value = nextErrors;
    return Object.values(nextErrors).every((message) => !message);
}

async function handleRegister() {
    authStore.error = null;
    if (!validateForm()) return;

    const payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
        role: role.value,
        phone: phone.value.trim() || undefined,
        linkedin_url: linkedinUrl.value.trim() || undefined,
    };

    const ok = await authStore.register(payload);
    if (!ok) return;

    if (!authStore.isVerified) {
        router.push({ name: 'verify-email-notice' });
        return;
    }

    router.push(role.value === 'employer' ? '/employer/dashboard' : '/');
}
</script>

<style scoped>
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
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.auth-card__logo {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    text-decoration: none;
    margin-bottom: 4px;
}
.auth-card__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 8px;
}
.role-tabs {
    display: flex;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    margin-bottom: 8px;
}
.role-tab {
    flex: 1;
    padding: 9px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    background: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.role-tab.active {
    background: #534ab7;
    color: #fff;
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
.optional {
    font-weight: 400;
    color: var(--color-text-tertiary);
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
.field-error {
    font-size: 12px;
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
