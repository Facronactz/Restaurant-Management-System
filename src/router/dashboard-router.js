import { createRouter, createWebHistory } from 'vue-router';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: import('@/views/DashboardView.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: import('@/views/ProductsView.vue'),
  },
];

const dashboardRouter = createRouter({
  history: createWebHistory(),
  routes: dashboardRoutes,
});

export default dashboardRouter;
