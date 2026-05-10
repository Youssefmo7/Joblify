<template>
    <div class="auth-page">
        <div class="auth-card">
            <RouterLink to="/" class="auth-card__logo">Joblify</RouterLink>
            <h1 class="auth-card__title">Verify your email</h1>
            <p class="auth-card__sub">
                We sent a verification link to <strong>{{ authStore.currentUser?.email }}</strong>.
                Please check your inbox and click the link to activate your account.
            </p>

            <div v-if="message" :class="['banner', messageType]">
                {{ message }}
            </div>

            <button
                class="btn-primary"
                :disabled="resending || cooldown > 0"
                @click="resend"
            >
                {{
                    cooldown > 0
                        ? `Resend in ${cooldown}s`
                        : resending
                        ? 'Sending…'
                        : 'Resend verification email'
                }}
            </button>

            <p class="auth-card__footer">
                <button class="text-btn" @click="authStore.logout(); $router.push('/login');">
                    Sign out and use a different account
                </button>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const resending = ref(false);
const message = ref('');
const messageType = ref('success');
const cooldown = ref(0);
let timer = null;

async function resend() {
    if (cooldown.value > 0) return;
    resending.value = true;
    message.value = '';
    const ok = await authStore.resendVerification();
    resending.value = false;
    if (ok) {
        message.value = 'Verification email sent! Check your inbox.';
        messageType.value = 'success';
        cooldown.value = 60;
        timer = setInterval(() => {
            cooldown.value--;
            if (cooldown.value <= 0) clearInterval(timer);
        }, 1000);
    } else {
        message.value = authStore.error || 'Could not resend email. Try again later.';
        messageType.value = 'error';
    }
}

onUnmounted(() => {
    if (timer) clearInterval(timer);
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
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 14px;
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
    margin: 0;
}
.auth-card__sub {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
}
.banner {
    font-size: 13px;
    padding: 10px 14px;
    border-radius: var(--border-radius-md);
    margin: 0;
}
.banner.success {
    background: #eaf3de;
    color: #27500a;
}
.banner.error {
    background: #fcebeb;
    color: #791f1f;
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
    margin-top: 4px;
}
.text-btn {
    background: none;
    border: none;
    color: #534ab7;
    font-size: 13px;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
}
</style>
