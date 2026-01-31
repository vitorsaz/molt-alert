import { config } from '../config.js';
import { withRetry } from './utils.js';

const HEADERS = { 'X-API-KEY': config.BIRDEYE_API_KEY, 'x-chain': 'solana' };

let solPriceUsd = 0;
let solPriceLastUpdate = 0;

async function fetchWithRetry(url, options = {}) {
    return withRetry(async () => {
        const r = await fetch(url, { headers: HEADERS, ...options });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    }, { retries: 3, delay: 1000 });
}

export async function getSolPrice() {
    const now = Date.now();
    if (solPriceUsd > 0 && now - solPriceLastUpdate < 60000) return solPriceUsd;
    try {
        const json = await fetchWithRetry(`${config.BIRDEYE_PRICE}?address=So11111111111111111111111111111111111111112`);
        if (json.success && json.data?.value) {
            solPriceUsd = json.data.value;
            solPriceLastUpdate = now;
        }
    } catch (e) { console.error('[BIRDEYE] SOL price error:', e.message); }
    return solPriceUsd > 0 ? solPriceUsd : 200;
}

export async function getTokenOverview(ca) {
    try {
        const json = await fetchWithRetry(`${config.BIRDEYE_OVERVIEW}?address=${ca}`);
        if (json.success && json.data) {
            const d = json.data;
            return {
                name: d.name,
                symbol: d.symbol,
                logo: d.logoURI,
                price: d.price,
                mc: d.mc,
                liquidity: d.liquidity,
                holders: d.holder,
                twitter: d.extensions?.twitter || null,
                telegram: d.extensions?.telegram || null,
                website: d.extensions?.website || null,
            };
        }
    } catch (e) { console.error('[BIRDEYE] Overview error:', e.message); }
    return null;
}
