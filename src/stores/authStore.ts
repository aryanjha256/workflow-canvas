import { create } from "zustand";
import type { User, UserRole, SSOProvider } from "../types";
import { AuthService } from "../services/authService";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (provider: SSOProvider, role: UserRole) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;

  // Computed
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isViewer: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (provider: SSOProvider, role: UserRole) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.loginWithSSO(provider, role);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    AuthService.logout();
    set({ user: null, error: null });
  },

  checkAuth: () => {
    const user = AuthService.getCurrentUser();
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },

  isAuthenticated: () => {
    return get().user !== null;
  },

  isAdmin: () => {
    return get().user?.role === "Admin";
  },

  isViewer: () => {
    return get().user?.role === "Viewer";
  },
}));
