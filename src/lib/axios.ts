import axios from 'axios';

// Create a dedicated Axios instance for API calls
const rawBase = import.meta.env['VITE_API_BASE_URL'] ?? '';
// ensure base ends without trailing slash and default to /v1 prefix used by API
const baseURL = rawBase.replace(/\/$/, '') + '/v1';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// If an auth token is provided via env, attach it to default headers
const token = import.meta.env['VITE_API_AUTH_TOKEN'];
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor: global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log useful information for debugging
    // error.response may be undefined for network errors
    // eslint-disable-next-line no-console
    try {
      if (error && error.response) {
        console.error('API Error: status=', error.response.status);
        console.error('API Error: data=', error.response.data);
      } else {
        console.error('API Error:', error?.message ?? error);
      }
    } catch (e) {
      // fallback
      // eslint-disable-next-line no-console
      console.error('API Error (logging failed):', error);
    }

    // Optionally you can show a toast here, or normalize the error shape
    // e.g. toast.error(error?.response?.data?.message || 'Unknown error');

    return Promise.reject(error);
  }
);

// Request interceptor: attach token from Zustand store dynamically
apiClient.interceptors.request.use(async (config) => {
  try {
    // import store getter dynamically to avoid potential circular imports
    const mod = await import('../store/auth');
    const getToken = (mod.default && (mod.default.getState ? mod.default.getState().token : null)) as string | null;
    const token = getToken ?? null;
    if (token) {
      // cast to any to avoid Axios typed headers mismatch in this simple helper
      (config.headers as any) = config.headers || {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore if store not available
  }
  return config;
});

export default apiClient;
