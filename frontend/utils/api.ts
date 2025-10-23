// frontend/utils/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get API URL
export function getApiUrl(endpoint: string): string {
  return `${API_URL}${endpoint}`;
}

// Simple fetch wrapper for API calls (authentication is handled by the global interceptor)
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(getApiUrl(endpoint), options);
}

// Helper for JSON responses
export async function apiJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(endpoint, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}