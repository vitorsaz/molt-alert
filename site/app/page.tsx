'use client';

import { useEffect, useState } from 'react';
import { getSupabase, subscribeToTokens, subscribeToStatus, Token, SystemStatus } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [migratedTokens, setMigratedTokens] = useState<Token[]>([]);
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabase();

        // Fetch initial data
        async function fetchData() {
            const [tokensRes, migratedRes, statusRes] = await Promise.all([
                supabase.from('tokens').select('*').eq('status', 'tracking').order('bonding_percent', { ascending: false }),
                supabase.from('tokens').select('*').eq('status', 'migrated').order('migrated_at', { ascending: false }).limit(20),
                supabase.from('system_status').select('*').eq('id', 1).single()
            ]);

            if (tokensRes.data) setTokens(tokensRes.data);
            if (migratedRes.data) setMigratedTokens(migratedRes.data);
            if (statusRes.data) setStatus(statusRes.data);
            setLoading(false);
        }

        fetchData();

        // Subscribe to realtime
        const tokenSub = subscribeToTokens((token) => {
            if (token.status === 'tracking') {
                setTokens(prev => {
                    const existing = prev.findIndex(t => t.ca === token.ca);
                    if (existing >= 0) {
                        const updated = [...prev];
                        updated[existing] = token;
                        return updated.sort((a, b) => b.bonding_percent - a.bonding_percent);
                    }
                    return [token, ...prev].sort((a, b) => b.bonding_percent - a.bonding_percent);
                });
            } else if (token.status === 'migrated') {
                setTokens(prev => prev.filter(t => t.ca !== token.ca));
                setMigratedTokens(prev => [token, ...prev].slice(0, 20));
            }
        });

        const statusSub = subscribeToStatus(setStatus);

        return () => {
            tokenSub.unsubscribe();
            statusSub.unsubscribe();
        };
    }, []);

    const hotTokens = tokens.filter(t => t.bonding_percent >= 90);
    const trackingTokens = tokens.filter(t => t.bonding_percent < 90);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent" />
                <div className="max-w-6xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <span className="text-8xl mb-6 block animate-float">🦞</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 lobster-glow">
                            Molt Alert
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                            Track pump.fun tokens about to migrate to Raydium.<br />
                            Catch the molt before it happens.
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 flex-wrap">
                            <div className="glass rounded-xl px-6 py-4">
                                <p className="text-gray-400 text-sm">Tracking</p>
                                <p className="text-3xl font-bold">{status?.tracking_count || tokens.length}</p>
                            </div>
                            <div className="glass rounded-xl px-6 py-4 border-yellow-500/30">
                                <p className="text-yellow-500 text-sm">Hot (90%+)</p>
                                <p className="text-3xl font-bold text-yellow-500">{status?.hot_count || hotTokens.length}</p>
                            </div>
                            <div className="glass rounded-xl px-6 py-4 border-green-500/30">
                                <p className="text-green-500 text-sm">Migrated</p>
                                <p className="text-3xl font-bold text-green-500">{status?.migrated_count || migratedTokens.length}</p>
                            </div>
                            <div className="glass rounded-xl px-6 py-4">
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className={`text-xl font-bold ${status?.status === 'ONLINE' ? 'text-green-500' : 'text-red-500'}`}>
                                    {status?.status || 'OFFLINE'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Hot Tokens (90%+) */}
            {hotTokens.length > 0 && (
                <section id="hot" className="py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-red-500">🔥</span>
                            About to Molt ({hotTokens.length})
                        </h2>
                        <div className="grid gap-4">
                            <AnimatePresence>
                                {hotTokens.map((token) => (
                                    <TokenCard key={token.ca} token={token} isHot />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            )}

            {/* Tracking Tokens */}
            <section id="tracker" className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span>📡</span>
                        Tracking ({trackingTokens.length})
                    </h2>
                    {loading ? (
                        <div className="grid gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="token-card p-4 shimmer h-20" />
                            ))}
                        </div>
                    ) : trackingTokens.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>No tokens being tracked yet.</p>
                            <p className="text-sm mt-2">New tokens will appear here automatically.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            <AnimatePresence>
                                {trackingTokens.slice(0, 50).map((token) => (
                                    <TokenCard key={token.ca} token={token} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>

            {/* Recently Migrated */}
            <section id="migrated" className="py-12 px-4 bg-[#0d0d0d]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-green-500">✅</span>
                        Recently Migrated ({migratedTokens.length})
                    </h2>
                    {migratedTokens.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No migrations yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {migratedTokens.map((token) => (
                                <MigratedCard key={token.ca} token={token} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// TOKEN CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
function TokenCard({ token, isHot = false }: { token: Token; isHot?: boolean }) {
    const isCritical = token.bonding_percent >= 99;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`token-card ${isHot ? 'hot' : ''} ${isCritical ? 'migrating' : ''} p-4`}
        >
            <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-full bg-[#262626] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl">🦞</span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold truncate">{token.symbol || token.name}</h3>
                        {isCritical && <span className="text-xs bg-red-500 px-2 py-0.5 rounded">MOLTING!</span>}
                        {isHot && !isCritical && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">HOT</span>}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{token.name}</p>
                </div>

                {/* Progress */}
                <div className="w-48 flex-shrink-0">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Bonding</span>
                        <span className={`font-mono font-bold ${isCritical ? 'text-red-500' : isHot ? 'text-yellow-500' : 'text-white'}`}>
                            {token.bonding_percent?.toFixed(1)}%
                        </span>
                    </div>
                    <div className="progress-bar h-2">
                        <div
                            className={`progress-fill ${isCritical ? 'critical' : isHot ? 'hot' : 'normal'}`}
                            style={{ width: `${Math.min(100, token.bonding_percent || 0)}%` }}
                        />
                    </div>
                </div>

                {/* Market Cap */}
                <div className="text-right flex-shrink-0 w-24">
                    <p className="text-sm text-gray-400">MC</p>
                    <p className="font-mono font-bold">{formatMC(token.market_cap)}</p>
                </div>

                {/* Links */}
                <div className="flex gap-2 flex-shrink-0">
                    <a
                        href={`https://pump.fun/${token.ca}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] rounded text-sm transition-colors"
                    >
                        Pump
                    </a>
                    {token.twitter && (
                        <a
                            href={token.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] rounded text-sm transition-colors"
                        >
                            𝕏
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MIGRATED CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
function MigratedCard({ token }: { token: Token }) {
    const timeAgo = token.migrated_at ? formatTimeAgo(token.migrated_at) : '';

    return (
        <div className="token-card p-4 border-green-500/20">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center overflow-hidden">
                    {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
                    ) : (
                        <span>🦞</span>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold">{token.symbol || token.name}</h3>
                    <p className="text-sm text-gray-500">{token.name}</p>
                </div>
                <div className="text-right">
                    <p className="text-green-500 font-bold">Migrated ✓</p>
                    <p className="text-sm text-gray-500">{timeAgo}</p>
                </div>
                <div className="flex gap-2">
                    <a
                        href={`https://dexscreener.com/solana/${token.ca}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded text-sm transition-colors"
                    >
                        DexScreener
                    </a>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function formatMC(value: number) {
    if (!value) return '$0';
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
}

function formatTimeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
