import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const setupAxios = (token) => {
  axios.defaults.baseURL = API_ENDPOINT;

  const authToken = token || localStorage.getItem('token');

  if (authToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
