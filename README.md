# Akshit Jain — Portfolio

A premium, highly interactive developer portfolio built with **Next.js 14**, **Framer Motion**, and **Tailwind CSS**. It showcases AI/ML work alongside full-stack engineering, with a focus on smooth aesthetics and professional micro-animations.

![Portfolio Preview](/public/projects/portfolio.png)

## 🚀 Live Demo
Experience the live site at: **[akshitjain.vercel.app](https://akshitjain.vercel.app)** 

## ✨ Key Features

- **Dynamic Hero Section**: Split-grid layout with a smooth scroll-driven avatar-to-photo morphing effect.
- **Continuous Marquee Animations**: Infinite-loop technology and service cards that pause on hover for better readability.
- **Interactive Tech Stack**: Section headings with color-shift on hover and skill cards with pop-out elevation effects.
- **Live Counters**: Subtle pulsing animations on statistics (Languages, Frameworks, Tools) to make the data feel alive.
- **Handcrafted UI/UX**: Professional hover states, platform-branded social links (LinkedIn/Twitter/Instagram), and smooth-scroll navigation.
- **Unified Journey Timeline**: Work experience and education rendered on one scroll-driven timeline, typed and distinguished by role.
- **Project Detail Modals**: Per-project galleries and key-insight breakdowns, with graceful handling of projects that have no public repo.
- **Mobile Responsive**: Fully optimized for all screen sizes from mobile to ultra-wide displays.
- **Unicorn Studio Integration**: Interactive background animations for a premium, futuristic aesthetic.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Google Fonts (Barlow Condensed & Inter)](https://fonts.google.com/)
- **Interactions**: [Unicorn Studio](https://unicorn.studio/)

## 📂 Project Structure

```text
/
├── public/          # Static assets (images, profile photo, etc.)
├── src/
│   ├── app/         # Next.js App Router (layout, globals.css)
│   │   └── api/chat/  # Serverless endpoint for the AI assistant
│   ├── components/  # React components (Hero, TechStack, etc.)
│   │   └── chat/      # Chat widget, state hook, safe Markdown renderer
│   ├── data/        # portfolio.ts: single source of truth for the site AND the assistant
│   └── lib/chat/    # Assistant server logic (knowledge, retrieval, prompt, providers, guards)
├── tests/           # Unit tests for the assistant (node --test)
├── package.json     # Project dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## 🤖 AI Portfolio Assistant

A floating **Ask About Akshit** chat that answers recruiters' questions about Akshit's skills, projects, experience and links. It only answers from verified portfolio and resume data.

### How a question flows

```text
Browser (ChatWidget) ──POST /api/chat { messages: last 10 turns }──▶ Route handler (Vercel function)
   1. Kill switch (CHAT_ENABLED), same-origin check, 32 KB body cap
   2. Per-visitor admission in ONE store round trip: shared kill flag, 10/min, 30/hour,
      60/day, max 2 concurrent answers  → HTTP 429 + Retry-After if exceeded
   3. Validate the body: only { messages }, roles, ≤2,000 chars, control characters stripped
   4. Prompt injection → fixed refusal; clearly unrelated question → fixed redirect (no model call)
   5. Global daily budget (CHAT_DAILY_BUDGET) → 503 once spent
   6. Retrieve relevant knowledge from portfolio.ts (profile + up to 4 matching sections)
   7. Stream from ONE model (SSE). A second model is tried only if the first fails
      before producing any text (max CHAT_MAX_ATTEMPTS = 2). No retries mid-answer.
   8. Every chunk passes the stream sanitizer: unverified links, emails and phone numbers
      are removed; a leaked key or prompt marker aborts the model and replaces the answer
◀── NDJSON stream of {delta}/{replace}/{done}/{error} → rendered progressively with a small
    Markdown renderer (React elements only, no raw HTML). Stop aborts the model call.
```

- **Knowledge source: one file.** The assistant reads `src/data/portfolio.ts`, the same module the site renders. Nothing else needs maintaining: no second knowledge file, database, embeddings or sync job. Anything not in it is answered with *"I don't have verified information…"*.
- **Keys stay server-side.** Keys are read only in `src/lib/chat/providers.ts` inside the route handler. Nothing is exposed through `NEXT_PUBLIC_*`.
- **No conversation storage.** Conversations live in React state for the current page view. The only server-side data is short-lived counters keyed by a salted hash of the visitor's IP (never the raw IP), expiring within 24 hours.

### Updating what the assistant knows

Edit `src/data/portfolio.ts`, push to `main`, and Vercel redeploys the site and assistant together.

| You change… | Where in `portfolio.ts` | Site | Assistant |
| --- | --- | --- | --- |
| Add a project | `projects` | new card | can describe it and share its repo/demo links |
| Project known only to the assistant (e.g. no image yet) | `projects` with `showOnSite: false` | hidden | knows it |
| Add a skill | `skillsMarquee`, `skillCategories` or `additionalSkills` | shown (first two) | recognises it; says "used in X" only if a project's `tags` include it, otherwise "listed" |
| Change a link, email or resume | `personal`, project `github`/`demo` | updated | uses the new value; the old URL is rejected by the link allowlist |
| Experience, education, certifications, achievements | `experience`, `education`, `certifications`, `achievements`, `training` | updated (where rendered) | updated |

Fields such as project `details`, experience `details`, education `grade`, `achievements` and `careerInterests` hold resume facts the site doesn't render (yet). The assistant reads every field.

Why it can't go stale: the knowledge base, retrieval keywords, skill evidence and link allowlist are all derived from `portfolio.ts` when the serverless function starts. Each Vercel deployment bundles its own copy of the file, and `/api/chat` is `force-dynamic` with `Cache-Control: no-store`, so no cache survives a deploy.

### Configuration

Copy `.env.example` to `.env` (or `.env.local`) and set at least one key:

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini key ([AI Studio](https://aistudio.google.com/apikey)) |
| `GEMINI_MODEL` | Optional, comma-separated. Default `gemini-flash-lite-latest,gemini-flash-latest` |
| `GROQ_API_KEY` | Groq key ([console](https://console.groq.com/keys)) |
| `GROQ_MODEL` | Optional, comma-separated. Default `openai/gpt-oss-120b` |
| `XAI_API_KEY` / `GROK_API_KEY` | xAI Grok key (optional) |
| `XAI_MODEL` / `GROK_MODEL` | Optional. Default `grok-3-mini` |
| `CHAT_PROVIDER_ORDER` | Optional. Default `gemini,groq,xai` |
| `CHAT_MAX_OUTPUT_TOKENS` | Optional. Default `700` (max 2048) |

**Abuse and cost protection.** All values are optional, read on the server only, and can't be changed by a request:

| Variable | Default | Effect |
| --- | --- | --- |
| `CHAT_ENABLED` | `true` | `false` = emergency kill switch; every request gets 503 with no model call (takes effect on redeploy) |
| `CHAT_RATE_PER_MINUTE` / `_PER_HOUR` / `_PER_DAY` | `10` / `30` / `60` | Per-visitor limits → HTTP 429 with `Retry-After` |
| `CHAT_MAX_CONCURRENT` | `2` | Answers one visitor can be streaming at once |
| `CHAT_MAX_MESSAGE_CHARS` | `2000` | Longest accepted question (max 4000) |
| `CHAT_DAILY_BUDGET` | `500` | Model calls per UTC day across all visitors; `0` = unlimited |
| `CHAT_MAX_ATTEMPTS` | `2` | Model calls per question (1 = no fallback) |
| `CHAT_FIRST_TOKEN_TIMEOUT_MS` | `10000` | Abort if a provider sends nothing (or stalls) for this long |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` + `KV_REST_API_TOKEN`) | unset | Shared counters, needed for limits that hold across Vercel instances (see below) |

#### Making the limits reliable on Vercel (free)

Vercel runs your API route on many short-lived instances that share no memory. Without a shared store, the limits, concurrency cap and daily budget are counted **per instance**. That stops a single burst, but a determined visitor or a traffic spike can get more. To make them global:

1. Vercel → your project → **Storage** (or **Marketplace**) → add **Upstash for Redis**, choose the **Free** plan, and connect it to this project. Vercel adds the `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`) variables automatically.
2. Redeploy. Each question costs about 11 Redis commands, well within the free tier for a portfolio.
3. **Instant kill switch** (no redeploy): in the Upstash console run `SET chat:disabled 1`; `DEL chat:disabled` turns the assistant back on.

