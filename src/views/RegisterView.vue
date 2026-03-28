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
                        placeholder="you@example.com"
                        required
                        />
                        <!-- type="email" -->
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
                        <!-- minlength="6" -->
                    <p v-if="errors.password" class="field-error">
                        {{ errors.password }}
                    </p>
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
                    <p v-if="errors.jobTitle" class="field-error">
                        {{ errors.jobTitle }}
                    </p>
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
                    <p v-if="errors.website" class="field-error">
                        {{ errors.website }}
                    </p>
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
import { ref, watch } from 'vue';
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
const errors = ref({
    name: '',
    email: '',
    password: '',
    jobTitle: '',
    website: '',
});

watch(role, () => {
    errors.value.jobTitle = '';
    errors.value.website = '';
    authStore.error = null;
});

function validateForm() {
    const nextErrors = {
        name: '',
        email: '',
        password: '',
        jobTitle: '',
        website: '',
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
    } else if (!/[a-z]/.test(passwordValue)) {
        nextErrors.password = 'Password must include a lowercase letter.';
    } else if (!/[A-Z]/.test(passwordValue)) {
        nextErrors.password = 'Password must include an uppercase letter.';
    } else if (!/[0-9]/.test(passwordValue)) {
        nextErrors.password = 'Password must include a number.';
    } else if (!/[^A-Za-z0-9]/.test(passwordValue)) {
        nextErrors.password = 'Password must include a special character.';
    }

    if (role.value === 'candidate' && jobTitle.value.trim().length > 0) {
        if (jobTitle.value.trim().length < 2) {
            nextErrors.jobTitle = 'Job title must be at least 2 characters.';
        }
    }

    if (role.value === 'employer' && website.value.trim().length > 0) {
        try {
            const url = new URL(website.value.trim());
            if (!['http:', 'https:'].includes(url.protocol)) {
                nextErrors.website = 'Website must start with http or https.';
            }
        } catch {
            nextErrors.website = 'Enter a valid website URL.';
        }
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
        ...(role.value === 'candidate' &&
            jobTitle.value.trim() && {
                title: jobTitle.value.trim(),
            }),
        ...(role.value === 'employer' && {
            companyName: name.value.trim(),
            ...(website.value.trim() && { website: website.value.trim() }),
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
</style>
