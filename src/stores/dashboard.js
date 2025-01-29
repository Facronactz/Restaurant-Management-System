import { defineStore } from 'pinia';
import axios from 'axios'
import { setupAxios } from '@/utils/common-axios.js'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    monthlyPerformance: [],
    totalProfit: 0,
    totalOrder: 0,
    totalPriceOrder: 0,
    totalPriceInventory: 0,
    loading: false,
  }),

  actions: {
    async fetchDashboardData(year) {
      this.loading = true;
      try {
        setupAxios();
        const response = await axios.get(`/business-performance/years/${year}`);
        // console.log(response)
        const data = response.data.data; // Adjust based on your API response structure
        this.monthlyPerformance = data.monthly_performance;
        this.totalProfit = data.total_profit;
        this.totalOrder = data.total_order;
        this.totalPriceOrder = data.total_price_order;
        this.totalPriceInventory = data.total_price_inventory;
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
