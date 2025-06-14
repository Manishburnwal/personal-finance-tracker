import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'https://personal-finance-tracker-backend-p03o.onrender.com/api', // adjust if you're using a different port
});

// Attach token from localStorage to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
