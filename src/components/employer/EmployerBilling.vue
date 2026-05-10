<template>
  <div class="billing-section">
    <header class="section-header">
      <h1 class="section-title">Billing & Payment History</h1>
      <!-- TODO: Add balance due 
      <div class="balance-card">
        <span class="label">Balance Due:</span>
        <span class="value">$0.00</span>
      </div> -->
    </header>

    <div v-if="appsStore.loading" class="state-msg">Loading history...</div>

    <div v-else class="history-table-container">
      <table class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td class="date-cell">{{ formatDate(payment.createdAt) }}</td>
            <td class="desc-cell">
              <p class="main-desc">Placement Fee: Candidate #{{ payment.candidateId }}</p>
              <p class="sub-desc">Job ID: {{ payment.jobId }}</p>
            </td>
            <td class="amount-cell">${{ payment.amount.toFixed(2) }}</td>
            <td class="method-cell">
              <span class="method-tag">{{ payment.method }}</span>
            </td>
            <td class="status-cell">
              <span class="status-tag success">Completed</span>
            </td>
          </tr>
          <tr v-if="payments.length === 0">
            <td colspan="5" class="empty-state">No payment history found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationsStore } from '@/stores/applicationsStore';

const authStore = useAuthStore();
const appsStore = useApplicationsStore();

const employerId = computed(() => authStore.currentUser?.id);
const payments = computed(() => appsStore.paymentsForEmployer(employerId.value));

// Debug watch
watch(payments, (newVal) => {
  console.log("Payments updated in component:", newVal);
}, { immediate: true });

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

onMounted(() => {
  if (employerId.value) {
    appsStore.fetchPayments();
  }
});
</script>

<style scoped>
.billing-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.balance-card {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  padding: 8px 16px;
  border-radius: 12px;
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.balance-card .label { color: var(--color-text-secondary); }
.balance-card .value { font-weight: 700; color: #16a34a; }

.history-table-container {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.history-table th {
  background: var(--color-background-secondary);
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border-tertiary);
}

.history-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-tertiary);
  font-size: 14px;
}

.history-table tr:last-child td { border-bottom: none; }

.history-table tr:hover { background: #f8fafc; }

.main-desc { font-weight: 600; color: var(--color-text-primary); margin: 0; }
.sub-desc { font-size: 12px; color: var(--color-text-tertiary); margin: 2px 0 0; }

.amount-cell { font-family: monospace; font-weight: 700; color: var(--color-text-primary); }

.method-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
  text-transform: uppercase;
}

.status-tag.success {
  background: #dcfce7;
  color: #166534;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-tertiary);
}

.state-msg {
  text-align: center;
  padding: 40px;
  color: var(--color-text-tertiary);
}
</style>
