import type { User, UserRole, SSOProvider } from "../types";

// Mock user data
const MOCK_USERS = {
  google: {
    admin: {
      id: "google-admin-1",
      name: "John Admin (Google)",
      email: "admin@gmail.com",
      role: "Admin" as UserRole,
      provider: "google" as SSOProvider,
    },
    viewer: {
      id: "google-viewer-1",
      name: "Jane Viewer (Google)",
      email: "viewer@gmail.com",
      role: "Viewer" as UserRole,
      provider: "google" as SSOProvider,
    },
  },
  microsoft: {
    admin: {
      id: "microsoft-admin-1",
      name: "Bob Admin (Microsoft)",
      email: "admin@outlook.com",
      role: "Admin" as UserRole,
      provider: "microsoft" as SSOProvider,
    },
    viewer: {
      id: "microsoft-viewer-1",
      name: "Alice Viewer (Microsoft)",
      email: "viewer@outlook.com",
      role: "Viewer" as UserRole,
      provider: "microsoft" as SSOProvider,
    },
  },
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthService {
  /**
   * Mock SSO login
   * Simulates OAuth flow with Google or Microsoft
   */
  static async loginWithSSO(
    provider: SSOProvider,
    role: UserRole
  ): Promise<User> {
    // Simulate network delay
    await delay(1000);

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error(
        `Failed to authenticate with ${provider}. Please try again.`
      );
    }

    const roleKey = role.toLowerCase() as "admin" | "viewer";
    const user = MOCK_USERS[provider][roleKey];

    // Store user in session storage (simulating a token)
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("authToken", `mock-token-${user.id}`);

    return user;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return sessionStorage.getItem("authToken") !== null;
  }

  /**
   * Get current user from session
   */
  static getCurrentUser(): User | null {
    const userJson = sessionStorage.getItem("user");
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
  }

  /**
   * Check if user has admin role
   */
  static isAdmin(user: User | null): boolean {
    return user?.role === "Admin";
  }

  /**
   * Check if user has viewer role
   */
  static isViewer(user: User | null): boolean {
    return user?.role === "Viewer";
  }
}
