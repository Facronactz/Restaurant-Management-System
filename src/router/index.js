import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import authRouter from '@/router/auth-router.js'
import { useAuthStore } from '@/stores/auth.js'
import dashboardRouter from '@/router/dashboard-router.js'

const mainRoutes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/AboutView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: mainRoutes,
})

authRouter.getRoutes().forEach((route) => {
  router.addRoute(route)
})

dashboardRouter.getRoutes().forEach((route) => {
  router.addRoute(route)
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.name !== 'Login' && !authStore.isLogin) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
