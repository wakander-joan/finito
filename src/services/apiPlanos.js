import axios from 'axios';

const apiPlanos = axios.create({
  baseURL: 'http://localhost:9090/planning/api',
});


apiPlanos.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiPlanos;