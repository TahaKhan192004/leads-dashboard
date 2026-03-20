# LeadRadar — Google Maps Lead Intelligence Dashboard

A Next.js 15 dashboard for scraping, viewing, and managing Google Maps leads.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Features

- **Scrape Bar** — triggers `POST /scrape/async` on your FastAPI backend, polls `GET /jobs/{job_id}` every 2s, auto-refreshes table when done
- **Toggle controls** — enable/disable Website Scraping and AI Context per scrape
- **Max leads selector** — 5 / 10 / 20 / 50 / 100
- **Lead table** with all columns: business, phone, address, rating, emails, socials, keyword, date added
- **Email dropdown** — deduplicates `emails` + `firecrawl_emails`, strips `mailto:`, shows Gmail compose link on hover
- **Social icons** — Facebook, LinkedIn, Instagram, Twitter/X, YouTube with colored icons linking to profiles
- **Notes modal** — click to open/edit notes per lead, saved via `PATCH /api/leads/{id}/notes`, supports `⌘S` shortcut
- **Business summary** — expandable inline via "▼ Summary" toggle in the Notes column
- **Filters** — keyword filter, email availability filter (all / has email / no email)
- **Sorting** — by date added, last updated, business name, or rating; ascending/descending toggle
- **Search** — filter by business name, address, or phone
- **Pagination** — 20 per page, smart page window, shows `from–to of total`
- **Stats row** — total leads, with-email count, unique keywords, current page count

---

## Project Structure

```
leads-dashboard/
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts              # GET leads with filters/pagination
│   │   │   └── [id]/notes/route.ts   # PATCH notes for a lead
│   │   └── keywords/route.ts         # GET unique keywords list
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # Main dashboard
├── components/
│   ├── SearchBar.tsx                 # Scrape form + job polling
│   ├── LeadsTable.tsx                # Main data table + row expansion
│   ├── EmailDropdown.tsx             # Email list with Gmail button
│   ├── SocialsIcons.tsx              # Platform icons with links
│   ├── NotesModal.tsx                # Notes viewer/editor modal
│   ├── FiltersBar.tsx                # Filters + sort controls
│   └── Pagination.tsx                # Page navigation
├── lib/
│   ├── supabase.ts                   # Supabase client
│   └── api.ts                        # FastAPI client (scrape/poll)
└── types/index.ts                    # All TypeScript types
```

---

## Supabase Table

The app queries the `google map leads` table (note: table name has a space, handled via Supabase JS client).

---

## Deployment

Deploy on Vercel. Add the three env vars in your Vercel project settings.

For the FastAPI backend URL on production, set `NEXT_PUBLIC_API_BASE_URL` to your EC2 instance URL.
