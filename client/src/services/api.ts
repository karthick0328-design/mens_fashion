import axios from 'axios';
import {
  getMockCategories,
  saveMockCategory,
  updateMockCategory,
  deleteMockCategory,
  INITIAL_COLLECTIONS,
  getMockDashboard,
} from './mockFallback';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo users for offline / static Vercel preview
const DEMO_ADMIN = {
  _id: '67a8b9c0d1e2f3a4b5c6d7e8',
  name: 'Aurelius Executive',
  email: 'admin@example.com',
  role: 'SUPER_ADMIN',
  phone: '+91 98765 43210',
  addresses: [
    {
      _id: 'demo-addr-admin-1',
      name: 'Aurelius Headquarters',
      phone: '+91 98765 43210',
      addressLine1: '402, High Street Phoenix',
      addressLine2: 'Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400013',
      country: 'India',
      isDefault: true,
    },
  ],
};

const DEMO_CUSTOMER = {
  _id: '67a8b9c0d1e2f3a4b5c6d7e0',
  name: 'Karthick Ramanathan',
  email: 'customer@aurelius.com',
  role: 'CUSTOMER',
  phone: '+91 98840 12345',
  addresses: [
    {
      _id: 'demo-addr-cust-1',
      name: 'Karthick Ramanathan',
      phone: '+91 98840 12345',
      addressLine1: '12, Luxury Boulevard',
      addressLine2: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      isDefault: true,
    },
  ],
};

// Helper: Provide mock response when running on static hosting (like Vercel SPA) where backend is not yet hosted
function resolveMockFallback(config: any) {
  const url = (config.url || '').replace(/^\/api\/v1/, '');
  const method = (config.method || 'get').toLowerCase();
  let body: any = {};
  try {
    body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
  } catch {
    body = config.data || {};
  }

  // 1. Auth Login
  if (url.includes('/auth/login') && method === 'post') {
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (
      (email === 'admin@example.com' || email === 'admin@aurelius.com') &&
      password === 'Admin@123'
    ) {
      return {
        data: {
          success: true,
          message: 'Admin authentication granted',
          data: { user: DEMO_ADMIN, token: 'demo-jwt-admin-token' },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    if (email === 'customer@aurelius.com' && password === 'Customer@123456') {
      return {
        data: {
          success: true,
          message: 'Client authentication granted',
          data: { user: DEMO_CUSTOMER, token: 'demo-jwt-customer-token' },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    const err: any = new Error('Invalid email or password. Please try again.');
    err.response = {
      status: 401,
      data: { success: false, message: 'Invalid email or password. Please try again.' },
    };
    throw err;
  }

  // 2. Auth Register
  if (url.includes('/auth/register') && method === 'post') {
    const newUser = {
      _id: 'user-' + Date.now(),
      name: body.name || 'Aurelius Client',
      email: body.email || 'client@aurelius.com',
      role: 'CUSTOMER',
      addresses: [],
    };
    return {
      data: {
        success: true,
        message: 'Account registered successfully',
        data: { user: newUser, token: 'demo-jwt-reg-token' },
      },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // 3. Admin Categories
  if (url.includes('/admin/categories')) {
    if (method === 'get') {
      return {
        data: { success: true, data: getMockCategories() },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (method === 'post') {
      const created = saveMockCategory(body);
      return {
        data: { success: true, message: 'Department created successfully', data: created },
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (method === 'put') {
      const id = url.split('/').pop() || '';
      const updated = updateMockCategory(id, body);
      return {
        data: { success: true, message: 'Department updated successfully', data: updated },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (method === 'delete') {
      const id = url.split('/').pop() || '';
      deleteMockCategory(id);
      return {
        data: { success: true, message: 'Department deleted successfully' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 4. Admin Collections
  if (url.includes('/admin/collections')) {
    return {
      data: { success: true, data: INITIAL_COLLECTIONS },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // 5. Admin Dashboard Analytics
  if (url.includes('/admin/analytics/dashboard')) {
    return {
      data: { success: true, data: getMockDashboard() },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  return null;
}

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurelius_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 and fallback for static hosts like Vercel (405 / HTML rewrites)
api.interceptors.response.use(
  (response) => {
    // If Vercel rewrote an API request to index.html (returns HTML string with 200)
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html')) {
      const fallback = resolveMockFallback(response.config);
      if (fallback) return fallback as any;
    }
    return response;
  },
  (error) => {
    // If Vercel returned 405 Method Not Allowed, or network error / 404
    const isStaticDeployError =
      error.response?.status === 405 ||
      error.response?.status === 404 ||
      error.code === 'ERR_NETWORK' ||
      !error.response;

    if (isStaticDeployError && error.config) {
      try {
        const fallback = resolveMockFallback(error.config);
        if (fallback) {
          return Promise.resolve(fallback);
        }
      } catch (mockError) {
        return Promise.reject(mockError);
      }
    }

    if (error.response?.status === 401) {
      // Clear token if expired
      const isAuthRoute =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/register');
      if (!isAuthRoute && localStorage.getItem('aurelius_token')) {
        localStorage.removeItem('aurelius_token');
        localStorage.removeItem('aurelius_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
