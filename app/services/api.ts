import axios, { type AxiosInstance, type AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
	authToken = token;
	if (token) {
		apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_token", token);
		}
	} else {
		delete apiClient.defaults.headers.common["Authorization"];
		if (typeof window !== "undefined") {
			localStorage.removeItem("auth_token");
		}
	}
};

// Initialize token from localStorage (client-side only)
if (typeof window !== "undefined") {
	const storedToken = localStorage.getItem("auth_token");
	if (storedToken) {
		setAuthToken(storedToken);
	}
}

// Request interceptor for auth token
apiClient.interceptors.request.use(
	(config) => {
		if (authToken) {
			config.headers.Authorization = `Bearer ${authToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			setAuthToken(null);
			// Optionally redirect to login
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

// Generic API methods
export const api = {
	get: <T>(url: string, params?: any): Promise<T> =>
		apiClient.get(url, { params }).then((response) => response.data),

	post: <T>(url: string, data?: any): Promise<T> =>
		apiClient.post(url, data).then((response) => response.data),

	put: <T>(url: string, data?: any): Promise<T> =>
		apiClient.put(url, data).then((response) => response.data),

	delete: <T>(url: string): Promise<T> =>
		apiClient.delete(url).then((response) => response.data),
};

export default api;
