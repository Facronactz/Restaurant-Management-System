import { createRouter, createWebHistory } from 'vue-router';

const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: import('@/views/LoginView.vue'),
  },{
    path: '/logout',
    name: 'Logout',
    component: import('@/views/LogoutView.vue'),
  },
];

const authRouter = createRouter({
  history: createWebHistory(),
  routes: authRoutes,
});

export default authRouter;
