# ClerkWise AI

ClerkWise is a premium clinical education AI platform designed to guide medical students through structured patient history-taking (clerking) and clinical reasoning. When a student enters a patient's presenting chief complaint, ClerkWise orchestrates an advanced multi-step LangGraph workflow to produce a detailed, specialty-specific guide teaching the student exactly what questions to ask, what clinical signs to check, and why they matter.

---

## 🌟 Core Features

- **RAG-Powered Clinical Guidance**: Employs category-filtered retrieval-augmented generation referencing 20+ clinical documents across four main medical specialties:
  - **Internal Medicine** (Cardiovascular, Respiratory, GI, endocrine, neurology)
  - **Surgery** (Acute abdomen, trauma surveys, hernias, lumps)
  - **Obstetrics & Gynecology** (Obstetric records, gynecological history, subfertility)
  - **Pediatrics** (Age-adapted history, developmental milestones, safeguarding)
- **LangGraph Orchestrated Workflow**: Uses a 10-node StateGraph machine to guide students sequentially through:
  - Input Validation & Error Handling (filters out non-medical inputs)
  - Context Retrieval (RAG reference search)
  - History of Presenting Complaint (HPC / SOCRATES framework)
  - Family History (FHx / Pertinent negatives)
  - Social History (SHx / Pack-years & lifestyle)
  - Drug History (DHx / Allergies & OTC interactions)
  - Past Medical History (PMH / MJ THREADS mnemonic)
  - Differential Diagnosis & Investigations (anatomical/systemic lists, red flags, bedside/blood/imaging tests)
- **Dynamic Model Switching**: Powered by a unified model factory supporting:
  - Google Gemini (`gemini-3-flash-preview`)
  - Anthropic Claude (`claude-sonnet-5`)
  - OpenAI GPT (`gpt-5.5-2026-04-23`)
  - Integrated directly with client-side Zustand store for selection.
- **Premium User Experience**: Modern SaaS design with Tailwind CSS v4, custom theme toggle (light/dark modes), glassmorphic visuals, and fluid micro-animations.
- **Authentication**: Safe session management handled through [Better Auth](https://www.better-auth.com/).
- **Rate Limiting**: Built-in request limiting using [Upstash Redis](https://upstash.com/).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **AI/LLM Framework**: [LangChain.js](https://js.langchain.com/) & [LangGraph.js](https://langchain-ai.github.io/langgraphjs/)
- **Database / ORM**: [Drizzle ORM](https://orm.drizzle.team/) with [Postgres](https://www.postgresql.org/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Rate Limiter**: [Upstash Ratelimit](https://github.com/upstash/ratelimit) via Upstash Redis
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- **Styling & Icons**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), and [Lucide React](https://lucide.dev/)
- **Environment & Build Tools**: Bun, TSX, ESLint

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# Database Settings
DATABASE_URL=postgresql://user:password@localhost:5432/clerkwise

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# LLM Providers API Keys
GOOGLE_API_KEY=your_google_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# OAuth Integrations (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
INSTAGRAM_CLIENT_ID=your_instagram_id
INSTAGRAM_CLIENT_SECRET=your_instagram_secret
TIKTOK_CLIENT_ID=your_tiktok_id
TIKTOK_CLIENT_SECRET=your_tiktok_secret

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Vercel Blob Storage (Optional)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Mailing (Nodemailer app passwords)
NODEMAILER_USER=your_email_address
NODEMAILER_APP_PASSWORD=your_app_password
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ayinde-xyz/gemini-clone.git
cd gemini-clone
```

### 2. Install Dependencies
We recommend using [Bun](https://bun.sh/) for dependency management and execution:
```bash
bun install
```

### 3. Setup Database Schemas
Generate and push Drizzle migrations to your Postgres instance:
```bash
bun db:generate
bun db:push
```

### 4. Start the Dev Server
Run the local next development environment:
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **dev** | `bun dev` | Runs the Next.js development server with Turbopack |
| **build** | `bun build` | Compiles the production build |
| **start** | `bun start` | Boots the compiled production application |
| **lint** | `bun lint` | Type-checks code style and runs ESLint linting |
| **db:generate** | `bun db:generate` | Creates SQL migrations via Drizzle Kit |
| **db:push** | `bun db:push` | Pushes the schema definition directly to Postgres |
| **db:studio** | `bun db:studio` | Launches the interactive Drizzle Studio database explorer |
| **test** | `npx tsx tests/runner.ts` | Executes the 75-case E2E validation test runner |
| **typecheck** | `npx tsc --noEmit` | Validates TypeScript compilation |

---

## 🧪 E2E Test Suite

The project includes a robust AST-based testing suite that parses files into abstract syntax trees to verify layout structure, accessibility variables, and combinations:

```bash
npx tsx tests/runner.ts
```

It validates 75 test cases covering:
- **Tier 1**: UI Feature Presence (Hero, Feature cards, sequential steps, fonts, gradients)
- **Tier 2**: Boundaries (Responsive breakpoint scaling, screen-reader Aria elements, empty grid handling)
- **Tier 3**: Cross-Feature Interactions (Theme Toggle x Glassmorphic styles, Auth Session state routing)
- **Tier 4**: Real-world User Journeys
- **Tier 5**: Adversarial safety checks

---

## 👥 Authors & Links

- **Creator & Main Author**: [Ayinde Abdulrahman](https://ayindeabdulrahman.xyz) (`ayinde-xyz`)
- **Repository**: [GitHub Repository Link](https://github.com/ayinde-xyz/gemini-clone)
- **Documentation Refs**: [Better Auth Docs](https://www.better-auth.com/docs), [LangChain Docs](https://js.langchain.com/docs/)
