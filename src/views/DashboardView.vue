<template>
  <section class="flex flex-col gap-6">
    <section class="absolute top-2 right-10 flex gap-6 w-1/4">
      <Select
        v-model="filterYear"
        :options="yearOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Filter by year"
        class="w-full"
      />
    </section>
    <h2 class="text-4xl text-mainSoil text-center mb-6 font-extrabold">
      Admin Dashboard
    </h2>
    <section class="flex gap-6 justify-center items-center mb-12">
      <Card class="w-[24%] min-h-[200px]">
        <section class="w-full h-[200px] bg-[#82ca9d] flex justify-center items-center flex-col">
          <h3 class="text-start font-semibold text-mainSoil">Total Income</h3>
          <p class="text-start font-extrabold text-mainGreen text-3xl">
            Rp. {{ formatCurrency(totalPriceOrder) }}
          </p>
        </section>
      </Card>
      <Card class="w-[24%] min-h-[200px]">
        <section class="w-full h-[200px] bg-[#8884d8] flex justify-center items-center flex-col">
          <h3 class="text-start font-semibold text-mainSoil">
            Total Profit ({{ filterYear }})
          </h3>
          <p class="text-start font-extrabold text-mainGreen text-3xl">
            Rp. {{ totalProfit.toLocaleString("id-ID") }}
          </p>
        </section>
      </Card>
      <Card class="w-[24%] min-h-[200px]">
        <section class="w-full h-[200px] bg-[#FF8000] flex justify-center items-center flex-col">
          <h3 class="text-start font-semibold text-mainSoil">
            Total Order ({{ filterYear }})
          </h3>
          <p class="text-start font-extrabold text-mainGreen text-3xl">
            {{ totalOrder.toLocaleString("id-ID") }} Order
          </p>
        </section>
      </Card>
      <Card class="w-[24%] min-h-[200px]">
        <section class="w-full h-[200px] bg-[#FA4032] flex justify-center items-center flex-col">
          <h3 class="text-start font-semibold text-mainSoil">
            Total Purchase ({{ filterYear }})
          </h3>
          <p class="text-start font-extrabold text-mainGreen text-3xl">
            Rp. {{ totalPriceInventory.toLocaleString("id-ID") }}
          </p>
        </section>
      </Card>
    </section>
    <section class="flex gap-4">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full" />
    </section>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import Select from 'primevue/select';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import yearOptionRange from '@/utils/year-option-range.js';

// Pinia store
const dashboardStore = useDashboardStore();

// Reactive state
const filterYear = ref(new Date().getFullYear());

// Fetch dashboard data on mount
onMounted(() => {
  dashboardStore.fetchDashboardData(filterYear.value);
});

// Watch for filterYear changes
watch(filterYear, (newYear) => {
  dashboardStore.fetchDashboardData(newYear);
});

// Computed properties for state
const monthlyPerformance = computed(() => dashboardStore.monthlyPerformance);
const totalProfit = computed(() => dashboardStore.totalProfit);
const totalOrder = computed(() => dashboardStore.totalOrder);
const totalPriceOrder = computed(() => dashboardStore.totalPriceOrder);
const totalPriceInventory = computed(() => dashboardStore.totalPriceInventory);

// Year options
const yearOptions = yearOptionRange().map(year => ({ label: year, value: year }));

// Chart data and options
const chartData = computed(() => {
  return {
    labels: monthlyPerformance.value.map(item => item.month),
    datasets: [
      {
        label: 'Profit',
        backgroundColor: '#8884d8',
        data: monthlyPerformance.value.map(item => item.profit),
      },
      {
        label: 'Income',
        backgroundColor: '#82ca9d',
        data: monthlyPerformance.value.map(item => item.totalPriceOrder),
      },
      {
        label: 'Purchase',
        backgroundColor: '#FA4032',
        data: monthlyPerformance.value.map(item => item.totalPriceInventory),
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: Rp. ${context.raw.toLocaleString('id-ID')}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return `Rp. ${value.toLocaleString('id-ID')}`;
        }
      }
    }
  }
};

// Currency formatting function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value);
};
</script>

<style scoped>
.chart-container {
  height: 500px; /* Adjust the height as needed */
}
</style>
