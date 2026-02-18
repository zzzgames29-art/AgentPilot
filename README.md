# AgentPilot (MVP)

AgentPilot is a personal commission dashboard for property agents built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Supabase Auth/Postgres**, **Zod**, and **React Hook Form**.

## Features

- Email/password authentication (Supabase Auth)
- Leads CRUD
  - Fields: `name`, `phone`, `budget_min`, `budget_max`, `property_interest`, `source`, `stage`, `next_followup_date`, `notes`
  - Stages: `New`, `Contacted`, `Viewing`, `Negotiation`, `Closed`, `Lost`
  - Additional for dashboard math: `expected_price`, `commission_percent`
- Dashboard widgets
  - Overdue follow-ups
  - Follow-ups due today
  - Lead count by stage
  - Pipeline value (sum `expected_price` for open stages)
  - Expected commission (sum of `expected_price * commission_percent` for open stages)
- Lead list with filters
  - stage
  - source
  - follow-up due status
- Lead detail page
  - Edit lead
  - Quick actions: mark contacted, set follow-up tomorrow, move stage

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- React Hook Form + Zod

## Project Structure

- `app/` – App Router pages/layouts
- `components/` – shared UI/forms
- `lib/` – constants, schemas, types, Supabase client
- `schema.sql` – Supabase Postgres schema + RLS

## Setup

### 1) Create Supabase project

- Create a new Supabase project
- Go to **SQL Editor** and run `schema.sql`
- In **Authentication > Providers**, enable Email provider (default)

### 2) Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3) Install dependencies and run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

### Deploy to Vercel

1. Push this repository to GitHub.
2. Import project in Vercel.
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## Notes

- RLS is enforced in Postgres, so users can only read/write their own leads.
- Auth is handled fully by Supabase email/password.
