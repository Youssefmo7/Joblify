<template>
    <div class="employer-profile-page">
        <div class="employer-profile-card">
            <header class="profile-header">
                <div>
                    <p class="profile-eyebrow">Employer Profile</p>
                    <h1 class="profile-title">Company settings</h1>
                    <p class="profile-subtitle">
                        Update your company details and logo.
                    </p>
                </div>
                <RouterLink class="back-link" to="/employer/dashboard">
                    Back to dashboard
                </RouterLink>
            </header>

            <form class="profile-form" @submit.prevent="handleSave">
                <div class="form-group">
                    <label class="form-label">Company name <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.name"
                        class="form-input"
                        type="text"
                        placeholder="Your company"
                        required
                    />
                    <p v-if="errors.name" class="field-error">
                        {{ errors.name }}
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

                <div class="form-group">
                    <label class="form-label">
                        Location
                        <span class="optional">(optional)</span>
                    </label>
                    <input
                        v-model="form.location"
                        class="form-input"
                        type="text"
                        placeholder="Cairo, Egypt"
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Description
                        <span class="optional">(optional)</span>
                    </label>
                    <textarea
                        v-model="form.description"
                        class="form-input"
                        rows="4"
                        placeholder="Tell candidates about your company..."
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Company Logo
                        <span class="optional">(optional)</span>
                    </label>
                    <div class="flex items-center space-x-4">
                        <div class="h-16 w-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            <img v-if="logoPreview" :src="logoPreview" class="h-full w-full object-cover">
                            <svg v-else class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 2z"></path></svg>
                        </div>
                        <div>
                            <button type="button" @click="$refs.logoInput.click()" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none">Upload Logo</button>
                            <input type="file" ref="logoInput" class="hidden" accept="image/*" @change="handleLogoChange">
                            <p class="text-xs text-gray-500 mt-1">PNG, JPG or GIF. Max 2MB.</p>
                        </div>
                    </div>
                </div>

                <p v-if="companyStore.error" class="form-error">
                    {{ companyStore.error }}
                </p>
                <p v-if="success" class="form-success">
                    Company profile saved successfully.
                </p>

                <button class="btn-primary" type="submit" :disabled="companyStore.loading">
                    {{ companyStore.loading ? 'Saving…' : 'Save changes' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/companyStore';

const companyStore = useCompanyStore();

const form = reactive({
    name: '',
    description: '',
    website: '',
    location: '',
});

const logoFile = ref(null);
const logoPreview = ref(null);
const success = ref(false);
const errors = reactive({
    name: '',
    website: '',
});

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
    errors.name = '';
    errors.website = '';

    if (!form.name.trim()) {
        errors.name = 'Company name is required.';
    }
    errors.website = validateUrl(form.website);

    return !Object.values(errors).some((value) => value);
}

function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) {
        logoFile.value = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
            logoPreview.value = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function handleSave() {
    companyStore.error = null;
    success.value = false;
    if (!validateForm()) return;

    const result = await companyStore.saveCompany({
        name: form.name.trim(),
        description: form.description.trim(),
        website: form.website.trim(),
        location: form.location.trim(),
        logo: logoFile.value,
    });

    if (result) {
        success.value = true;
        logoFile.value = null;
    }
}

onMounted(async () => {
    await companyStore.fetchCompany();
    if (companyStore.company) {
        form.name = companyStore.company.name || '';
        form.description = companyStore.company.description || '';
        form.website = companyStore.company.website || '';
        form.location = companyStore.company.location || '';
        logoPreview.value = companyStore.company.logo || null;
    }
});
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
