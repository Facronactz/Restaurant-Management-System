<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductsStore } from '@/stores/products' // Adjust the import based on your store structure
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import { SquarePlus, SquarePen, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js' // Adjust based on your icon library

const productsStore = useProductsStore()
const userStore = useAuthStore()

const products = computed(() => productsStore.products)
const paging = computed(() => productsStore.paging)
const page = computed(() => productsStore.page)

const searchByName = ref('')
const selectedCategory = ref('')
const name = ref('')
const price = ref('')
const categories = ref('')
const isStockAvailable = ref('READY') // Default to "READY"

const productId = ref('')

const tableHeaders = ['Name', 'Category', 'Price', 'User  Name', 'Available', 'Action']

const categoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Foods', value: 'FOODS' },
  { label: 'Drinks', value: 'DRINKS' },
]

const stockOptions = [
  { label: 'Ready', value: 'READY' },
  { label: 'Not Ready', value: 'NOT_READY' },
]

// Fetch products on mount
onMounted(() => {
  productsStore.fetchProducts()
})

// Watch for search and category changes
watch([searchByName, selectedCategory], () => {
  const params = {
    name: searchByName.value,
    category: selectedCategory.value,
  }
  productsStore.fetchProducts(params)
})

// Handle page change
const handlePageChange = (newPage) => {
  productsStore.setPage(newPage)
}

// Reset form
const resetForm = (needToClose = false) => {
  productId.value = ''
  name.value = ''
  price.value = ''
  categories.value = ''
  isStockAvailable.value = 'READY'

  if (needToClose) {
    document.getElementById('modal_form_product').close()
  }
}

// Handle delete
const handleDelete = async (id) => {
  await productsStore.deleteProduct(id)
  productsStore.fetchProducts()
}

// Handle edit button click
const onButtonEditClick = (id) => {
  const product = products.value.find((p) => p.id_product === id)
  if (product) {
    productId.value = product.id_product
    name.value = product.product_name
    price.value = product.product_price
    categories.value = product.categories
    isStockAvailable.value = product.available_stock
    document.getElementById('modal_form_product').showModal()
  }
}

// Handle add button click
const onButtonAddClick = () => {
  resetForm()
  document.getElementById('modal_form_product').showModal()
}

// Handle form submission
const handleSubmit = async () => {
  const data = {
    id_user: userStore.user.id_user,
    product_name: name.value,
    product_price: price.value,
    categories: categories.value,
    available_stock: isStockAvailable.value,
  }

  if (productId.value) {
    await productsStore.updateProduct({ id: productId.value, ...data })
  } else {
    await productsStore.createProduct(data)
  }

  resetForm()
  document.getElementById('modal_form_product').close()
  productsStore.fetchProducts()
}

// Currency formatting function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}
</script>

<template>
  <div class="container mx-auto my-4 p-4">
    <h2 class="text-3xl font-bold">Products</h2>
    <div class="flex justify-end gap-5">
      <InputText v-model="searchByName" placeholder="Search by name" class="w-full max-w-xs" />
      <Select
        v-model="selectedCategory"
        :options="categoryOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="All Categories"
        class="w-full max-w-xs"
      />
      <Button @click="onButtonAddClick">
        <SquarePlus size="1.5em" color="#00d12a" />
      </Button>
    </div>

    <dialog id="modal_form_product" class="modal">
      <div class="modal-box">
        <form @submit.prevent="handleSubmit">
          <InputText v-model="name" placeholder="Product Name" class="my-2" />
          <InputText v-model="price" type="number" placeholder="Product Price" class="my-2" />
          <Select
            v-model="categories"
            :options="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Category"
            class="my-2"
          />
          <Select
            v-model="isStockAvailable"
            :options="stockOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Stock Availability"
            class="my-2"
          />
          <Button type="submit">Submit</Button>
        </form>
        <div class="modal-action">
          <Button @click="resetForm(true)">Close</Button>
        </div>
      </div>
    </dialog>

    <div class="overflow-x-auto shadow-lg outline outline-1 outline-slate-300 rounded-md mt-2">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="6" class="text-center">No products available</td>
          </tr>
          <tr v-for="(item, index) in products" :key="item.id_product">
            <th>{{ (page - 1) * 10 + index + 1 }}</th>
            <td>{{ item.product_name }}</td>
            <td>{{ item.categories }}</td>
            <td>{{ formatCurrency(item.product_price) }}</td>
            <td>{{ item.user.name }}</td>
            <td>{{ item.available_stock }}</td>
            <td>
              <Button @click="onButtonEditClick(item.id_product)">
                <SquarePen size="1.5em" color="#00d15b" />
              </Button>
              <Button @click="handleDelete(item.id_product)">
                <Trash2 size="1.5em" color="#d12a00" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Paginator
      v-if="paging.totalPages > 1"
      :total="paging.totalPages"
      :currentPage="page"
      @change="handlePageChange"
    />
  </div>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
