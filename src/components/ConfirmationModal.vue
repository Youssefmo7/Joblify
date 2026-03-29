<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" class="modal-overlay" @click.self="cancel">
                <div class="modal-container">
                    <Transition name="modal-slide">
                        <div v-if="isOpen" class="modal-content">
                            <!-- Icon -->
                            <div class="modal-icon" :class="`icon--${type}`">
                                <svg
                                    v-if="type === 'warning'"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                >
                                    <path
                                        d="M16 2L2 28h28L16 2zm0 8l4 8h-8l4-8zm0 10a1 1 0 110 2 1 1 0 010-2z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <svg
                                    v-else-if="type === 'error'"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                >
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <path
                                        d="M12 12l8 8M20 12l-8 8"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                <svg
                                    v-else-if="type === 'success'"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                >
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <path
                                        d="M10 16l4 4 8-8"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <svg
                                    v-else
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                >
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    />
                                    <path
                                        d="M16 12v4m0 4h0"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </div>

                            <!-- Title -->
                            <h2 class="modal-title">{{ title }}</h2>

                            <!-- Message -->
                            <p class="modal-message">{{ message }}</p>

                            <!-- Buttons -->
                            <div class="modal-actions">
                                <button
                                    class="btn btn-secondary"
                                    @click="cancel"
                                    :disabled="isLoading"
                                >
                                    {{ cancelText }}
                                </button>
                                <button
                                    class="btn btn-primary"
                                    :class="`btn--${type}`"
                                    @click="confirm"
                                    :disabled="isLoading"
                                >
                                    <span v-if="!isLoading">
                                        {{ confirmText }}
                                    </span>
                                    <span v-else class="btn-loading">
                                        <span class="spinner"></span>
                                        {{ loadingText }}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Confirm action',
    },
    message: {
        type: String,
        default: 'Are you sure?',
    },
    confirmText: {
        type: String,
        default: 'Confirm',
    },
    cancelText: {
        type: String,
        default: 'Cancel',
    },
    loadingText: {
        type: String,
        default: 'Processing...',
    },
    type: {
        type: String,
        enum: ['warning', 'error', 'success', 'info'],
        default: 'warning',
    },
});

const emit = defineEmits(['confirm', 'cancel']);

const isLoading = ref(false);

const confirm = async () => {
    isLoading.value = true;
    emit('confirm');
    // Auto-reset after 500ms if still open
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
};

const cancel = () => {
    if (!isLoading.value) {
        emit('cancel');
    }
};

// Prevent body scroll when modal is open
watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            isLoading.value = false;
        }
    }
);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
}

.modal-container {
    position: relative;
    width: 100%;
    max-width: 420px;
}

.modal-content {
    background: var(--color-background-primary, #fff);
    border-radius: 12px;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--color-border-secondary, #e5e5e5);
}

/* Icon */
.modal-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: #fff;
}

.icon--warning {
    background: #faeeda;
    color: #b53930;
}

.icon--error {
    background: #fcebeb;
    color: #d11b1b;
}

.icon--success {
    background: #eaf3de;
    color: #3b6d11;
}

.icon--info {
    background: #e6f2ff;
    color: #0047ab;
}

/* Typography */
.modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary, #000);
    margin: 0;
    text-align: center;
    letter-spacing: -0.5px;
}

.modal-message {
    font-size: 14px;
    color: var(--color-text-secondary, #666);
    margin: 0;
    text-align: center;
    line-height: 1.5;
}

/* Actions */
.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 40px;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: var(--color-background-secondary, #f5f5f5);
    color: var(--color-text-secondary, #666);
    border: 1px solid var(--color-border-secondary, #e5e5e5);
}

.btn-secondary:hover:not(:disabled) {
    background: var(--color-border-secondary, #e5e5e5);
}

.btn-primary {
    background: #534ab7;
    color: #fff;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    background: #3f2d99;
    box-shadow: 0 8px 20px rgba(83, 74, 183, 0.3);
}

.btn--error {
    background: #f93d3d;
}

.btn--error:hover:not(:disabled) {
    background: #f93d3d;
    box-shadow: 0 8px 20px rgba(163, 45, 45, 0.3);
}

.btn--warning {
    background: #f93d3d;
}

.btn--warning:hover:not(:disabled) {
    background: #f93d3d;
    box-shadow: 0 8px 20px rgba(163, 45, 45, 0.3);
}

/* Loading spinner */
.btn-loading {
    display: flex;
    align-items: center;
    gap: 6px;
}

.spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-leave-active {
    transition: transform 0.2s ease;
}

.modal-slide-enter-from {
    transform: scale(0.9) translateY(-20px);
}

.modal-slide-leave-to {
    transform: scale(0.95);
    opacity: 0.8;
}
</style>
