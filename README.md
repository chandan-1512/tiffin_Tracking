# TiffinTrack

A full-stack tiffin subscription management system for home-style lunch delivery services.

TiffinTrack helps tiffin owners manage customers, subscriptions, pauses, deliveries, and monthly pro-rated billing from a single application.

---

## 1. Problem Statement

Home-style tiffin services commonly operate on monthly subscription plans. Customers may need to pause their service for travel, festivals, or other reasons.

The owner therefore needs to:

* Know which customers are currently active or paused
* Manage monthly subscriptions
* Record pause periods
* Calculate bills based only on days when food was actually served
* Search customers by name or phone
* Manage customer accounts
* Handle subscription transfers
* Process customer data imports

TiffinTrack addresses these requirements through a web-based full-stack application.

---

## 2. Key Features

### Customer Management

* Add customers
* Search customers by name or phone
* Paginate customer results
* Sort customer results
* View individual customer details
* Track active and paused subscriptions

### Subscription Management

* Create monthly subscriptions
* Set monthly plan prices
* Set subscription start dates
* Pause subscriptions
* Resume subscriptions
* Transfer subscriptions between customers

### Pro-Rated Billing

Billing is based on actual weekdays served.

Monday to Friday are considered delivery days.

```text
Bill =
Monthly Plan Price ×
Served Weekdays / Total Billable Weekdays
```

Pause dates are inclusive.

Example:

```text
Monthly Plan = ₹3000
September 2026 weekdays = 22
Paused weekdays = 2
Served weekdays = 20

Bill = 3000 × 20 / 22
     = ₹2727.27
```

Historical subscription ownership is preserved so that transferred subscriptions can be billed according to which customer was served during each period.

---

## 3. Authentication

TiffinTrack supports two user roles:

### Owner

Owners can:

* View dashboard
* Manage customers
* Create subscriptions
* Pause/resume subscriptions
* View billing
* Transfer subscriptions
* Import customers

### Customer

Customers can:

* Log in
* View their account
* View subscription information
* Pause/resume their subscription
* View their bill

Passwords are hashed using bcrypt and authentication uses JWT tokens.

---

## 4. Assessment Functionality

The application also implements the required additional assessment functionality.

### T1 — Daily Delivery Notifications

The system provides a deterministic clock endpoint:

```http
POST /api/clock
```

For a supplied date, the system identifies customers who are:

* Active
* Within their subscription period
* Scheduled on a weekday
* Not paused on that date

Delivery notifications are written to the notification outbox.

The outbox can be viewed using:

```http
GET /api/notifications/outbox
```

---

### T6 — Mid-Cycle Subscription Transfer

Subscriptions can be transferred to another customer during an active billing cycle.

```http
POST /api/subscriptions/:id/transfer
```

The system preserves assignment history.

Billing is split according to the dates for which each customer owned the subscription.

Example:

```text
Customer A
September 1 → September 15

Customer B
September 16 → September 30
```

Each customer is billed according to their served weekdays.

---

### T4 — Messy Customer CSV Import

Customer data can be imported using:

```http
POST /api/import/customers
```

The importer handles:

* Duplicate phone numbers
* Phone number normalization
* Multiple supported date formats
* Missing required fields
* Invalid records

The response provides:

```json
{
  "imported": 0,
  "deduped": 0,
  "rejected": 0,
  "errors": []
}
```

A sample file is provided as:

```text
sample-data.csv
```

---

## 5. Technology Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* CSS

### Backend

* Node.js
* Express
* JavaScript
* JWT
* bcrypt
* Multer

### Database

* SQLite
* Prisma ORM

### Testing

* Jest
* Supertest

### Development Tools

* Git
* GitHub
* VS Code
* GitHub Codespaces

---

## 6. Project Structure

```text
tiffin-track/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   └── test/
│       ├── billing.test.js
│       ├── import.test.js
│       └── notification.test.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
│
├── sample-data.csv
├── README.md
├── REASONING.md
├── AI_LOGS.md
└── package.json
```

---

## 7. Database Schema

The main database entities are:

```text
User
 │
 └── Customer
       │
       └── Subscription
             │
             ├── Pause
             │
             └── SubscriptionAssignment
             
NotificationOutbox
```

### User

Stores authentication information and user roles.

### Customer

Stores customer information such as name and phone number.

### Subscription

Stores monthly plan information, price, start date, and current status.

### Pause

Stores historical pause periods.

### SubscriptionAssignment

Stores historical ownership periods for subscription transfers.

### NotificationOutbox

Stores generated delivery notifications.

---

## 8. REST API

### Authentication

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register a user    |
| POST   | `/api/auth/login`    | Login              |
| GET    | `/api/me`            | Get logged-in user |

### Dashboard

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/dashboard` | Dashboard statistics |

### Customers

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/customers`     | Create customer       |
| GET    | `/api/customers`     | List/search customers |
| GET    | `/api/customers/:id` | Get customer details  |

Example:

```http
GET /api/customers?page=1&limit=10&search=Rahul&sort=name&order=asc
```

### Subscriptions

