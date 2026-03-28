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
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input
                        v-model="password"
                        class="form-input"
                        type="password"
                        placeholder="••••••••"
                        required
                        minlength="6"
                    />
                </div>

                <!-- Candidate extras -->
                <div v-if="role === 'candidate'" class="form-group">
                    <label class="form-label">
                        Job title
                        <span class="optional">(optional)</span>
                    </label>
                    <input
                        v-model="jobTitle"
                        class="form-input"
                        type="text"
                        placeholder="Frontend Developer"
                    />
                </div>

                <!-- Employer extras -->
                <div v-if="role === 'employer'" class="form-group">
                    <label class="form-label">
                        Company website
                        <span class="optional">(optional)</span>
                    </label>
                    <input
                        v-model="website"
                        class="form-input"
                        type="url"
                        placeholder="https://yourcompany.com"
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
const jobTitle = ref('');
const website = ref('');

async function handleRegister() {
    const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
        role: role.value,
        ...(role.value === 'candidate' && { title: jobTitle.value }),
        ...(role.value === 'employer' && {
            companyName: name.value,
            website: website.value,
        }),
    };

    const ok = await authStore.register(payload);
    if (ok) {
        router.push(role.value === 'employer' ? '/employer/dashboard' : '/');
    }
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
