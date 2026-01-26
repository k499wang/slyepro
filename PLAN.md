# AI ASMR Tool - Implementation Plan

## Project Overview
A web app for generating AI ASMR content using Grok Imagine (via Kie.ai), with extensibility to other AI tools (image, video, music generation).

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Auth | Supabase Auth (Google, Email) |
| Database | Supabase (PostgreSQL) |
| AI APIs | Kie.ai (Grok Imagine, Suno, Flux, etc.) |
| Styling | Tailwind CSS + shadcn/ui |
| Payments | Stripe |

---

## Phase 1: Foundation Setup

### 1.1 Dependencies to Install
```bash
# Supabase (Auth + Database)
bun add @supabase/supabase-js @supabase/ssr

# UI Components
bunx shadcn@latest init
bunx shadcn@latest add button card input label textarea tabs avatar dropdown-menu dialog toast sonner

# Payments
bun add stripe @stripe/stripe-js

# Utilities
bun add zod lucide-react
```

### 1.2 Environment Variables
Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Kie.ai
KIE_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.3 Supabase Auth Setup
In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Email (with confirm email optional for dev)
3. Enable Google OAuth:
   - Create Google Cloud OAuth credentials
   - Add redirect URL: `https://<project>.supabase.co/auth/v1/callback`
   - Add Client ID and Secret to Supabase

### 1.4 Supabase Database Schema
```sql
-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asmr_video', 'image', 'music', 'video')),
  prompt TEXT NOT NULL,
  input_image_url TEXT,
  output_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  credits_used INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  description TEXT,
  stripe_payment_id TEXT,
  generation_id UUID REFERENCES generations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created ON generations(created_at DESC);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Phase 2: Project Structure

```
/src
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Login page
│   │   ├── signup/page.tsx          # Signup page
│   │   └── callback/route.ts        # OAuth callback handler
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Dashboard layout with sidebar
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── generate/
│   │   │   └── page.tsx             # ASMR generator
│   │   ├── history/
│   │   │   └── page.tsx             # Generation history
│   │   ├── credits/
│   │   │   └── page.tsx             # Buy credits
│   │   └── settings/
│   │       └── page.tsx             # User settings
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts      # Stripe payments
│   │   ├── generate/route.ts        # AI generation
│   │   ├── generations/
│   │   │   └── [id]/route.ts        # Get generation status
│   │   └── credits/
│   │       └── checkout/route.ts    # Stripe checkout
│   ├── layout.tsx
│   ├── page.tsx                     # Landing page
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn components
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── oauth-buttons.tsx
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── user-nav.tsx
│   ├── generator/
│   │   ├── prompt-input.tsx
│   │   ├── image-upload.tsx
│   │   ├── generation-card.tsx
│   │   └── video-player.tsx
│   └── credits/
│       ├── credit-balance.tsx
│       └── pricing-cards.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   └── middleware.ts            # Auth middleware helper
│   ├── kie.ts                       # Kie.ai API wrapper
│   ├── stripe.ts                    # Stripe helpers
│   ├── credits.ts                   # Credit management
│   └── utils.ts                     # General utilities
├── hooks/
│   ├── use-user.ts                  # Current user hook
│   ├── use-credits.ts
│   └── use-generations.ts
├── types/
│   └── index.ts                     # TypeScript types
└── middleware.ts                    # Next.js middleware for auth
```

---

## Phase 3: Implementation Steps

### Step 1: Supabase Setup
- [ ] Create Supabase project
- [ ] Enable Google OAuth provider
- [ ] Run database schema SQL
- [ ] Create Supabase client utilities (client + server)
- [ ] Create Next.js middleware for session refresh

### Step 2: Auth Pages
- [ ] Create login page with email + Google
- [ ] Create signup page
- [ ] Create OAuth callback route
- [ ] Add protected route middleware
- [ ] Test auth flow

### Step 3: Core UI
- [ ] Initialize shadcn/ui
- [ ] Create dashboard layout with sidebar
- [ ] Build user navigation dropdown
- [ ] Create landing page

### Step 4: ASMR Generator
- [ ] Build prompt input component
- [ ] Add image upload for image-to-video
- [ ] Create Kie.ai API wrapper
- [ ] Build generation API route
- [ ] Implement polling for generation status
- [ ] Create video player component

### Step 5: Credits System
- [ ] Display credit balance in header
- [ ] Deduct credits on generation
- [ ] Build credit purchase page
- [ ] Integrate Stripe checkout
- [ ] Handle Stripe webhooks

### Step 6: History & Polish
- [ ] Build generation history page
- [ ] Add re-generate functionality
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test all flows

---

## Phase 4: API Reference

### Kie.ai Grok Imagine API
```typescript
// POST https://api.kie.ai/v1/grok-imagine
{
  prompt: string;          // Required: Text description
  image_url?: string;      // Optional: Reference image for image-to-video
  mode?: 'normal' | 'fun' | 'custom';  // Generation mode
  webhook_url?: string;    // Optional: Callback URL
}

// Response
{
  id: string;              // Generation ID
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_url?: string;     // Video URL when completed
  error?: string;
}
```

### Credit Costs
| Generation Type | Credits |
|----------------|---------|
| ASMR Video (Grok Imagine) | 5 |
| Image Generation | 2 |
| Music Generation | 3 |
| Video Generation | 8 |

### Credit Packages
| Package | Credits | Price |
|---------|---------|-------|
| Starter | 50 | $4.99 |
| Popular | 150 | $9.99 |
| Pro | 500 | $24.99 |

---

## Phase 5: Future Extensions

### Additional AI Tools (via Kie.ai)
- **Image Generation**: Flux, Midjourney API
- **Music Generation**: Suno API
- **Video Generation**: Veo 3, Runway
- **Voice/TTS**: ElevenLabs

### Features Roadmap
- [ ] Preset templates for popular ASMR types
- [ ] Batch generation
- [ ] Custom voice cloning
- [ ] Social sharing
- [ ] Generation scheduling
- [ ] Team/organization support

---

## Quick Start Checklist

1. [ ] Create Supabase project
2. [ ] Enable Google OAuth in Supabase
3. [ ] Run database schema in SQL Editor
4. [ ] Get Kie.ai API key
5. [ ] Set up Stripe account (test mode)
6. [ ] Fill in `.env.local`
7. [ ] Install dependencies
8. [ ] Run `bun dev` and test auth flow
