import { createRouter, createWebHistory } from "vue-router";
import LayoutPage from "@/views/LayoutPage.vue";
import JobDetails from "@/components/JobDetails.vue";
import MyApplications from "../components/MyApplications.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: LayoutPage,
      alias: ["/index.html", "/home"],
      meta: { layoutFile: "index.html" },
    },
    {
      path: "/my-applications",
      name: "MyApplications",
      component: MyApplications,
    },
    {
      path: "/jobs",
      name: "Jobs",
      component: LayoutPage,
      meta: { layoutFile: "index.html" },
    },
    {
      path: "/job-details/:id?",
      name: "JobDetails",
      component: JobDetails,
      alias: ["/job-details.html"],
      beforeEnter(to) {
        // If an id param is present, tell the store which job to show.
        if (to.params.id) {
          import("@/store").then(({ useAppStore }) => {
            const store = useAppStore();
            store.setCurrentJob(Number(to.params.id));
          });
        }
      },
    },
    {
      path: "/login",
      name: "LoginRegister",
      component: LayoutPage,
      alias: ["/login-register", "/login-register.html"],
      meta: { layoutFile: "login-register.html" },
    },
    {
      path: "/create-job",
      name: "CreateJob",
      component: LayoutPage,
      alias: ["/create-job.html"],
      meta: { layoutFile: "create-job.html" },
    },
    {
      path: "/candidates",
      name: "Candidates",
      component: LayoutPage,
      alias: ["/candidate-dashboard", "/candidate-dashboard.html"],
      meta: { layoutFile: "candidate-dashboard.html" },
    },
    {
      path: "/employers",
      name: "Employers",
      component: LayoutPage,
      alias: ["/employer-dashboard", "/employer-dashboard.html"],
      meta: { layoutFile: "employer-dashboard.html" },
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("@/views/Admin.vue"),
      alias: ["/admin-dashboard", "/admin-dashboard.html"],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
