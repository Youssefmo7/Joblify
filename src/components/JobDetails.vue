<template>
    <div
        class="text-gray-800 font-sans min-h-screen"
        style="background-color: #f4f5f7"
    >
        <!-- Navbar -->
        <nav
            class="bg-white border-b sticky top-0 z-50"
            style="border-color: #e8ecf1"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a
                            href="/"
                            class="text-2xl font-bold tracking-tight text-gray-900 mr-6"
                        >
                            Joblify
                        </a>
                    </div>
                    <div class="flex-1 flex items-center justify-center px-8">
                        <div class="w-full max-w-lg relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                                <svg
                                    class="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                class="block w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 placeholder-gray-500 text-sm focus:outline-none focus:bg-white focus:ring-1"
                                style="border-color: #e8ecf1"
                                placeholder="Search jobs..."
                                type="search"
                            />
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="rounded-full h-8 w-8 overflow-hidden border"
                            style="border-color: #e8ecf1"
                        >
                            <img
                                :src="currentUser.avatar"
                                alt="Profile"
                                class="h-8 w-8 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Toast -->
        <transition name="toast">
            <div
                v-if="toast.show"
                class="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
                :style="{
                    backgroundColor:
                        toast.type === 'success' ? '#16a34a' : '#dc2626',
                }"
            >
                <svg
                    v-if="toast.type === 'success'"
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <svg
                    v-else
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                {{ toast.message }}
            </div>
        </transition>

        <!-- Content -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Breadcrumb -->
            <nav class="text-sm text-gray-500 mb-6">
                <a href="/jobs" class="hover:text-pink-500">Jobs</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900 font-medium">{{ job.title }}</span>
            </nav>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- LEFT col -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Job Info Card -->
                    <div
                        class="bg-white rounded-xl border p-6"
                        style="border-color: #e8ecf1"
                    >
                        <div class="flex items-start mb-6">
                            <div
                                class="h-16 w-16 flex-shrink-0 rounded-lg border flex items-center justify-center mr-5"
                                :class="[job.companyBg, job.companyText]"
                                style="border-color: #e8ecf1"
                            >
                                <span class="font-bold text-2xl">
                                    {{ job.companyInitial }}
                                </span>
                            </div>
                            <div class="flex-1">
                                <h1 class="text-2xl font-bold text-gray-900">
                                    {{ job.title }}
                                </h1>
                                <p
                                    class="text-base font-medium text-gray-700 mt-1"
                                >
                                    {{ job.company }}
                                </p>
                                <div
                                    class="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-500"
                                >
                                    <span class="flex items-center">
                                        <svg
                                            class="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        {{ job.location }}
                                    </span>
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {{ job.workType }}
                                    </span>
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="job.salaryBadgeClass"
                                    >
                                        {{ job.salary }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Tags -->
                        <div
                            class="flex flex-wrap gap-2 mb-6 pb-6 border-b"
                            style="border-color: #e8ecf1"
                        >
                            <span
                                v-for="tag in [
                                    ...job.techStack,
                                    job.category,
                                    job.experienceLevel,
                                ]"
                                :key="tag"
                                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <!-- Body -->
                        <div class="space-y-6">
                            <section>
                                <h3
                                    class="text-lg font-bold text-gray-900 mb-3"
                                >
                                    About the Role
                                </h3>
                                <p
                                    class="text-sm leading-relaxed text-gray-700"
                                >
                                    {{ job.description }}
                                </p>
                            </section>
                            <section>
                                <h3
                                    class="text-lg font-bold text-gray-900 mb-3"
                                >
                                    Requirements
                                </h3>
                                <ul
                                    class="list-disc pl-5 space-y-2 text-sm text-gray-600"
                                >
                                    <li
                                        v-for="req in job.requirements"
                                        :key="req"
                                    >
                                        {{ req }}
                                    </li>
                                </ul>
                            </section>
                            <section>
                                <h3
                                    class="text-lg font-bold text-gray-900 mb-3"
                                >
                                    Benefits
                                </h3>
                                <ul
                                    class="list-disc pl-5 space-y-2 text-sm text-gray-600"
                                >
                                    <li
                                        v-for="benefit in job.benefits"
                                        :key="benefit"
                                    >
                                        {{ benefit }}
                                    </li>
                                </ul>
                            </section>
                        </div>

                        <!-- Meta footer -->
                        <div
                            class="mt-6 pt-6 border-t text-sm text-gray-500"
                            style="border-color: #e8ecf1"
                        >
                            <span>Posted {{ job.postedAt }}</span>
                            <span class="mx-2">&bull;</span>
                            <span class="font-medium text-gray-700">
                                {{ job.applicantsCount }} applicants
                            </span>
                            <span class="mx-2">&bull;</span>
                            <span>Deadline: {{ job.deadline }}</span>
                        </div>
                    </div>

                    <!-- Comments -->
                    <div
                        class="bg-white rounded-xl border p-6"
                        style="border-color: #e8ecf1"
                    >
                        <h3 class="text-lg font-bold text-gray-900 mb-5">
                            Discussion
                            <span
                                class="ml-2 text-sm font-normal text-gray-400"
                            >
                                ({{ comments.length }})
                            </span>
                        </h3>

                        <transition-group
                            name="comment"
                            tag="div"
                            class="space-y-4"
                        >
                            <div
                                v-for="comment in comments"
                                :key="comment.id"
                                class="flex items-start space-x-3"
                                :class="{ 'ml-8': comment.isEmployer }"
                            >
                                <template v-if="comment.avatar">
                                    <img
                                        :src="comment.avatar"
                                        class="h-8 w-8 rounded-full border flex-shrink-0"
                                        style="border-color: #e8ecf1"
                                    />
                                </template>
                                <template v-else>
                                    <div
                                        class="h-8 w-8 rounded-full border flex-shrink-0 flex items-center justify-center bg-gray-100"
                                        style="border-color: #e8ecf1"
                                    >
                                        <span
                                            class="font-bold text-sm text-gray-600"
                                        >
                                            {{
                                                comment.companyInitial ||
                                                comment.author[0]
                                            }}
                                        </span>
                                    </div>
                                </template>

                                <div
                                    class="flex-1 rounded-lg p-3"
                                    :class="
                                        comment.isEmployer
                                            ? 'bg-pink-50'
                                            : 'bg-gray-50'
                                    "
                                >
                                    <div
                                        class="flex items-center justify-between mb-1"
                                    >
                                        <p
                                            class="text-sm font-medium text-gray-900"
                                        >
                                            {{ comment.author }}
                                            <span
                                                v-if="comment.isEmployer"
                                                class="text-xs text-white px-1.5 py-0.5 rounded ml-1"
                                                style="
                                                    background-color: #fd366e;
                                                "
                                            >
                                                Employer
                                            </span>
                                            <span
                                                v-if="comment.isOwn"
                                                class="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1"
                                            >
                                                You
                                            </span>
                                        </p>
                                        <span class="text-xs text-gray-400">
                                            {{ comment.postedAt }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600">
                                        {{ comment.text }}
                                    </p>
                                </div>
                            </div>
                        </transition-group>

                        <p
                            v-if="comments.length === 0"
                            class="text-sm text-gray-400 text-center py-4"
                        >
                            No comments yet. Be the first to ask a question!
                        </p>

                        <!-- Add comment -->
                        <div class="mt-6 flex items-start space-x-3">
                            <img
                                :src="currentUser.avatar"
                                class="h-8 w-8 rounded-full border flex-shrink-0"
                                style="border-color: #e8ecf1"
                            />
                            <div class="flex-1">
                                <textarea
                                    v-model="newComment"
                                    rows="2"
                                    maxlength="300"
                                    class="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 transition-colors"
                                    :class="
                                        newComment.length > 250
                                            ? 'border-orange-300'
                                            : ''
                                    "
                                    style="border-color: #e8ecf1"
                                    placeholder="Ask a question or add a comment..."
                                    @keydown.ctrl.enter="submitComment"
                                ></textarea>
                                <div
                                    class="mt-2 flex justify-between items-center"
                                >
                                    <span
                                        class="text-xs transition-colors"
                                        :class="
                                            newComment.length > 250
                                                ? 'text-orange-500 font-medium'
                                                : 'text-gray-400'
                                        "
                                    >
                                        {{ newComment.length }}/300 · Ctrl+Enter
                                        to post
                                    </span>
                                    <button
                                        class="px-4 py-1.5 text-white text-sm font-medium rounded-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                                        style="background-color: #fd366e"
                                        :disabled="!newComment.trim()"
                                        @click="submitComment"
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT col: Application panel -->
                <div class="lg:col-span-1">
                    <div
                        class="bg-white rounded-xl border p-6 sticky top-24"
                        style="border-color: #e8ecf1"
                    >
                        <!-- Success state  -->
                        <!-- i will add this condition when there is an api -->
                        <!-- v-if="submitSuccess" || alreadyApplied -->
                        <div v-if="submitSuccess" class="text-center py-2">
                            <div
                                class="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-4"
                                style="animation: pop 0.4s ease"
                            >
                                <svg
                                    class="h-7 w-7 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2.5"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 class="text-base font-bold text-gray-900">
                                Application Submitted!
                            </h3>
                            <p class="text-sm text-gray-500 mt-1 mb-4">
                                {{ job.company }} will review your application
                                and reach out via email.
                            </p>
                            <div
                                class="p-3 bg-gray-50 rounded-lg text-left text-sm space-y-2 border"
                                style="border-color: #e8ecf1"
                            >
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Position</span>
                                    <span
                                        class="font-medium text-gray-800 text-right"
                                    >
                                        {{ job.title }}
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Company</span>
                                    <span class="font-medium text-gray-800">
                                        {{ job.company }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-500">Status</span>
                                    <span
                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                    >
                                        In Review
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">
                                        Submitted as
                                    </span>
                                    <span class="font-medium text-gray-800">
                                        {{ submittedName }}
                                    </span>
                                </div>
                            </div>

                            <!-- ── NEW: link to my applications ── -->
                            <a
                                href="/my-applications"
                                class="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                                style="background-color: #fd366e"
                            >
                                <svg
                                    class="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                View My Applications
                            </a>

                            <a
                                href="/jobs"
                                class="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 border hover:bg-gray-50 transition-colors"
                                style="border-color: #e8ecf1"
                            >
                                Browse More Jobs
                            </a>
                        </div>

                        <!-- Form -->
                        <div v-else>
                            <h3 class="text-lg font-bold text-gray-900 mb-4">
                                Apply for this Job
                            </h3>

                            <!-- Error banner -->
                            <div
                                v-if="formError"
                                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2"
                            >
                                <svg
                                    class="h-4 w-4 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {{ formError }}
                            </div>

                            <div class="space-y-4">
                                <!-- Name -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Full Name
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.name"
                                        type="text"
                                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors"
                                        :class="
                                            fieldError.name
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300'
                                        "
                                        placeholder="Jane Doe"
                                        @blur="validateField('name')"
                                        @input="clearFieldError('name')"
                                    />
                                    <p
                                        v-if="fieldError.name"
                                        class="text-xs text-red-500 mt-1"
                                    >
                                        {{ fieldError.name }}
                                    </p>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Email
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.email"
                                        type="email"
                                        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors"
                                        :class="
                                            fieldError.email
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300'
                                        "
                                        placeholder="jane@example.com"
                                        @blur="validateField('email')"
                                        @input="clearFieldError('email')"
                                    />
                                    <p
                                        v-if="fieldError.email"
                                        class="text-xs text-red-500 mt-1"
                                    >
                                        {{ fieldError.email }}
                                    </p>
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        v-model="form.phone"
                                        type="tel"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <!-- Resume -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Upload Resume
                                    </label>

                                    <!-- Selected file -->
                                    <div
                                        v-if="form.resumeFileName"
                                        class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                    >
                                        <div
                                            class="flex items-center space-x-2"
                                        >
                                            <svg
                                                class="h-5 w-5 text-green-600 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <span
                                                class="text-xs font-medium text-green-800 truncate max-w-[140px]"
                                            >
                                                {{ form.resumeFileName }}
                                            </span>
                                        </div>
                                        <button
                                            class="text-gray-400 hover:text-gray-600 ml-2"
                                            @click="clearResume"
                                        >
                                            <svg
                                                class="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- Upload progress -->
                                    <div
                                        v-else-if="
                                            uploadProgress > 0 &&
                                            uploadProgress < 100
                                        "
                                        class="p-3 border border-gray-200 rounded-lg"
                                    >
                                        <div
                                            class="flex justify-between text-xs text-gray-500 mb-1"
                                        >
                                            <span>
                                                Uploading
                                                {{ uploadingFileName }}...
                                            </span>
                                            <span>{{ uploadProgress }}%</span>
                                        </div>
                                        <div
                                            class="w-full bg-gray-100 rounded-full h-1.5"
                                        >
                                            <div
                                                class="h-1.5 rounded-full transition-all duration-200"
                                                style="
                                                    background-color: #fd366e;
                                                "
                                                :style="{
                                                    width: uploadProgress + '%',
                                                }"
                                            ></div>
                                        </div>
                                    </div>

                                    <!-- Drop zone -->
                                    <div
                                        v-else
                                        class="flex justify-center rounded-lg border-2 border-dashed px-6 py-6 cursor-pointer transition-colors"
                                        :class="
                                            isDragging
                                                ? 'border-pink-400 bg-pink-50'
                                                : 'border-gray-300 hover:border-pink-400'
                                        "
                                        @click="triggerFileInput"
                                        @dragover.prevent="isDragging = true"
                                        @dragleave="isDragging = false"
                                        @drop.prevent="handleFileDrop"
                                    >
                                        <div class="text-center">
                                            <svg
                                                class="mx-auto h-10 w-10 transition-colors"
                                                :class="
                                                    isDragging
                                                        ? 'text-pink-400'
                                                        : 'text-gray-400'
                                                "
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 48 48"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l2.879-2.879m0 0a3 3 0 014.243 0L20 34"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                            <p
                                                class="mt-2 text-sm text-gray-600"
                                            >
                                                <span
                                                    class="font-medium cursor-pointer"
                                                    style="color: #fd366e"
                                                >
                                                    {{
                                                        isDragging
                                                            ? 'Drop it here!'
                                                            : 'Upload a file'
                                                    }}
                                                </span>
                                                <span v-if="!isDragging">
                                                    or drag &amp; drop
                                                </span>
                                            </p>
                                            <p
                                                class="text-xs text-gray-500 mt-1"
                                            >
                                                PDF, DOC up to 10MB
                                            </p>
                                        </div>
                                        <input
                                            ref="fileInput"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            class="hidden"
                                            @change="handleFileSelect"
                                        />
                                    </div>
                                </div>

                                <!-- Submit -->
                                <button
                                    class="w-full text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    style="background-color: #fd366e"
                                    :disabled="isSubmitting"
                                    @click="handleSubmit"
                                >
                                    <svg
                                        v-if="isSubmitting"
                                        class="animate-spin h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        />
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    {{
                                        isSubmitting
                                            ? 'Submitting...'
                                            : 'Submit Application'
                                    }}
                                </button>
                            </div>

                            <!-- Divider -->
                            <div class="relative flex py-4 items-center mt-2">
                                <div
                                    class="flex-grow border-t border-gray-200"
                                ></div>
                                <span
                                    class="flex-shrink-0 mx-4 text-gray-400 text-xs"
                                >
                                    or
                                </span>
                                <div
                                    class="flex-grow border-t border-gray-200"
                                ></div>
                            </div>

                            <!-- LinkedIn -->
                            <button
                                class="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center text-sm transition-colors"
                                @click="handleLinkedIn"
                            >
                                <svg
                                    class="w-5 h-5 mr-2 text-[#0077b5]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                    />
                                </svg>
                                Easy Apply with LinkedIn
                            </button>
                        </div>

                        <div
                            class="mt-6 pt-4 border-t flex justify-between"
                            style="border-color: #e8ecf1"
                        >
                            <button
                                class="text-sm flex items-center gap-1 transition-all"
                                :class="
                                    isSaved
                                        ? 'font-medium'
                                        : 'text-gray-500 hover:text-gray-700'
                                "
                                :style="isSaved ? 'color: #fd366e' : ''"
                                @click="handleSave"
                            >
                                <svg
                                    class="w-4 h-4 transition-transform"
                                    :style="
                                        isSaved ? 'transform: scale(1.2)' : ''
                                    "
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
                                {{ isSaved ? 'Saved' : 'Save Job' }}
                            </button>
                            <button
                                class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                                @click="handleShare"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, reactive } from 'vue';
