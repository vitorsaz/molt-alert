import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_KEY || config.SUPABASE_ANON_KEY
);

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════
export async function updateSystemStatus(data) {
    const { error } = await supabase
        .from('system_status')
        .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
    if (error) console.error('[SUPABASE] Status error:', error.message);
    return !error;
}

// ═══════════════════════════════════════════════════════════════
// TOKENS (bonding curve tracking)
// ═══════════════════════════════════════════════════════════════
export async function upsertToken(token) {
    const { data, error } = await supabase
        .from('tokens')
        .upsert({ ...token, updated_at: new Date().toISOString() }, { onConflict: 'ca' })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Token error:', error.message);
    return data;
}

export async function getToken(ca) {
    const { data } = await supabase.from('tokens').select('*').eq('ca', ca).single();
    return data;
}

export async function getActiveTokens() {
    const { data } = await supabase
        .from('tokens')
        .select('*')
        .eq('status', 'tracking')
        .order('bonding_percent', { ascending: false });
    return data || [];
}

export async function getHotTokens(threshold = 90) {
    const { data } = await supabase
        .from('tokens')
        .select('*')
        .eq('status', 'tracking')
        .gte('bonding_percent', threshold)
        .order('bonding_percent', { ascending: false });
    return data || [];
}

export async function getMigratedTokens(limit = 50) {
    const { data } = await supabase
        .from('tokens')
        .select('*')
        .eq('status', 'migrated')
        .order('migrated_at', { ascending: false })
        .limit(limit);
    return data || [];
}

export async function markAsMigrated(ca, txSignature = null) {
    const { data, error } = await supabase
        .from('tokens')
        .update({
            status: 'migrated',
            migrated_at: new Date().toISOString(),
            migration_tx: txSignature,
            bonding_percent: 100
        })
        .eq('ca', ca)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Migration error:', error.message);
    return data;
}

// ═══════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════
export async function getStats() {
    const [tracking, hot, migrated] = await Promise.all([
        supabase.from('tokens').select('id', { count: 'exact' }).eq('status', 'tracking'),
        supabase.from('tokens').select('id', { count: 'exact' }).eq('status', 'tracking').gte('bonding_percent', 90),
        supabase.from('tokens').select('id', { count: 'exact' }).eq('status', 'migrated')
    ]);

    return {
        tracking: tracking.count || 0,
        hot: hot.count || 0,
        migrated: migrated.count || 0
    };
}
