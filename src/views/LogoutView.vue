<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
authStore.logout()

setTimeout(() => {
  window.location.href = '/'
}, 2000)
</script>

<template>
Please wait while you are logged out...
</template>

<style scoped>

</style>
