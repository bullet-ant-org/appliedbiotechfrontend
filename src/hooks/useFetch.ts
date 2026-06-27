import { useState, useCallback, useMemo } from 'react';

interface UseFetchOptions extends RequestInit {
  // Add any custom options here if needed
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: (url: string, options?: UseFetchOptions) => Promise<T | null>;
}

function useFetch<T = any>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const BASE_URL = useMemo(() => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    const productionUrl = 'https://appliedbiotechbackend.onrender.com';
    
    // If we are running on a deployed site (Vercel), prioritize production URL 
    // even if the environment variable was accidentally set to localhost during build.
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) return productionUrl;
    }
    return envUrl || productionUrl;
  }, []);

  const fetchData = useCallback(async (url: string, options?: UseFetchOptions) => {
    setLoading(true);
    setError(null);
    setData(null); // Clear previous data on new request

    try {
      const cleanBase = BASE_URL.replace(/\/$/, '');
      const cleanPath = url.startsWith('/') ? url : `/${url}`;

      const token = typeof window !== 'undefined' ? localStorage.getItem("ab.auth.token") : null;
      const headers = new Headers(options?.headers);
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(`${cleanBase}${cleanPath}`, { ...options, headers });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      
      // Fix: Consume body exactly once to avoid "body already used" errors
      const result = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const msg = (isJson && (result.message || result.error)) || 
                    (typeof result === 'string' ? result : null) || 
                    response.statusText || 
                    `HTTP ${response.status}`;
        throw new Error(msg);
      }

      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err; // Rethrow so the caller (e.g. login page) can catch it
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  return { data, loading, error, fetchData };
}

export default useFetch;