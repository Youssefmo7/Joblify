<template>
    <div class="text-gray-800 font-sans min-h-screen flex flex-col" style="background-color: #f4f5f7">
        <!-- Navbar -->
        <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/employer/dashboard" class="text-2xl font-bold tracking-tight text-gray-900 border-r border-gray-200 pr-4 mr-4">Joblify</router-link>
                        <span class="text-lg font-semibold text-gray-600">{{ isEdit ? 'Edit Job' : 'Post a New Job' }}</span>
                    </div>
                    <div class="flex items-center">
                        <router-link to="/employer/dashboard" class="text-sm text-gray-600 hover:text-gray-900 font-medium mr-4">Cancel</router-link>
                        <button 
                            v-if="currentStep === 3" 
                            class="bg-[#fd366e] hover:bg-pink-600 text-white text-sm font-medium py-2 px-5 rounded-lg disabled:opacity-50 transition-colors"
                            @click="publishJob"
                            :disabled="jobsStore.loading"
                        >
                            {{ jobsStore.loading ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Update Job' : 'Publish Job') }}
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
            <div class="w-full max-w-5xl">
            <!-- Progress Steps -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors" :class="stepCircleClass(1)">
                        {{ currentStep > 1 ? '✓' : '1' }}
                    </div>
                    <span class="ml-2 text-sm font-medium transition-colors" :class="stepTextClass(1)">Job Details</span>
                </div>
                <div class="flex-1 mx-4 h-px bg-gray-300"></div>
                <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors" :class="stepCircleClass(2)">
                        {{ currentStep > 2 ? '✓' : '2' }}
                    </div>
                    <span class="ml-2 text-sm font-medium transition-colors" :class="stepTextClass(2)">Requirements</span>
                </div>
                <div class="flex-1 mx-4 h-px bg-gray-300"></div>
                <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors" :class="stepCircleClass(3)">3</div>
                    <span class="ml-2 text-sm font-medium transition-colors" :class="stepTextClass(3)">Preview</span>
                </div>
            </div>

            <form @submit.prevent class="space-y-6">
                <!-- Step 1: Job Details -->
                <div v-show="currentStep === 1" id="step1" class="space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Job Title <span class="text-red-500">*</span></label>
                                <input 
                                    v-model="form.title" 
                                    type="text" 
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors"
                                    :class="touched.title && errors.title ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    @blur="validateField('title')"
                                >
                                <p v-if="touched.title && errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Job Description <span class="text-red-500">*</span></label>
                                <textarea 
                                    v-model="form.description" 
                                    rows="6" 
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] resize-none transition-colors"
                                    :class="touched.description && errors.description ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                                    @blur="validateField('description')"
                                ></textarea>
                                <p v-if="touched.description && errors.description" class="text-xs text-red-500 mt-1">{{ errors.description }}</p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select 
                                        v-model="form.category" 
                                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] bg-white transition-colors"
                                        :class="touched.category && errors.category ? 'border-red-500' : 'border-gray-300'"
                                        @blur="validateField('category')"
                                    >
                                        <option value="">Select a category</option>
                                        <option v-for="cat in categoriesStore.categories" :key="cat.id" :value="cat.id">
                                            {{ cat.name }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Location <span class="text-red-500">*</span></label>
                                    <input 
                                        v-model="form.location" 
                                        type="text" 
                                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors"
                                        :class="touched.location && errors.location ? 'border-red-500' : 'border-gray-300'"
                                        placeholder="e.g. Mountain View, CA"
                                        @blur="validateField('location')"
                                    >
                                    <p v-if="touched.location && errors.location" class="text-xs text-red-500 mt-1">{{ errors.location }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Work Type &amp; Deadline</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Work Type <span class="text-red-500">*</span></label>
                                <div class="flex gap-3">
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" v-model="form.workType" value="remote" class="sr-only peer">
                                        <div class="peer-checked:ring-2 peer-checked:ring-[#fd366e] peer-checked:border-[#fd366e] border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                                            <p class="text-sm font-semibold text-gray-900">Remote</p>
                                            <p class="text-xs text-gray-500 mt-1">Work from anywhere</p>
                                        </div>
                                    </label>
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" v-model="form.workType" value="onsite" class="sr-only peer">
                                        <div class="peer-checked:ring-2 peer-checked:ring-[#fd366e] peer-checked:border-[#fd366e] border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                                            <p class="text-sm font-semibold text-gray-900">On-site</p>
                                            <p class="text-xs text-gray-500 mt-1">Office based</p>
                                        </div>
                                    </label>
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" v-model="form.workType" value="hybrid" class="sr-only peer">
                                        <div class="peer-checked:ring-2 peer-checked:ring-[#fd366e] peer-checked:border-[#fd366e] border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                                            <p class="text-sm font-semibold text-gray-900">Hybrid</p>
                                            <p class="text-xs text-gray-500 mt-1">Mix of both</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Application Deadline <span class="text-red-500">*</span></label>
                                    <input 
                                        v-model="form.deadline" 
                                        type="date" 
                                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors"
                                        :class="touched.deadline && errors.deadline ? 'border-red-500' : 'border-gray-300'"
                                        @blur="validateField('deadline')"
                                    >
                                    <p v-if="touched.deadline && errors.deadline" class="text-xs text-red-500 mt-1">{{ errors.deadline }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                    <select v-model="form.experienceLevel" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] bg-white transition-colors">
                                        <option value="entry">Entry Level</option>
                                        <option value="mid">Mid Level</option>
                                        <option value="senior">Senior Level</option>
                                        <option value="lead">Lead / Principal</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4">
                        <button type="button" @click="nextStep(2)" class="px-8 py-2.5 bg-[#fd366e] hover:bg-pink-600 hover:scale-[1.02] active:scale-95 text-white font-medium rounded-lg text-sm transition-all shadow-sm">Next: Requirements</button>
                    </div>
                </div>

                <!-- Step 2: Requirements & Overview -->
                <div v-show="currentStep === 2" id="step2" class="space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Requirements &amp; Benefits</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                <textarea 
                                    v-model="form.requirementsText" 
                                    rows="4" 
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] resize-none transition-colors"
                                    :class="touched.requirements && errors.requirements ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="List the job requirements..."
                                    @blur="validateField('requirements')"
                                ></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                                <textarea v-model="form.benefitsText" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] resize-none transition-colors" placeholder="List the benefits offered..."></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                <div class="space-y-3">
                                    <div class="relative">
                                        <input 
                                            v-model="skillSearch" 
                                            type="text" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors" 
                                            placeholder="Search skills (e.g. Vue.js)..."
                                            @input="skillsStore.suggestSkills(skillSearch)"
                                        >
                                        <div v-if="skillsStore.suggestions.length && skillSearch.length >= 2" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            <button 
                                                v-for="skill in filteredSuggestions" 
                                                :key="skill.id"
                                                type="button"
                                                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-100"
                                                @click="addSkill(skill)"
                                            >
                                                {{ skill.name }}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- Selected Skills Pills -->
                                    <div class="flex flex-wrap gap-2">
                                        <div 
                                            v-for="skill in form.selectedSkills" 
                                            :key="skill.id"
                                            class="flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-[#fd366e] border border-pink-100 rounded-full text-xs font-medium"
                                        >
                                            {{ skill.name }}
                                            <button @click="removeSkill(skill.id)" class="hover:text-pink-800 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Salary Range <span class="text-gray-400 text-xs">(in EGP)</span></label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <input 
                                            v-model.number="form.salaryMin" 
                                            type="number" 
                                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors"
                                            :class="touched.salaryMin && errors.salaryMin ? 'border-red-500' : 'border-gray-300'"
                                            placeholder="Min (e.g. 50000)"
                                            @blur="validateField('salaryMin')"
                                        >
                                        <p v-if="touched.salaryMin && errors.salaryMin" class="text-xs text-red-500 mt-1">{{ errors.salaryMin }}</p>
                                    </div>
                                    <div>
                                        <input 
                                            v-model.number="form.salaryMax" 
                                            type="number" 
                                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors"
                                            :class="touched.salaryMax && errors.salaryMax ? 'border-red-500' : 'border-gray-300'"
                                            placeholder="Max (e.g. 80000)"
                                            @blur="validateField('salaryMax')"
                                        >
                                        <p v-if="touched.salaryMax && errors.salaryMax" class="text-xs text-red-500 mt-1">{{ errors.salaryMax }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between pt-4">
                        <button type="button" @click="prevStep(1)" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors">Back</button>
                        <button type="button" @click="nextStep(3)" class="px-8 py-2.5 bg-[#fd366e] hover:bg-pink-600 hover:scale-[1.02] active:scale-95 text-white font-medium rounded-lg text-sm transition-all shadow-sm">Next: Finalize</button>
                    </div>
                </div>

                <!-- Step 3: Branding & Preview -->
                <div v-show="currentStep === 3" id="step3" class="space-y-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h2 class="text-lg font-bold text-blue-900 mb-2">Review Summary</h2>
                        <p class="text-sm text-blue-700 mb-4">Please review your job posting details before publishing. You can still go back to make changes.</p>
                        <div class="space-y-2 text-sm text-blue-900">
                            <p><strong>Title:</strong> {{ form.title || '-' }}</p>
                            <p><strong>Location:</strong> {{ form.location || '-' }}</p>
                            <p><strong>Work Type:</strong> {{ form.workType }}</p>
                            <p><strong>Experience:</strong> {{ form.experienceLevel }}</p>
                        </div>
                    </div>

                        <div class="flex flex-col items-end gap-2 pt-4">
                            <div class="flex justify-between w-full">
                                <button type="button" @click="prevStep(2)" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors">Back</button>
                                <button 
                                    type="button" 
                                    class="px-8 py-2.5 bg-[#fd366e] hover:bg-pink-600 hover:scale-[1.02] active:scale-95 text-white font-medium rounded-lg text-sm transition-all shadow-sm disabled:opacity-50"
                                    @click="publishJob"
                                    :disabled="jobsStore.loading"
                                >
                                    {{ jobsStore.loading ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Update Job' : 'Publish Job') }}
                                </button>
                            </div>
                            <div v-if="submissionError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg w-full">
                                <p class="text-sm text-red-600 font-bold mb-1">{{ submissionError }}</p>
                                <ul v-if="Object.keys(jobsStore.validationErrors).length" class="list-disc list-inside">
                                    <li v-for="(errs, field) in jobsStore.validationErrors" :key="field" class="text-xs text-red-500">
                                        {{ errs[0] }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useSkillsStore } from '@/stores/skillsStore';
import { useCompanyStore } from '@/stores/companyStore';

const props = defineProps({
    jobId: {
        type: [String, Number],
        default: null
    }
});

const router = useRouter();
const authStore = useAuthStore();
const jobsStore = useJobsStore();
const categoriesStore = useCategoriesStore();
const skillsStore = useSkillsStore();
const companyStore = useCompanyStore();

const currentStep = ref(1);
const submissionError = ref('');

const isEdit = computed(() => !!props.jobId);

const form = reactive({
    title: '',
    description: '',
    category: '',
    location: '',
    workType: 'remote',
    deadline: '',
    experienceLevel: 'senior',
    requirementsText: '',
    benefitsText: '',
    selectedSkills: [], // Array of {id, name}
    salaryMin: null,
    salaryMax: null,
});

const skillSearch = ref('');
const filteredSuggestions = computed(() => {
    return skillsStore.suggestions.filter(s => !form.selectedSkills.some(ss => ss.id === s.id));
});

function addSkill(skill) {
    form.selectedSkills.push(skill);
    skillSearch.value = '';
    skillsStore.suggestions = [];
}

function removeSkill(id) {
    form.selectedSkills = form.selectedSkills.filter(s => s.id !== id);
}

const touched = reactive({
    title: false,
    description: false,
    category: false,
    location: false,
    deadline: false,
    requirements: false,
    salaryMin: false,
    salaryMax: false,
});

const errors = computed(() => {
    const errs = {};
    
    // Title
    if (!form.title?.trim()) {
        errs.title = 'Please enter a job title.';
    } else if (form.title.length > 255) {
        errs.title = 'Please enter a valid job title.';
    }
    
    // Description
    if (!form.description?.trim()) {
        errs.description = 'Please enter a job description.';
    }
    
    // Location
    if (!form.location?.trim()) {
        errs.location = 'Please enter a job location.';
    }
    
    // Deadline (Required per user request, after_or_equal:today per Laravel)
    if (!form.deadline) {
        errs.deadline = 'The deadline must be a valid date.';
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(form.deadline);
        if (isNaN(deadlineDate.getTime())) {
            errs.deadline = 'The deadline must be a valid date.';
        } else if (deadlineDate < today) {
            errs.deadline = 'The deadline must be a date after or equal to today.';
        }
    }

    // Salary Min/Max (Numeric per Laravel)
    if (form.salaryMin !== null && form.salaryMin !== '' && (isNaN(form.salaryMin) || form.salaryMin <= 0)) {
        errs.salaryMin = 'Please enter a valid minimum salary.';
    }
    if (form.salaryMax !== null && form.salaryMax !== '' && (isNaN(form.salaryMax) || form.salaryMax <= 0)) {
        errs.salaryMax = 'Please enter a valid maximum salary.';
    }
    if(form.salaryMin && form.salaryMax && Number(form.salaryMin) >= Number(form.salaryMax)){
        errs.salaryMax = 'The maximum salary must be greater than the minimum salary.';
    }
    
    // Categories and Requirements are nullable in Laravel, so no error flags needed unless specifically requested.
    
    return errs;
});

function validateField(field) {
    touched[field] = true;
}

function validateStep1() {
    touched.title = true;
    touched.description = true;
    touched.location = true;
    touched.deadline = true;
    
    return !(errors.value.title || errors.value.description || errors.value.location || errors.value.deadline);
}

function validateStep2() {
    touched.salaryMin = true;
    touched.salaryMax = true;
    return !(errors.value.salaryMin || errors.value.salaryMax);
}

function nextStep(step) {
    if (currentStep.value === 1 && !validateStep1()) return;
    if (currentStep.value === 2 && !validateStep2()) return;
    
    currentStep.value = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    currentStep.value = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function stepCircleClass(step) {
    if (step < currentStep.value) return 'bg-green-500 text-white';
    if (step === currentStep.value) return 'bg-[#fd366e] text-white';
    return 'bg-gray-200 text-gray-500';
}

function stepTextClass(step) {
    return step <= currentStep.value ? 'text-gray-900' : 'text-gray-500';
}

async function publishJob() {
    if (!validateStep1() || !validateStep2()) {
        if (!validateStep1()) {
            currentStep.value = 1;
        } else {
            currentStep.value = 2;
        }
        return;
    }

    const employer = authStore.currentUser;
    if (!employer) {
        alert('Please log in first');
        return;
    }

    const jobData = {
        title: form.title.trim(),
        description: form.description.trim(),
        requirements: form.requirementsText.trim(),
        benefits: form.benefitsText.trim(),
        salary_min: form.salaryMin,
        salary_max: form.salaryMax,
        location: form.location.trim(),
        work_type: form.workType,
        experience_level: form.experienceLevel,
        deadline: form.deadline,
        category_id: form.category ? Number(form.category) : null,
        skills: form.selectedSkills.map(s => s.id),
        company_id: companyStore.company?.id || employer.company_id || 1,
    };

    submissionError.value = '';
    const result = isEdit.value 
        ? await jobsStore.updateJob(props.jobId, jobData)
        : await jobsStore.postJob(jobData);

    if (result) {
        router.push('/employer/dashboard');
    } else {
        submissionError.value = jobsStore.error || `Failed to ${isEdit.value ? 'update' : 'publish'} job. Please check your data.`;
    }
}

onMounted(async () => {
    categoriesStore.fetchCategories();
    skillsStore.fetchSkills();
    companyStore.fetchCompany();

    if (isEdit.value) {
        const job = await jobsStore.fetchJob(props.jobId);
        if (job) {
            form.title = job.title;
            // Handle description which might contain requirements if it was combined before
            // but the API now has them separate.
            form.description = job._raw.description || '';
            form.location = job.location;
            form.workType = job.workType;
            form.experienceLevel = job.experienceLevel;
            form.deadline = job._raw.deadline ? job._raw.deadline.split('T')[0] : '';
            form.salaryMin = job.salaryMin;
            form.salaryMax = job.salaryMax;
            form.category = job._raw.categories?.[0]?.id || '';
            form.requirementsText = job._raw.requirements || '';
            form.benefitsText = job._raw.benefits || '';
            form.selectedSkills = (job._raw.skills || []).map(s => ({ id: s.id, name: s.name }));
        }
    }
});
</script>

<style scoped>
.peer:checked ~ div {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
</style>