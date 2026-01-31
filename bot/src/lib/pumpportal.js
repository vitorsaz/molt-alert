import WebSocket from 'ws';
import { config } from '../config.js';

let ws = null;
let isConnected = false;

// ═══════════════════════════════════════════════════════════════
// WEBSOCKET
// ═══════════════════════════════════════════════════════════════
export function connectPumpPortal(callbacks = {}) {
    const { onToken, onTrade, onMigration, onConnect, onDisconnect } = callbacks;
    console.log('[PUMPPORTAL] Conectando...');
    ws = new WebSocket(config.PUMPPORTAL_WS);

    ws.on('open', () => {
        isConnected = true;
        console.log('[PUMPPORTAL] ✅ Conectado!');
        if (onConnect) onConnect();
    });

    ws.on('message', async (data) => {
        try {
            const msg = JSON.parse(data.toString());

            // Novo token criado
            if (msg.txType === 'create' && msg.mint && onToken) {
                onToken(msg);
            }

            // Trade (buy/sell)
            if ((msg.txType === 'buy' || msg.txType === 'sell') && onTrade) {
                onTrade(msg);
            }

            // Migration para Raydium
            if (msg.txType === 'migrate' && onMigration) {
                onMigration(msg);
            }
        } catch {}
    });

    ws.on('close', () => {
        isConnected = false;
        console.log('[PUMPPORTAL] ❌ Desconectado. Reconectando em 5s...');
        if (onDisconnect) onDisconnect();
        setTimeout(() => connectPumpPortal(callbacks), 5000);
    });

    ws.on('error', (e) => console.error('[PUMPPORTAL] Erro:', e.message));
    return ws;
}

export function subscribeNewTokens() {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
        console.log('[PUMPPORTAL] Inscrito em novos tokens');
    }
}

export function subscribeTokenTrade(tokenAddress) {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeTokenTrade', keys: [tokenAddress] }));
    }
}

export function subscribeMigration() {
    if (ws && isConnected) {
        ws.send(JSON.stringify({ method: 'subscribeMigration' }));
        console.log('[PUMPPORTAL] Inscrito em migrações');
    }
}

export function isWsConnected() { return isConnected; }

export function closeWebSocket() {
    if (ws) {
        isConnected = false;
        ws.close();
        ws = null;
        console.log('[PUMPPORTAL] WebSocket fechado');
    }
}