If Redis is configured but unreachable, the route falls back to per-instance memory rather than going down, and logs `[chat] rate-limit store unavailable`.

Defaults use Google's `-latest` aliases, so they keep working when dated model versions are retired. Groq model IDs change more often: if the server log shows `model_not_found`, pick a current ID from the Groq console and set `GROQ_MODEL`.

### Run locally

```bash
npm install
cp .env.example .env    # then fill in your key(s)
npm run dev             # http://localhost:3000, then click "Ask about Akshit"
```

### Deploy (Vercel)

No separate backend. `/api/chat` is a Next.js route handler in this repo, and Vercel deploys it as a serverless function alongside the site on the same domain (`https://akshitjain.vercel.app/api/chat`). No `vercel.json` is needed.

1. In Vercel → **Project → Settings → Environment Variables**, make sure the keys exist under these names for **Production** (and **Preview** if you want previews to chat): `GEMINI_API_KEY` (also accepted: `GOOGLE_GENERATIVE_AI_API_KEY`, `GOOGLE_API_KEY`) and/or `GROQ_API_KEY` (`XAI_API_KEY`/`GROK_API_KEY` for xAI). Your local `.env` is git-ignored and is **not** uploaded. Environment-variable changes apply only to new deployments.
2. Push to `main` (or redeploy). `/api/chat` runs as a Node.js serverless function (`maxDuration = 30`), and nothing else needs configuring.
3. Check: open the site, ask a question. If it says the assistant isn't available, open **Vercel → Logs** and look for `[chat]` lines.

