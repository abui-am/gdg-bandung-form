import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLogout } from "~/services";
import { useProfile } from "~/services/queries/auth";
import type { User } from "~/services/types";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	const {
		data: profileData,
		isLoading: isProfileLoading,
		error: profileError,
	} = useProfile({
		enabled: typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
		retry: false,
		queryKey: ["profile"],
	});

	// Debug logging for profile query
	useEffect(() => {
		console.log("Profile query state:", { 
			profileData, 
			isProfileLoading, 
			profileError,
			hasToken: typeof window !== "undefined" && !!localStorage.getItem("auth_token")
		});
	}, [profileData, isProfileLoading, profileError]);

	const logoutMutation = useLogout({
		onSuccess: () => {
			setUser(null);
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		},
	});

	// Listen for token changes via custom event
	useEffect(() => {
		const handleTokenChange = (e: CustomEvent) => {
			console.log("Auth token changed via custom event", { 
				token: e.detail.token,
				action: e.detail.action 
			});
			if (e.detail.action === "remove" && user) {
				// Token was removed, clear user
				setUser(null);
			}
		};

		window.addEventListener("authTokenChanged", handleTokenChange as EventListener);
		return () => window.removeEventListener("authTokenChanged", handleTokenChange as EventListener);
	}, [user]);

	useEffect(() => {
		if (typeof window === "undefined") {
			setIsInitialized(true);
			return;
		}

		const token = localStorage.getItem("auth_token");
		console.log("Auth context initialization", { token, user, profileData });
		
		if (!token) {
			setIsInitialized(true);
			return;
		}

		if (profileData) {
			console.log("Setting user from profile data", { profileData });
			setUser(profileData);
			setIsInitialized(true);
		} else if (profileError) {
			console.log("Profile error, clearing token", { profileError });
			// Token is invalid
			localStorage.removeItem("auth_token");
			setIsInitialized(true);
		}
	}, [profileData, profileError]);

	const logout = () => {
		logoutMutation.mutate();
	};

	const value: AuthContextType = {
		user,
		isLoading: !isInitialized || isProfileLoading,
		isAuthenticated: !!user,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
