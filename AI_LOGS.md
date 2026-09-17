# AI Development Logs — TiffinTrack

## 1. Project Context

**Project:** TiffinTrack
**Purpose:** Full-stack tiffin subscription and billing management system.

The project was developed with AI assistance for planning, architecture, implementation, debugging, testing, and documentation.

---

## 2. Initial Requirements

The project needed to support:

* Customer registration and login
* Owner/admin login
* Customer management
* Monthly tiffin subscriptions
* Pause and resume functionality
* Weekday-based delivery calculation
* Pro-rated monthly billing
* Customer search by name or phone
* Pagination
* Sorting
* REST APIs
* Real database persistence
* Usable React frontend
* Automated testing
* Project documentation

The assessment also specified three additional capabilities:

* T1 — Daily delivery notification outbox
* T6 — Mid-cycle subscription transfer
* T4 — Messy customer CSV import

---

## 3. AI-Assisted Architecture Planning

AI assistance was used to break the requirements into manageable modules.

The selected stack was:

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Database:** SQLite + Prisma
* **Authentication:** JWT + bcrypt
* **Language:** JavaScript
* **Testing:** Jest / Supertest
* **Version Control:** Git + GitHub

The architecture was divided into:

```text
TiffinTrack
├── frontend
│   └── React + Vite
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── prisma
│   └── test
│
├── README.md
├── REASONING.md
└── AI_LOGS.md
```

---

## 4. Database Design

AI assistance was used to design a relational schema containing:

* User
* Customer
* Subscription
* SubscriptionAssignment
* Pause
* NotificationOutbox

The `SubscriptionAssignment` table was introduced to preserve historical ownership when a subscription is transferred between customers.

This prevents billing history from depending only on the current subscription owner.

---

## 5. Subscription and Billing Logic

The billing logic was designed around weekdays.

Monday through Friday are considered billable delivery days.

For a billing month:

```text
Total billable weekdays
        ↓
Remove paused weekdays
        ↓
Calculate served weekdays
        ↓
Apply monthly-price pro-ration
```

The main formula is:

```text
Bill =
Monthly Plan Price ×
Served Weekdays / Total Billable Weekdays
```

Pause dates are treated as inclusive.

The implementation also preserves historical assignment periods for subscription transfers.

---

## 6. T1 — Delivery Notification Outbox

AI assistance was used to implement the daily delivery notification flow.

The endpoint:

```http
POST /api/clock
```

accepts a date and determines which customers are due for delivery.

A customer is eligible when:

* The date is a weekday
* The subscription is active
* The subscription has already started
* The customer is not paused on that date

Eligible deliveries are written to:

```text
NotificationOutbox
```

The outbox can be inspected through:

```http
GET /api/notifications/outbox
```

This provides a deterministic implementation suitable for assessment testing.

---

## 7. T6 — Subscription Transfer

AI assistance was used to design subscription ownership history.

The transfer endpoint is:

```http
POST /api/subscriptions/:id/transfer
```

A transfer creates a new assignment period rather than deleting the previous customer's history.

Example:

```json
{
  "newCustomerId": 2,
  "transferDate": "2026-09-16"
}
```

The billing system then calculates served weekdays separately for each assignment period.

This allows a single monthly subscription to be billed according to which customer actually owned the subscription during each part of the cycle.

---

## 8. T4 — Messy Customer Import

AI assistance was used to implement CSV import handling.

The import process:

```text
CSV file
   ↓
Parse rows
   ↓
Normalize phone numbers
   ↓
Normalize supported date formats
   ↓
Validate required fields
   ↓
Detect duplicates
   ↓
Create clean customer + subscription records
   ↓
Return import report
```

The API returns:

```json
{
  "imported": 0,
  "deduped": 0,
  "rejected": 0,
  "errors": []
}
```

Supported date formats include:

```text
YYYY-MM-DD
YYYY/MM/DD
DD/MM/YYYY
DD-MM-YYYY
```

Phone normalization removes formatting characters and handles the Indian `91` country-code prefix.

---

## 9. Authentication

AI assistance was used to implement authentication using:

* bcrypt for password hashing
* JWT for session authentication
* Role-based access for OWNER and CUSTOMER

The application provides separate experiences for:

```text
OWNER
  → Dashboard
  → Customers
  → Billing
  → Import

CUSTOMER
  → My Account
  → Subscription
  → Pause/Resume
  → Bill
```

---

## 10. Frontend Development

AI assistance was used to build the React frontend pages:

* Landing
* Login
* Register
* Dashboard
* Customers
* Customer Details
* Import Customers
* My Account

The frontend communicates with the Express REST API.

The landing page was kept customer-facing and focuses on the product, its benefits, target users, and future features rather than exposing internal assessment implementation details.

---

## 11. Testing

AI assistance was used to create tests for important business functionality.

The test suite covers:

* Pro-rated billing
* Notification eligibility
* CSV import and deduplication

The backend tests are located in:

```text
backend/test/
```

The intended test command is:

```bash
npm test
```

---

## 12. Debugging and Fixes

During development, AI assistance was used to troubleshoot issues including:

* Git repository configuration
* Git remote configuration
* GitHub push/authentication issues
* Frontend startup issues
* React runtime errors
* Prisma setup
* Database migration
* Backend/frontend separation
* API testing

For example, the frontend runtime error:

```text
React is not defined
```

was traced to the React import/configuration and corrected in the frontend.

---

## 13. Development Decisions

Several implementation decisions were made to keep the application practical within the assessment time limit:

1. SQLite was selected to reduce database setup complexity.
2. Prisma was used for schema management and database access.
3. Business logic was separated into service files.
4. Historical subscription assignments were persisted instead of inferred.
5. The notification system uses an outbox rather than an external messaging provider.
6. CSV imports return a structured report so invalid and duplicate rows can be inspected.
7. The frontend provides a simple usable interface over the REST API.

---

## 14. AI Usage Summary

AI assistance was used as a development aid for:

* Requirement decomposition
* Architecture planning
* Database schema design
* API design
* Business-logic implementation
* Frontend implementation
* Testing
* Debugging
* Documentation
* Git troubleshooting

The final application structure and implementation were reviewed and adapted during development to match the assessment requirements.

---

## 15. Important Note

This file is a development summary.

If the assessment specifically requires the **complete AI conversation/transcript**, the actual conversation used during development should be added here rather than reconstructing or fabricating a transcript.
