// API Response Types
export interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
}

// Auth Types
export interface User {
	id: number;
	name: string;
	email: string;
	created_at: string;
	updated_at: string;
	events?: Event[];
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

// Event Types
export enum EventType {
	ONLINE = "online",
	OFFLINE = "offline",
	HYBRID = "hybrid",
}

export interface Event {
	id: number;
	title: string;
	description: string;
	start_date: string;
	end_date: string;
	location: string;
	link: string;
	event_type: EventType;
	is_published: boolean;
	user_id: number;
	created_at: string;
	updated_at: string;
	user?: User;
	tickets?: Ticket[];
	vouchers?: Voucher[];
	registrations?: Registration[];
	form?: Form;
}

export interface UpdateEventRequest {
	title?: string;
	description?: string;
	start_date?: string;
	end_date?: string;
	location?: string;
	link?: string;
	event_type?: EventType;
	is_published?: boolean;
}

// Form Types
export interface FormField {
	id: string;
	type: "text" | "textarea" | "email" | "dropdown" | "checkbox"; // text, textarea, email, dropdown, checkbox
	label: string;
	required: boolean;
	options?: string[]; // For dropdown and checkbox
	properties?: Record<string, any>;
}

export interface Form {
	id: number;
	event_id: string;
	form_config: FormField[];
	created_at: string;
	updated_at: string;
	event?: Event;
}

export interface CreateFormRequest {
	event_id: string;
	form_config: FormField[];
}

// Ticket Types
export interface Ticket {
	id: number;
	event_id: string;
	name: string;
	price: number;
	quota: number;
	sold: number;
	created_at: string;
	updated_at: string;
	event?: Event;
	registrations?: Registration[];
	voucher_tickets?: VoucherTicketType[];
}

export interface CreateTicketRequest {
	event_id: string;
	name: string;
	price: number;
	quota: number;
}

export interface UpdateTicketRequest {
	name?: string;
	price?: number;
	quota?: number;
}

// Voucher Types
export enum VoucherType {
	PERCENTAGE = "percentage",
	FIXED = "fixed",
}

export interface Voucher {
	id: number;
	event_id: string;
	code: string;
	type: VoucherType;
	value: number;
	quota: number;
	used: number;
	is_active: boolean;
	expiry_date: string;
	created_at: string;
	updated_at: string;
	event?: Event;
	registrations?: Registration[];
	voucher_tickets?: VoucherTicketType[];
}

export interface CreateVoucherRequest {
	event_id: string;
	code: string;
	type: VoucherType;
	value: number;
	quota: number;
	expiry_date: string;
	ticket_ids?: number[];
}

export interface UpdateVoucherRequest {
	code?: string;
	type?: VoucherType;
	value?: number;
	quota?: number;
	expiry_date?: string;
	is_active?: boolean;
	ticket_ids?: number[];
}

export interface ValidateVoucherRequest {
	code: string;
	ticket_id: number;
}

export interface ValidateVoucherResponse {
	valid: boolean;
	discount_amount: number;
	message: string;
}

export interface VoucherTicketType {
	id: number;
	voucher_id: number;
	ticket_id: number;
	created_at: string;
	voucher?: Voucher;
	ticket?: Ticket;
}

// Registration Types
export enum RegistrationStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	CANCELLED = "cancelled",
}

export interface Registration {
	id: number;
	event_id: string;
	ticket_id: number;
	voucher_id?: number;
	registration_code: string;
	status: RegistrationStatus;
	final_amount: number;
	discount_amount: number;
	created_at: string;
	updated_at: string;
	event?: Event;
	ticket?: Ticket;
	voucher?: Voucher;
	payment?: Payment;
	attendee_data?: Record<string, any>;
}

export interface CreateRegistrationRequest {
	event_id: string;
	ticket_id: number;
	voucher_code?: string;
	attendee_data: Record<string, any>;
}

export interface RegistrationResponse {
	registration: Registration;
	payment_url?: string;
}

// Payment Types
export enum PaymentStatus {
	PENDING = "pending",
	SUCCESS = "success",
	FAILED = "failed",
	CANCELLED = "cancelled",
}

export interface Payment {
	id: number;
	registration_id: number;
	amount: number;
	status: PaymentStatus;
	payment_method: string;
	payment_url: string;
	doku_reference_id: string;
	paid_at?: string;
	created_at: string;
	updated_at: string;
	registration?: Registration;
}

// Analytics Types
export interface PaymentStatusData {
	pending: number;
	success: number;
	failed: number;
	cancelled: number;
}

export interface RegistrationTrendData {
	date: string;
	count: number;
}

export interface TicketSalesData {
	ticket_id: number;
	ticket_name: string;
	price: number;
	quota: number;
	sold: number;
	available: number;
	revenue: number;
}

export interface VoucherUsageData {
	voucher_id: number;
	code: string;
	type: string;
	value: number;
	quota: number;
	used: number;
	available: number;
	total_discount: number;
}

export interface EventAnalytics {
	total_registrations: number;
	confirmed_registrations: number;
	pending_registrations: number;
	total_revenue: number;
	payment_status: PaymentStatusData;
	registration_trend: RegistrationTrendData[];
	ticket_sales: TicketSalesData[];
	voucher_usage: VoucherUsageData[];
}

// Webhook Types
export interface DokuWebhookData {
	session_id: string;
	transaction_id: string;
	payment_code: string;
	status: string;
	amount: number;
	currency: string;
	payment_method: string;
	paid_at: string;
	signature: string;
}

// Common Types
export interface ErrorResponse {
	error: string;
}

export interface HealthResponse {
	status: string;
	message: string;
}

// Pagination Types
export interface PaginationParams {
	page?: number;
	limit?: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
