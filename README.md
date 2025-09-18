# SpotMijnVlucht Deals

This project hosts the SpotMijnVlucht deals frontend that consumes the managed deals API.

## Development

```bash
npm install
npm run dev
```

## Environment variables

The deals API client expects the following environment variables when you want to connect to the live backend:

- `FLIGHT_DEALS_API_URL` (optional) – override the default API base URL. Defaults to the production Cloud Run endpoint.
- `FLIGHT_DEALS_API_KEY` – public API token used for read-only access (client endpoints).
- `FLIGHT_DEALS_API_ADMIN_KEY` (optional) – privileged API token used for admin CRUD operations. Falls back to `FLIGHT_DEALS_API_KEY` when omitted.

All external requests use a `Authorization: Bearer <token>` header. Provide values through your `.env.local` or hosting provider secrets so both the public deals endpoint and the admin dashboard can connect to the backend.
