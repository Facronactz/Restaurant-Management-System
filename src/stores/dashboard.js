import { defineStore } from 'pinia';
import axios from 'axios'
import { setupAxios } from '@/utils/common-axios.js'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    monthlyPerformance: [],
    totalProfit: 0,
    totalPriceOrder: 0,
    totalOrder: 0,
    totalPriceInventory: 0,
    year: 2024,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDashboardData(year) {
      setupAxios()
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`/business-performance/years/${year}`);
        const data = response.data.data;
        // console.log(data)

        // Map the monthly performance data
        // this.monthlyPerformance = data.monthly_performance.map(item => ({
        //   month: item.month.slice(0, 3) + " " + data.years,
        //   profit: item.profit,
        //   totalOrder: item.total_order,
        //   totalPriceOrder: item.total_price_order,
        //   totalPriceInventory: item.total_price_inventory,
        // }));
        this.monthlyPerformance = data.monthly_performance;
        // Set other state properties
        this.totalProfit = data.total_profit;
        this.totalPriceOrder = data.grand_total_price_order;
        this.totalOrder = data.grand_total_order;
        this.totalPriceInventory = data.grand_total_price_inventory;
        this.year = data.years;
      } catch (error) {
        this.error = error.response?.data || "Failed to fetch dashboard data";
      } finally {
        this.loading = false;
      }
    },
  },
});
