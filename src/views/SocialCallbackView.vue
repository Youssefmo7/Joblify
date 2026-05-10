<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
       <p class="mt-4 text-gray-600">Completing login... Please wait</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    const token = route.query.token; 
    if (token) {
        const success = await authStore.handleSocialCallback(token);
        if (success) {
            if (authStore.isEmployer) router.push('/employer/dashboard');
            else if (authStore.isAdmin) router.push('/admin');
            else router.push('/');
        } else {
            router.push('/login');
        }
    } else {
        router.push('/login');
    }
});
</script>