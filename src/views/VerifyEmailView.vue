<template>
    <div class="auth-page">
        <div class="auth-card">
            <RouterLink to="/" class="auth-card__logo">Joblify</RouterLink>
            <h1 class="auth-card__title">Email verification</h1>

            <div v-if="verifying" class="auth-card__sub">
                Verifying your email…
            </div>
            <div v-else-if="verified" class="form-success">
                Email verified successfully!
                <RouterLink to="/login">Sign in</RouterLink>
            </div>
            <div v-else class="form-error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import client from '@/api/client';

const route = useRoute();
const authStore = useAuthStore();
const verifying = ref(true);
const verified = ref(false);
const error = ref('');

onMounted(async () => {
    try {
        await client.get(`/email/verify/${route.params.id}/${route.params.hash}`);
        verified.value = true;
        // Update local user so they don't need to re-login
        if (authStore.user) {
            authStore.user.email_verified_at = new Date().toISOString();
        }
    } catch (err) {
        error.value = err.message || 'Invalid or expired verification link.';
    } finally {
        verifying.value = false;
    }
});
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
    margin: 0;
}
.form-success {
    font-size: 14px;
    color: var(--color-text-success, #16a34a);
    margin: 8px 0 0;
}
.form-error {
    font-size: 14px;
    color: var(--color-text-danger);
    margin: 8px 0 0;
}
</style>
