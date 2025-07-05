import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("events", "routes/events.tsx"),
	route("events/:eventId", "routes/events.$eventId.tsx"),
	route("events/:eventId/form", "routes/events.$eventId.form.tsx"),
	route("events/:eventId/vouchers", "routes/events.$eventId.vouchers.tsx"),
	route("form-builder", "routes/form-builder.tsx"),
	route("login", "routes/login.tsx"),
	route("register", "routes/register.tsx"),
] satisfies RouteConfig;
