import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Jobs from "@/views/Jobs.vue";
import Candidates from "@/views/Candidates.vue";
import Employers from "@/views/Employers.vue";
import Admin from "@/views/Admin.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/jobs",
      name: "Jobs",
      component: Jobs,
    },
    {
      path: "/candidates",
      name: "Candidates",
      component: Candidates,
    },
    {
      path: "/employers",
      name: "Employers",
      component: Employers,
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
    },
  ],
});

export default router;