| Method | Endpoint                          | Description           |
| ------ | --------------------------------- | --------------------- |
| POST   | `/api/customers/:id/subscribe`    | Create subscription   |
| POST   | `/api/subscriptions/:id/pause`    | Pause subscription    |
| POST   | `/api/subscriptions/:id/resume`   | Resume subscription   |
| POST   | `/api/subscriptions/:id/transfer` | Transfer subscription |

### Billing

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | `/api/billing`              | Get monthly billing |
| GET    | `/api/billing/customer/:id` | Get customer bill   |

Example:

```http
GET /api/billing?month=2026-09
```

### Notifications

| Method | Endpoint                    | Description                     |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/api/clock`                | Generate delivery notifications |
| GET    | `/api/notifications/outbox` | View notification outbox        |

### Import

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/import/customers` | Import customer CSV |

### Customer Account

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| GET    | `/api/my-account` | Get logged-in customer's account |

---

## 9. Pagination and Sorting

Customer listing supports pagination, searching, and sorting.

Example:

```http
GET /api/customers?page=1&limit=10&search=Rahul&sort=name&order=asc
```

Parameters:

| Parameter | Purpose               |
| --------- | --------------------- |
| `page`    | Page number           |
| `limit`   | Number of records     |
| `search`  | Name or phone search  |
| `sort`    | Allowed sorting field |
| `order`   | `asc` or `desc`       |

---

## 10. Running the Project

### Requirements

Install:

* Node.js
* npm
* Git

---

### Install dependencies

From the project root:

```cmd
npm install
npm run install:all
```

---

### Configure backend

```cmd
cd backend
copy .env.example .env
```

The default environment configuration is:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-development-secret"
PORT=4000
```

---

### Generate Prisma Client

```cmd
npx prisma generate
```

---

### Create the database

```cmd
npx prisma migrate dev --name init
```

---

### Seed demo data

```cmd
npm run seed
```

---

### Run tests

From the backend directory:

```cmd
npm test
```

---

## 11. Start the Application

### Terminal 1 — Backend

```cmd
cd backend
npm run dev
```

Backend:

```text
http://localhost:4000
```

### Terminal 2 — Frontend

```cmd
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

The backend port is used for REST APIs, while the frontend port serves the actual web application.

---

## 12. Demo Accounts

### Owner

```text
Email: demo@tiffintrack.local
Password: Demo@123
```

### Customer

```text
Email: rahul@tiffintrack.local
Password: Rahul@123
```

The seed command creates demo data for development and assessment testing.

---

## 13. Testing the Assessment Functionality

### T1 — Notification

Login as owner and call:

```http
POST http://localhost:4000/api/clock
```

Body:

```json
{
  "date": "2026-09-17"
}
```

Then:

```http
GET http://localhost:4000/api/notifications/outbox?date=2026-09-17
```

The response contains notifications for eligible deliveries.

---

### T6 — Transfer

First retrieve customers and subscription information.

Then call:

```http
POST /api/subscriptions/:id/transfer
```

Example body:

```json
{
  "newCustomerId": 3,
  "transferDate": "2026-09-16"
}
```

Then check:

```http
GET /api/billing?month=2026-09
```

The billing result reflects the historical assignment periods.

---

### T4 — Import

Use the provided:

```text
sample-data.csv
```

through the customer import page or the API:

```http
POST /api/import/customers
```

The result contains:

```text
imported
deduped
rejected
errors
```

---

## 14. Frontend Pages

```text
/                  Landing page
/login             Login
/register          Registration
/dashboard         Owner dashboard
/customers         Customer management
/customers/:id     Customer details
/import            CSV import
/my-account        Customer account
```

The landing page focuses on the product and customer-facing value rather than internal implementation details.

---

## 15. Testing

The backend includes tests for the main business logic:

```text
backend/test/billing.test.js
backend/test/import.test.js
backend/test/notification.test.js
```

Run:

```cmd
cd backend
npm test
```

The tests focus on:

* Pro-rated billing
* Notification eligibility
* CSV validation and deduplication

---

## 16. Environment Variables

Backend `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-development-secret"
PORT=4000
```

Frontend `.env` can contain:

```env
VITE_API_URL=http://localhost:4000/api
```

Do not commit `.env` files containing secrets.

---

## 17. Production Considerations

For a production deployment, the following improvements could be made:

* PostgreSQL instead of SQLite
* External notification provider
* Secure secret management
* Refresh-token based authentication
* Rate limiting
* Request validation
* Structured logging
* Docker deployment
* CI/CD pipeline
* Automated database backups
* Stronger audit logging

---

## 18. Future Features

Potential future product improvements include:

1. **Online Payments** — Allow customers to pay monthly bills directly through the platform.

2. **Delivery Staff Management** — Assign routes and delivery staff to daily tiffin deliveries.

3. **Customer Notifications** — Send automated WhatsApp/SMS notifications for deliveries, pauses, bills, and payment reminders.

---

## 19. Documentation

Additional project documentation:

* `REASONING.md` — Architecture and implementation decisions
* `AI_LOGS.md` — AI-assisted development documentation
* `sample-data.csv` — Sample messy customer data for import testing

---

## 20. License

This project was created as a full-stack assessment project for demonstrating application development, database design, REST API development, business-logic implementation, and frontend integration.
