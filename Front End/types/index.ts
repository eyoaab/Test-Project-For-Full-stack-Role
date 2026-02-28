// User types
export type UserRole = "user" | "manager";

export interface User {
  _id?: string;  // MongoDB ID (entries API)
  id?: string;   // Auth API returns 'id' instead of '_id'
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// Entry types
export type EntryStatus = "pending" | "approved" | "rejected";

export interface Entry {
  _id: string;
  title: string;
  description: string;
  amount: number;
  status: EntryStatus;
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Entry form types
export interface CreateEntryData {
  title: string;
  description: string;
  amount: number;
}

export interface UpdateEntryStatusData {
  status: EntryStatus;
}

// Filter and pagination types
export interface EntryFilters {
  status?: EntryStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// Statistics types
export interface EntryStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Session types (NextAuth)
export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  token: string;
}
