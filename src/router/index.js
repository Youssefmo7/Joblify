import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// ── Public views ──────────────────────────────────────────────
import HomeView from '@/views/HomeView.vue';
import JobDetailView from '@/views/JobDetailView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import VerifyEmailView from '@/views/VerifyEmailView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SocialCallbackView from '@/views/SocialCallbackView.vue';
import CompanyProfileView from '@/views/CompanyProfileView.vue';

// ── Candidate views ───────────────────────────────────────────
import ProfileView from '@/views/candidate/ProfileView.vue';
import ApplicationsView from '@/views/candidate/ApplicationsView.vue';

// ── Employer views ────────────────────────────────────────────
import EmployerDashboard from '@/views/employer/DashboardView.vue';
import PostJobView from '@/views/employer/PostJobView.vue';
import EmployerProfileView from '@/views/employer/ProfileView.vue';
import ApplicantsView from '@/views/employer/ApplicantsView.vue';
import EditJobView from '@/views/employer/EditJobView.vue';

// ── Admin views ───────────────────────────────────────────────
import AdminDashboard from '@/components/AdminDashboard.vue';

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
        meta: { guestOnly: true, hideNavbar: true },
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { guestOnly: true, hideNavbar: true },
    },
    {
        path: '/auth/callback',
        name: 'social-callback',
        component: SocialCallbackView,
        meta: { guestOnly: true },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView,
        meta: { guestOnly: true, hideNavbar: true },
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: ResetPasswordView,
        meta: { guestOnly: true, hideNavbar: true },
    },
    {
        path: '/email/verify/:id/:hash',
        name: 'verify-email',
        component: VerifyEmailView,
    },
    {
        path: '/companies/:id',
        name: 'company-profile',
        component: CompanyProfileView,
    },

    // ── Candidate ─────────────────────────────────────────────
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true, role: 'candidate', verified: true },
    },
    {
        path: '/my-applications',
        name: 'my-applications',
        component: ApplicationsView,
        meta: { requiresAuth: true, role: 'candidate', verified: true },
    },

    // ── Employer ──────────────────────────────────────────────
    {
        path: '/employer/dashboard',
        name: 'employer-dashboard',
        component: EmployerDashboard,
        meta: { requiresAuth: true, role: 'employer', verified: true },
    },
    {
        path: '/employer/post-job',
        name: 'post-job',
        component: PostJobView,
        meta: { requiresAuth: true, role: 'employer', hideNavbar: true, verified: true },
    },
    {
        path: '/employer/profile',
        name: 'employer-profile',
        component: EmployerProfileView,
        meta: { requiresAuth: true, role: 'employer', verified: true },
    },
    {
        path: '/employer/jobs/:id/applicants',
        name: 'applicants',
        component: ApplicantsView,
        meta: { requiresAuth: true, role: 'employer', verified: true },
    },
    {
        path: '/employer/jobs/:id/edit',
        name: 'edit-job',
        component: EditJobView,
        meta: { requiresAuth: true, role: 'employer', hideNavbar: true, verified: true },
    },

    // ── Admin ─────────────────────────────────────────────────
    {
        path: '/admin',
        name: 'admin-dashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin', hideNavbar: true, verified: true },
    },

    // ── Email verification notice ─────────────────────────────
    {
        path: '/verify-email-notice',
        name: 'verify-email-notice',
        component: () => import('@/views/VerifyEmailNoticeView.vue'),
        meta: { requiresAuth: true },
    },

    // ── Catch-all 404 ─────────────────────────────────────────
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

// ── Auto-login on first navigation ────────────────────────────
let authInitialized = false;
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    if (!authInitialized) {
        authInitialized = true;
        await auth.fetchUser();
    }

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

    // Email verification required
    if (to.meta.verified && auth.isLoggedIn && !auth.isVerified) {
        return next({ name: 'verify-email-notice' });
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
