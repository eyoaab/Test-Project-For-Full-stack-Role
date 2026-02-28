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
    const axiosError = error as AxiosError<{ message: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || "An error occurred";
  }
  return "An unexpected error occurred";
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { email, password } = credentials;
    const { data } = await axiosInstance.post<AuthResponse>("/auth/register", { email, password });
    return data;
  },

  registerManager: async (credentials: RegisterCredentials, token: string): Promise<AuthResponse> => {
    const { email, password } = credentials;
    const { data } = await axiosInstance.post<AuthResponse>(
      "/auth/register/manager",
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },
};

// Entries API
export const entriesApi = {
  getMyEntries: async (token: string): Promise<Entry[]> => {
    const { data } = await axiosInstance.get<Entry[]>("/entries/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  getAllEntries: async (token: string, filters?: EntryFilters): Promise<Entry[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    
    const { data } = await axiosInstance.get<Entry[]>(`/entries?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  getEntry: async (id: string, token: string): Promise<Entry> => {
    const { data } = await axiosInstance.get<Entry>(`/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  createEntry: async (entryData: CreateEntryData, token: string): Promise<Entry> => {
    const { data } = await axiosInstance.post<Entry>("/entries", entryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  updateEntryStatus: async (id: string, statusData: UpdateEntryStatusData, token: string): Promise<Entry> => {
    const { data } = await axiosInstance.patch<Entry>(`/entries/${id}/status`, statusData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  deleteEntry: async (id: string, token: string): Promise<void> => {
    await axiosInstance.delete(`/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
