<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-card">
            <!-- Header -->
            <div class="modal-header">
                <h2 class="modal-title">Job Details</h2>
                <button class="modal-close" @click="$emit('close')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="modal-body text-center py-12">
                <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-sm text-gray-500">Loading job details…</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="modal-body text-center py-12">
                <p class="text-sm text-red-600">{{ error }}</p>
                <button class="mt-4 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50" @click="fetchJob">Retry</button>
            </div>

            <!-- Content -->
            <div v-else-if="job" class="modal-body">
                <div v-if="successMessage" class="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    {{ successMessage }}
                </div>

                <div class="flex items-start gap-4 mb-6">
                    <div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img v-if="job.company?.logo" :src="job.company.logo" class="w-full h-full object-cover">
                        <span v-else class="text-lg font-bold text-gray-500">{{ job.company?.name?.charAt(0) || '?' }}</span>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900">{{ job.title }}</h3>
                        <p class="text-sm text-gray-600">{{ job.company?.name || 'Unknown' }}</p>
                    </div>
                    <span class="ml-auto px-2 py-1 text-xs font-bold uppercase bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase">Location</p>
                        <p class="font-medium text-gray-900">{{ job.location || '—' }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase">Work Type</p>
                        <p class="font-medium text-gray-900">{{ job.work_type || '—' }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase">Experience</p>
                        <p class="font-medium text-gray-900">{{ job.experience_level || '—' }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase">Salary</p>
                        <p class="font-medium text-gray-900">{{ formatSalary(job.salary_min, job.salary_max) }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase">Deadline</p>
                        <p class="font-medium text-gray-900">{{ formatDeadline(job.deadline) }}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase">Posted</p>
                        <p class="font-medium text-gray-900">{{ formatDate(job.created_at) }}</p>
                    </div>
                </div>

                <div class="space-y-4 mb-6">
                    <div v-if="job.description">
                        <h4 class="text-sm font-bold text-gray-900 mb-1">Description</h4>
                        <p class="text-sm text-gray-600 whitespace-pre-line">{{ job.description }}</p>
                    </div>
                    <div v-if="job.requirements">
                        <h4 class="text-sm font-bold text-gray-900 mb-1">Requirements</h4>
                        <p class="text-sm text-gray-600 whitespace-pre-line">{{ job.requirements }}</p>
                    </div>
                    <div v-if="job.benefits">
                        <h4 class="text-sm font-bold text-gray-900 mb-1">Benefits</h4>
                        <p class="text-sm text-gray-600 whitespace-pre-line">{{ job.benefits }}</p>
                    </div>
                </div>

                <div v-if="job.skills?.length || job.categories?.length" class="flex flex-wrap gap-2 mb-6">
                    <span v-for="cat in job.categories" :key="cat.id" class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">{{ cat.name }}</span>
                    <span v-for="skill in job.skills" :key="skill.id" class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{{ skill.name }}</span>
                </div>

                <!-- Actions -->
                <div v-if="!successMessage" class="flex gap-3 pt-4 border-t border-gray-100">
                    <input v-model="rejectReason" class="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Rejection reason (optional)" />
                    <button class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50" @click="handleReject">Reject</button>
                    <button class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700" @click="handleApprove">Approve</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import client from '@/api/client';

export default {
    name: 'JobPreviewModal',
    props: {
        jobId: { type: [String, Number], required: true },
    },
    emits: ['close', 'approve', 'reject'],
    setup(props, { emit }) {
        const job = ref(null);
        const loading = ref(true);
        const error = ref('');
        const rejectReason = ref('');
        const successMessage = ref('');

        const formatDate = (value) => {
            if (!value) return '—';
            const date = new Date(value);
            if (!Number.isFinite(date.getTime())) return '—';
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };

        const formatSalary = (min, max) => {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
            });
            if (min && max) return `${formatter.format(min)} – ${formatter.format(max)}`;
            if (min) return formatter.format(min);
            if (max) return formatter.format(max);
            return '—';
        };

        const formatDeadline = (value) => {
            if (!value) return '—';
            const date = new Date(value);
            if (!Number.isFinite(date.getTime())) return value;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };

        const fetchJob = async () => {
            loading.value = true;
            error.value = '';
            try {
                const data = await client.get(`/jobs/${props.jobId}`);
                job.value = data;
            } catch (err) {
                error.value = err.message || 'Could not load job details.';
            } finally {
                loading.value = false;
            }
        };

        const handleApprove = () => {
            emit('approve', props.jobId);
            successMessage.value = 'Job approved successfully.';
            setTimeout(() => emit('close'), 2000);
        };

        const handleReject = () => {
            emit('reject', props.jobId, rejectReason.value);
            successMessage.value = 'Job rejected.';
            setTimeout(() => emit('close'), 2000);
        };

        onMounted(fetchJob);

        return {
            job,
            loading,
            error,
            rejectReason,
            successMessage,
            formatDate,
            formatSalary,
            formatDeadline,
            fetchJob,
            handleApprove,
            handleReject,
        };
    },
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}
.modal-card {
    background: var(--color-background-primary);
    border-radius: var(--border-radius-lg);
    width: 100%;
    max-width: 640px;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-border-tertiary);
}
.modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
}
.modal-close {
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
}
.modal-close:hover {
    color: var(--color-text-primary);
    background: var(--color-background-secondary);
}
.modal-body {
    padding: 20px;
    overflow-y: auto;
}
</style>
