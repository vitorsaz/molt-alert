#!/usr/bin/env node
import 'dotenv/config';

console.log('');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        🦞 MOLT ALERT - TESTANDO CONEXÕES                   ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

const results = { supabase: false, birdeye: false, helius: false, pumpportal: false };

async function testSupabase() {
    console.log('[1/4] Testando Supabase...');
    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;
        if (!url || !key) { console.log('      ❌ Vars não configuradas'); return; }

        const response = await fetch(`${url}/rest/v1/`, {
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
        });

        if (response.ok || response.status === 404) {
            console.log('      ✅ Supabase OK!');
            results.supabase = true;
        } else {
            console.log(`      ❌ Erro: ${response.status}`);
        }
    } catch (e) { console.log(`      ❌ Erro: ${e.message}`); }
}

async function testBirdeye() {
    console.log('[2/4] Testando Birdeye...');
    try {
        const apiKey = process.env.BIRDEYE_API_KEY;
        if (!apiKey) { console.log('      ❌ BIRDEYE_API_KEY não configurado'); return; }

        const response = await fetch(
            'https://public-api.birdeye.so/defi/price?address=So11111111111111111111111111111111111111112',
            { headers: { 'X-API-KEY': apiKey, 'x-chain': 'solana' } }
        );
        const data = await response.json();

        if (data.success) {
            console.log(`      ✅ Birdeye OK! (SOL = $${data.data.value.toFixed(2)})`);
            results.birdeye = true;
        } else {
            console.log(`      ❌ Erro: ${data.message || 'Unknown'}`);
        }
    } catch (e) { console.log(`      ❌ Erro: ${e.message}`); }
}

async function testHelius() {
    console.log('[3/4] Testando Helius RPC...');
    try {
        const apiKey = process.env.HELIUS_API_KEY;
        if (!apiKey) { console.log('      ❌ HELIUS_API_KEY não configurado'); return; }

        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getHealth' })
        });
        const data = await response.json();

        if (data.result === 'ok') {
            console.log('      ✅ Helius RPC OK!');
            results.helius = true;
        } else {
            console.log(`      ❌ Erro: ${JSON.stringify(data.error)}`);
        }
    } catch (e) { console.log(`      ❌ Erro: ${e.message}`); }
}

async function testPumpPortal() {
    console.log('[4/4] Testando PumpPortal WebSocket...');
    try {
        const WebSocket = (await import('ws')).default;

        await new Promise((resolve, reject) => {
            const ws = new WebSocket('wss://pumpportal.fun/api/data');
            const timeout = setTimeout(() => { ws.close(); reject(new Error('Timeout')); }, 5000);

            ws.on('open', () => {
                clearTimeout(timeout);
                console.log('      ✅ PumpPortal WebSocket OK!');
                results.pumpportal = true;
                ws.close();
                resolve();
            });
            ws.on('error', (e) => { clearTimeout(timeout); reject(e); });
        });
    } catch (e) { console.log(`      ❌ Erro: ${e.message}`); }
}

async function runTests() {
    await testSupabase();
    await testBirdeye();
    await testHelius();
    await testPumpPortal();

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');

    const allOk = Object.values(results).every(v => v);
    Object.entries(results).forEach(([name, ok]) => {
        console.log(`  ${ok ? '✅' : '❌'} ${name}`);
    });

    console.log('');
    console.log(allOk ? '🦞 Tudo OK! Pode rodar: npm start' : '⚠️  Corrija os erros acima.');
    console.log('═══════════════════════════════════════════════════════════════');
}

runTests().catch(console.error);
