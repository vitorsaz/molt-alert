import 'dotenv/config';

export const config = {
    // PumpPortal
    PUMPPORTAL_WS: 'wss://pumpportal.fun/api/data',

    // Birdeye (do .env)
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    BIRDEYE_OVERVIEW: 'https://public-api.birdeye.so/defi/token_overview',
    BIRDEYE_PRICE: 'https://public-api.birdeye.so/defi/price',

    // Helius (do .env)
    HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    HELIUS_RPC: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,

    // Supabase (do .env)
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

    // Server
    PORT: parseInt(process.env.PORT) || 3001,

    // Migration Config
    MIGRATION_THRESHOLD: 90, // Alert when bonding curve >= 90%
    UPDATE_INTERVAL: 5000,   // Update every 5 seconds
};

// Validação
const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'BIRDEYE_API_KEY', 'HELIUS_API_KEY'];
const missing = required.filter(k => !config[k] && !process.env[k]);
if (missing.length > 0) {
    console.error('❌ Variáveis faltando:', missing.join(', '));
    process.exit(1);
}
