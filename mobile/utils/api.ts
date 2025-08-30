import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  "https://x-native-clone-1o6jv44nu-victors-projects-874b0df4.vercel.app/api";

export const createApiClient = (
  getToken: (options?: { template?: string }) => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  // Attach token before each request
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        console.log("Got Clerk token:", token?.slice(0, 20));

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("⚠️ No token returned from Clerk.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch Clerk token:", err);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

// React hook to use the API client inside components
export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

// User endpoints
export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/users/profile", data),
};
