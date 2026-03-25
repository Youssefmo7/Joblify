<template>
    <div class="text-gray-800 font-sans min-h-screen" style="background-color: #f4f5f7">
        <!-- Top Bar -->
        <nav class="bg-white border-b sticky top-0 z-50" style="border-color: #e8ecf1">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/" class="text-2xl font-bold tracking-tight text-gray-900 border-r pr-4 mr-4" style="border-color: #e8ecf1">Joblify</router-link>
                        <span class="text-lg font-semibold text-gray-600">Post a New Job</span>
                    </div>
                    <div class="flex items-center">
                        <router-link to="/employers" class="text-sm text-gray-600 hover:text-gray-900 font-medium mr-4">Cancel</router-link>
                        <button
                            v-if="currentStep === 3"
                            class="text-white text-sm font-medium py-2 px-5 rounded-lg"
                            style="background-color: #fd366e"
                            @click="publishJob"
                        >
                            Publish Job
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Progress Steps -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <div
                        class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                        :class="stepCircleClass(1)"
                    >
                        {{ currentStep > 1 ? '✓' : '1' }}
                    </div>
                    <span class="ml-2 text-sm font-medium" :class="stepTextClass(1)">Job Details</span>
                </div>
                <div class="flex-1 mx-4 h-px bg-gray-300"></div>
                <div class="flex items-center">
                    <div
                        class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                        :class="stepCircleClass(2)"
                    >
                        {{ currentStep > 2 ? '✓' : '2' }}
                    </div>
                    <span class="ml-2 text-sm font-medium" :class="stepTextClass(2)">Requirements</span>
                </div>
                <div class="flex-1 mx-4 h-px bg-gray-300"></div>
                <div class="flex items-center">
                    <div
                        class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                        :class="stepCircleClass(3)"
                    >
                        3
                    </div>
                    <span class="ml-2 text-sm font-medium" :class="stepTextClass(3)">Preview</span>
                </div>
            </div>

            <!-- STEP 1: Job Details -->
            <div v-show="currentStep === 1" class="space-y-6">
                <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Job Title <span class="text-red-500">*</span></label>
                            <input
                                v-model="form.title"
                                type="text"
                                class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors"
                                :class="errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                                placeholder="e.g. Senior Frontend Engineer"
                                @blur="validateField('title')"
                            />
                            <p v-if="errors.title" class="text-xs text-red-500 mt-1">Job title is required</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Job Description <span class="text-red-500">*</span></label>
                            <textarea
                                v-model="form.description"
                                rows="6"
                                class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none transition-colors"
                                :class="errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                                placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                                @blur="validateField('description')"
                            ></textarea>
                            <p v-if="errors.description" class="text-xs text-red-500 mt-1">Description is required</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Category <span class="text-red-500">*</span></label>
                                <select
                                    v-model="form.category"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 bg-white transition-colors"
                                    :class="errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300'"
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
                                <p v-if="errors.category" class="text-xs text-red-500 mt-1">Category is required</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Location <span class="text-red-500">*</span></label>
                                <input
                                    v-model="form.location"
                                    type="text"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors"
                                    :class="errors.location ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                                    placeholder="e.g. Mountain View, CA"
                                    @blur="validateField('location')"
                                />
                                <p v-if="errors.location" class="text-xs text-red-500 mt-1">Location is required</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Work Type &amp; Deadline</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Work Type <span class="text-red-500">*</span></label>
                            <div class="flex gap-3">
                                <label v-for="wt in workTypes" :key="wt.value" class="flex-1 cursor-pointer">
                                    <input type="radio" v-model="form.workType" :value="wt.value" class="sr-only peer" />
                                    <div class="peer-checked:ring-2 peer-checked:border-pink-500 border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50"
                                         :style="form.workType === wt.value ? 'ring-color: #fd366e; border-color: #fd366e' : ''">
                                        <p class="text-sm font-semibold text-gray-900">{{ wt.label }}</p>
                                        <p class="text-xs text-gray-500 mt-1">{{ wt.desc }}</p>
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
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors"
                                    :class="errors.deadline ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                                    @blur="validateField('deadline')"
                                />
                                <p v-if="errors.deadline" class="text-xs text-red-500 mt-1">Deadline is required</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                <select v-model="form.experienceLevel" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 bg-white">
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
                    <button type="button" @click="goToStep(2)" class="btn-primary px-8 py-2.5 text-white font-medium rounded-lg text-sm transition-all">
                        Next: Requirements
                    </button>
                </div>
            </div>

            <!-- STEP 2: Requirements & Benefits -->
            <div v-show="currentStep === 2" class="space-y-6">
                <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Requirements &amp; Benefits</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Requirements <span class="text-red-500">*</span></label>
                            <textarea
                                v-model="form.requirements"
                                rows="4"
                                class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none transition-colors"
                                :class="errors.requirements ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                                placeholder="List the job requirements (one per line)..."
                                @blur="validateField('requirements')"
                            ></textarea>
                            <p v-if="errors.requirements" class="text-xs text-red-500 mt-1">Please list at least one requirement</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                            <textarea
                                v-model="form.benefits"
                                rows="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                                placeholder="List the benefits offered (one per line)..."
                            ></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                            <input
                                v-model="form.techStack"
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1"
                                placeholder="e.g. Vue.js, TypeScript, GraphQL (comma-separated)"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                            <div class="grid grid-cols-2 gap-4">
                                <input v-model="form.salaryMin" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1" placeholder="Min (e.g. 140000)" />
                                <input v-model="form.salaryMax" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1" placeholder="Max (e.g. 200000)" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between pt-4">
                    <button type="button" @click="goToStep(1)" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50">Back</button>
                    <button type="button" @click="goToStep(3)" class="btn-primary px-8 py-2.5 text-white font-medium rounded-lg text-sm transition-all">Next: Finalize</button>
                </div>
            </div>

            <!-- STEP 3: Preview & Branding -->
            <div v-show="currentStep === 3" class="space-y-6">
                <div class="bg-white rounded-xl border p-6" style="border-color: #e8ecf1">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Company Branding</h2>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                        <div class="flex items-center space-x-4">
                            <div class="h-16 w-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                <img v-if="logoPreview" :src="logoPreview" class="h-full w-full object-cover" />
                                <svg v-else class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <button type="button" @click="$refs.logoInput.click()" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Upload Logo</button>
                                <input ref="logoInput" type="file" class="hidden" accept="image/*" @change="handleLogoUpload" />
                                <p class="text-xs text-gray-500 mt-1">PNG, JPG or SVG. Max 2MB.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h2 class="text-lg font-bold text-blue-900 mb-2">Review Summary</h2>
                    <p class="text-sm text-blue-700 mb-4">Please review your job posting details before publishing.</p>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between"><span class="text-gray-500">Title</span><span class="font-medium text-gray-900">{{ form.title || '-' }}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Category</span><span class="font-medium text-gray-900">{{ form.category || '-' }}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Location</span><span class="font-medium text-gray-900">{{ form.location || '-' }}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Work Type</span><span class="font-medium text-gray-900">{{ form.workType }}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Deadline</span><span class="font-medium text-gray-900">{{ form.deadline || '-' }}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Experience</span><span class="font-medium text-gray-900">{{ form.experienceLevel }}</span></div>
                        <div v-if="form.techStack" class="flex justify-between"><span class="text-gray-500">Tech Stack</span><span class="font-medium text-gray-900">{{ form.techStack }}</span></div>
                        <div v-if="form.salaryMin || form.salaryMax" class="flex justify-between">
                            <span class="text-gray-500">Salary</span>
                            <span class="font-medium text-gray-900">${{ form.salaryMin || 0 }}k – ${{ form.salaryMax || 0 }}k / yr</span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between pt-4">
                    <button type="button" @click="goToStep(2)" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50">Back</button>
                    <button type="button" @click="publishJob" class="btn-primary px-8 py-2.5 text-white font-medium rounded-lg text-sm transition-all">Publish Job</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/store';

