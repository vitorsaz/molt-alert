import chalk from 'chalk';
import fs from 'fs';

// ═══════════════════════════════════════════════════════════════
// LOGS EM ARQUIVO
// ═══════════════════════════════════════════════════════════════
if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
const logFileName = `./logs/${new Date().toISOString().split('T')[0]}.log`;
const logStream = fs.createWriteStream(logFileName, { flags: 'a' });

function saveToFile(message) {
    const clean = message.replace(/\x1b\[[0-9;]*m/g, '');
    logStream.write(clean + '\n');
}

// ═══════════════════════════════════════════════════════════════
// FORMATADORES
// ═══════════════════════════════════════════════════════════════
function padRight(str, len) {
    str = String(str);
    return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length);
}

function padLeft(str, len) {
    str = String(str);
    return str.length >= len ? str.slice(0, len) : ' '.repeat(len - str.length) + str;
}

function formatMC(value) {
    if (!value) return '0';
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return value.toFixed(2);
}

function formatPercent(value) {
    if (value === undefined || value === null) return '0%';
    return `${value.toFixed(1)}%`;
}

function timestamp() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

// Progress bar para bonding curve
function progressBar(percent, width = 20) {
    const p = Math.max(0, Math.min(100, percent || 0));
    const filled = Math.round((p / 100) * width);
    const empty = width - filled;

    let color;
    if (p >= 90) color = chalk.bgRed;
    else if (p >= 70) color = chalk.bgYellow;
    else color = chalk.bgGray;

    return color(' '.repeat(filled)) + chalk.bgGray.dim(' '.repeat(empty));
}

// ═══════════════════════════════════════════════════════════════
// LOG DE TOKEN (Migration Tracker)
// ═══════════════════════════════════════════════════════════════
export function logMigration(data) {
    const { symbol, name, bondingPercent, mc, holders, isNew, isMigrating } = data;

    let badge;
    if (isMigrating) {
        badge = chalk.bgRed.white.bold(' MOLT! ');
    } else if (bondingPercent >= 90) {
        badge = chalk.bgYellow.black(' HOT   ');
    } else if (isNew) {
        badge = chalk.bgBlue.white(' NEW   ');
    } else {
        badge = chalk.bgGray.white(' TRACK ');
    }

    const parts = [
        chalk.gray(timestamp()),
        badge,
        chalk.white(padRight(symbol || name || '???', 12)),
        progressBar(bondingPercent),
        chalk.cyan(padLeft(formatPercent(bondingPercent), 6)),
        chalk.gray('|'),
        chalk.magenta('MC:'),
        chalk.white(padLeft(formatMC(mc), 8)),
        chalk.gray('|'),
        chalk.green('H:'),
        chalk.white(padLeft(String(holders || 0), 5)),
    ];

    const line = parts.join(' ');
    console.log(line);
    saveToFile(line);
}

export function logMigrated(data) {
    const { symbol, name, mc, holders, txSignature } = data;

    const line = [
        chalk.gray(timestamp()),
        chalk.bgGreen.black.bold(' MIGRATED '),
        chalk.green(padRight(symbol || name || '???', 12)),
        chalk.magenta('MC:'),
        chalk.white(formatMC(mc)),
        chalk.gray('|'),
        chalk.green('H:'),
        chalk.white(holders || 0),
        chalk.gray('|'),
        chalk.blue(txSignature ? txSignature.slice(0, 16) + '...' : ''),
    ].join(' ');

    console.log(line);
    saveToFile(line);
}

// ═══════════════════════════════════════════════════════════════
// LOGS DE SISTEMA
// ═══════════════════════════════════════════════════════════════
export function logWS(event, message = '') {
    const line = [
        chalk.gray(timestamp()),
        chalk.bgBlue.white('  WS   '),
        chalk.blue(padRight(event, 12)),
        message ? chalk.gray('| ' + message) : ''
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logError(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.bgRed.white(' ERROR '),
        chalk.red(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logSuccess(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.bgGreen.black('  OK   '),
        chalk.green(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logInfo(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.bgGray.white(' INFO  '),
        chalk.white(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logWarning(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.bgYellow.black(' WARN  '),
        chalk.yellow(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

// ═══════════════════════════════════════════════════════════════
// HEADERS
// ═══════════════════════════════════════════════════════════════
export function logHeader(title) {
    console.log('');
    console.log(chalk.red('═'.repeat(60)));
    console.log(chalk.red('  🦞 ' + title));
    console.log(chalk.red('═'.repeat(60)));
    console.log('');
    saveToFile(`\n${'═'.repeat(60)}\n  ${title}\n${'═'.repeat(60)}\n`);
}

export function logStats(stats) {
    const { tracking, hot, migrated, connected } = stats;

    console.log('');
    console.log(chalk.red('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.red('║') + chalk.white('                    🦞 MOLT ALERT STATS                     ') + chalk.red('║'));
    console.log(chalk.red('╠════════════════════════════════════════════════════════════╣'));
    console.log(chalk.red('║') + `  Status:    ${connected ? chalk.green('CONNECTED') : chalk.red('DISCONNECTED')}`.padEnd(60) + chalk.red('║'));
    console.log(chalk.red('║') + `  Tracking:  ${chalk.white(tracking)} tokens`.padEnd(51) + chalk.red('║'));
    console.log(chalk.red('║') + `  Hot (90%+): ${chalk.yellow(hot)} tokens`.padEnd(51) + chalk.red('║'));
    console.log(chalk.red('║') + `  Migrated:  ${chalk.green(migrated)} total`.padEnd(51) + chalk.red('║'));
    console.log(chalk.red('╚════════════════════════════════════════════════════════════╝'));
    console.log('');
}
