import { createRouter, createWebHistory } from "vue-router";
import LayoutPage from "@/views/LayoutPage.vue";

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
      path: "/jobs",
      name: "Jobs",
      component: LayoutPage,
      meta: { layoutFile: "index.html" },
    },
    {
      path: "/job-details",
      name: "JobDetails",
      component: LayoutPage,
      alias: ["/job-details.html"],
      meta: { layoutFile: "job-details.html" },
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
      component: LayoutPage,
      alias: ["/admin-dashboard", "/admin-dashboard.html"],
      meta: { layoutFile: "admin-dashboard.html" },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
