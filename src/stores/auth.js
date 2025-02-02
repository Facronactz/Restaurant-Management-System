// stores/auth-router.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { setupAxios } from '@/utils/common-axios.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogin: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),

  actions: {
    async login(credentials) {
      try {
        setupAxios()
        const response = await axios.post('/auth/login', credentials)
        // console.log(response)
        this.isLogin = true
        this.user = response.data.data.user
        this.token = response.data.data.token

        // Store token in localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        // Set default axios authorization header
        setupAxios(this.token)

        return response.data
      } catch (error) {
        // Clear authentication state on failure
        this.logout()
        throw error
      }
    },

    async register(credentials) {
      try {
        setupAxios()
        credentials.role = 'ADMIN'
        const response = await axios.post('/auth/register', credentials)
        // console.log(response)
        return response.data
      } catch (error) {
        // Clear authentication state on failure
        this.logout()
        throw error
      }
    },

    logout() {
      this.isLogin = false
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },

    async validateToken() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get('/api/validate-token')
          this.isLogin = true
          this.user = response.data.user
          return true
        } catch {
          this.logout()
          return false
        }
      }
      return false
    }
  }
})
