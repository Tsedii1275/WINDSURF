import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API Base URL - adjust based on your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
// Enable mock mode for development when API is not available
// Set VITE_USE_MOCK_API=false to force API mode, or leave unset for auto-detection
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true" ||
  (import.meta.env.VITE_USE_MOCK_API !== "false" && import.meta.env.DEV);

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  campus?: string;
  avatar?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  password?: string;
}

export interface UpdateUserRequest {
  name: string;
  role: string;
  campus: string;
  status: "Active" | "Inactive";
}

export interface ResetPasswordResponse {
  temporaryPassword: string;
}

// Mock storage for development (in-memory)
let mockUsersStorage: User[] = [
  { id: 1, name: "Abebe Kebede", email: "abebe.k@aau.edu.et", role: "ICT Admin", status: "Active", campus: "Main Campus (6 Kilo)", avatar: "AK" },
  { id: 2, name: "Sara Hailu", email: "sara.h@aau.edu.et", role: "Campus Admin", status: "Active", campus: "Technology Campus", avatar: "SH" },
  { id: 3, name: "Dawit Tesfaye", email: "dawit.t@aau.edu.et", role: "Training Coordinator", status: "Inactive", campus: "Science Campus", avatar: "DT" },
  { id: 4, name: "Meron Alemu", email: "meron.a@aau.edu.et", role: "Finance Officer", status: "Active", campus: "Main Campus (6 Kilo)", avatar: "MA" },
  { id: 5, name: "Yonas Girma", email: "yonas.g@aau.edu.et", role: "Rental Officer", status: "Active", campus: "Commerce Campus", avatar: "YG" },
  { id: 6, name: "Tigist Bekele", email: "tigist.b@aau.edu.et", role: "Auditor", status: "Active", campus: "Medical Campus", avatar: "TB" },
  { id: 7, name: "Henok Tadesse", email: "henok.t@aau.edu.et", role: "Training Coordinator", status: "Active", campus: "Law Campus", avatar: "HT" },
];

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  // Use mock data if mock mode is enabled
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockUsersStorage]), 300);
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: unknown) {
    // If fetch fails (network error, CORS, etc.), fall back to mock data
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("API request timeout, using mock data");
      } else {
        console.warn("API request failed, using mock data:", error.message);
      }
    }
    // Return mock data as fallback
    return [...mockUsersStorage];
  }
};

// Create a new user
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  // Use mock data if mock mode is enabled
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const getInitials = (name: string) => {
          return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        };

        const newUser: User = {
          id: Math.max(...mockUsersStorage.map(u => u.id)) + 1,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
          campus: "Main Campus (6 Kilo)", // Default campus
          avatar: getInitials(userData.name),
        };

        mockUsersStorage.push(newUser);
        resolve(newUser);
      }, 500);
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to create user";

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
    // If fetch fails (network error, CORS, timeout, etc.), fall back to mock data
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("API request timeout, using mock data for user creation");
      } else if (error.message.includes("Failed to create user")) {
        // Only throw if it's a real API error (not a network error)
        // Check if we got a response (status code error)
        if (!error.message.includes("Network error") && !error.message.includes("Failed to fetch")) {
          throw error; // Re-throw actual API errors (like validation errors from backend)
        }
        // Otherwise, fall through to mock data
        console.warn("API request failed, using mock data for user creation:", error.message);
      } else {
        // Network errors (Failed to fetch, CORS, etc.) - use mock data
        console.warn("Network error, using mock data for user creation:", error.message);
      }
    }

    // Fallback to mock data when API is not available
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const newUser: User = {
      id: mockUsersStorage.length > 0 ? Math.max(...mockUsersStorage.map(u => u.id)) + 1 : 1,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      campus: "Main Campus (6 Kilo)", // Default campus
      avatar: getInitials(userData.name),
    };

    mockUsersStorage.push(newUser);
    return newUser;
  }
};

// Update an existing user
export const updateUser = async (userId: number, userData: UpdateUserRequest): Promise<User> => {
  // Use mock data if mock mode is enabled
  if (USE_MOCK_API) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsersStorage.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          reject(new Error("User not found"));
          return;
        }

        const getInitials = (name: string) => {
          return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        };

        const updatedUser: User = {
          ...mockUsersStorage[userIndex],
          name: userData.name,
          role: userData.role,
          campus: userData.campus,
          status: userData.status,
          avatar: getInitials(userData.name),
        };

        mockUsersStorage[userIndex] = updatedUser;
        resolve(updatedUser);
      }, 500);
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to update user";

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("API request timeout, using mock data for user update");
      } else if (error.message.includes("Failed to update user")) {
        if (!error.message.includes("Network error") && !error.message.includes("Failed to fetch")) {
          throw error;
        }
        console.warn("API request failed, using mock data for user update:", error.message);
      } else {
        console.warn("Network error, using mock data for user update:", error.message);
      }
    }

    // Fallback to mock data
    const userIndex = mockUsersStorage.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const updatedUser: User = {
      ...mockUsersStorage[userIndex],
      name: userData.name,
      role: userData.role,
      campus: userData.campus,
      status: userData.status,
      avatar: getInitials(userData.name),
    };

    mockUsersStorage[userIndex] = updatedUser;
    return updatedUser;
  }
};

// Reset user password
export const resetPassword = async (userId: number): Promise<ResetPasswordResponse> => {
  // Use mock data if mock mode is enabled
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random password
        const tempPassword = `Temp${Math.random().toString(36).slice(2, 10)}!`;
        resolve({ temporaryPassword: tempPassword });
      }, 500);
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to reset password";

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("API request timeout, using mock data for password reset");
      } else if (error.message.includes("Failed to reset password")) {
        if (!error.message.includes("Network error") && !error.message.includes("Failed to fetch")) {
          throw error;
        }
        console.warn("API request failed, using mock data for password reset:", error.message);
      } else {
        console.warn("Network error, using mock data for password reset:", error.message);
      }
    }

    // Fallback to mock data
    const tempPassword = `Temp${Math.random().toString(36).slice(2, 10)}!`;
    return { temporaryPassword: tempPassword };
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (userId: number, status: "Active" | "Inactive"): Promise<User> => {
  // Use mock data if mock mode is enabled
  if (USE_MOCK_API) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsersStorage.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          reject(new Error("User not found"));
          return;
        }

        const updatedUser: User = {
          ...mockUsersStorage[userIndex],
          status,
        };

        mockUsersStorage[userIndex] = updatedUser;
        resolve(updatedUser);
      }, 500);
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to update user status";

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("API request timeout, using mock data for status update");
      } else if (error.message.includes("Failed to update user status")) {
        if (!error.message.includes("Network error") && !error.message.includes("Failed to fetch")) {
          throw error;
        }
        console.warn("API request failed, using mock data for status update:", error.message);
      } else {
        console.warn("Network error, using mock data for status update:", error.message);
      }
    }

    // Fallback to mock data
    const userIndex = mockUsersStorage.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...mockUsersStorage[userIndex],
      status,
    };

    mockUsersStorage[userIndex] = updatedUser;
    return updatedUser;
  }
};

// React Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: false, // Don't retry on failure, use fallback mock data
    refetchOnWindowFocus: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users after successful creation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: UpdateUserRequest }) =>
      updateUser(userId, userData),
    onSuccess: () => {
      // Invalidate and refetch users after successful update
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (userId: number) => resetPassword(userId),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: "Active" | "Inactive" }) =>
      updateUserStatus(userId, status),
    onSuccess: () => {
      // Invalidate and refetch users after successful status update
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
