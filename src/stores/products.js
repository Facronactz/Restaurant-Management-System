import { defineStore } from 'pinia';
import axios from 'axios'
import { setupAxios } from '@/utils/common-axios.js'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    productById: null,
    paging: {},
    page: 1,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        setupAxios()
        const response = await axios.get('/products?page=0&size=100', { params });
        console.log(response)
        const data = response.data.data;
        this.products = data.content;
        this.paging = {
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        }
      } catch (error) {
        this.error = error.response?.data || "Failed to fetch products";
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`/products/${id}`);
        this.productById = response.data;
      } catch (error) {
        this.error = error.response?.data || "Failed to fetch product";
      } finally {
        this.loading = false;
      }
    },

    async createProduct(data) {
      this.loading = true;
      this.error = null;

      try {
        await axios.post('/products/create', data);
      } catch (error) {
        this.error = error.response?.data || "Failed to create product";
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(data) {
      this.loading = true;
      this.error = null;
      const id = data.id;
      delete data.id;

      try {
        await axios.put(`/products/update/${id}`, data);
      } catch (error) {
        this.error = error.response?.data || "Failed to update product";
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/products/delete/${id}`);
      } catch (error) {
        this.error = error.response?.data || "Failed to delete product";
      } finally {
        this.loading = false;
      }
    },

    setPage(page) {
      this.page = page;
    },
  },
});
