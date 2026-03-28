<template>
    <div class="apply-panel">
        <!-- Panel header -->
        <div class="apply-panel__header">
            <div>
                <h2 class="apply-panel__title">Apply for {{ job.title }}</h2>
                <p class="apply-panel__sub">
                    {{ job.company }} · {{ job.location }}
                </p>
            </div>
            <button
                class="apply-panel__close"
                @click="$emit('close')"
                aria-label="Close"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>

        <!-- Method toggle -->
        <div class="apply-panel__methods">
            <button
                :class="['method-btn', { active: method === 'resume' }]"
                @click="method = 'resume'"
            >
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
                Upload resume
            </button>
            <button
                :class="['method-btn', { active: method === 'contact' }]"
                @click="method = 'contact'"
            >
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
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                    />
                </svg>
                Share contact info
            </button>
        </div>

        <!-- ── Resume method ── -->
        <div v-if="method === 'resume'" class="apply-panel__section">
            <label class="field-label">Resume (PDF)</label>

            <!-- Saved resume from profile -->
            <div v-if="resumeUrl && !newFile" class="saved-resume">
                <svg
                    width="16"
                    height="16"
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
                <span class="saved-resume__name">
                    {{ resumeUrl.split('/').pop() }}
                </span>
                <button class="text-btn" @click="clearFile">Change file</button>
            </div>

            <!-- Upload zone -->
            <div
                v-else
                :class="['upload-zone', { 'upload-zone--filled': newFile }]"
                @click="$refs.fileInput.click()"
            >
                <svg
                    v-if="!newFile"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="opacity: 0.4"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span v-if="!newFile" class="upload-zone__text">
                    Click to upload PDF
                    <span class="upload-zone__hint">— max 5MB</span>
                </span>
                <span v-else class="upload-zone__filled-name">
                    {{ newFile.name }}
                </span>
            </div>
            <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                style="display: none"
                @change="onFileChange"
            />

            <p v-if="method === 'resume' && !canSubmit" class="field-warn">
                Please upload a resume to continue.
            </p>
        </div>

        <!-- ── Contact method ── -->
        <div v-if="method === 'contact'" class="apply-panel__section">
            <div class="field-group">
                <label class="field-label">Email</label>
                <input
                    v-model="contactEmail"
                    class="field-input"
                    type="email"
                    placeholder="your@email.com"
                />
            </div>
            <div class="field-group">
                <label class="field-label">Phone</label>
                <input
                    v-model="contactPhone"
                    class="field-input"
                    type="tel"
                    placeholder="+1 555 000 0000"
                />
            </div>
            <p class="field-hint">
                Your details will be shared directly with {{ job.company }}.
            </p>
            <p v-if="method === 'contact' && !canSubmit" class="field-warn">
                Please fill in both email and phone.
            </p>
        </div>

        <!-- ── Cover note ── -->
        <div class="apply-panel__section">
            <label class="field-label">
                Cover note
                <span class="field-label__opt">optional</span>
            </label>
            <textarea
                v-model="coverNote"
                class="field-input field-textarea"
                rows="3"
                placeholder="Say something to stand out…"
            />
        </div>

        <!-- Error message -->
        <p v-if="errorMsg" class="apply-panel__error">{{ errorMsg }}</p>

        <!-- Actions -->
        <div class="apply-panel__actions">
            <button class="btn-cancel" @click="$emit('close')">Cancel</button>
            <button
                class="btn-submit"
                :disabled="!canSubmit || submitting"
                @click="handleSubmit"
            >
                <span v-if="submitting" class="spinner" />
                {{ submitting ? 'Submitting…' : 'Submit application' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const props = defineProps({
    job: { type: Object, required: true },
});
const emit = defineEmits(['close', 'success']);

const authStore = useAuthStore();
const appsStore = useApplicationsStore();

const method = ref('resume');
const newFile = ref(null);
const resumeUrl = ref(authStore.currentUser?.resumeUrl || '');
const contactEmail = ref(authStore.currentUser?.email || '');
const contactPhone = ref(authStore.currentUser?.phone || '');
const coverNote = ref('');
const submitting = ref(false);
const errorMsg = ref('');

const canSubmit = computed(() => {
    if (method.value === 'resume') return !!(newFile.value || resumeUrl.value);
    return !!(contactEmail.value.trim() && contactPhone.value.trim());
});

function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    newFile.value = file;
    resumeUrl.value = `/resumes/${file.name}`;
}

function clearFile() {
    newFile.value = null;
    resumeUrl.value = '';
}

async function handleSubmit() {
    errorMsg.value = '';
    submitting.value = true;
    const user = authStore.currentUser;
    const payload =
        method.value === 'resume'
            ? { resumeUrl: resumeUrl.value, coverNote: coverNote.value }
            : {
                  contactEmail: contactEmail.value,
                  contactPhone: contactPhone.value,
                  coverNote: coverNote.value,
              };

    try {
        const ok = await appsStore.applyToJob(
            props.job.id,
            user.id,
            props.job.employerId,
            method.value,
            payload
        );
        if (ok) emit('success');
        else
            errorMsg.value =
                appsStore.error || 'Could not submit. Please try again.';
    } catch {
        errorMsg.value = 'Something went wrong. Please try again.';
    } finally {
        submitting.value = false;
    }
}
</script>

<style scoped>
/* ── Panel container — inline block, no fixed, no backdrop ── */
.apply-panel {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-lg);
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* Subtle top accent line matching the brand */
    border-top: 3px solid #e8246a;
}

