<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Secure Payment</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="payment-summary">
          <div class="summary-item">
            <span class="label">Candidate:</span>
            <span class="value">Candidate #{{ application.candidateId }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Position:</span>
            <span class="value">{{ jobTitle }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <span class="label">Amount Due:</span>
            <span class="value">$99.00</span>
          </div>
        </div>

        <div class="payment-methods">
          <p class="section-subtitle">Select Payment Method</p>
          <div class="methods-grid">
            <!-- TODO: PayPal 
            <label class="method-card">
              <input type="radio" v-model="method" value="paypal" name="payment_method" class="sr-only peer">
              <div class="method-card__inner peer-checked:selected">
                <div class="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.723a1.603 1.603 0 0 1 1.581-1.337h7.432c4.057 0 6.203 2.06 5.613 5.753-.404 2.536-1.921 4.14-4.225 4.14h-1.636a.64.64 0 0 0-.631.541l-.973 6.162a.64.64 0 0 1-.631.54h-4.398z"/>
                  </svg>
                </div>
                <span class="method-name">PayPal</span>
              </div>
            </label>
            -->
            <label class="method-card">
              <input type="radio" v-model="method" value="stripe" name="payment_method" class="sr-only peer">
              <div class="method-card__inner peer-checked:selected" checked="true">
                <div class="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,8H4V6H20V8M20,18H4V12H20V18M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0 0 4,20H20A2,2 0 0 0 22,18V6C22,4.89 21.1,4 20,4Z" />
                  </svg>
                </div>
                <span class="method-name">Stripe</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button 
          class="btn-pay" 
          :disabled="!method || loading"
          @click="handlePayment"
        >
          {{ loading ? 'Processing...' : 'Confirm & Pay $99.00' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApplicationsStore } from '@/stores/applicationsStore';

const props = defineProps({
  show: Boolean,
  application: Object,
  jobTitle: String,
  employerId: String
});

const emit = defineEmits(['close', 'success']);
const appsStore = useApplicationsStore();

const method = ref('paypal');
const loading = ref(false);

async function handlePayment() {
  loading.value = true;
  const paymentData = {
    employerId: props.employerId,
    applicationId: props.application.id,
    jobId: props.application.jobId,
    candidateId: props.application.candidateId,
    amount: 99,
    currency: 'USD',
    method: method.value
  };

  const success = await appsStore.processPayment(paymentData);
  if (success) {
    emit('success');
  } else {
    alert('Payment failed. Please try again.');
  }
  loading.value = false;
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
  z-index: 1000;
}

.modal-content {
  background: #fff;
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

.payment-summary {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-item .label {
  color: #64748b;
}

.summary-item .value {
  color: #1e293b;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 12px 0;
}

.summary-item.total {
  margin-bottom: 0;
  font-size: 16px;
}

.summary-item.total .value {
  color: #fd366e;
  font-size: 18px;
  font-weight: 700;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
}

.methods-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.method-card {
  cursor: pointer;
}

.method-card__inner {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.method-card__inner:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.method-card__inner.selected {
  border-color: #fd366e;
  background: #fff1f2;
}

.method-icon {
  color: #64748b;
}

.selected .method-icon {
  color: #fd366e;
}

.method-name {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.selected .method-name {
  color: #fd366e;
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

.btn-pay {
  flex: 2;
  padding: 10px;
  background: #fd366e;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pay:hover:not(:disabled) {
  background: #e11d48;
  transform: translateY(-1px);
}

.btn-pay:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
