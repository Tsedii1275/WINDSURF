import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API Base URL - adjust based on your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
// Enable mock mode for development when API is not available
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true" ||
    (import.meta.env.VITE_USE_MOCK_API !== "false" && import.meta.env.DEV);

export interface School {
    id: number;
    name: string;
    dean: string;
    students: number;
    programs: number;
}

export interface Campus {
    id: number;
    name: string;
    location: string;
    schools: number;
    users: number;
    status: boolean; // true = Active, false = Inactive
    admin: string;
}

export interface CreateCampusRequest {
    name: string;
    location: string;
    admin: string;
}

// Mock storage for development (in-memory)
let mockCampusesStorage: Campus[] = [
    {
        id: 1,
        name: "Main Campus (6 Kilo)",
        location: "6 Kilo, Addis Ababa",
        schools: 12,
        users: 456,
        status: true,
        admin: "Dr. Alemayehu Bekele",
    },
    {
        id: 2,
        name: "Technology Campus (5 Kilo)",
        location: "5 Kilo, Addis Ababa",
        schools: 8,
        users: 289,
        status: true,
        admin: "Dr. Tigist Haile",
    },
    {
        id: 3,
        name: "Science Campus (4 Kilo)",
        location: "4 Kilo, Addis Ababa",
        schools: 6,
        users: 178,
        status: true,
        admin: "Prof. Kebede Meskel",
    },
    {
        id: 4,
        name: "Commerce Campus",
        location: "Mexico Square",
        schools: 4,
        users: 234,
        status: false,
        admin: "Dr. Sara Mengistu",
    },
    {
        id: 5,
        name: "Medical Campus (Black Lion)",
        location: "Black Lion, Addis Ababa",
        schools: 3,
        users: 567,
        status: true,
        admin: "Prof. Yohannes Tefera",
    },
    {
        id: 6,
        name: "Law Campus (Sidist Kilo)",
        location: "Sidist Kilo, Addis Ababa",
        schools: 2,
        users: 123,
        status: true,
        admin: "Dr. Meseret Abebe",
    },
];

// Mock schools data for each campus
const mockSchoolsData: Record<number, School[]> = {
    1: [ // Main Campus
        { id: 1, name: "School of Engineering", dean: "Dr. Ahmed Hassan", students: 2500, programs: 8 },
        { id: 2, name: "School of Natural Sciences", dean: "Prof. Yemisrach Alemayehu", students: 1800, programs: 6 },
        { id: 3, name: "School of Business", dean: "Dr. Solomon Negash", students: 2100, programs: 5 },
        { id: 4, name: "School of Social Sciences", dean: "Prof. Martha Asefa", students: 1500, programs: 7 },
    ],
    2: [ // Technology Campus
        { id: 5, name: "School of Information Technology", dean: "Dr. Dawit Mengistu", students: 1200, programs: 4 },
        { id: 6, name: "School of Computing", dean: "Prof. Rahel Tesfaye", students: 950, programs: 3 },
        { id: 7, name: "School of Electrical Engineering", dean: "Dr. Getachew Bekele", students: 800, programs: 3 },
    ],
    3: [ // Science Campus
        { id: 8, name: "School of Physics", dean: "Prof. Mulugeta Hailu", students: 650, programs: 2 },
        { id: 9, name: "School of Chemistry", dean: "Dr. Tigist Wondimu", students: 700, programs: 2 },
        { id: 10, name: "School of Biology", dean: "Prof. Amha Desta", students: 850, programs: 3 },
    ],
    4: [ // Commerce Campus
        { id: 11, name: "School of Accounting", dean: "Dr. Hanna Gebreyesus", students: 890, programs: 2 },
        { id: 12, name: "School of Economics", dean: "Prof. Abebe Tilahun", students: 750, programs: 2 },
    ],
    5: [ // Medical Campus
        { id: 13, name: "School of Medicine", dean: "Prof. Yohannes Tefera", students: 1800, programs: 1 },
        { id: 14, name: "School of Nursing", dean: "Dr. Selamawit Assefa", students: 1200, programs: 2 },
    ],
    6: [ // Law Campus
        { id: 15, name: "School of Law", dean: "Dr. Meseret Abebe", students: 950, programs: 1 },
    ],
};

// Fetch all campuses
export const fetchCampuses = async (): Promise<Campus[]> => {
    // Use mock data if mock mode is enabled
    if (USE_MOCK_API) {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...mockCampusesStorage]), 300);
        });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE_URL}/campuses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch campuses: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.warn("API request timeout, using mock data");
            } else {
                console.warn("API request failed, using mock data:", error.message);
            }
        }
        return [...mockCampusesStorage];
    }
};

