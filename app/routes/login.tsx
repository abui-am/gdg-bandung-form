import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/contexts/auth-context";
import { useLogin } from "~/services/mutations/auth";
import type { LoginRequest } from "~/services/types";

export function meta() {
	return [
		{ title: "Login - GDG Bandung" },
		{ name: "description", content: "Login to access your dashboard" },
	];
}

export default function Login() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();
	const emailId = useId();
	const passwordId = useId();

	const [formData, setFormData] = useState<LoginRequest>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<LoginRequest>>({});

	// Redirect if already authenticated
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, isLoading, navigate]);

	const loginMutation = useLogin({
		onSuccess: () => {
			// The token is automatically set by the mutation
			navigate("/", { replace: true });
		},
		onError: (error: any) => {
			console.error("Login error:", error);
			setErrors({
				email:
					error.response?.data?.error ||
					"Login failed. Please check your credentials.",
			});
		},
	});

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginRequest> = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		loginMutation.mutate(formData);
	};

	const handleInputChange =
		(field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));

			// Clear error for this field
			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			}
		};

	// Show loading while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Access your GDG Bandung dashboard
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<Label htmlFor={emailId}>Email address</Label>
							<Input
								id={emailId}
								type="email"
								autoComplete="email"
								value={formData.email}
								onChange={handleInputChange("email")}
								className={errors.email ? "border-red-500" : ""}
								placeholder="Enter your email"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
						</div>

						<div>
							<Label htmlFor={passwordId}>Password</Label>
							<Input
								id={passwordId}
								type="password"
								autoComplete="current-password"
								value={formData.password}
								onChange={handleInputChange("password")}
								className={errors.password ? "border-red-500" : ""}
								placeholder="Enter your password"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password}</p>
							)}
						</div>
					</div>

					<div>
						<Button
							type="submit"
							className="w-full"
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? "Signing in..." : "Sign in"}
						</Button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="font-medium text-primary hover:text-primary/80"
							>
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
