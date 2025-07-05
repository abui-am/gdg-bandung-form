import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/contexts/auth-context";
import { useRegister } from "~/services/mutations/auth";
import type { RegisterRequest } from "~/services/types";

export function meta() {
	return [
		{ title: "Sign Up - GDG Bandung" },
		{ name: "description", content: "Create your account to join GDG Bandung" },
	];
}

export default function SignUp() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	const [formData, setFormData] = useState<RegisterRequest>({
		name: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<
		Partial<RegisterRequest & { confirmPassword: string }>
	>({});
	const [confirmPassword, setConfirmPassword] = useState("");

	// Redirect if already authenticated
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, isLoading, navigate]);

	const registerMutation = useRegister({
		onSuccess: () => {
			navigate("/", { replace: true });
		},
		onError: (error: any) => {
			console.error("Registration error:", error);
			setErrors({
				email:
					error.response?.data?.error ||
					"Registration failed. Please try again.",
			});
		},
	});

	const validateForm = (): boolean => {
		const newErrors: Partial<RegisterRequest & { confirmPassword: string }> =
			{};

		if (!formData.name) {
			newErrors.name = "Name is required";
		} else if (formData.name.length < 2) {
			newErrors.name = "Name must be at least 2 characters";
		}

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

		if (!confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		registerMutation.mutate(formData);
	};

	const handleInputChange =
		(field: keyof RegisterRequest) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));

			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			}
		};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setConfirmPassword(e.target.value);

		if (errors.confirmPassword) {
			setErrors((prev) => ({
				...prev,
				confirmPassword: undefined,
			}));
		}
	};

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
						Join GDG Bandung
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Create your account to start managing events
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<Label htmlFor={nameId}>Full Name</Label>
							<Input
								id={nameId}
								type="text"
								autoComplete="name"
								value={formData.name}
								onChange={handleInputChange("name")}
								className={errors.name ? "border-red-500" : ""}
								placeholder="Enter your full name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600">{errors.name}</p>
							)}
						</div>

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
								autoComplete="new-password"
								value={formData.password}
								onChange={handleInputChange("password")}
								className={errors.password ? "border-red-500" : ""}
								placeholder="Enter your password"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password}</p>
							)}
						</div>

						<div>
							<Label htmlFor={confirmPasswordId}>Confirm Password</Label>
							<Input
								id={confirmPasswordId}
								type="password"
								autoComplete="new-password"
								value={confirmPassword}
								onChange={handleConfirmPasswordChange}
								className={errors.confirmPassword ? "border-red-500" : ""}
								placeholder="Confirm your password"
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600">
									{errors.confirmPassword}
								</p>
							)}
						</div>
					</div>

					<div>
						<Button
							type="submit"
							className="w-full"
							disabled={registerMutation.isPending}
						>
							{registerMutation.isPending
								? "Creating account..."
								: "Create account"}
						</Button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-primary hover:text-primary/80"
							>
								Sign in
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
