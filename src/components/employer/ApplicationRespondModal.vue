<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">
          {{ status === 'accepted' ? 'Accept Candidate' : 'Reject Candidate' }}
        </h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="app-summary">
          <p class="summary-text">
            Candidate: <strong>Candidate #{{ application.candidateId }}</strong><br>
            Position: <strong>{{ jobTitle }}</strong>
          </p>
        </div>

        <div v-if="status === 'accepted'" class="confirm-message">
          <div class="info-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Accepting this candidate will mark the application as accepted and notify the candidate. You will be able to pay the placement fee from your dashboard.</p>
          </div>
          <p class="final-confirm">Are you sure you want to accept this candidate?</p>
        </div>

        <div v-else class="reject-form">
          <label class="field-label">Rejection Note (Required)</label>
          <textarea 
            v-model="rejectionReason" 
            class="note-input" 
            placeholder="Please provide a reason for rejection. This will be shared with the candidate."
            rows="4"
          ></textarea>
          <p v-if="error" class="error-msg">{{ error }}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button 
          :class="['btn-confirm', status === 'accepted' ? 'accept' : 'reject']"
          :disabled="loading || (status === 'rejected' && !rejectionReason.trim())"
          @click="handleConfirm"
        >
          {{ loading ? 'Processing...' : (status === 'accepted' ? 'Yes, Accept' : 'Submit Rejection') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: Boolean,
  application: Object,
  jobTitle: String,
  status: String, // 'accepted' or 'rejected'
  loading: Boolean
});

const emit = defineEmits(['close', 'confirm']);

const rejectionReason = ref('');
const error = ref('');

function handleConfirm() {
  if (props.status === 'rejected' && !rejectionReason.value.trim()) {
    error.value = 'A rejection note is required.';
    return;
  }
  emit('confirm', {
    appId: props.application.id,
    status: props.status,
    note: rejectionReason.value.trim()
  });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* Above other modals */
}

.modal-content {
  background: #fff;
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modal-up 0.3s ease-out;
}

@keyframes modal-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 24px;
}

.app-summary {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.summary-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.info-box {
  display: flex;
  gap: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 12px;
  border-radius: 8px;
  color: #1e40af;
  font-size: 13px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.info-box svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.final-confirm {
  text-align: center;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.note-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
}

.note-input:focus {
  outline: none;
  border-color: #534ab7;
  box-shadow: 0 0 0 2px rgba(83, 74, 183, 0.1);
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  margin-top: 8px;
}

.modal-footer {
  padding: 20px 24px;
  background: #f8fafc;
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  padding: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.btn-confirm {
  flex: 2;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm.accept { background: #22c55e; }
.btn-confirm.accept:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }

.btn-confirm.reject { background: #ef4444; }
.btn-confirm.reject:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
