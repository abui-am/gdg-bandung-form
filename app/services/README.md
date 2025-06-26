# API Services

This directory contains all the API-related code using React Query for state management and caching.

## Structure

```
services/
├── api.ts              # Axios client setup and configuration
├── types.ts            # TypeScript type definitions from Swagger
├── query-client.ts     # React Query client configuration
├── queries/            # React Query queries (GET requests)
│   ├── auth.ts
│   ├── events.ts
│   ├── forms.ts
│   ├── tickets.ts
│   ├── vouchers.ts
│   ├── registrations.ts
│   ├── analytics.ts
│   └── index.ts
├── mutations/          # React Query mutations (POST, PUT, DELETE)
│   ├── auth.ts
│   ├── events.ts
│   ├── forms.ts
│   ├── tickets.ts
│   ├── vouchers.ts
│   ├── registrations.ts
│   └── index.ts
└── index.ts           # Main export file
```

## Usage

### Setup

First, wrap your app with the React Query provider:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

### Authentication

```tsx
import { useLogin, useRegister, useProfile } from './services';

function LoginForm() {
  const loginMutation = useLogin({
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Token is automatically set in axios headers
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials);
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  );
}

function Profile() {
  const { data: user, isLoading, error } = useProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Events

```tsx
import { 
  useEvents, 
  useEventDetails, 
  useCreateEvent, 
  useUpdateEvent, 
  useDeleteEvent 
} from './services';

function EventsList() {
  const { data: events, isLoading } = useEvents({ page: 1, limit: 10 });
  const createEventMutation = useCreateEvent();

  const handleCreateEvent = (eventData) => {
    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        // Events list will be automatically refetched
      },
    });
  };

  return (
    <div>
      {events?.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### Forms

```tsx
import { 
  usePublicForm, 
  useFormForEdit, 
  useCreateOrUpdateForm 
} from './services';

function FormBuilder({ eventId }) {
  const { data: form } = useFormForEdit(eventId);
  const updateFormMutation = useCreateOrUpdateForm();

  const handleSaveForm = (formConfig) => {
    updateFormMutation.mutate({
      event_id: eventId,
      form_config: formConfig,
    });
  };

  return (
    <div>
      {/* Form builder UI */}
    </div>
  );
}
```

### Tickets

```tsx
import { 
  usePublicTickets, 
  useCreateTicket, 
  useUpdateTicket 
} from './services';

function TicketManager({ eventId }) {
  const { data: tickets } = usePublicTickets(eventId);
  const createTicketMutation = useCreateTicket();

  return (
    <div>
      {tickets?.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
```

### Vouchers

```tsx
import { 
  useEventVouchers, 
  useValidateVoucher, 
  useCreateVoucher 
} from './services';

function VoucherValidation() {
  const validateVoucherMutation = useValidateVoucher();

  const handleValidateVoucher = (code, ticketId) => {
    validateVoucherMutation.mutate({ code, ticket_id: ticketId }, {
      onSuccess: (data) => {
        if (data.valid) {
          console.log('Voucher valid! Discount:', data.discount_amount);
        }
      },
    });
  };

  return (
    <div>
      {/* Voucher validation UI */}
    </div>
  );
}
```

### Registrations

```tsx
import { useCreateRegistration } from './services';

function RegistrationForm({ eventId, ticketId }) {
  const createRegistrationMutation = useCreateRegistration();

  const handleRegister = (attendeeData, voucherCode) => {
    createRegistrationMutation.mutate({
      event_id: eventId,
      ticket_id: ticketId,
      voucher_code: voucherCode,
      attendee_data: attendeeData,
    }, {
      onSuccess: (data) => {
        if (data.payment_url) {
          // Redirect to payment
          window.location.href = data.payment_url;
        }
      },
    });
  };

  return (
    <div>
      {/* Registration form */}
    </div>
  );
}
```

### Analytics

```tsx
import { useDashboardAnalytics, useEventAnalytics } from './services';

function Dashboard() {
  const { data: analytics } = useDashboardAnalytics();

  return (
    <div>
      {/* Dashboard with analytics */}
    </div>
  );
}

function EventAnalytics({ eventId }) {
  const { data: analytics } = useEventAnalytics(eventId);

  return (
    <div>
      <h3>Total Revenue: ${analytics?.total_revenue}</h3>
      <p>Total Registrations: {analytics?.total_registrations}</p>
      {/* More analytics display */}
    </div>
  );
}
```

## Error Handling

All API calls include automatic error handling:

- 401 errors automatically clear the auth token and redirect to login
- Network errors are retried automatically
- Error details are available in the query/mutation error objects

```tsx
function Component() {
  const { data, error, isError } = useEvents();

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{/* Component content */}</div>;
}
```

## Query Keys

All query keys are exported for manual cache management:

```tsx
import { queryClient } from './services/query-client';
import { eventKeys } from './services';

// Invalidate all events
queryClient.invalidateQueries({ queryKey: eventKeys.all });

// Invalidate specific event
queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
```

## Environment Variables

Set the following environment variable for API configuration:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

If not set, it defaults to `http://localhost:8080/api`.

## Type Safety

All API calls are fully typed based on the Swagger specification. TypeScript will catch type mismatches at compile time.

```tsx
// This will show TypeScript errors if the shape doesn't match
const eventData: CreateEventRequest = {
  title: "My Event",
  description: "Event description",
  // ... other required fields
};

createEventMutation.mutate(eventData);
``` 