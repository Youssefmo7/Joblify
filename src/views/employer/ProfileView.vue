<template>
    <div class="employer-profile-page">
        <div class="employer-profile-card">
            <header class="profile-header">
                <div>
                    <p class="profile-eyebrow">Employer Profile</p>
                    <h1 class="profile-title">Company settings</h1>
                    <p class="profile-subtitle">
                        Update your company details, contact email, and social links.
                    </p>
                </div>
                <RouterLink class="back-link" to="/employer/dashboard">
                    Back to dashboard
                </RouterLink>
            </header>

            <form class="profile-form" @submit.prevent="handleSave">
                <div class="form-group">
                    <label class="form-label">Company name</label>
                    <input
                        v-model="form.companyName"
                        class="form-input"
                        type="text"
                        placeholder="Your company"
                        required
                    />
                    <p v-if="errors.companyName" class="field-error">
                        {{ errors.companyName }}
                    </p>
                </div>

                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input
                        v-model="form.email"
                        class="form-input"
                        type="email"
                        placeholder="you@company.com"
                        required
                    />
                    <p v-if="errors.email" class="field-error">
                        {{ errors.email }}
                    </p>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Password
                        <span class="optional">(leave blank to keep)</span>
                    </label>
                    <input
                        v-model="form.password"
                        class="form-input"
                        type="password"
                        placeholder="New password"
                    />
                    <p v-if="errors.password" class="field-error">
                        {{ errors.password }}
                    </p>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Company website
                        <span class="optional">(optional)</span>
                    </label>
                    <input
                        v-model="form.website"
                        class="form-input"
                        type="url"
                        placeholder="https://yourcompany.com"
                    />
                    <p v-if="errors.website" class="field-error">
                        {{ errors.website }}
                    </p>
                </div>

                <div class="social-grid">
                    <div class="form-group">
                        <label class="form-label">LinkedIn</label>
                        <input
                            v-model="form.linkedin"
                            class="form-input"
                            type="url"
                            placeholder="https://linkedin.com/company/..."
                        />
                        <p v-if="errors.linkedin" class="field-error">
                            {{ errors.linkedin }}
                        </p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Twitter / X</label>
                        <input
                            v-model="form.twitter"
                            class="form-input"
                            type="url"
                            placeholder="https://x.com/yourcompany"
                        />
                        <p v-if="errors.twitter" class="field-error">
                            {{ errors.twitter }}
                        </p>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Facebook</label>
                        <input
                            v-model="form.facebook"
                            class="form-input"
                            type="url"
                            placeholder="https://facebook.com/yourcompany"
                        />
                        <p v-if="errors.facebook" class="field-error">
                            {{ errors.facebook }}
                        </p>
                    </div>
                </div>

                <p v-if="authStore.error" class="form-error">
                    {{ authStore.error }}
                </p>
                <p v-if="success" class="form-success">
                    Profile updated successfully.
                </p>

                <button class="btn-primary" type="submit" :disabled="saving">
                    {{ saving ? 'Saving…' : 'Save changes' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const form = reactive({
    companyName:
        authStore.currentUser?.companyName || authStore.currentUser?.name || '',
    email: authStore.currentUser?.email || '',
    password: '',
    website: authStore.currentUser?.website || '',
    linkedin: authStore.currentUser?.socialLinks?.linkedin || '',
    twitter: authStore.currentUser?.socialLinks?.twitter || '',
    facebook: authStore.currentUser?.socialLinks?.facebook || '',
});

const errors = reactive({
    companyName: '',
    email: '',
    password: '',
    website: '',
    linkedin: '',
    twitter: '',
    facebook: '',
});

const saving = ref(false);
const success = ref(false);

function validateUrl(value) {
    if (!value.trim()) return '';
    try {
        const url = new URL(value.trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
            return 'URL must start with http or https.';
        }
    } catch {
        return 'Enter a valid URL.';
    }
    return '';
}

function validateForm() {
    errors.companyName = '';
    errors.email = '';
    errors.password = '';
    errors.website = '';
    errors.linkedin = '';
    errors.twitter = '';
    errors.facebook = '';

    if (!form.companyName.trim()) {
        errors.companyName = 'Company name is required.';
    }

    if (!form.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (form.password) {
        const value = form.password;
        if (value.length < 8) {
            errors.password = 'Password must be at least 8 characters.';
        } else if (!/[a-z]/.test(value)) {
            errors.password = 'Password must include a lowercase letter.';
        } else if (!/[A-Z]/.test(value)) {
            errors.password = 'Password must include an uppercase letter.';
        } else if (!/[0-9]/.test(value)) {
            errors.password = 'Password must include a number.';
        } else if (!/[^A-Za-z0-9]/.test(value)) {
            errors.password = 'Password must include a special character.';
        }
    }

    errors.website = validateUrl(form.website);
    errors.linkedin = validateUrl(form.linkedin);
    errors.twitter = validateUrl(form.twitter);
    errors.facebook = validateUrl(form.facebook);

    return !Object.values(errors).some((value) => value);
}

async function handleSave() {
    authStore.error = null;
    success.value = false;
    if (!validateForm()) return;

    saving.value = true;
    const updates = {
        companyName: form.companyName.trim(),
        name: form.companyName.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        socialLinks: {
            linkedin: form.linkedin.trim(),
            twitter: form.twitter.trim(),
            facebook: form.facebook.trim(),
        },
    };

    if (form.password.trim()) {
        updates.password = form.password;
    }

    const ok = await authStore.updateProfile(updates);
    saving.value = false;
    success.value = ok;

    if (ok) {
        form.password = '';
    }
}
</script>

<style scoped>
.employer-profile-page {
    min-height: calc(100vh - 56px);
    display: flex;
    justify-content: center;
    padding: 32px 16px 48px;
    background: var(--color-background-tertiary);
}
.employer-profile-card {
    width: min(720px, 100%);
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 32px;
}
.profile-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 24px;
}
.profile-eyebrow {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-tertiary);
    margin: 0 0 8px;
}
.profile-title {
    font-size: 24px;
    margin: 0 0 6px;
}
.profile-subtitle {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
}
.back-link {
    font-size: 13px;
    color: #534ab7;
    text-decoration: none;
    white-space: nowrap;
}
.profile-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.social-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.form-label {
    font-size: 13px;
    font-weight: 600;
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
.field-error {
    font-size: 12px;
    color: var(--color-text-danger);
    margin: 0;
}
.form-error {
    font-size: 13px;
    color: var(--color-text-danger);
    margin: 0;
}
.form-success {
    font-size: 13px;
    color: #16a34a;
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
}
.btn-primary:hover:not(:disabled) {
    opacity: 0.88;
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: default;
}

@media (max-width: 640px) {
    .profile-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