// Create a new campus
export const createCampus = async (campusData: CreateCampusRequest): Promise<Campus> => {
    // Use mock data if mock mode is enabled
    if (USE_MOCK_API) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCampus: Campus = {
                    id: Math.max(...mockCampusesStorage.map(c => c.id)) + 1,
                    name: campusData.name,
                    location: campusData.location,
                    schools: 0,
                    users: 0,
                    status: true,
                    admin: campusData.admin,
                };

                mockCampusesStorage.push(newCampus);
                resolve(newCampus);
            }, 500);
        });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/campuses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(campusData),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to create campus";

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
                console.warn("API request timeout, using mock data for campus creation");
            } else if (!error.message.includes("Network error") && !error.message.includes("Failed to fetch")) {
                throw error;
            } else {
                console.warn("Network error, using mock data for campus creation:", error.message);
            }
        }

        // Fallback to mock data
        const newCampus: Campus = {
            id: mockCampusesStorage.length > 0 ? Math.max(...mockCampusesStorage.map(c => c.id)) + 1 : 1,
            name: campusData.name,
            location: campusData.location,
            schools: 0,
            users: 0,
            status: true,
            admin: campusData.admin,
        };

        mockCampusesStorage.push(newCampus);
        return newCampus;
    }
};

// Update campus details (name, location, admin)
export const updateCampus = async (campusId: number, campusData: CreateCampusRequest): Promise<Campus> => {
    if (USE_MOCK_API) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const campusIndex = mockCampusesStorage.findIndex(c => c.id === campusId);
                if (campusIndex === -1) {
                    reject(new Error("Campus not found"));
                    return;
                }

                const updatedCampus: Campus = {
                    ...mockCampusesStorage[campusIndex],
                    name: campusData.name,
                    location: campusData.location,
                    admin: campusData.admin,
                };

                mockCampusesStorage[campusIndex] = updatedCampus;
                resolve(updatedCampus);
            }, 500);
        });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/campuses/${campusId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(campusData),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to update campus";

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
            if (error.name === 'AbortError' || error.message.includes("Network error") || error.message.includes("Failed to fetch")) {
                console.warn("API error, using mock data for campus update");
            } else {
                throw error;
            }
        }

        const campusIndex = mockCampusesStorage.findIndex(c => c.id === campusId);
        if (campusIndex === -1) {
            throw new Error("Campus not found");
        }

        const updatedCampus: Campus = {
            ...mockCampusesStorage[campusIndex],
            name: campusData.name,
            location: campusData.location,
            admin: campusData.admin,
        };

        mockCampusesStorage[campusIndex] = updatedCampus;
        return updatedCampus;
    }
};

// Update campus status (active/inactive)
export const updateCampusStatus = async (campusId: number, status: boolean): Promise<Campus> => {
    // Use mock data if mock mode is enabled
    if (USE_MOCK_API) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const campusIndex = mockCampusesStorage.findIndex(c => c.id === campusId);
                if (campusIndex === -1) {
                    reject(new Error("Campus not found"));
                    return;
                }

                const updatedCampus: Campus = {
                    ...mockCampusesStorage[campusIndex],
                    status,
                };

                mockCampusesStorage[campusIndex] = updatedCampus;
                resolve(updatedCampus);
            }, 500);
        });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/campuses/${campusId}/status`, {
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
            let errorMessage = "Failed to update campus status";

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
            } else if (!error.message.includes("Network error") && !error.message.includes("Failed to fetch")) {
                throw error;
            } else {
                console.warn("Network error, using mock data for status update:", error.message);
            }
        }

        // Fallback to mock data
        const campusIndex = mockCampusesStorage.findIndex(c => c.id === campusId);
        if (campusIndex === -1) {
            throw new Error("Campus not found");
        }

        const updatedCampus: Campus = {
            ...mockCampusesStorage[campusIndex],
            status,
        };

        mockCampusesStorage[campusIndex] = updatedCampus;
        return updatedCampus;
    }
};

// Fetch schools for a specific campus
export const fetchCampusSchools = async (campusId: number): Promise<School[]> => {
    // Use mock data if mock mode is enabled
    if (USE_MOCK_API) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const schools = mockSchoolsData[campusId] || [];
                resolve(schools);
            }, 300);
        });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE_URL}/campuses/${campusId}/schools`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch schools: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.warn("API request timeout, using mock data");
            } else {
                console.warn("API request failed, using mock data:", error.message);
            }
        }
        return mockSchoolsData[campusId] || [];
    }
};

// React Query hooks
export const useCampuses = () => {
    return useQuery({
        queryKey: ["campuses"],
        queryFn: fetchCampuses,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateCampus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCampus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["campuses"] });
        },
    });
};

export const useUpdateCampus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ campusId, campusData }: { campusId: number; campusData: CreateCampusRequest }) =>
            updateCampus(campusId, campusData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["campuses"] });
        },
    });
};

export const useUpdateCampusStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ campusId, status }: { campusId: number; status: boolean }) =>
            updateCampusStatus(campusId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["campuses"] });
        },
    });
};

export const useCampusSchools = (campusId: number | null) => {
    return useQuery({
        queryKey: ["campusSchools", campusId],
        queryFn: () => campusId ? fetchCampusSchools(campusId) : Promise.resolve([]),
        enabled: campusId !== null,
        retry: false,
    });
};