export default {
    name: 'CreateJob',

    data() {
        return {
            currentStep: 1,
            logoPreview: null,
            form: {
                title: '',
                description: '',
                category: '',
                location: '',
                workType: 'Remote',
                deadline: '',
                experienceLevel: 'Senior Level',
                requirements: '',
                benefits: '',
                techStack: '',
                salaryMin: '',
                salaryMax: '',
            },
            errors: {
                title: false,
                description: false,
                category: false,
                location: false,
                deadline: false,
                requirements: false,
            },
            workTypes: [
                { value: 'Remote', label: 'Remote', desc: 'Work from anywhere' },
                { value: 'On-site', label: 'On-site', desc: 'Office based' },
                { value: 'Hybrid', label: 'Hybrid', desc: 'Mix of both' },
            ],
        };
    },

    methods: {
        validateField(field) {
            if (field === 'requirements') {
                this.errors.requirements = !this.form.requirements.trim();
            } else {
                this.errors[field] = !this.form[field] || (typeof this.form[field] === 'string' && !this.form[field].trim());
            }
        },

        validateStep1() {
            this.errors.title = !this.form.title.trim();
            this.errors.description = !this.form.description.trim();
            this.errors.category = !this.form.category;
            this.errors.location = !this.form.location.trim();
            this.errors.deadline = !this.form.deadline;
            return !(this.errors.title || this.errors.description || this.errors.category || this.errors.location || this.errors.deadline);
        },

        validateStep2() {
            this.errors.requirements = !this.form.requirements.trim();
            return !this.errors.requirements;
        },

        goToStep(step) {
            if (step > this.currentStep) {
                if (this.currentStep === 1 && !this.validateStep1()) return;
                if (this.currentStep === 2 && !this.validateStep2()) return;
            }
            this.currentStep = step;
            window.scrollTo(0, 0);
        },

        stepCircleClass(step) {
            if (step < this.currentStep) return 'step-done';
            if (step === this.currentStep) return 'step-active';
            return 'step-inactive';
        },

        stepTextClass(step) {
            return step <= this.currentStep ? 'text-gray-900' : 'text-gray-500';
        },

        handleLogoUpload(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    this.logoPreview = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        publishJob() {
            const store = useAppStore();
            const jobData = {
                title: this.form.title,
                description: this.form.description,
                category: this.form.category,
                location: this.form.location,
                workType: this.form.workType,
                deadline: this.form.deadline,
                experienceLevel: this.form.experienceLevel,
                techStack: this.form.techStack.split(',').map(s => s.trim()).filter(s => s),
                salary: `$${this.form.salaryMin || 0}k – $${this.form.salaryMax || 0}k / yr`,
                requirements: this.form.requirements.split('\n').filter(r => r.trim()),
                benefits: this.form.benefits.split('\n').filter(b => b.trim()),
                company: store.currentUser.name,
                companyInitial: store.currentUser.name.charAt(0),
                companyBg: this.logoPreview ? '' : 'bg-gray-100',
                companyText: this.logoPreview ? '' : 'text-gray-600',
                logo: this.logoPreview || '',
                salaryBadgeClass: 'bg-green-100 text-green-800',
            };
            store.addJob(jobData);
            this.$router.push('/employers');
        },
    },
};
</script>

<style scoped>
.step-active {
    background-color: #fd366e;
    color: #fff;
}
.step-done {
    background-color: #16a34a;
    color: #fff;
}
.step-inactive {
    background-color: #e5e7eb;
    color: #6b7280;
}
input:focus, textarea:focus, select:focus {
    --tw-ring-color: #fd366e;
    border-color: #fd366e;
}
input[type="radio"]:checked ~ div {
    box-shadow: 0 0 0 2px #fd366e;
    border-color: #fd366e;
}
.btn-primary {
    background-color: #fd366e;
}
.btn-primary:hover {
    background-color: #e02d5f;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.btn-primary:active {
    transform: translateY(0);
}
</style>
