import { defineStore } from "pinia";
export const useAppStore = defineStore("app", {
  state: () => ({
    // ── Candidate: profile 
    candidateProfile: {
      first_name:  "Sarah",
      last_name:   "Hassan",
      email:       "sarah.hassan@email.com",
      phone:       "+20 100 123 4567",
      location:    "Cairo, Egypt",
      bio:         "Frontend developer with 3 years of experience in Vue.js and React.",
      skills:      ["Vue.js", "React", "JavaScript", "Tailwind CSS", "Git"],
      avatar_url:  null,
      resume_url:  null,
      resume_name: null,
    },
    // ── Candidate: applications 
    candidateApplications: [
      {
        id: 1, job_id: 101,
        job_title: "Senior Vue Developer", company_name: "TechCorp Egypt",
        company_logo: null, location: "Cairo, Egypt", work_type: "Hybrid",
        status: "pending",  applied_at: "2025-03-18T10:00:00Z",
      },
      {
        id: 2, job_id: 102,
        job_title: "Frontend Developer", company_name: "DevAgency Co.",
        company_logo: null, location: "Remote", work_type: "Remote",
        status: "accepted", applied_at: "2025-03-10T09:00:00Z",
      },
      {
        id: 3, job_id: 103,
        job_title: "UI/UX Developer", company_name: "PixelCraft Studio",
        company_logo: null, location: "Alexandria, Egypt", work_type: "On-site",
        status: "rejected", applied_at: "2025-03-05T14:00:00Z",
      },
      {
        id: 4, job_id: 104,
        job_title: "React Native Developer", company_name: "MobileFirst Ltd.",
        company_logo: null, location: "Cairo, Egypt", work_type: "Remote",
        status: "pending",  applied_at: "2025-03-20T11:30:00Z",
      },
    ],
  }),
  // ── Getters 
   getters: {
    pendingApplications:  (state) => state.candidateApplications.filter(a => a.status === "pending"),
    acceptedApplications: (state) => state.candidateApplications.filter(a => a.status === "accepted"),
    rejectedApplications: (state) => state.candidateApplications.filter(a => a.status === "rejected"),
    pendingCount:         (state) => state.candidateApplications.filter(a => a.status === "pending").length,
  },
  // ── Actions ───────────────────────────────────────────────────────
  actions: {
    updateCandidateProfile(payload) {
      this.candidateProfile = { ...this.candidateProfile, ...payload };
    },
    addSkill(skill) {
      const s = skill.trim();
      if (s && !this.candidateProfile.skills.includes(s)) {
        this.candidateProfile.skills.push(s);
      }
    },
    removeSkill(skill) {
      this.candidateProfile.skills = this.candidateProfile.skills.filter((s) => s !== skill);
    },
    setResume(url, name) {
      this.candidateProfile.resume_url  = url;
      this.candidateProfile.resume_name = name;
    },
    cancelApplication(id) {
      const app = this.candidateApplications.find((a) => a.id === id);
      if (app && app.status === "pending") {
        this.candidateApplications = this.candidateApplications.filter((a) => a.id !== id);
      }
    },
  },
});