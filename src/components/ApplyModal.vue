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

        <!-- Already applied notice -->
        <div v-if="alreadyApplied" class="apply-panel__already">
            ✅ You've already applied to this job.
            <button class="apply-panel__close-link" @click="$emit('close')">
                Close
            </button>
        </div>

        <template v-else>
            <!-- Resume upload -->
            <div class="apply-panel__section">
                <label class="field-label">Resume (PDF, DOC, DOCX) <span class="text-red-500">*</span></label>

                <div v-if="newFile" class="saved-resume">
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
                        {{ newFile.name }}
                    </span>
                    <button class="text-btn" @click="clearFile">
                        Change file
                    </button>
                </div>

                <div
                    v-else
                    :class="['upload-zone', { 'upload-zone--filled': newFile }]"
                    @click="$refs.fileInput.click()"
                >
                    <svg
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
                    <span class="upload-zone__text">
                        Click to upload resume
                        <span class="upload-zone__hint">— max 5MB</span>
                    </span>
                </div>
                <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style="display: none"
                    @change="onFileChange"
                />

                <p v-if="!canSubmit" class="field-warn">
                    Please upload a resume to continue.
                </p>
            </div>

            <!-- Cover letter -->
            <div class="apply-panel__section">
                <label class="field-label">
                    Cover letter
                    <span class="field-label__opt">optional</span>
                </label>
                <textarea
                    v-model="coverLetter"
                    class="field-input field-textarea"
                    rows="3"
                    placeholder="Say something to stand out…"
                />
            </div>

            <!-- Error -->
            <p v-if="errorMsg" class="apply-panel__error">{{ errorMsg }}</p>

            <!-- Actions -->
            <div class="apply-panel__actions">
                <button class="btn-cancel" @click="$emit('close')">
                    Cancel
                </button>
                <button
                    class="btn-submit"
                    :disabled="!canSubmit || submitting"
                    @click="handleSubmit"
                >
                    <span v-if="submitting" class="spinner" />
                    {{ submitting ? 'Submitting…' : 'Submit application' }}
                </button>
            </div>
        </template>
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

const user = authStore.currentUser;

const alreadyApplied = computed(() =>
    appsStore.hasApplied(props.job.id, user?.id)
);

const newFile = ref(null);
const coverLetter = ref('');
const submitting = ref(false);
const errorMsg = ref('');

const canSubmit = computed(() => !!newFile.value);

function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    newFile.value = file;
}

function clearFile() {
    newFile.value = null;
}

async function handleSubmit() {
    if (!user) {
        errorMsg.value = 'You must be logged in to apply.';
        return;
    }
    if (!newFile.value) {
        errorMsg.value = 'Please upload a resume.';
        return;
    }
    errorMsg.value = '';
    submitting.value = true;

    try {
        const result = await appsStore.applyToJob(props.job.id, {
            resume: newFile.value,
            coverLetter: coverLetter.value.trim(),
        });

        if (result) {
            emit('success');
        } else {
            errorMsg.value =
                appsStore.error || 'Could not submit. Please try again.';
        }
    } catch {
        errorMsg.value = 'Something went wrong. Please try again.';
    } finally {
        submitting.value = false;
    }
}
</script>

<style scoped>
.apply-panel {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-lg);
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-top: 3px solid #e8246a;
}

.apply-panel__already {
    padding: 20px;
    font-size: 14px;
    color: #0f6e56;
    background: #e1f5ee;
    display: flex;
    align-items: center;
    gap: 12px;
}
.apply-panel__close-link {
    background: none;
    border: none;
    font-size: 13px;
    color: #534ab7;
    cursor: pointer;
    text-decoration: underline;
    margin-left: auto;
}

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

.apply-panel__section {
    padding: 16px 20px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
.field-warn {
    font-size: 12px;
    color: #854f0b;
    background: #faeeda;
    padding: 6px 10px;
    border-radius: var(--border-radius-md);
    margin: 0;
}

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

.apply-panel__error {
    margin: 12px 20px 0;
    font-size: 13px;
    color: var(--color-text-danger);
    background: #fcebeb;
    padding: 8px 12px;
    border-radius: var(--border-radius-md);
}

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