/* ── Header ── */
.apply-panel__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 20px 0;
}
.apply-panel__title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 2px;
}
.apply-panel__sub {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin: 0;
}
.apply-panel__close {
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    padding: 2px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    transition: color 0.15s;
}
.apply-panel__close:hover {
    color: var(--color-text-primary);
}

/* ── Method toggle ── */
.apply-panel__methods {
    display: flex;
    gap: 8px;
    padding: 16px 20px 0;
}
.method-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 10px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    background: none;
    font-size: 13px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.method-btn.active {
    background: #eeedfe;
    border-color: #7f77dd;
    color: #3c3489;
    font-weight: 500;
}

/* ── Sections ── */
.apply-panel__section {
    padding: 16px 20px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* ── Field styles ── */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.field-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: 6px;
}
.field-label__opt {
    font-size: 11px;
    font-weight: 400;
    color: var(--color-text-tertiary);
}
.field-input {
    padding: 9px 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s;
}
.field-input:focus {
    border-color: #534ab7;
}
.field-textarea {
    resize: vertical;
    min-height: 72px;
    font-family: inherit;
}
.field-hint {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin: 0;
}
.field-warn {
    font-size: 12px;
    color: #854f0b;
    background: #faeeda;
    padding: 6px 10px;
    border-radius: var(--border-radius-md);
    margin: 0;
}

/* ── Saved resume row ── */
.saved-resume {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-md);
    font-size: 13px;
    color: var(--color-text-primary);
}
.saved-resume svg {
    color: #534ab7;
    flex-shrink: 0;
}
.saved-resume__name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.text-btn {
    background: none;
    border: none;
    font-size: 12px;
    color: #534ab7;
    cursor: pointer;
    padding: 0;
    white-space: nowrap;
}

/* ── Upload zone ── */
.upload-zone {
    border: 1.5px dashed var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
}
.upload-zone:hover {
    border-color: #534ab7;
    background: #eeedfe22;
}
.upload-zone--filled {
    border-color: #1d9e75;
    background: #e1f5ee;
}
.upload-zone__text {
    font-size: 13px;
    color: var(--color-text-secondary);
}
.upload-zone__hint {
    color: var(--color-text-tertiary);
}
.upload-zone__filled-name {
    font-size: 13px;
    color: #0f6e56;
    font-weight: 500;
}

/* ── Error ── */
.apply-panel__error {
    margin: 12px 20px 0;
    font-size: 13px;
    color: var(--color-text-danger);
    background: #fcebeb;
    padding: 8px 12px;
    border-radius: var(--border-radius-md);
}

/* ── Actions ── */
.apply-panel__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    margin-top: 4px;
    border-top: 1px solid var(--color-border-tertiary);
}
.btn-cancel {
    padding: 9px 20px;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
}
.btn-cancel:hover {
    border-color: var(--color-border-primary);
    color: var(--color-text-primary);
}
.btn-submit {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 22px;
    background: #e8246a;
    color: #fff;
    border: none;
    border-radius: var(--border-radius-md);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
}
.btn-submit:hover:not(:disabled) {
    opacity: 0.88;
}
.btn-submit:disabled {
    opacity: 0.5;
    cursor: default;
}

/* ── Spinner ── */
.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
