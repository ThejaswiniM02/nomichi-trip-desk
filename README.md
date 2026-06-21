# Nomichi Trip Desk

A working CRM built for Nomichi's team to manage trip enquiries end to end — from first contact to a confirmed seat — alongside a public-facing page where travellers can browse trips and enquire.

**Live app:** https://nomichi-trip-desk-eight.vercel.app
**Admin login:** admin@nomichi.com / **password**: admin123

## What I built

The system has three connected pieces, exactly as scoped:

- **Public enquiry page** — travellers browse open trips and send an enquiry with their details, group type, preferred month, and what they're hoping the trip feels like. Trips are pulled live from the database, so only open trips ever show.
- **Team admin (the CRM core)** — an authenticated dashboard where the team can search and filter leads, open a lead to see everything they shared, move them through a clear pipeline (New → Contacted → Qualified → Vibe Check Sent → Confirmed / Not a Fit), and log timestamped call notes against each lead.
- **Trip CMS** — the team can create and edit trips themselves, no code required. A trip marked "open" appears on the public page immediately; closed trips don't.

I also built the dashboard overview (total leads, leads by stage, leads per trip) and one AI-assisted feature: a button on each lead's detail page that drafts a warm, on-brand first WhatsApp message using the trip details and what the traveller actually said they're hoping for, powered by Gemini.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Postgres database, authentication)
- **Tailwind CSS** for styling
- **Gemini API** for the AI message drafting feature
- **Vercel** for hosting

## Setup

1. Clone the repo and install dependencies:
npm install
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
3. Run the SQL in `supabase/schema.sql` (or the SQL editor in your Supabase project) to create the `trips`, `leads`, and `call_logs` tables and seed sample data.
4. Create an admin user in Supabase Authentication (email + password), with "Auto Confirm User" enabled.
5. Run the dev server:
npm run dev

## Decisions I'm most proud of

**Making the lead detail page the actual heart of the build.** The brief was explicit that this is where the team lives and dies, so I built it as one connected view — full enquiry context, a live status pipeline, and a call log that updates instantly — rather than splitting these into separate tabs or pages the team would have to click between mid-call.

**Grounding the AI feature in what the traveller actually said.** Instead of a generic templated message, the WhatsApp draft pulls the lead's own words about what they're hoping the trip feels like, and writes around that. It follows Nomichi's voice rules (no exclamation marks, no "unlock"/"elevate" language, short sentences) so it reads like something the team would actually send, not an obvious AI draft.

**Keeping the status pipeline exactly as scoped, with no shortcuts.** Six clear stages, a dropdown to move a lead forward (or to Not a Fit), and a visual pipeline indicator so the team can see progress at a glance. No over-engineering, no extra statuses that weren't asked for.

## What I'd do with another week

- Row-level security so each team member sees their own assigned leads by default
- CSV export of leads
- An activity timeline per lead (status changes, notes, and owner changes in one feed)
- The other two AI features from the brief: a one-line call log summary, and a "does this traveller look like a fit" suggestion
- Tighter mobile responsiveness across the admin views
- Light UI polish to bring in the full Nomichi palette (olive and yellow as accents) more deliberately across the admin side
