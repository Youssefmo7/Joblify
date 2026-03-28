<template>
    <div class="text-gray-800 font-sans min-h-screen flex flex-col" style="background-color: #f4f5f7">
        <!-- Navbar -->
        <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/employer/dashboard" class="text-2xl font-bold tracking-tight text-gray-900 border-r border-gray-200 pr-4 mr-4">Joblify</router-link>
                        <span class="text-lg font-semibold text-gray-600">Post a New Job</span>
                    </div>
                    <div class="flex items-center">
                        <router-link to="/employer/dashboard" class="text-sm text-gray-600 hover:text-gray-900 font-medium mr-4">Cancel</router-link>
                        <button 
                            v-if="currentStep === 3" 
                            class="bg-[#fd366e] hover:bg-pink-600 text-white text-sm font-medium py-2 px-5 rounded-lg disabled:opacity-50 transition-colors"
                            @click="publishJob"
                            :disabled="jobsStore.loading"
                        >
                            {{ jobsStore.loading ? 'Publishing...' : 'Publish Job' }}
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
                                <p v-if="touched.title && errors.title" class="text-xs text-red-500 mt-1">Job title is required</p>
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
                                <p v-if="touched.description && errors.description" class="text-xs text-red-500 mt-1">Description is required</p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Category <span class="text-red-500">*</span></label>
                                    <select 
                                        v-model="form.category" 
                                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] bg-white transition-colors"
                                        :class="touched.category && errors.category ? 'border-red-500' : 'border-gray-300'"
                                        @blur="validateField('category')"
                                    >
                                        <option value="">Select a category</option>
                                        <option>Programming</option>
                                        <option>Design</option>
                                        <option>Management</option>
                                        <option>Marketing</option>
                                        <option>Sales</option>
                                        <option>Other</option>
                                    </select>
                                    <p v-if="touched.category && errors.category" class="text-xs text-red-500 mt-1">Category is required</p>
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
                                    <p v-if="touched.location && errors.location" class="text-xs text-red-500 mt-1">Location is required</p>
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
                                        <input type="radio" v-model="form.workType" value="Remote" class="sr-only peer">
                                        <div class="peer-checked:ring-2 peer-checked:ring-[#fd366e] peer-checked:border-[#fd366e] border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                                            <p class="text-sm font-semibold text-gray-900">Remote</p>
                                            <p class="text-xs text-gray-500 mt-1">Work from anywhere</p>
                                        </div>
                                    </label>
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" v-model="form.workType" value="On-site" class="sr-only peer">
                                        <div class="peer-checked:ring-2 peer-checked:ring-[#fd366e] peer-checked:border-[#fd366e] border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                                            <p class="text-sm font-semibold text-gray-900">On-site</p>
                                            <p class="text-xs text-gray-500 mt-1">Office based</p>
                                        </div>
                                    </label>
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" v-model="form.workType" value="Hybrid" class="sr-only peer">
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
                                    <p v-if="touched.deadline && errors.deadline" class="text-xs text-red-500 mt-1">Deadline is required</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                    <select v-model="form.experienceLevel" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] bg-white transition-colors">
                                        <option>Entry Level</option>
                                        <option>Mid Level</option>
                                        <option>Senior Level</option>
                                        <option>Director</option>
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
                                <label class="block text-sm font-medium text-gray-700 mb-1">Requirements <span class="text-red-500">*</span></label>
                                <textarea 
                                    v-model="form.requirementsText" 
                                    rows="4" 
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] resize-none transition-colors"
                                    :class="touched.requirements && errors.requirements ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="List the job requirements (one per line)..."
                                    @blur="validateField('requirements')"
                                ></textarea>
                                <p v-if="touched.requirements && errors.requirements" class="text-xs text-red-500 mt-1">Please list at least one requirement</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                                <textarea v-model="form.benefitsText" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] resize-none transition-colors" placeholder="List the benefits offered (one per line)..."></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                                <input v-model="form.techStack" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors" placeholder="e.g. Vue.js, TypeScript, GraphQL (comma-separated)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <input v-model.number="form.salaryMin" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors" placeholder="Min (e.g. 140000)">
                                    <input v-model.number="form.salaryMax" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fd366e] focus:border-[#fd366e] transition-colors" placeholder="Max (e.g. 200000)">
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
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 class="text-lg font-bold text-gray-900 mb-4">Company Branding</h2>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                            <div class="flex items-center space-x-4">
                                <div class="h-16 w-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    <img v-if="logoPreview" :src="logoPreview" class="h-full w-full object-cover">
                                    <img v-else-if="authStore.currentUser?.companyLogo" :src="authStore.currentUser.companyLogo" class="h-full w-full object-cover">
                                    <svg v-else class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <button type="button" @click="$refs.logoInput.click()" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none">Upload Logo</button>
                                    <input type="file" ref="logoInput" class="hidden" accept="image/*" @change="handleLogoChange">
                                    <p class="text-xs text-gray-500 mt-1">PNG, JPG or SVG. Max 2MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h2 class="text-lg font-bold text-blue-900 mb-2">Review Summary</h2>
                        <p class="text-sm text-blue-700 mb-4">Please review your job posting details before publishing. You can still go back to make changes.</p>
                        <div class="space-y-2 text-sm text-blue-900">
                            <p><strong>Title:</strong> {{ form.title || '-' }}</p>
                            <p><strong>Location:</strong> {{ form.location || '-' }}</p>
                            <p><strong>Work Type:</strong> {{ form.workType }}</p>
                        </div>
                    </div>

                    <div class="flex justify-between pt-4">
                        <button type="button" @click="prevStep(2)" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors">Back</button>
                        <button 
                            type="button" 
                            class="px-8 py-2.5 bg-[#fd366e] hover:bg-pink-600 hover:scale-[1.02] active:scale-95 text-white font-medium rounded-lg text-sm transition-all shadow-sm disabled:opacity-50"
                            @click="publishJob"
                            :disabled="jobsStore.loading"
                        >
                            {{ jobsStore.loading ? 'Publishing...' : 'Publish Job' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useJobsStore } from '@/stores/jobsStore';

const router = useRouter();
const authStore = useAuthStore();
const jobsStore = useJobsStore();

const currentStep = ref(1);
const logoPreview = ref(null);
const logoFile = ref(null);

const form = reactive({
    title: '',
    description: '',
    category: '',
    location: '',
    workType: 'Remote',
    deadline: '',
    experienceLevel: 'Senior Level',
    requirementsText: '',
    benefitsText: '',
    techStack: '',
    salaryMin: null,
    salaryMax: null,
});

const touched = reactive({
    title: false,
    description: false,
    category: false,
    location: false,
    deadline: false,
    requirements: false,
});

const errors = computed(() => ({
    title: !form.title?.trim(),
    description: !form.description?.trim(),
    category: !form.category,
    location: !form.location?.trim(),
    deadline: !form.deadline,
    requirements: !form.requirementsText?.trim(),
}));

function validateField(field) {
    touched[field] = true;
}

function validateStep1() {
    touched.title = true;
    touched.description = true;
    touched.category = true;
    touched.location = true;
    touched.deadline = true;
    return !(errors.value.title || errors.value.description || errors.value.category || errors.value.location || errors.value.deadline);
}

function validateStep2() {
    touched.requirements = true;
    return !errors.value.requirements;
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

function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) {
        logoFile.value = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
            logoPreview.value = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function publishJob() {
    if (!validateStep1() || !validateStep2()) {
        currentStep.value = 1;
        return;
    }

    const employer = authStore.currentUser;
    if (!employer) {
        alert('Please log in first');
        return;
    }

    const jobData = {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        workType: form.workType,
        deadline: new Date(form.deadline).toISOString(),
        experienceLevel: form.experienceLevel,
        skills: form.techStack.split(',').map(s => s.trim()).filter(s => s),
        salary: `$${form.salaryMin || 0}k – $${form.salaryMax || 0}k / yr`,
        responsibilities: form.description.split('\n').filter(r => r.trim()),
        requirements: form.requirementsText.split('\n').filter(r => r.trim()),
        benefits: form.benefitsText.split('\n').filter(b => b.trim()),
        company: employer.companyName || employer.name,
        companyInitial: (employer.companyName || employer.name).charAt(0),
        companyBg: logoPreview.value ? '' : 'bg-gray-100',
        companyText: logoPreview.value ? '' : 'text-gray-600',
        logo: logoPreview.value || employer.companyLogo || '',
        status: 'pending'
    };

    const result = await jobsStore.postJob(jobData, employer.id);
    if (result) {
        router.push('/employer/dashboard');
    }
}
</script>

<style scoped>
.peer:checked ~ div {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
</style>
