// frontend/utils/fetchInterceptor.ts
import toast from 'react-hot-toast';

// Global fetch interceptor that automatically adds authentication
let originalFetch: typeof fetch;

export default function initializeFetchInterceptor() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Store original fetch if not already stored
  if (!originalFetch) {
    originalFetch = window.fetch;
  }

  // Override fetch with authentication interceptor
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Skip authentication for login endpoint
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('/auth/login') || url.includes('/login')) {
      return originalFetch(input, init);
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add authorization header if token exists
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add Content-Type if not already set and body exists
    if (!headers.has('Content-Type') && init?.body && typeof init.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    const response = await originalFetch(input, {
      ...init,
      headers,
    });

    // Handle authentication errors globally (but not for login endpoints)
    if ((response.status === 401 || response.status === 403) && !url.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired or invalid. Please log in again.');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    return response;
  };

}