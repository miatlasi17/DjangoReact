import axios from 'axios';
import store from './store'; // Assuming your Redux store is named 'store'

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && store.getState().user.isAuthenticated) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (error.response.status === 401 && !originalRequest._retry && accessToken) {
      originalRequest._retry = true;
      
      try {
        const response = await api.post('token/refresh/', {
          refresh: refreshToken,
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        
        // Update Redux store with new access token
        store.dispatch(refreshToken.fulfilled({ isAuthenticated: true }));
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Handle token refresh failure (e.g., logout the user)
        // ...
      }
    }
    return Promise.reject(error);
  }
);

export { api };
