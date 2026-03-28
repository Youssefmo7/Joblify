<template>
    <div class="profile-page">
        <div class="profile-page__inner">
            <!-- ── LEFT SIDEBAR ── -->
            <aside class="profile-sidebar">
                <!-- Avatar card -->
                <div class="avatar-card">
                    <div class="avatar-card__banner" />
                    <div class="avatar-card__body">
                        <div class="avatar-card__avatar-wrap">
                            <img
                                class="avatar-card__img"
                                :src="
                                    form.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        form.name
                                    )}&background=534AB7&color=fff`
                                "
                                :alt="form.name"
                            />
                        </div>
                        <p class="avatar-card__name">
                            {{ form.name || 'Your name' }}
                        </p>
                        <p class="avatar-card__title">
                            {{ form.title || 'Add your job title' }}
                        </p>

                        <div class="avatar-card__divider" />

                        <div class="avatar-card__stats">
                            <div class="avatar-card__stat">
                                <span class="stat-label">Profile views</span>
                                <span class="stat-value">
                                    {{
                                        authStore.currentUser?.profileViews || 0
                                    }}
                                </span>
                            </div>
                            <div class="avatar-card__stat">
                                <span class="stat-label">Saved jobs</span>
                                <span class="stat-value">
                                    {{
                                        authStore.currentUser?.savedJobs
                                            ?.length || 0
                                    }}
                                </span>
                            </div>
                            <div class="avatar-card__stat">
                                <span class="stat-label">Applications</span>
                                <span class="stat-value">{{ appCount }}</span>
                            </div>
                        </div>

                        <div class="avatar-card__divider" />

                        <RouterLink to="/my-applications" class="sidebar-link">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            My applications
                        </RouterLink>
                        <RouterLink to="/" class="sidebar-link">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Browse jobs
                        </RouterLink>

                        <div class="avatar-card__divider" />

                        <button class="logout-btn" @click="handleLogout">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign out
                        </button>
                    </div>
                </div>

                <!-- Skills summary -->
                <div class="sidebar-card">
                    <h3 class="sidebar-card__title">Your skills</h3>
                    <div class="skills-chips">
                        <span
                            v-for="skill in form.skills"
                            :key="skill"
                            class="skill-chip"
                        >
                            {{ skill }}
                        </span>
                        <span v-if="!form.skills.length" class="no-data">
                            No skills added yet
                        </span>
                    </div>
                </div>

                <!-- Resume summary -->
                <div class="sidebar-card">
                    <h3 class="sidebar-card__title">Resume</h3>
                    <a
                        v-if="form.resumeUrl"
                        :href="form.resumeUrl"
                        target="_blank"
                        class="resume-preview-link"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                            />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {{ form.resumeUrl.split('/').pop() }}
                    </a>
                    <span v-else class="no-data">No resume uploaded</span>
                </div>
            </aside>

            <!-- ── MAIN ── -->
            <main class="profile-main">
                <!-- Tabs -->
                <div class="section-tabs">
                    <button
                        v-for="tab in tabs"
                        :key="tab.value"
                        :class="[
                            'section-tab',
                            { active: activeTab === tab.value },
                        ]"
                        @click="activeTab = tab.value"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <!-- ══ Personal info ══ -->
                <div v-if="activeTab === 'info'" class="profile-card">
                    <div class="profile-card__header">
                        <h2 class="profile-card__title">
                            Personal information
                        </h2>
                        <p class="profile-card__sub">
                            Update your name, contact details, and public
                            profile.
                        </p>
                    </div>

                    <form class="profile-form" @submit.prevent="handleSave">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Full name</label>
                                <input
                                    v-model="form.name"
                                    class="form-input"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Job title</label>
                                <input
                                    v-model="form.title"
                                    class="form-input"
                                    placeholder="Frontend Developer"
                                />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input
                                    v-model="form.email"
                                    class="form-input"
                                    type="email"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input
                                    v-model="form.phone"
                                    class="form-input"
                                    type="tel"
                                    placeholder="+1 555 000 0000"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">LinkedIn URL</label>
                            <input
                                v-model="form.linkedin"
                                class="form-input"
                                type="url"
                                placeholder="https://linkedin.com/in/yourname"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                Avatar URL
                                <span class="optional">
                                    (leave blank to use initials)
                                </span>
                            </label>
                            <input
                                v-model="form.avatar"
                                class="form-input"
                                placeholder="https://..."
                            />
                        </div>

                        <div class="form-footer">
                            <div>
                                <p v-if="authStore.error" class="form-error">
                                    {{ authStore.error }}
                                </p>
                                <p v-if="saveSuccess" class="form-success">
                                    Changes saved!
                                </p>
                            </div>
                            <button
                                type="submit"
                                class="btn-primary"
                                :disabled="authStore.loading"
                            >
                                {{
                                    authStore.loading
                                        ? 'Saving…'
                                        : 'Save changes'
                                }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- ══ Skills ══ -->
                <div v-if="activeTab === 'skills'" class="profile-card">
                    <div class="profile-card__header">
                        <h2 class="profile-card__title">
                            Skills & technologies
                        </h2>
                        <p class="profile-card__sub">
                            Add skills that help employers find you.
                        </p>
                    </div>

                    <div class="skill-add-row">
                        <input
                            v-model="skillInput"
                            class="form-input"
                            placeholder="Type a skill and press Enter (e.g. Vue.js)"
                            @keydown.enter.prevent="addSkill"
                        />
                        <button
                            type="button"
                            class="btn-secondary"
                            @click="addSkill"
                        >
                            Add
                        </button>
                    </div>

                    <div v-if="form.skills.length" class="skills-grid">
                        <div
                            v-for="(skill, i) in form.skills"
                            :key="skill"
                            class="skill-pill"
                        >
                            <span>{{ skill }}</span>
                            <button
                                class="skill-pill__remove"
                                @click="removeSkill(i)"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <p v-else class="no-data no-data--center">
                        No skills yet. Add one above.
                    </p>

                    <div class="form-footer">
                        <p v-if="saveSuccess" class="form-success">
                            Skills saved!
                        </p>
                        <button
                            class="btn-primary"
                            :disabled="authStore.loading"
                            @click="handleSave"
                        >
                            {{ authStore.loading ? 'Saving…' : 'Save skills' }}
                        </button>
                    </div>
                </div>

                <!-- ══ Resume ══ -->
                <div v-if="activeTab === 'resume'" class="profile-card">
                    <div class="profile-card__header">
                        <h2 class="profile-card__title">Resume</h2>
                        <p class="profile-card__sub">
                            Upload your CV so employers can review it when you
                            apply.
                        </p>
                    </div>

                    <div v-if="form.resumeUrl" class="resume-current">
                        <div class="resume-current__icon">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div class="resume-current__info">
                            <p class="resume-current__name">
                                {{ form.resumeUrl.split('/').pop() }}
                            </p>
                            <p class="resume-current__sub">Current resume</p>
                        </div>
                        <div class="resume-current__actions">
                            <a
                                :href="form.resumeUrl"
                                target="_blank"
                                class="btn-ghost-sm"
                            >
                                View
                            </a>
                            <button class="btn-danger-sm" @click="removeResume">
                                Remove
                            </button>
                        </div>
                    </div>

                    <div
                        class="file-drop"
                        :class="{
                            'file-drop--has': newResumeFile,
                            'file-drop--drag': isDragging,
                        }"
                        @click="$refs.resumeInput.click()"
                        @dragover.prevent="isDragging = true"
                        @dragleave="isDragging = false"
                        @drop.prevent="handleDrop"
                    >
                        <svg
                            v-if="!newResumeFile"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style="opacity: 0.4"
                        >
                            <path
                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                            />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p v-if="!newResumeFile" class="file-drop__text">
                            Drag & drop PDF here, or
                            <span class="file-drop__cta">click to browse</span>
                        </p>
                        <p v-else class="file-drop__name">
                            {{ newResumeFile.name }}
                        </p>
                    </div>
                    <input
                        ref="resumeInput"
                        type="file"
                        accept=".pdf"
                        style="display: none"
                        @change="handleResumeChange"
                    />

                    <div class="form-footer">
                        <div>
                            <p v-if="saveSuccess" class="form-success">
                                Resume saved!
                            </p>
                            <p v-if="authStore.error" class="form-error">
                                {{ authStore.error }}
                            </p>
                        </div>
                        <button
                            class="btn-primary"
                            :disabled="authStore.loading"
                            @click="handleSave"
                        >
                            {{ authStore.loading ? 'Saving…' : 'Save resume' }}
                        </button>
                    </div>
                </div>

                <!-- ══ Password & account ══ -->
                <div v-if="activeTab === 'account'" class="profile-card">
                    <div class="profile-card__header">
                        <h2 class="profile-card__title">Change password</h2>
                        <p class="profile-card__sub">
                            Keep your account secure with a strong password.
                        </p>
                    </div>

                    <form
                        class="profile-form"
                        @submit.prevent="handlePasswordChange"
                    >
                        <div class="form-group">
                            <label class="form-label">New password</label>
                            <input
                                v-model="newPassword"
                                class="form-input"
                                type="password"
                                placeholder="At least 6 characters"
                                minlength="6"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                Confirm new password
                            </label>
                            <input
                                v-model="confirmPassword"
                                class="form-input"
                                type="password"
                                placeholder="Repeat password"
                                required
                            />
                        </div>
                        <p v-if="passwordError" class="form-error">
                            {{ passwordError }}
                        </p>
                        <p v-if="passwordSuccess" class="form-success">
                            Password updated!
                        </p>

                        <div class="form-footer">
                            <div />
                            <button
                                type="submit"
                                class="btn-primary"
                                :disabled="authStore.loading"
                            >
                                {{
                                    authStore.loading
                                        ? 'Updating…'
                                        : 'Update password'
                                }}
                            </button>
                        </div>
                    </form>

                    <!-- Logout section -->
                    <div class="danger-zone">
                        <h3 class="danger-zone__title">Sign out</h3>
                        <p class="danger-zone__sub">
                            You'll be redirected to the login page.
                        </p>
                        <button class="logout-btn-full" @click="handleLogout">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign out of Joblify
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const router = useRouter();
const authStore = useAuthStore();
const appsStore = useApplicationsStore();

const tabs = [
    { label: 'Personal info', value: 'info' },
    { label: 'Skills', value: 'skills' },
    { label: 'Resume', value: 'resume' },
    { label: 'Account', value: 'account' },
];
const activeTab = ref('info');

const form = reactive({
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    avatar: '',
    skills: [],
    resumeUrl: '',
});

const skillInput = ref('');
const newResumeFile = ref(null);
const isDragging = ref(false);
const saveSuccess = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const passwordSuccess = ref(false);

const appCount = computed(
    () => appsStore.myApplications(authStore.currentUser?.id).length
);

// ── Skills ────────────────────────────────────────────────────
function addSkill() {
    const s = skillInput.value.trim();
    if (s && !form.skills.includes(s)) form.skills.push(s);
    skillInput.value = '';
}

function removeSkill(i) {
    form.skills.splice(i, 1);
}

// ── Resume ────────────────────────────────────────────────────
function handleResumeChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    newResumeFile.value = file;
    form.resumeUrl = `/resumes/${file.name}`;
}

function handleDrop(e) {
    isDragging.value = false;
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        newResumeFile.value = file;
        form.resumeUrl = `/resumes/${file.name}`;
    }
}

function removeResume() {
    form.resumeUrl = '';
    newResumeFile.value = null;
}

// ── Save ──────────────────────────────────────────────────────
async function handleSave() {
    saveSuccess.value = false;
    const ok = await authStore.updateProfile({ ...form });
    if (ok) {
        saveSuccess.value = true;
        setTimeout(() => {
            saveSuccess.value = false;
        }, 3000);
    }
}

// ── Password ──────────────────────────────────────────────────
async function handlePasswordChange() {
    passwordError.value = '';
    passwordSuccess.value = false;
    if (newPassword.value !== confirmPassword.value) {
        passwordError.value = 'Passwords do not match.';
        return;
    }
    const ok = await authStore.updateProfile({ password: newPassword.value });
    if (ok) {
        passwordSuccess.value = true;
        newPassword.value = confirmPassword.value = '';
        setTimeout(() => {
            passwordSuccess.value = false;
        }, 3000);
    }
}

// ── Logout ────────────────────────────────────────────────────
function handleLogout() {
    authStore.logout();
    router.push('/login');
}

// ── Init ──────────────────────────────────────────────────────
onMounted(async () => {
    const user = authStore.currentUser;
    if (!user) return router.push('/login');
    form.name = user.name || '';
    form.title = user.title || '';
    form.email = user.email || '';
    form.phone = user.phone || '';
    form.linkedin = user.linkedin || '';
    form.avatar = user.avatar || '';
    form.skills = [...(user.skills || [])];
    form.resumeUrl = user.resumeUrl || '';
    await appsStore.fetchMyApplications(user.id);
});
</script>

<style scoped>
.profile-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 16px;
}
.profile-page__inner {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 20px;
    align-items: start;
}
@media (max-width: 768px) {
    .profile-page__inner {
        grid-template-columns: 1fr;
    }
}

/* ── Sidebar ── */
.profile-sidebar {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.avatar-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
}
.avatar-card__banner {
    height: 64px;
    background: #534ab7;
}
.avatar-card__body {
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 0;
}
.avatar-card__avatar-wrap {
    margin-top: -28px;
    margin-bottom: 10px;
}
.avatar-card__img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 3px solid var(--color-background-primary);
    object-fit: cover;
    display: block;
}
.avatar-card__name {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 2px;
}
.avatar-card__title {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin: 0;
}
.avatar-card__divider {
    height: 1px;
    background: var(--color-border-tertiary);
    margin: 12px 0;
}
.avatar-card__stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.avatar-card__stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.stat-label {
    font-size: 13px;
    color: var(--color-text-secondary);
}
.stat-value {
    font-size: 13px;
    font-weight: 500;
    color: #e8246a;
}
.sidebar-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: 7px 0;
    transition: color 0.15s;
}
.sidebar-link:hover {
    color: #534ab7;
}
.logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-danger);
    background: none;
    border: none;
    cursor: pointer;
    padding: 7px 0;
    width: 100%;
    text-align: left;
}
.logout-btn:hover {
    opacity: 0.75;
}
.sidebar-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.sidebar-card__title {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
    margin: 0;
}
.skills-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.skill-chip {
    font-size: 12px;
    background: #eeedfe;
    color: #534ab7;
    padding: 3px 10px;
    border-radius: 99px;
}
.no-data {
    font-size: 12px;
    color: var(--color-text-tertiary);
}
.no-data--center {
    text-align: center;
    padding: 20px 0;
}
.resume-preview-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #534ab7;
    text-decoration: none;
}
.resume-preview-link:hover {
    text-decoration: underline;
}

/* ── Tabs ── */
.profile-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.section-tabs {
    display: flex;
    gap: 0;
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 5px;
}
.section-tab {
    flex: 1;
    padding: 8px 10px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    background: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--border-radius-md);
    transition: all 0.15s;
}
.section-tab.active {
    background: #534ab7;
    color: #fff;
}

/* ── Card ── */
.profile-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.profile-card__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.profile-card__title {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
}
.profile-card__sub {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0;
}

/* ── Form ── */
.profile-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}
@media (max-width: 580px) {
    .form-row {
        grid-template-columns: 1fr;
    }
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
    font-size: 12px;
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
    box-sizing: border-box;
    width: 100%;
}
.form-input:focus {
    border-color: #534ab7;
}
.form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-tertiary);
}
.form-error {
    font-size: 13px;
    color: var(--color-text-danger);
    margin: 0;
}
.form-success {
    font-size: 13px;
    color: #0f6e56;
    margin: 0;
}

/* ── Buttons ── */
.btn-primary {
    padding: 9px 24px;
    background: #e8246a;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: opacity 0.15s;
    flex-shrink: 0;
}
.btn-primary:hover:not(:disabled) {
    opacity: 0.88;
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: default;
}
.btn-secondary {
    padding: 9px 16px;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    color: var(--color-text-secondary);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
}
.btn-secondary:hover {
    border-color: #534ab7;
    color: #534ab7;
}
.btn-ghost-sm {
    font-size: 12px;
    padding: 5px 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 6px;
    color: var(--color-text-secondary);
    background: none;
    text-decoration: none;
    cursor: pointer;
}
.btn-ghost-sm:hover {
    border-color: #534ab7;
    color: #534ab7;
}
.btn-danger-sm {
    font-size: 12px;
    padding: 5px 12px;
    border: 1px solid var(--color-border-danger);
    border-radius: 6px;
    color: var(--color-text-danger);
    background: none;
    cursor: pointer;
}
.btn-danger-sm:hover {
    background: #fcebeb;
}

/* ── Skills tab ── */
.skill-add-row {
    display: flex;
    gap: 10px;
}
.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.skill-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    background: #eeedfe;
    color: #534ab7;
    padding: 6px 12px;
    border-radius: 99px;
    border: 1px solid #cecbf6;
}
.skill-pill__remove {
    background: none;
    border: none;
    color: #7f77dd;
    cursor: pointer;
    font-size: 11px;
    padding: 0;
    line-height: 1;
}
.skill-pill__remove:hover {
    color: #a32d2d;
}

/* ── Resume tab ── */
.resume-current {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-md);
}
.resume-current__icon {
    color: #534ab7;
    flex-shrink: 0;
}
.resume-current__info {
    flex: 1;
}
.resume-current__name {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 2px;
}
.resume-current__sub {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.resume-current__actions {
    display: flex;
    gap: 8px;
}
.file-drop {
    border: 1.5px dashed var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    padding: 32px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.file-drop:hover,
.file-drop--drag {
    border-color: #534ab7;
    background: #eeedfe22;
}
.file-drop--has {
    border-color: #1d9e75;
    background: #e1f5ee;
}
.file-drop__text {
    font-size: 14px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.file-drop__cta {
    color: #534ab7;
    font-weight: 500;
}
.file-drop__name {
    font-size: 14px;
    color: #0f6e56;
    font-weight: 500;
}

/* ── Danger zone ── */
.danger-zone {
    border: 1px solid var(--color-border-danger);
    border-radius: var(--border-radius-md);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.danger-zone__title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-danger);
    margin: 0;
}
.danger-zone__sub {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0;
}
.logout-btn-full {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-danger);
    background: none;
    border: 1px solid var(--color-border-danger);
    border-radius: var(--border-radius-md);
    padding: 8px 16px;
    cursor: pointer;
    width: fit-content;
    transition: background 0.15s;
}
.logout-btn-full:hover {
    background: #fcebeb;
}
</style>
