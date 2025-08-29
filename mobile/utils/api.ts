import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  "https://x-native-clone-1o6jv44nu-victors-projects-874b0df4.vercel.app/api";

export const createApiClient = (
  getToken: (options?: { template?: string }) => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    // const token = await getToken();
    const token = await getToken({ template: "mobile" });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found from Clerk!");
    }

    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();

  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/users/profile", data),
};
