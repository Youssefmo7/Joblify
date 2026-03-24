import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    usersCount: 4281,
    activeJobsCount: 312,
    usersGrowth: "+12% this month",
    jobsGrowth: "+8% this month",
    pendingJobs: [
      {
        id: 1,
        title: "Data Analyst Intern",
        company: "TechStartup LLC",
        submittedTime: "2 hours ago",
        status: "pending",
      },
      {
        id: 2,
        title: "Senior React Developer",
        company: "DevAgency Co.",
        submittedTime: "5 hours ago",
        status: "pending",
      },
      {
        id: 3,
        title: "Marketing Manager",
        company: "BrandWorks Inc.",
        submittedTime: "1 day ago",
        status: "pending",
      },
      {
        id: 4,
        title: "UI/UX Designer",
        company: "PixelCraft Studio",
        submittedTime: "1 day ago",
        status: "pending",
      },
      {
        id: 5,
        title: "Node.js Backend Engineer",
        company: "ScaleCore",
        submittedTime: "2 days ago",
        status: "pending",
      },
    ],
    moderationQueue: [
      {
        id: 101,
        author: "anonymous_user_47",
        text: "This company is fake, avoid them at all costs!!!",
        jobTitle: "Frontend Developer",
        flaggedReason: "Abusive language",
      },
      {
        id: 102,
        author: "candidate_pro",
        text: "Phone number here: 01234567890 call me directly for offers",
        jobTitle: "Product Manager",
        flaggedReason: "Possible personal data sharing",
      },
      {
        id: 103,
        author: "new_account_92",
        text: "Visit this external site for guaranteed placement",
        jobTitle: "QA Engineer",
        flaggedReason: "Suspicious external promotion",
      },
    ],
    approvedJobs: [],
    rejectedJobs: [],
  }),
  getters: {
    pendingJobsCount: (state) => state.pendingJobs.length,
    flaggedCommentsCount: (state) => state.moderationQueue.length,
    totalReviewedJobs: (state) =>
      state.approvedJobs.length + state.rejectedJobs.length,
  },
  actions: {
    approveJob(jobId) {
      const index = this.pendingJobs.findIndex((job) => job.id === jobId);

      if (index === -1) {
        return;
      }

      const [job] = this.pendingJobs.splice(index, 1);
      this.approvedJobs.push({ ...job, status: "approved" });
      this.activeJobsCount += 1;
    },
    rejectJob(jobId) {
      const index = this.pendingJobs.findIndex((job) => job.id === jobId);

      if (index === -1) {
        return;
      }

      const [job] = this.pendingJobs.splice(index, 1);
      this.rejectedJobs.push({ ...job, status: "rejected" });
    },
    removeFlaggedComment(commentId) {
      this.moderationQueue = this.moderationQueue.filter(
        (comment) => comment.id !== commentId,
      );
    },
  },
});
