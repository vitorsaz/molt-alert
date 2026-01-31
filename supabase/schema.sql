-- ═══════════════════════════════════════════════════════════════
-- MOLT ALERT - DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════

-- System Status
CREATE TABLE IF NOT EXISTS system_status (
    id INT PRIMARY KEY DEFAULT 1,
    status TEXT DEFAULT 'OFFLINE',
    tracking_count INT DEFAULT 0,
    hot_count INT DEFAULT 0,
    migrated_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO system_status (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Tokens
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ca TEXT UNIQUE NOT NULL,
    name TEXT,
    symbol TEXT,
    logo TEXT,
    market_cap DECIMAL(20, 2) DEFAULT 0,
    bonding_percent DECIMAL(5, 2) DEFAULT 0,
    holders INT DEFAULT 0,
    twitter TEXT,
    telegram TEXT,
    website TEXT,
    status TEXT DEFAULT 'tracking',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    migrated_at TIMESTAMPTZ,
    migration_tx TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tokens_ca ON tokens(ca);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_tokens_bonding ON tokens(bonding_percent DESC);
CREATE INDEX IF NOT EXISTS idx_tokens_migrated ON tokens(migrated_at DESC) WHERE status = 'migrated';
