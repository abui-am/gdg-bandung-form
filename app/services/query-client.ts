import { QueryClient } from "@tanstack/react-query";

// Create a query client with default options
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			// Don't refetch on window focus by default
			refetchOnWindowFocus: false,
			// Don't refetch on reconnect by default
			refetchOnReconnect: true,
		},
		mutations: {
			// Retry failed mutations once
			retry: 1,
		},
	},
});

export default queryClient;
