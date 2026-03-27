import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        // stats
        usersCount: 4281,
        usersGrowth: '+12% this month',
        activeJobsCount: 312,
        jobsGrowth: '+8% this month',

        // Current logged-in user
        currentUser: {
            id: 101,
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '+1 (555) 000-0000',
            avatar: 'https://i.pravatar.cc/150?img=68',
            role: 'candidate', // 'candidate' | 'employer' | 'admin'
        },

        // jobs
        jobs: [
            {
                id: 1,
                title: 'Senior Frontend Engineer',
                company: 'Google',
                companyInitial: 'G',
                companyBg: 'bg-gray-100',
                companyText: 'text-gray-600',
                location: 'Mountain View, CA',
                workType: 'Remote',
                salary: '$140k – $200k / yr',
                salaryBadgeClass: 'bg-green-100 text-green-800',
                category: 'Engineering',
                experienceLevel: 'Mid-Senior',
                techStack: ['Vue.js', 'TypeScript', 'GraphQL'],
                description:
                    'We are looking for an experienced Frontend Engineer with deep knowledge of Vue.js to join our core team. You will be responsible for reinventing how millions interact with our platform, collaborating with design and backend engineering to ship world-class experiences.',
                requirements: [
                    '5+ years of experience with modern JavaScript frameworks (Vue.js preferred)',
                    'Strong understanding of TypeScript and state management patterns',
                    'Experience with GraphQL APIs and RESTful services',
                    'Familiarity with CI/CD pipelines and testing frameworks',
                    'Excellent communication and collaboration skills',
                ],
                benefits: [
                    'Competitive salary and equity package',
                    'Comprehensive health, dental, and vision insurance',
                    'Flexible remote work policy',
                    'Annual learning and development budget',
                    'Generous PTO and parental leave',
                ],
                postedAt: '2 hours ago',
                applicantsCount: 14,
                deadline: 'April 15, 2026',
                status: 'active',
            },
            {
                id: 2,
                title: 'Product Designer',
                company: 'Stripe',
                companyInitial: 'S',
                companyBg: 'bg-blue-600',
                companyText: 'text-white',
                location: 'San Francisco, CA',
                workType: 'Hybrid',
                salary: '$120k – $160k / yr',
                salaryBadgeClass: 'bg-blue-100 text-blue-800',
                category: 'Design',
                experienceLevel: 'Mid Level',
                techStack: ['Figma', 'Prototyping', 'Design Systems'],
                description:
                    "Stripe is hiring a Product Designer to bring high-quality execution and visual logic to the dashboard experience. You'll work closely with product managers and engineers to craft seamless user flows.",
                requirements: [
                    '3+ years of product design experience at a tech company',
                    'Expert-level Figma skills and component library management',
                    'Strong portfolio demonstrating end-to-end design process',
                    'Experience with complex data-heavy interfaces',
                    'Ability to balance user needs with technical constraints',
                ],
                benefits: [
                    'Equity and competitive base salary',
                    'Remote-friendly with quarterly offsites',
                    'Top-tier health benefits',
                    '$2,000 annual equipment budget',
                    'Paid parental leave for all parents',
                ],
                postedAt: '5 days ago',
                applicantsCount: 31,
                deadline: 'May 1, 2026',
                status: 'active',
            },
            {
                id: 3,
                title: 'Data Analyst Intern',
                company: 'TechStartup LLC',
                companyInitial: 'T',
                companyBg: 'bg-purple-100',
                companyText: 'text-purple-700',
                location: 'New York, NY',
                workType: 'On-site',
                salary: '$25 – $35 / hr',
                salaryBadgeClass: 'bg-purple-100 text-purple-800',
                category: 'Data',
                experienceLevel: 'Entry Level',
                techStack: ['Python', 'SQL', 'Tableau'],
                description:
                    'Join our data team and help drive business decisions through analysis and visualization. You will work directly with senior analysts on real projects.',
                requirements: [
                    "Enrolled in or recently completed a Bachelor's in CS, Stats, or related field",
                    'Proficiency in Python and SQL',
                    'Experience with data visualization tools (Tableau, Power BI)',
                    'Strong analytical and problem-solving mindset',
                ],
                benefits: [
                    'Competitive hourly compensation',
                    'Mentorship from senior data professionals',
                    'Possibility of full-time conversion',
                    'Free lunch on office days',
                ],
                postedAt: '1 day ago',
                applicantsCount: 7,
                deadline: 'March 31, 2026',
                status: 'pending',
            },
        ],

        // ID of the job currently being viewed
        currentJobId: 1,

        // comments
        comments: [
            {
                id: 1,
                jobId: 1,
                author: 'Mark Johnson',
                avatar: 'https://i.pravatar.cc/150?img=47',
                text: 'Is this role open to candidates in Europe as well? The listing says remote but I wanted to confirm timezone requirements.',
                postedAt: '1 hour ago',
                isEmployer: false,
                flagged: false,
            },
            {
                id: 2,
                jobId: 1,
                author: 'Google',
                avatar: null,
                companyInitial: 'G',
                text: "Yes, we accept applications from Europe! We have a 4-hour overlap requirement with PST, but otherwise it's fully flexible.",
                postedAt: '45 min ago',
                isEmployer: true,
                flagged: false,
            },
            {
                id: 3,
                jobId: 1,
                author: 'Priya Nair',
                avatar: 'https://i.pravatar.cc/150?img=44',
                text: 'What does the interview process look like? Is there a take-home assessment involved?',
                postedAt: '30 min ago',
                isEmployer: false,
                flagged: false,
            },
            {
                id: 4,
                jobId: 2,
                author: 'Alex Chen',
                avatar: 'https://i.pravatar.cc/150?img=11',
                text: 'Does this role require working in the SF office regularly, or is it mostly remote with occasional visits?',
                postedAt: '2 days ago',
                isEmployer: false,
                flagged: false,
            },
        ],

        // applications
        applications: [
            {
                id: 201,
                jobId: 1,
                candidateId: 999,
                candidateName: 'Alice Smith',
                email: 'alice@example.com',
                phone: '+1 (555) 111-2222',
                resumeFileName: 'alice_smith_resume.pdf',
                status: 'pending', // 'pending' | 'accepted' | 'rejected'
                submittedAt: '2 days ago',
            },
            {
                id: 202,
                jobId: 1,
                candidateId: 101,
                candidateName: 'Bob Taylor',
                email: 'bob@example.com',
                phone: '+1 (555) 333-4444',
                resumeFileName: 'bob_taylor_cv.pdf',
                status: 'pending',
                submittedAt: '3 days ago',
            },
        ],

        // jobs saved by the current candidate
        savedJobIds: [2],

        // admin state
        approvedJobs: [],
        rejectedJobs: [],
        moderationQueue: [
            {
                id: 301,
                jobId: 1,
                author: 'John Miller',
                jobTitle: 'Data Analyst Intern',
                text: "This is a scam posting, don't apply here!!! They will steal your data.",
                flaggedReason: 'Misinformation / spam',
                flaggedBy: 2,
            },
            {
                id: 302,
                jobId: 2,
                author: 'Sarah K.',
                jobTitle: 'Senior React Developer',
                text: 'Inappropriate language and spam content...',
                flaggedReason: 'Inappropriate language',
                flaggedBy: 4,
            },
        ],
    }),

    getters: {
        currentJob(state) {
            return (
                state.jobs.find((j) => j.id === state.currentJobId) ||
                state.jobs[0]
            );
        },
        pendingJobs(state) {
            return state.jobs.filter((j) => j.status === 'pending');
        },
        pendingJobsCount(state) {
            return state.jobs.filter((j) => j.status === 'pending').length;
        },
        flaggedCommentsCount(state) {
            return state.moderationQueue.length;
        },
        totalReviewedJobs(state) {
            return state.approvedJobs.length + state.rejectedJobs.length;
        },
        commentsForCurrentJob(state) {
            return state.comments.filter(
                (c) => c.jobId === state.currentJobId && !c.flagged
            );
        },
        isCurrentJobSaved(state) {
            return state.savedJobIds.includes(state.currentJobId);
        },
        currentUserApplication(state) {
            return state.applications.find(
                (a) =>
                    a.jobId === state.currentJobId &&
                    a.candidateId === state.currentUser.id
            );
        },

        myApplications(state) {
            return state.applications
                .filter((a) => a.candidateId === state.currentUser.id)
                .map((a) => {
                    const job = state.jobs.find((j) => j.id === a.jobId);
                    return {
                        ...a,
                        jobTitle: job?.title || 'Unknown Position',
                        company: job?.company || 'Unknown Company',
                        companyInitial: job?.companyInitial || '?',
                        companyBg: job?.companyBg || 'bg-gray-100',
                        companyText: job?.companyText || 'text-gray-600',
                        location: job?.location || '',
                        workType: job?.workType || '',
                    };
                });
        },
    },

    // actions
    actions: {
        setCurrentJob(jobId) {
            this.currentJobId = jobId;
        },

        submitApplication({ name, email, phone, resumeFileName }) {
            // prevent duplicate applications
            // const alreadyApplied = this.applications.some(
            //     (a) =>
            //         a.jobId === this.currentJobId &&
            //         a.candidateId === this.currentUser.id
            // );
            // if (alreadyApplied)
            //     return { success: false, message: 'Already applied.' };

            const newApplication = {
                id: Date.now(),
                jobId: this.currentJobId,
                candidateId: this.currentUser.id,
                candidateName: name,
                email,
                phone,
                resumeFileName: resumeFileName || null,
                status: 'pending',
                submittedAt: 'just now',
            };
            this.applications.push(newApplication);

            // increment applicant count on the job
            const job = this.jobs.find((j) => j.id === this.currentJobId);
            if (job) job.applicantsCount += 1;

            return { success: true };
        },

        addComment(text) {
            if (!text.trim()) return;
            const newComment = {
                id: Date.now(),
                jobId: this.currentJobId,
                author: this.currentUser.name,
                avatar: this.currentUser.avatar,
                text: text.trim(),
                postedAt: 'just now',
                isEmployer: this.currentUser.role === 'employer',
                flagged: false,
            };
            this.comments.push(newComment);
        },

        toggleSaveJob() {
            const idx = this.savedJobIds.indexOf(this.currentJobId);
            if (idx === -1) {
                this.savedJobIds.push(this.currentJobId);
            } else {
                this.savedJobIds.splice(idx, 1);
            }
        },

        withdrawApplication(applicationId) {
            this.applications = this.applications.filter(
                (a) => a.id !== applicationId
            );
        },

        // admin actions
        approveJob(jobId) {
            const job = this.jobs.find((j) => j.id === jobId);
            if (job) {
                job.status = 'active';
                this.approvedJobs.push(jobId);
            }
        },
        rejectJob(jobId) {
            const job = this.jobs.find((j) => j.id === jobId);
            if (job) {
                job.status = 'rejected';
                this.rejectedJobs.push(jobId);
            }
        },
        removeFlaggedComment(commentId) {
            this.moderationQueue = this.moderationQueue.filter(
                (c) => c.id !== commentId
            );
        },
    },
});
