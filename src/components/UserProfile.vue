<template>
  <div class="user-profile">
    <h2>User Profile</h2>
    <p>Name: {{ user.name }}</p>
    <p>Email: {{ user.email }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      user: { name: '', email: '' } // Fetch from API
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}
</style>