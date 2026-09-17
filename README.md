# TiffinTrack

Full-stack home-style tiffin management application with subscription billing and three assessment twists.

## Core
- Owner registration/login
- Customer name/phone lookup
- Pagination and sorting
- Monthly subscription
- Inclusive pause ranges
- Weekday-only pro-rated billing
- Customer login and self-service account
- Historical subscription assignment

## T1 — Integrate: daily delivery notifications
`POST /api/clock` with:
```json
{ "date": "2026-09-17" }
```
The system checks:
1. Subscription is ACTIVE
2. Subscription has started
3. Date is Monday-Friday
4. Date is not in a pause range

Eligible customers are written to the `NotificationOutbox` table.

Inspect:
`GET /api/notifications/outbox?date=2026-09-17`

## T6 — Lifecycle: mid-cycle transfer
`POST /api/subscriptions/:id/transfer`
```json
{
  "newCustomerId": 2,
  "transferDate": "2026-09-16"
}
```

The monthly plan and original cycle remain unchanged.
`SubscriptionAssignment` stores ownership intervals.

Billing attributes served weekdays to the customer who owned the subscription on those dates.

## T4 — Messy data import
`POST /api/import/customers`

Use multipart/form-data with field:
`file`

CSV headers:
`name,phone,startDate,monthlyPrice`

Supported examples:
- phone: `9876543210`, `+91 98765-43210`
- dates: `2026-09-01`, `2026/09/01`, `01/09/2026`, `01-09-2026`

Response:
```json
{
  "imported": 10,
  "deduped": 3,
  "rejected": 2,
  "errors": []
}
```

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/me`
- GET `/api/dashboard`
- POST `/api/customers`
- GET `/api/customers?page=1&limit=10&search=Rahul&sort=name&order=asc`
- GET `/api/customers/:id`
- POST `/api/customers/:id/subscribe`
- POST `/api/subscriptions/:id/pause`
- POST `/api/subscriptions/:id/resume`
- POST `/api/subscriptions/:id/transfer`
- GET `/api/billing?month=2026-09`
- GET `/api/billing/customer/:id?month=2026-09`
- POST `/api/clock`
- GET `/api/notifications/outbox`
- POST `/api/import/customers`
- GET `/api/my-account`

## Windows CMD setup
```cmd
npm install
npm run install:all
cd backend
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm test
cd ..
npm run dev
```

Frontend:
`http://localhost:5173`

Backend:
`http://localhost:4000`

## Demo credentials
Owner:
`demo@tiffintrack.local`
`Demo@123`

Customer:
`rahul@tiffintrack.local`
`Rahul@123`

## Billing
Base formula:
`monthly plan price × served weekdays / total weekdays in selected month`

T6 uses the same monthly denominator but splits served days by assignment interval.

## Production trade-offs
- SQLite keeps timed setup simple.
- The CSV parser targets simple comma-separated data and does not implement quoted commas.
- NotificationOutbox is persistent and observable; a production worker could consume it and call SMS/WhatsApp/email providers.

## Three future features
1. Online payments
2. WhatsApp notification provider
3. Delivery staff management
