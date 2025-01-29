<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
// import { LockKeyhole, LockKeyholeOpen } from 'lucide-vue'

import logo from '@/assets/logo.jpg'

// Import Pinia store
import { useAuthStore } from '@/stores/auth'

// Validation utilities
import {
  isEmailValid,
  isStrongPassword
} from '@/utils/validator'

// Composition Setup
const router = useRouter()
const authStore = useAuthStore()

// Reactive State
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorEmail = ref('')
const errorPassword = ref('')

// Lifecycle and Redirect
onMounted(() => {
  if (authStore.isLogin) {
    router.push('/')
  }
})

// Methods
const validateInputs = () => {
  let isValid = true
  errorPassword.value = ''
  errorEmail.value = ''

  // Email Validation
  if (!email.value.trim()) {
    errorEmail.value = 'Email cannot be blank'
    isValid = false
  } else if (!isEmailValid(email.value)) {
    errorEmail.value = 'Invalid email format'
    isValid = false
  }

  // Password Validation
  if (!password.value.trim()) {
    errorPassword.value = 'Password cannot be blank'
    isValid = false
  } else if (password.value.length < 8) {
    errorPassword.value = 'Password must be at least 8 characters long'
    isValid = false
  } else if (!isStrongPassword(password.value)) {
    errorPassword.value = 'Password must start with a capital letter, include a number, and a special character'
    isValid = false
  }

  return isValid
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  // Input Validation
  if (!validateInputs()) return

  try {
    // Attempt Login via Pinia Store Action
    await authStore.login({
      email: email.value,
      password: password.value
    })

    // Success Notification
    Swal.fire({
      icon: 'success',
      title: 'Signed in successfully',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })

    // Redirect to Home
    router.push('/')
  } catch (error) {
    // Error Handling
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: 'Login failed',
      text: error.message || 'Invalid email or password. Please try again.'
    })
  }
}
</script>

<template>
  <div class="flex h-screen w-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-300">
    <div class="flex items-center justify-center w-full h-full">
      <div class="mx-auto mt-10 p-8 rounded-xl bg-white shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h1 class="text-center text-3xl font-semibold text-gray-800 mb-8">Login</h1>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <input
              type="text"
              class="w-full p-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Email"
              v-model="email"
              required
              autocomplete="off"
            />
            <p v-if="errorEmail" class="mt-2 text-sm text-red-500">{{ errorEmail }}</p>
          </div>

          <div class="flex items-center gap-2">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="w-full p-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Password"
              v-model="password"
              required
              autocomplete="off"
            />
<!--            <component-->
<!--              :is="showPassword ? 'LockKeyholeOpen' : 'LockKeyhole'"-->
<!--              @click="togglePasswordVisibility"-->
<!--              class="text-gray-700 cursor-pointer"-->
<!--              size="30"-->
<!--              strokeWidth="1.5"-->
<!--            />-->
          </div>

          <p v-if="errorPassword" class="mt-2 text-sm text-red-500">{{ errorPassword }}</p>

          <button
            type="submit"
            class="w-full p-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    <div
      class="relative hidden lg:flex w-full h-full bg-cover bg-center dark:bg-gray-800"
      :style="{ backgroundImage: `url(${logo})` }"
    >
      <div class="absolute inset-0 bg-black opacity-40 dark:opacity-50" />
    </div>
  </div>
</template>
