<template>
    <div class="post-job-page">
        <div class="post-job-card">
            <h1 class="post-job__title">
                {{ isEditing ? 'Edit job posting' : 'Post a new job' }}
            </h1>

            <form class="post-job-form" @submit.prevent="handleSubmit">
                <!-- Basic info -->
                <fieldset class="fieldset">
                    <legend class="fieldset__legend">Basic information</legend>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Job title *</label>
                            <input
                                v-model="form.title"
                                class="form-input"
                                required
                                placeholder="e.g. Senior Frontend Engineer"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Category *</label>
                            <select
                                v-model="form.category"
                                class="form-input"
                                required
                            >
                                <option value="">Select category</option>
                                <option value="programming">Programming</option>
                                <option value="design">Design</option>
                                <option value="management">Management</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Sales</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Description *</label>
                        <textarea
                            v-model="form.description"
                            class="form-input form-textarea"
                            rows="5"
                            required
                            placeholder="Describe the role…"
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Responsibilities</label>
                        <div
                            v-for="(item, i) in form.responsibilities"
                            :key="i"
                            class="list-input-row"
                        >
                            <input
                                v-model="form.responsibilities[i]"
                                class="form-input"
                                placeholder="Responsibility…"
                            />
                            <button
                                type="button"
                                class="btn-remove"
                                @click="form.responsibilities.splice(i, 1)"
                            >
                                ✕
                            </button>
                        </div>
                        <button
                            type="button"
                            class="btn-add"
                            @click="form.responsibilities.push('')"
                        >
                            + Add
                        </button>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Requirements</label>
                        <div
                            v-for="(item, i) in form.requirements"
                            :key="i"
                            class="list-input-row"
                        >
                            <input
                                v-model="form.requirements[i]"
                                class="form-input"
                                placeholder="Requirement…"
                            />
                            <button
                                type="button"
                                class="btn-remove"
                                @click="form.requirements.splice(i, 1)"
                            >
                                ✕
                            </button>
                        </div>
                        <button
                            type="button"
                            class="btn-add"
                            @click="form.requirements.push('')"
                        >
                            + Add
                        </button>
                    </div>
                </fieldset>

                <!-- Skills -->
                <fieldset class="fieldset">
                    <legend class="fieldset__legend">
                        Skills & technologies
                    </legend>
                    <div class="skills-input">
                        <div class="skills-chips">
                            <span
                                v-for="(s, i) in form.skills"
                                :key="s"
                                class="skill-chip"
                            >
                                {{ s }}
                                <button
                                    type="button"
                                    @click="form.skills.splice(i, 1)"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                        <div class="list-input-row">
                            <input
                                v-model="skillInput"
                                class="form-input"
                                placeholder="Type a skill and press Enter"
                                @keydown.enter.prevent="addSkill"
                            />
                            <button
                                type="button"
                                class="btn-add"
                                @click="addSkill"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </fieldset>

                <!-- Location & work type -->
                <fieldset class="fieldset">
                    <legend class="fieldset__legend">
                        Location & work type
                    </legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Location *</label>
                            <input
                                v-model="form.location"
                                class="form-input"
                                required
                                placeholder="e.g. San Francisco, CA"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Work type *</label>
                            <select
                                v-model="form.workType"
                                class="form-input"
                                required
                            >
                                <option value="">Select…</option>
                                <option value="remote">Remote</option>
                                <option value="onsite">On-site</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <!-- Compensation -->
                <fieldset class="fieldset">
                    <legend class="fieldset__legend">Compensation</legend>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">
                                Salary min (USD/yr)
                            </label>
                            <input
                                v-model.number="form.salaryMin"
                                class="form-input"
                                type="number"
                                placeholder="e.g. 80000"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                Salary max (USD/yr)
                            </label>
                            <input
                                v-model.number="form.salaryMax"
                                class="form-input"
                                type="number"
                                placeholder="e.g. 120000"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Experience level *</label>
                        <select
                            v-model="form.experienceLevel"
                            class="form-input"
                            required
                        >
                            <option value="">Select…</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-level</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Benefits</label>
                        <div
                            v-for="(b, i) in form.benefits"
                            :key="i"
                            class="list-input-row"
                        >
                            <input
                                v-model="form.benefits[i]"
                                class="form-input"
                                placeholder="e.g. Health insurance"
                            />
                            <button
                                type="button"
                                class="btn-remove"
                                @click="form.benefits.splice(i, 1)"
                            >
                                ✕
                            </button>
                        </div>
                        <button
                            type="button"
                            class="btn-add"
                            @click="form.benefits.push('')"
                        >
                            + Add
                        </button>
                    </div>
                </fieldset>

                <!-- Deadline -->
                <fieldset class="fieldset">
                    <legend class="fieldset__legend">
                        Application deadline
                    </legend>
                    <div class="form-group">
                        <input
                            v-model="form.deadline"
                            class="form-input"
                            type="date"
                        />
                    </div>
                </fieldset>

                <p v-if="jobsStore.error" class="form-error">
                    {{ jobsStore.error }}
                </p>

                <div class="form-actions">
                    <RouterLink to="/employer/dashboard" class="btn-ghost">
                        Cancel
                    </RouterLink>
                    <button
                        type="submit"
                        class="btn-primary"
                        :disabled="jobsStore.loading"
                    >
                        {{
                            jobsStore.loading
                                ? 'Saving…'
                                : isEditing
                                ? 'Save changes'
                                : 'Submit for review'
                        }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const jobsStore = useJobsStore();

const isEditing = computed(() => !!route.params.id);
const skillInput = ref('');

const form = reactive({
    title: '',
    description: '',
    category: '',
    location: '',
    workType: '',
    experienceLevel: '',
    salaryMin: null,
    salaryMax: null,
    skills: [],
    responsibilities: [''],
    requirements: [''],
    benefits: [''],
    deadline: '',
});

function addSkill() {
    const s = skillInput.value.trim();
    if (s && !form.skills.includes(s)) form.skills.push(s);
    skillInput.value = '';
}

async function handleSubmit() {
    const clean = {
        ...form,
        responsibilities: form.responsibilities.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
        benefits: form.benefits.filter(Boolean),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    };

    if (isEditing.value) {
        const ok = await jobsStore.updateJob(Number(route.params.id), clean);
        if (ok) router.push('/employer/dashboard');
    } else {
        const job = await jobsStore.postJob(clean, authStore.currentUser.id);
        if (job) router.push('/employer/dashboard');
    }
}

onMounted(async () => {
    if (isEditing.value) {
        await jobsStore.fetchJob(route.params.id);
        const job = jobsStore.currentJob;
        if (job)
            Object.assign(form, {
                ...job,
                deadline: job.deadline?.slice(0, 10) || '',
            });
    }
});
</script>

<style scoped>
.post-job-page {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 16px;
}
.post-job-card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 32px;
}
.post-job__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0 0 28px;
}
.post-job-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.fieldset {
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-md);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.fieldset__legend {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    padding: 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}
@media (max-width: 600px) {
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
.form-textarea {
    resize: vertical;
    min-height: 100px;
}
.list-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
}
.btn-remove {
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    font-size: 14px;
    flex-shrink: 0;
}
.btn-add {
    font-size: 12px;
    color: #534ab7;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 0;
    text-align: left;
}
.skills-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.skills-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.skill-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    background: #eeedfe;
    color: #534ab7;
    padding: 4px 10px;
    border-radius: 99px;
}
.skill-chip button {
    background: none;
    border: none;
    color: #534ab7;
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    line-height: 1;
}
.form-error {
    color: var(--color-text-danger);
    font-size: 13px;
    margin: 0;
}
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
}
.btn-primary {
    padding: 10px 24px;
    background: #e8246a;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
}
.btn-primary:disabled {
    opacity: 0.5;
    cursor: default;
}
.btn-ghost {
    padding: 10px 24px;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    font-size: 14px;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    text-decoration: none;
}
</style>
