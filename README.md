# AstrologyMitra (astrologymitra.com)

Sell 10 personalised astrology PDF reports (Hindi / English) with Razorpay payments, AI-written content, customer dashboard and admin panel.

- `frontend/` — Next.js 14 website (landing, 10 service pages, dashboard, admin at `/admin`)
- `backend/` — Node.js + Express API, PostgreSQL, Puppeteer PDF engine, astronomy calculations (Lahiri ayanamsa)

## Deploy on Railway

1. Push this repo to GitHub. In Railway: **New Project → Deploy from GitHub repo**.
2. Add **PostgreSQL** (New → Database → PostgreSQL).
3. **Backend service** — Root Directory `backend` (uses the Dockerfile). Variables:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET` = any long random string
   - `ADMIN_EMAIL` = `astrologymitra3@gmail.com`, `ADMIN_PASSWORD` = your admin password
   - `FRONTEND_URL` = `https://astrologymitra.com` (frontend URL, used for CORS & email links)
   - `PUBLIC_API_URL` = public backend URL (e.g. `https://api.astrologymitra.com`)
   - Generate a domain for it (Settings → Networking).
4. **Frontend service** — Root Directory `frontend`. Variable `NEXT_PUBLIC_API_URL` = backend public URL. Attach your domain `astrologymitra.com`.
5. Open `https://astrologymitra.com/admin`, log in and fill **Settings**:
   - OpenAI API key (model `gpt-4o-mini` recommended — one call per report)
   - Razorpay Key ID / Secret, and switch off *Testing mode — bypass payment* when going live
   - Delivery delay (e.g. 1 hour → customer sees "Pandit ji is preparing your report" until then)
   - SMTP (Gmail: `smtp.gmail.com`, port 465, App Password) for report & order emails
   - Admin WhatsApp number (for the "WhatsApp me" button)

## How it works
Order form → account auto-created → Razorpay (or test bypass) → report generated immediately (chart calculated + one OpenAI call + PDF) → stored in Postgres → shown in customer dashboard and emailed at the scheduled release time. Admin sees every form (paid or not), can download, regenerate, release now, email, or send via WhatsApp (wa.me link with a private download URL).

## Local development
```
cd backend && npm install && DATABASE_URL=... ADMIN_PASSWORD=... npm start   # :8080
cd frontend && npm install && NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```
