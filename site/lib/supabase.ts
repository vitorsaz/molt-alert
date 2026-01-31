import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        if (typeof window === 'undefined') {
            console.warn('[SUPABASE] Env vars not available during build');
            return createClient('https://placeholder.supabase.co', 'placeholder');
        }
        throw new Error('Missing Supabase environment variables');
    }

    supabaseInstance = createClient(url, key);
    return supabaseInstance;
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
export interface Token {
    id: string;
    ca: string;
    name: string;
    symbol: string;
    logo: string | null;
    market_cap: number;
    bonding_percent: number;
    holders: number;
    twitter: string | null;
    telegram: string | null;
    website: string | null;
    status: 'tracking' | 'migrated';
    created_at: string;
    migrated_at: string | null;
}

export interface SystemStatus {
    id: number;
    status: string;
    tracking_count: number;
    hot_count: number;
    migrated_count: number;
    updated_at: string;
}

// ═══════════════════════════════════════════════════════════════
// REALTIME SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════
export function subscribeToTokens(callback: (token: Token) => void) {
    const client = getSupabase();
    return client
        .channel('tokens')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, (payload) => {
            callback(payload.new as Token);
        })
        .subscribe();
}

export function subscribeToStatus(callback: (status: SystemStatus) => void) {
    const client = getSupabase();
    return client
        .channel('status')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'system_status' }, (payload) => {
            callback(payload.new as SystemStatus);
        })
        .subscribe();
}
