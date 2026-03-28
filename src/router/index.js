import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// ── Public views ──────────────────────────────────────────────
import HomeView from '@/views/HomeView.vue';
import JobDetailView from '@/views/JobDetailView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

// ── Candidate views ───────────────────────────────────────────
import ProfileView from '@/views/candidate/ProfileView.vue';
import ApplicationsView from '@/views/candidate/ApplicationsView.vue';

// ── Employer views ────────────────────────────────────────────
import EmployerDashboard from '@/views/employer/DashboardView.vue';
import PostJobView from '@/views/employer/PostJobView.vue';
// import EditJobView from '@/views/employer/EditJobView.vue';
import ApplicantsView from '@/views/employer/ApplicantsView.vue';

// ── Admin views ───────────────────────────────────────────────
// import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import PendingJobsView from '@/views/admin/PendingJobsView.vue';
import ModerationView from '@/views/admin/ModerationView.vue';

const routes = [
    // ── Public ────────────────────────────────────────────────
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/jobs/:id',
        name: 'job-detail',
        component: JobDetailView,
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guestOnly: true },
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { guestOnly: true },
    },

    // ── Candidate ─────────────────────────────────────────────
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true, role: 'candidate' },
    },
    {
        path: '/my-applications',
        name: 'my-applications',
        component: ApplicationsView,
        meta: { requiresAuth: true, role: 'candidate' },
    },

    // ── Employer ──────────────────────────────────────────────
    {
        path: '/employer/dashboard',
        name: 'employer-dashboard',
        component: EmployerDashboard,
        meta: { requiresAuth: true, role: 'employer' },
    },
    {
        path: '/employer/post-job',
        name: 'post-job',
        component: PostJobView,
        meta: { requiresAuth: true, role: 'employer' },
    },
    // {
    //     path: '/employer/jobs/:id/edit',
    //     name: 'edit-job',
    //     component: EditJobView,
    //     meta: { requiresAuth: true, role: 'employer' },
    // },
    {
        path: '/employer/jobs/:id/applicants',
        name: 'applicants',
        component: ApplicantsView,
        meta: { requiresAuth: true, role: 'employer' },
    },

    // ── Admin ─────────────────────────────────────────────────
    // {
    //     path: '/admin',
    //     name: 'admin-dashboard',
    //     component: AdminDashboard,
    //     meta: { requiresAuth: true, role: 'admin' },
    // },
    {
        path: '/admin/pending-jobs',
        name: 'pending-jobs',
        component: PendingJobsView,
        meta: { requiresAuth: true, role: 'admin' },
    },
    {
        path: '/admin/moderation',
        name: 'moderation',
        component: ModerationView,
        meta: { requiresAuth: true, role: 'admin' },
    },

    // ── Catch-all 404 ─────────────────────────────────────────
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

// ── Navigation guard ──────────────────────────────────────────
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    // Logged-in users should not see login/register pages
    if (to.meta.guestOnly && auth.isLoggedIn) {
        return next(roleHomePath(auth.user.role));
    }

    // Protected route — must be logged in
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    // Role mismatch — redirect to that user's home
    if (to.meta.role && auth.user?.role !== to.meta.role) {
        return next(roleHomePath(auth.user?.role));
    }

    next();
});

// Returns the default home path per role
function roleHomePath(role) {
    if (role === 'employer') return '/employer/dashboard';
    if (role === 'admin') return '/admin';
    return '/';
}

export default router;
