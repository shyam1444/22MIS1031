# Notification System Design

**Stage 1: Priority Inbox (backend only)**

Goal
- Provide a small backend utility that fetches notifications from the test API and returns the top-N priority unread notifications.
- Integrate with the `logging_middleware` to record operations (fetch attempts, errors, and summary logs).

Design Decisions
- Priority is computed as a weighted combination of notification `Type` and recency.
- We assign weights (example): `Placement`=3, `Result`=2, `Event`=1. Higher weight means higher priority.
- Score = weight * 1e12 + unix_timestamp_seconds. This ensures weight dominates but recency breaks ties.
- Default `N` (top number) = 10, configurable via CLI arg or env var.
- Authentication: the notification API is protected. Provide `NOTIF_TOKEN` env var (Bearer token) or it will reuse `LOG_TOKEN`.

Components
- `logging_middleware/` — reusable `Log(stack, level, package, message)` implementation that posts to the provided logs endpoint.
- `notification_app_be/` — Node script `app.js` that:
  - fetches notifications from `http://4.224.186.213/evaluation-service/notifications`
  - computes scores, sorts, returns top-N
  - calls `Log` to record a summary log (info) and error logs on failures
- `notification_app_fe/` — tiny static demo that consumes the output of the backend (for Stage 1 this is a simple HTML showing sample top notifications).

How to run
1. Install dependencies in the folder you want to run.
2. Provide the bearer token via `NOTIF_TOKEN` or `LOG_TOKEN` env var.
3. Run `node app.js --top=10` inside `notification_app_be`.

Notes
- This stage focuses on correct sorting and logging integration. No database/storage required.
- The scoring parameters are simple and tunable; in a real system, you may use per-user preferences or ML ranking.
