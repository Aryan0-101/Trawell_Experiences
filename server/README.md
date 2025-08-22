# Trawell API Server

A tiny Express + Prisma (SQLite) API for storing users, quiz answers, and stories.

## Endpoints
- POST /api/users — body: { name, email, phone? } — upsert user
- POST /api/users/:email/quiz — body: [{ questionId, selectedOptions: string[] }]
- POST /api/users/:email/story — body: { text }

## Dev
1. Install deps
   - In this folder:
     - npm install
2. Init DB
   - npx prisma generate
   - npx prisma migrate dev --name init
3. Run
   - npm run dev (starts at http://localhost:5174)

Set VITE_API_BASE in the web app .env to http://localhost:5174 so the client can reach the API.
