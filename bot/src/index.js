import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { supabase, updateSystemStatus, upsertToken, getActiveTokens, getHotTokens, getMigratedTokens, markAsMigrated, getStats } from './lib/supabase.js';
import { getSolPrice, getTokenOverview } from './lib/birdeye.js';
import { fetchImageFromIPFS, calculateBondingPercent, calculateMarketCap } from './lib/utils.js';
import { logHeader, logMigration, logMigrated, logWS, logError, logSuccess, logInfo, logWarning, logStats } from './lib/logger.js';
import { connectPumpPortal, subscribeNewTokens, subscribeMigration, subscribeTokenTrade, isWsConnected, closeWebSocket } from './lib/pumpportal.js';

// ═══════════════════════════════════════════════════════════════
// IN-MEMORY TRACKING
// ═══════════════════════════════════════════════════════════════
const trackedTokens = new Map(); // ca -> token data

// ═══════════════════════════════════════════════════════════════
// EXPRESS API
// ═══════════════════════════════════════════════════════════════
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        connected: isWsConnected(),
        tracking: trackedTokens.size,
        uptime: process.uptime()
    });
});

app.get('/api/tokens', async (req, res) => {
    const tokens = await getActiveTokens();
    res.json(tokens);
});

app.get('/api/hot', async (req, res) => {
    const tokens = await getHotTokens(90);
    res.json(tokens);
});

app.get('/api/migrated', async (req, res) => {
    const tokens = await getMigratedTokens(50);
    res.json(tokens);
});

app.get('/api/stats', async (req, res) => {
    const stats = await getStats();
    res.json({ ...stats, connected: isWsConnected() });
});

app.listen(config.PORT, () => {
    logInfo(`API rodando em http://localhost:${config.PORT}`);
});

// ═══════════════════════════════════════════════════════════════
// PROCESSAR NOVO TOKEN
// ═══════════════════════════════════════════════════════════════
async function processNewToken(msg) {
    const { mint: ca, name, symbol, uri, marketCapSol, vSolInBondingCurve, vTokensInBondingCurve } = msg;

    const solPrice = await getSolPrice();
    const bondingPercent = calculateBondingPercent(vSolInBondingCurve, vTokensInBondingCurve);
    const mc = calculateMarketCap(vSolInBondingCurve, vTokensInBondingCurve, solPrice);

    // Buscar logo
    let logo = null;
    if (uri) {
        logo = await fetchImageFromIPFS(uri);
    }

    // Buscar info extra da Birdeye (depois de um tempo)
    let overview = null;
    setTimeout(async () => {
        overview = await getTokenOverview(ca);
        if (overview) {
            await upsertToken({
                ca,
                twitter: overview.twitter,
                telegram: overview.telegram,
                website: overview.website,
                holders: overview.holders
            });
        }
    }, 10000);

    const tokenData = {
        ca,
        name: name || 'Unknown',
        symbol: symbol || '???',
        logo,
        market_cap: mc,
        bonding_percent: bondingPercent,
        status: 'tracking',
        created_at: new Date().toISOString()
    };

    // Salvar no DB
    await upsertToken(tokenData);

    // Track in memory
    trackedTokens.set(ca, tokenData);

    // Subscribe to trades for this token
    subscribeTokenTrade(ca);

    logMigration({
        symbol: tokenData.symbol,
        name: tokenData.name,
        bondingPercent,
        mc,
        holders: 0,
        isNew: true
    });
}

// ═══════════════════════════════════════════════════════════════
// PROCESSAR TRADE (atualiza bonding curve)
// ═══════════════════════════════════════════════════════════════
async function processTrade(msg) {
    const { mint: ca, vSolInBondingCurve, vTokensInBondingCurve, marketCapSol } = msg;

    if (!trackedTokens.has(ca)) return;

    const token = trackedTokens.get(ca);
    const solPrice = await getSolPrice();
    const bondingPercent = calculateBondingPercent(vSolInBondingCurve, vTokensInBondingCurve);
    const mc = calculateMarketCap(vSolInBondingCurve, vTokensInBondingCurve, solPrice);

    const wasHot = token.bonding_percent >= 90;
    const isHot = bondingPercent >= 90;

    // Update
    token.bonding_percent = bondingPercent;
    token.market_cap = mc;
    trackedTokens.set(ca, token);

    // Update DB
    await upsertToken({
        ca,
        bonding_percent: bondingPercent,
        market_cap: mc
    });

    // Log if hot
    if (isHot) {
        logMigration({
            symbol: token.symbol,
            name: token.name,
            bondingPercent,
            mc,
            holders: token.holders || 0,
            isMigrating: bondingPercent >= 99
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// PROCESSAR MIGRAÇÃO
// ═══════════════════════════════════════════════════════════════
async function processMigration(msg) {
    const { mint: ca, signature } = msg;

    const token = trackedTokens.get(ca);

    await markAsMigrated(ca, signature);

    logMigrated({
        symbol: token?.symbol || '???',
        name: token?.name,
        mc: token?.market_cap,
        holders: token?.holders,
        txSignature: signature
    });

    // Remove from tracking
    trackedTokens.delete(ca);
}

// ═══════════════════════════════════════════════════════════════
// LOAD EXISTING TOKENS
// ═══════════════════════════════════════════════════════════════
async function loadExistingTokens() {
    const tokens = await getActiveTokens();
    logInfo(`Carregando ${tokens.length} tokens existentes...`);

    for (const token of tokens) {
        trackedTokens.set(token.ca, token);
        subscribeTokenTrade(token.ca);
    }

    logSuccess(`${tokens.length} tokens carregados em memória`);
}

// ═══════════════════════════════════════════════════════════════
// STATS LOOP
// ═══════════════════════════════════════════════════════════════
async function updateStatsLoop() {
    const stats = await getStats();

    await updateSystemStatus({
        status: isWsConnected() ? 'ONLINE' : 'OFFLINE',
        tracking_count: stats.tracking,
        hot_count: stats.hot,
        migrated_count: stats.migrated
    });

    logStats({
        tracking: stats.tracking,
        hot: stats.hot,
        migrated: stats.migrated,
        connected: isWsConnected()
    });
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
    logHeader('MOLT ALERT - Migration Tracker');

    await updateSystemStatus({ status: 'STARTING' });

    // Connect WebSocket
    connectPumpPortal({
        onConnect: async () => {
            logWS('CONNECTED', 'PumpPortal WebSocket conectado');
            await updateSystemStatus({ status: 'ONLINE' });

            subscribeNewTokens();
            subscribeMigration();

            // Load existing tokens after connection
            await loadExistingTokens();
        },
        onDisconnect: async () => {
            logWS('DISCONNECTED', 'Tentando reconectar...');
            await updateSystemStatus({ status: 'RECONNECTING' });
        },
        onToken: processNewToken,
        onTrade: processTrade,
        onMigration: processMigration
    });

    // Stats loop every 60s
    setInterval(updateStatsLoop, 60000);

    logSuccess('Molt Alert iniciado!');
}

// ═══════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════
async function shutdown(signal) {
    logInfo(`Recebido ${signal}, encerrando...`);

    try {
        await updateSystemStatus({ status: 'OFFLINE' });
        closeWebSocket();
        logHeader('MOLT ALERT ENCERRADO');
        process.exit(0);
    } catch (error) {
        logError(`Erro durante shutdown: ${error.message}`);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

main().catch(console.error);
