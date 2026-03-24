<template>
    <div
        class="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer"
        style="border-color: #e8ecf1"
        @click="$emit('select', job.id)"
    >
        <div class="flex items-start">
            <!-- logo -->
            <div
                class="h-12 w-12 flex-shrink-0 rounded-lg border flex items-center justify-center mr-4"
                :class="[job.companyBg, job.companyText]"
                style="border-color: #e8ecf1"
            >
                <span class="font-bold text-xl">{{ job.companyInitial }}</span>
            </div>

            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <h3 class="text-base font-bold text-gray-900 truncate">
                        {{ job.title }}
                    </h3>
                    <!-- Save toggle -->
                    <button
                        class="ml-2 flex-shrink-0 text-gray-400 hover:text-pink-500 transition-colors"
                        :style="isSaved ? 'color: #fd366e' : ''"
                        @click.stop="$emit('save', job.id)"
                    >
                        <svg
                            class="h-5 w-5"
                            :fill="isSaved ? 'currentColor' : 'none'"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </button>
                </div>

                <p class="text-sm font-medium text-gray-700">
                    {{ job.company }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                    {{ job.location }} &bull; {{ job.workType }}
                </p>

                <!-- Tags -->
                <div class="mt-3 flex flex-wrap gap-1.5">
                    <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="job.salaryBadgeClass"
                    >
                        {{ job.salary }}
                    </span>
                    <span
                        v-for="tag in job.techStack.slice(0, 2)"
                        :key="tag"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                        {{ tag }}
                    </span>
                </div>

                <!-- Footer -->
                <div
                    class="mt-4 pt-3 border-t flex justify-between items-center"
                    style="border-color: #e8ecf1"
                >
                    <span class="text-xs text-gray-400">
                        {{ job.postedAt }} &bull;
                        {{ job.applicantsCount }} applicants
                    </span>
                    <button
                        class="px-3 py-1.5 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                        style="background-color: #fd366e"
                        @click.stop="$emit('apply', job.id)"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'JobCard',
    props: {
        job: {
            type: Object,
            required: true,
        },
        isSaved: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['select', 'save', 'apply'],
};
</script>
