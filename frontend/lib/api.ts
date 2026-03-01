import axios, { AxiosError, AxiosInstance } from "axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Entry,
  CreateEntryData,
  UpdateEntryStatusData,
  ApiResponse,
  EntryFilters,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://test-project-for-full-stack-role.onrender.com/api/v1";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ success?: boolean; message?: string; error?: string }>;
    
    // Check if backend returned a message
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    // Fallback to error field or generic message
    return axiosError.response?.data?.error || "An error occurred";
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    
    // Backend returns { success, message, data: { token, user } }
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }
    
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { email, password } = credentials;
    const response = await axiosInstance.post("/auth/register", { email, password });
    
    // Backend returns { success, message, data: { token, user } }
    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }
    
    return response.data.data;
  },

  registerManager: async (credentials: RegisterCredentials, token: string): Promise<AuthResponse> => {
    const { email, password } = credentials;
    const response = await axiosInstance.post(
      "/auth/register/manager",
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Backend returns { success, message, data: { token, user } }
    if (!response.data.success) {
      throw new Error(response.data.message || "Manager registration failed");
    }
    
    return response.data.data;
  },
};

// Entries API
export const entriesApi = {
  getMyEntries: async (token: string): Promise<Entry[]> => {
    const response = await axiosInstance.get("/entries/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Backend may return { success, data: [...] } or just [...]
    if (response.data.success !== undefined && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    
    return Array.isArray(response.data) ? response.data : [];
  },

  getAllEntries: async (token: string, filters?: EntryFilters): Promise<Entry[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    
    const response = await axiosInstance.get(`/entries?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Backend may return { success, data: [...] } or just [...]
    if (response.data.success !== undefined && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    
    return Array.isArray(response.data) ? response.data : [];
  },

  getEntry: async (id: string, token: string): Promise<Entry> => {
    const response = await axiosInstance.get(`/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Backend may return { success, data: {...} } or just {...}
    if (response.data.success !== undefined && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  },

  createEntry: async (entryData: CreateEntryData, token: string): Promise<Entry> => {
    const response = await axiosInstance.post("/entries", entryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Backend may return { success, data: {...} } or just {...}
    if (response.data.success !== undefined && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  },

  updateEntryStatus: async (id: string, statusData: UpdateEntryStatusData, token: string): Promise<Entry> => {
    const response = await axiosInstance.patch(`/entries/${id}/status`, statusData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Backend may return { success, data: {...} } or just {...}
    if (response.data.success !== undefined && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  },

  deleteEntry: async (id: string, token: string): Promise<void> => {
    await axiosInstance.delete(`/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
