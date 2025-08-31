// import { useAuth } from "@clerk/clerk-expo";
// import axios, { AxiosInstance } from "axios";
// import * as SecureStore from "expo-secure-store";

// // const API_BASE_URL =
// //   "https://x-native-clone-1o6jv44nu-victors-projects-874b0df4.vercel.app/api";

// const API_BASE_URL = "https://x-native-clone.onrender.com/api";

// // export const createApiClient = (
// //   getToken: (options?: { template?: string }) => Promise<string | null>
// // ): AxiosInstance => {
// //   const api = axios.create({ baseURL: API_BASE_URL });

// //   // Attach token before each request
// //   api.interceptors.request.use(
// //     async (config) => {
// //       try {
// //         const token = await getToken();
// //         console.log("Got Clerk token:", token?.slice(0, 20));

// //         if (token) {
// //           config.headers.Authorization = `Bearer ${token}`;
// //         } else {
// //           console.warn("⚠️ No token returned from Clerk.");
// //         }
// //       } catch (err) {
// //         console.error("❌ Failed to fetch Clerk token:", err);
// //       }

// //       return config;
// //     },
// //     (error) => {
// //       return Promise.reject(error);
// //     }
// //   );

// //   return api;
// // };

// // React hook to use the API client inside components
// // export const useApiClient = (): AxiosInstance => {
// //   const { getToken } = useAuth();
// //   return createApiClient(getToken);
// // };

// // User endpoints
// // export const userApi = {
// //   syncUser: (api: AxiosInstance) => api.post("/users/sync"),
// //   getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
// //   updateProfile: (api: AxiosInstance, data: any) =>
// //     api.put("/users/profile", data),
// // };

// export const createApiClient = (
//   getToken: (options?: { template?: string }) => Promise<string | null>
// ): AxiosInstance => {
//   const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

//   // Attach token
//   api.interceptors.request.use(
//     async (config) => {
//       const token = await getToken();
//       if (token) {
//         console.log("Got Clerk token:", token.slice(0, 20));
//         config.headers.Authorization = `Bearer ${token}`;
//       } else {
//         console.warn("⚠️ No token returned from Clerk.");
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // 🔹 Ensure we always return the response
//   api.interceptors.response.use(
//     (response) => {
//       console.log("📡 Raw response data:", response.data);
//       return response.data; // <--- don’t swallow it!
//     },
//     (error) => {
//       console.error("❌ API Error:", error.response?.data || error.message);
//       return Promise.reject(error);
//     }
//   );

//   return api;
// };

// export const useApiClient = (): AxiosInstance => {
//   const { getToken } = useAuth();
//   return createApiClient(getToken);
// };

// // User endpoints
// export const userApi = {
//   syncUser: (api: AxiosInstance) => api.post("/users/sync"),
//   getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
//   updateProfile: (api: AxiosInstance, data: any) =>
//     api.put("/users/profile", data),
// };

import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosInstance } from "axios";

// const API_BASE_URL =
//   "https://x-native-clone-1o6jv44nu-victors-projects-874b0df4.vercel.app/api";

const API_BASE_URL = "https://x-native-clone.onrender.com/api";

// 🔹 Factory to create axios client
export const createApiClient = (
  getToken: (options?: { template?: string }) => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

  // Attach Clerk token before each request
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          console.log("Got Clerk token:", token.slice(0, 20));
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("⚠️ No token returned from Clerk.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch Clerk token:", err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Log responses and errors
  api.interceptors.response.use(
    (response) => {
      console.log("📡 Raw response data:", response.data);
      return response; // ✅ return full axios response, not just data
    },
    (error) => {
      console.error(
        "❌ API Error:",
        error.response?.status,
        error.response?.data || error.message
      );
      return Promise.reject(error);
    }
  );

  return api;
};

// React hook to use inside components
export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

// userApi endpoints
export const userApi = {
  syncUser: async (api: AxiosInstance) => {
    try {
      const response = await api.post("/users/sync");
      console.log("✅ Synced user:", response.data); // <-- access .data
      return response.data; // <-- send only data to caller
    } catch (err: any) {
      console.error(
        "❌ Sync error:",
        err.response?.status,
        err.response?.data || err.message
      );
      throw err;
    }
  },

  getCurrentUser: async (api: AxiosInstance) => {
    try {
      const response = await api.get("/users/me");
      console.log("✅ Current user:", response.data);
      return response.data;
    } catch (err: any) {
      console.error(
        "❌ GetCurrentUser error:",
        err.response?.data || err.message
      );
      throw err;
    }
  },

  updateProfile: async (api: AxiosInstance, data: any) => {
    try {
      const response = await api.put("/users/profile", data);
      console.log("✅ Updated profile:", response.data);
      return response.data;
    } catch (err: any) {
      console.error(
        "❌ UpdateProfile error:",
        err.response?.data || err.message
      );
      throw err;
    }
  },
};
