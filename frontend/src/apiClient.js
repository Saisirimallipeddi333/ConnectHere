import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// ---------- AUTH HELPERS (register, verify OTP, login) ----------
const AUTH_BASE_URL = 'http://localhost:8080/api/auth';

async function authPost(path, body) {
  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // some endpoints (register, verifyOtp) may return empty body
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function registerUser(payload) {
  // payload: { firstName, lastName, email, password, confirmPassword, role }
  return authPost('/register', payload);
}

export function verifyOtp(payload) {
  // payload: { email, code }
  return authPost('/verify-otp', payload);
}

export function loginUser(payload) {
  // payload: { email, password }
  return authPost('/login', payload);
}

export default api