### Tests

```bash
npm run test:chat   # assistant logic + sync tests (fixtures: new project/skill, changed URL/description, drift guards)
npm run lint
npm run build
```

### Known limitations

- **Without Upstash, rate limits, the concurrency cap and the daily budget are per instance**, not global (see "Making the limits reliable"). The `CHAT_ENABLED=false` kill switch works either way.
- Visitors are identified by IP. People behind one corporate network or NAT share the per-visitor limits.
- The daily budget counts model calls, not tokens. Token cost per call is bounded by history (10 turns), retrieved context (≈4 sections), `CHAT_MAX_OUTPUT_TOKENS` and a capped Gemini thinking budget.
- Free provider tiers have small per-minute token quotas (for example, Groq's free tier allows 8K tokens/min for `gpt-oss-120b`, about two answers a minute). That's why Gemini Flash-Lite answers first and Groq is the fallback.
- Retrieval uses keyword matching, which suits a knowledge base this small. Revisit it only if the data grows a lot.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akshitjain1/AJ.git
   cd AJ
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

The project is ready to be deployed on **Vercel**. 

1. Push your changes to GitHub.
2. Import the repository into Vercel.
3. The build settings are auto-detected (Next.js).

## 📩 Contact

**Akshit Jain** — AI Software Engineer
- Email: [akshitjainonly1@gmail.com](mailto:akshitjainonly1@gmail.com)
- LinkedIn: [Akshit Jain](https://www.linkedin.com/in/akshit-jain-b75a6028b)
- GitHub: [@akshitjain1](https://github.com/akshitjain1)

---
*Built with ❤️ by Akshit Jain*
