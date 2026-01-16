import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface UpdateProfileRequest {
  name: string;
  department: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Mock user profile (for development)
let mockProfile: UserProfile = {
  id: 1,
  name: "System Administrator",
  email: "admin@aau.edu.et",
  role: "ICT Administrator",
  department: "ICT Department",
};

// Get current user profile
export const fetchProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  } catch (error) {
    // Fallback to mock data
    console.warn("API request failed, using mock profile data");
    return { ...mockProfile };
  }
};

// Update user profile
export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/users/${mockProfile.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to update profile";
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Fallback to mock update
    if (error instanceof Error && !error.message.includes("Failed to update")) {
      console.warn("API request failed, using mock update");
      mockProfile = { ...mockProfile, ...data };
      return { ...mockProfile };
    }
    throw error;
  }
};

// Change password
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  const token = localStorage.getItem("token");
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to change password";
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    // For mock mode, just simulate success
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      console.warn("API request failed, simulating password change");
      return Promise.resolve();
    }
    throw error;
  }
};

// React Query hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
