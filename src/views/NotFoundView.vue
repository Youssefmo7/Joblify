<template>
    <div class="not-found">
        <div class="not-found__card">
            <p class="not-found__eyebrow">404</p>
            <h1 class="not-found__title">Page not found</h1>
            <p class="not-found__subtitle">
                The page you are looking for doesn’t exist or has been moved.
            </p>

            <div class="not-found__actions">
                <RouterLink class="btn-primary" to="/">Go home</RouterLink>
                <RouterLink class="btn-ghost" to="/login">Sign in</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.not-found {
    min-height: calc(100vh - 64px);
    display: grid;
    place-items: center;
    padding: 24px;
    background: var(--color-background-tertiary);
}
.not-found__card {
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: var(--border-radius-lg);
    padding: 40px;
    width: min(480px, 100%);
    text-align: center;
}
.not-found__eyebrow {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    margin: 0 0 8px;
}
.not-found__title {
    font-size: 26px;
    margin: 0 0 10px;
}
.not-found__subtitle {
    color: var(--color-text-secondary);
    margin: 0 0 24px;
}
.not-found__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}
.btn-primary,
.btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    border-radius: var(--border-radius-md);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
}
.btn-primary {
    background: #e8246a;
    color: #fff;
}
.btn-ghost {
    background: transparent;
    border: 1px solid var(--color-border-secondary);
    color: var(--color-text-primary);
}
.btn-primary:hover,
.btn-ghost:hover {
    opacity: 0.9;
}
</style>
