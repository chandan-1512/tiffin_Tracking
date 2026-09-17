# REASONING

## Core architecture
React + Vite frontend, Express REST API, Prisma ORM and SQLite.

## Billing
Pause history is persisted separately from current subscription status because current ACTIVE/PAUSED state cannot reconstruct historical service days.

## T1
`POST /api/clock` is a deterministic morning trigger for the assessment. It checks weekday, active status, subscription start and pause history. Eligible notifications are stored in `NotificationOutbox`, making the integration observable through `/api/notifications/outbox`.

## T6
Changing only `Subscription.customerId` would destroy historical ownership. `SubscriptionAssignment` stores start/end intervals so the billing engine can calculate which customer was served on each part of the cycle.

## T4
The importer is a normalize → validate → deduplicate → persist pipeline. Phone is the identity key. Common date formats are converted to ISO date-only values. Invalid records are rejected with row numbers.

## Authentication
Users have OWNER or CUSTOMER roles. Owners can manage the whole service; customers are restricted to their own `/api/my-account`.

## Trade-offs
The timed assessment favors a small dependency footprint. SQLite is appropriate for a demo-scale builder round. A production implementation would use a worker-backed notification queue and a robust CSV parser.
