import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
export const BOOKS_ENDPOINT = '/books';
