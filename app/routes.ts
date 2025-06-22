import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("form-builder", "routes/form-builder.tsx"),
] satisfies RouteConfig;
