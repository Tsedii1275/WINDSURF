import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "SYSTEM_ADMIN" | "OFFICE_USER" | "PUBLIC";

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    role: Role;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for token/session
        const savedUser = localStorage.getItem("auth_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        // Mock login logic
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                let role: Role = "OFFICE_USER";
                let name = "Office User";

                if (email.includes("admin")) {
                    role = "SYSTEM_ADMIN";
                    name = "System Administrator";
                } else if (!email.endsWith("@aau.edu.et")) {
                    role = "PUBLIC";
                    name = email.split("@")[0];
                }

                const newUser: User = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    email,
                    role,
                };

                setUser(newUser);
                localStorage.setItem("auth_user", JSON.stringify(newUser));
                localStorage.setItem("token", "mock-token");
                setIsLoading(false);
                resolve();
            }, 1000);
        });
    };

    const signup = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const newUser: User = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    email,
                    role: "PUBLIC",
                };

                setUser(newUser);
                localStorage.setItem("auth_user", JSON.stringify(newUser));
                localStorage.setItem("token", "mock-token");
                setIsLoading(false);
                resolve();
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("token");
    };

    const role: Role = user?.role || "PUBLIC";

    return (
        <AuthContext.Provider value={{ user, role, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
