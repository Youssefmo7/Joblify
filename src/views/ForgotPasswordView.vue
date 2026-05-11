<template>
    <div class="auth-page">
        <div class="auth-card">
            <RouterLink to="/" class="auth-card__logo">Joblify</RouterLink>
            <h1 class="auth-card__title">Reset your password</h1>
            <p class="auth-card__sub">
                Enter your email and we'll send you a reset link.
            </p>

            <form class="auth-form" @submit.prevent="handleSubmit" novalidate>
                <div class="form-group">
                    <label class="form-label">Email</label>
                     <input
                        v-model="email"
                        class="form-input"
                        :class="{ 'input-error': errors.email }"
                        type="email"
                        placeholder="you@example.com"
                    />
                    <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
                </div>

                <p v-if="authStore.error" class="form-error">
                    {{ authStore.error }}
                </p>
                <p v-if="sent" class="form-success">
                    Check your inbox for the reset link.
                </p>

                <button
                    class="btn-primary"
                    type="submit"
                    :disabled="authStore.loading || sent"
                >
                    {{ authStore.loading ? 'Sending…' : 'Send reset link' }}
                </button>
            </form>

            <p class="auth-card__footer">
                <RouterLink to="/login">Back to sign in</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const email = ref('');
const sent = ref(false);
const errors = ref({
    email: '',
})

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
    errors.value = nextErrors;
    return isValid;
}

async function handleSubmit() {
    authStore.error = null;
    errors.value = { email: '',}
    if (!validateForm()) return;
    const ok = await authStore.forgotPassword(email.value.trim());
    if (ok) sent.value = true;
    if (!ok) return;
}
</script>

<style scoped>
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
.form-success {
    font-size: 13px;
    color: var(--color-text-success, #16a34a);
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
</style>
