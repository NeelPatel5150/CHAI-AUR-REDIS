# CHAI AUR REDIS

This repository is a hands-on collection of Redis demos. Each folder shows one practical concept with a small Express app so you can learn Redis by running real examples instead of only reading theory.

## What This Repo Covers

1. Local Redis and MongoDB setup with Docker.
2. Simple banner storage with Redis strings.
3. OTP login flow with Redis TTL.
4. User profile caching with JSON strings versus Redis hashes.
5. Email queue processing with Redis lists.
6. Background jobs with BullMQ.
7. Live notifications with Redis Pub/Sub.

## Project Map

| Folder | Topic | What You Learn |
| --- | --- | --- |
| `01 setup-local-redis` | Local infrastructure | Connect to Redis and MongoDB from Node.js |
| `02-site-banner` | Redis strings | Store, read, update, delete, and check a banner message |
| `03-login-otp-with-TTL` | Expiring data | Save OTPs with TTL and validate them before expiry |
| `04-user-profile-cache-json-vs-hash` | Cache design | Compare JSON storage with Redis hashes |
| `05-email-queue-with-redis-lists` | Redis lists | Push jobs into a queue and process them one by one |
| `06-order-confirmation-jobs-with-bullmq` | Job queues | Use BullMQ for reliable background processing |
| `07-live-admin-notification-pubsub` | Pub/Sub | Publish notifications to live subscribers |

## Prerequisites

- Node.js 18 or newer.
- Docker and Docker Compose.
- Redis running on `redis://localhost:6379`.
- MongoDB running on `mongodb://localhost:27017` for the first demo.

## Start Redis And MongoDB

From the repository root:

```bash
docker compose up -d
```

This starts:

- Redis on port `6379`
- MongoDB on port `27017`

## Install Dependencies

Each demo is its own small Node.js project. Install dependencies inside the folder you want to run.

```bash
cd "01 setup-local-redis"
npm install
```

Repeat the same for any other demo folder you want to try.

## How To Run The Demos

Every app listens on port `3000`, so run one demo at a time.

### 1. Setup Local Redis

```bash
cd "01 setup-local-redis"
npm run dev
```

Routes:

- `GET /redis` checks the Redis connection.
- `GET /mongo` connects to MongoDB and returns the database name.

### 2. Site Banner

```bash
cd "02-site-banner"
npm run dev
```

Routes:

- `POST /banner` saves a banner message.
- `GET /banner` reads the current banner.
- `GET /banner/exists` checks whether the banner key exists.
- `DELETE /banner/delete` removes the banner.

### 3. Login OTP With TTL

```bash
cd "03-login-otp-with-TTL"
npm run dev
```

Routes:

- `POST /send-otp` creates a 6-digit OTP and stores it in Redis for 30 seconds.
- `POST /verify-otp` checks the OTP and deletes it after success.
- `GET /otp/:phone/ttl` shows the remaining TTL.

### 4. User Profile Cache: JSON Vs Hash

```bash
cd "04-user-profile-cache-json-vs-hash"
npm run dev
```

Routes:

- `POST /user/:id/json` stores a profile as one JSON string.
- `GET /user/:id/json` reads the JSON profile.
- `POST /user/:id/hash` stores the same profile as a Redis hash.
- `GET /user/:id/hash` reads the hash fields.

### 5. Email Queue With Redis Lists

```bash
cd "05-email-queue-with-redis-lists"
npm run dev
```

Routes:

- `POST /send-email` adds an email job to the queue.
- `GET /emails/process-one` pops the oldest job and simulates sending it.

### 6. Order Confirmation Jobs With BullMQ

```bash
cd "06-order-confirmation-jobs-with-bullmq"
npm run dev
```

This demo uses a producer API plus a separate worker process.

- Run `src/api.js` to add jobs.
- Run `src/worker.js` to process jobs from the queue.

Route:

- `POST /welcome-email` adds a BullMQ job with retry and exponential backoff.

### 7. Live Admin Notification Pub/Sub

```bash
cd "07-live-admin-notification-pubsub"
npm run dev
```

This demo uses two processes.

- Run `src/api.js` to publish messages.
- Run `src/subscribe.js` to listen for notifications.

Route:

- `POST /notifications` publishes a live notification to all subscribers.

## Why These Demos Matter

Redis is more than a cache. In this repo you can see how it works as:

- a fast key-value store for simple app data,
- a temporary store for expiring login codes,
- a cache for structured user data,
- a queue for background jobs,
- a message bus for live updates.

## Recommended Learning Order

1. Start with `01 setup-local-redis` to confirm your local services are working.
2. Move to `02-site-banner` and `03-login-otp-with-TTL` to learn basic Redis keys and TTL.
3. Use `04-user-profile-cache-json-vs-hash` to understand data modeling.
4. Continue with `05-email-queue-with-redis-lists` and `06-order-confirmation-jobs-with-bullmq` for async processing.
5. Finish with `07-live-admin-notification-pubsub` to see realtime messaging.

## Notes

- The demos are intentionally small and focused.
- Most examples use `REDIS_URL=redis://localhost:6379` by default.
- The first demo also uses `MONGO_URL=mongodb://localhost:27017/chai_aur_redis` by default.
- If you are new to Redis, read the README from top to bottom first, then try each folder one by one.