import { useAppStore } from '@/store';

export default {
    name: 'JobDetails',

    setup() {
        //  Single store (the one in src/store/index.js)
        const store = useAppStore();

        // Expose currentUser directly so template never touches store.currentUser
        const currentUser = computed(() => store.currentUser);
        const job = computed(() => store.currentJob);
        const comments = computed(() => store.commentsForCurrentJob);
        const isSaved = computed(() => store.isCurrentJobSaved);
        const alreadyApplied = computed(() => !!store.currentUserApplication);

        const toast = reactive({ show: false, message: '', type: 'success' });
        function showToast(message, type = 'success') {
            toast.message = message;
            toast.type = type;
            toast.show = true;
            setTimeout(() => (toast.show = false), 3000);
        }

        const newComment = ref('');
        function submitComment() {
            if (!newComment.value.trim()) return;
            store.addComment(newComment.value);
            newComment.value = '';
            showToast('Comment posted!');
        }

        const form = ref({
            name: store.currentUser.name,
            email: store.currentUser.email,
            phone: store.currentUser.phone,
            resumeFileName: '',
        });

        const fieldError = reactive({ name: '', email: '' });
        const formError = ref('');
        const isSubmitting = ref(false);
        const submitSuccess = ref(false);
        const submittedName = ref('');

        function validateField(field) {
            if (field === 'name' && !form.value.name.trim()) {
                fieldError.name = 'Full name is required.';
            }
            if (field === 'email') {
                if (!form.value.email.trim()) {
                    fieldError.email = 'Email is required.';
                } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
                    fieldError.email = 'Please enter a valid email.';
                }
            }
        }
        function clearFieldError(field) {
            fieldError[field] = '';
        }

        const fileInput = ref(null);
        const isDragging = ref(false);
        const uploadProgress = ref(0);
        const uploadingFileName = ref('');

        function triggerFileInput() {
            fileInput.value?.click();
        }

        function simulateUpload(fileName) {
            uploadingFileName.value = fileName;
            uploadProgress.value = 0;
            const interval = setInterval(() => {
                uploadProgress.value += Math.floor(Math.random() * 20) + 10;
                if (uploadProgress.value >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        form.value.resumeFileName = fileName;
                        uploadProgress.value = 0;
                        uploadingFileName.value = '';
                    }, 300);
                }
            }, 150);
        }

        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) simulateUpload(file.name);
        }
        function handleFileDrop(e) {
            isDragging.value = false;
            const file = e.dataTransfer.files[0];
            if (file) simulateUpload(file.name);
        }
        function clearResume() {
            form.value.resumeFileName = '';
            if (fileInput.value) fileInput.value.value = '';
        }

        async function handleSubmit() {
            formError.value = '';
            validateField('name');
            validateField('email');
            if (fieldError.name || fieldError.email) return;

            isSubmitting.value = true;
            await new Promise((r) => setTimeout(r, 1000));

            const result = store.submitApplication({
                name: form.value.name,
                email: form.value.email,
                phone: form.value.phone,
                resumeFileName: form.value.resumeFileName,
            });

            isSubmitting.value = false;

            if (result.success) {
                submittedName.value = form.value.name;
                submitSuccess.value = true;
                showToast(`Application submitted to ${job.value.company}!`);
            } else {
                formError.value = result.message;
                showToast(result.message, 'error');
            }
        }

        function handleLinkedIn() {
            form.value.name = store.currentUser.name;
            form.value.email = store.currentUser.email;
            form.value.phone = store.currentUser.phone;
            handleSubmit();
        }

        function handleSave() {
            store.toggleSaveJob();
            showToast(
                store.isCurrentJobSaved
                    ? 'Job saved!'
                    : 'Job removed from saved.'
            );
        }
        function handleShare() {
            navigator.clipboard?.writeText(window.location.href);
            showToast('Link copied to clipboard!');
        }

        return {
            // user
            currentUser,
            // job
            job,
            isSaved,
            // comments
            comments,
            newComment,
            submitComment,
            // form
            form,
            fieldError,
            validateField,
            clearFieldError,
            formError,
            isSubmitting,
            submitSuccess,
            submittedName,
            alreadyApplied,
            // file
            fileInput,
            isDragging,
            uploadProgress,
            uploadingFileName,
            triggerFileInput,
            handleFileSelect,
            handleFileDrop,
            clearResume,
            // actions
            handleSubmit,
            handleLinkedIn,
            handleSave,
            handleShare,
            // toast
            toast,
        };
    },
};
</script>

<style>
@keyframes pop {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    70% {
        transform: scale(1.15);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}
.comment-enter-active {
    transition: all 0.35s ease;
}
.comment-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
</style>
