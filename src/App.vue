<template>
    <div id="app">
        <NavBar v-if="!$route.meta.hideNavbar" />
        <RouterView />
    </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style>
body {
    font-family: var(--font-sans, system-ui, sans-serif);
    background: var(--color-background-tertiary);
    color: var(--color-text-primary);
}
#app {
    min-height: 100vh;
}
</style>
