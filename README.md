# Molt Alert 🦞

Real-time migration tracker for pump.fun tokens. Track bonding curves and catch migrations before they happen.

## 🌐 Links

- **Site:** [molt-alert.vercel.app](https://molt-alert.vercel.app)
- **Twitter:** Coming soon

## 📦 Structure

```
molt-alert/
├── bot/         # Migration tracking bot
└── site/        # Next.js dashboard
```

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### 1. Clone the repository
```bash
git clone https://github.com/vitorsaz/molt-alert.git
cd molt-alert
```

### 2. Setup Database
1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run `supabase/schema.sql`
4. Run `supabase/fix_realtime.sql`

### 3. Setup Bot
```bash
cd bot
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run test  # Test connections
npm start     # Run bot
```

### 4. Setup Site (local dev)
```bash
cd site
cp .env.example .env.local
# Edit with NEXT_PUBLIC_SUPABASE_URL and KEY
npm install
npm run dev
```

### 5. Deploy Site
```bash
cd site
vercel --prod
# Add env vars in Vercel dashboard
```

## 🔧 Environment Variables

### Bot (.env)
```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
BIRDEYE_API_KEY=
HELIUS_API_KEY=
```

### Site (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 📊 Features

- ✅ Real-time bonding curve tracking
- ✅ Hot zone alerts (90%+)
- ✅ Migration notifications
- ✅ Token metadata (name, logo, socials)
- ✅ Recently migrated history
- ✅ Clean, responsive UI

## 🦞 Why "Molt"?

Lobsters molt (shed their shell) to grow bigger. Similarly, tokens "molt" from pump.fun to Raydium to access more liquidity and volume.

## ⚠️ Disclaimer

This is an experimental project. Trading memecoins is extremely risky. Not financial advice. DYOR.

## 📄 License

MIT
