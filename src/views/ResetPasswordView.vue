<template>
    <div class="auth-page">
        <div class="auth-card">
            <RouterLink to="/" class="auth-card__logo">Joblify</RouterLink>
            <h1 class="auth-card__title">Set new password</h1>
            <p class="auth-card__sub">Choose a strong new password.</p>

            <form class="auth-form" @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label class="form-label">New password</label>
                    <input
                        v-model="password"
                        class="form-input"
                        type="password"
                        placeholder="••••••••"
                        required
                        minlength="8"
                    />
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm password</label>
                    <input
                        v-model="passwordConfirmation"
                        class="form-input"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <p v-if="authStore.error" class="form-error">
                    {{ authStore.error }}
                </p>
                <p v-if="success" class="form-success">
                    Password reset! <RouterLink to="/login">Sign in</RouterLink>
                </p>

                <button
                    class="btn-primary"
                    type="submit"
                    :disabled="authStore.loading || success"
                >
                    {{ authStore.loading ? 'Saving…' : 'Reset password' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

const password = ref('');
const passwordConfirmation = ref('');
const success = ref(false);

async function handleSubmit() {
    authStore.error = null;
    if (password.value !== passwordConfirmation.value) {
        authStore.error = 'Passwords do not match.';
        return;
    }
    const ok = await authStore.resetPassword({
        token: route.query.token,
        email: route.query.email,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
    });
    if (ok) success.value = true;
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
</style>
