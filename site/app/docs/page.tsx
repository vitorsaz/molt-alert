export default function Docs() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-4">
                    <span>🦞</span>
                    Documentation
                </h1>
                <p className="text-gray-400 mb-12">Learn how Molt Alert works and how to use it.</p>

                {/* What is it */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">What is Molt Alert?</h2>
                    <p className="text-gray-300 mb-4">
                        Molt Alert is a real-time migration tracker for pump.fun tokens. It monitors the bonding curve
                        of tokens and alerts you when they're about to migrate to Raydium.
                    </p>
                    <p className="text-gray-300">
                        "Molt" refers to when a lobster sheds its shell to grow - just like tokens shedding pump.fun
                        to grow on Raydium.
                    </p>
                </section>

                {/* How it works */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">How it Works</h2>
                    <div className="space-y-4">
                        <div className="glass rounded-xl p-4">
                            <h3 className="font-bold mb-2">1. Bonding Curve Tracking</h3>
                            <p className="text-gray-400">
                                Every pump.fun token has a bonding curve. When it reaches ~85 SOL, the token
                                migrates to Raydium with full liquidity.
                            </p>
                        </div>
                        <div className="glass rounded-xl p-4">
                            <h3 className="font-bold mb-2">2. Real-time Monitoring</h3>
                            <p className="text-gray-400">
                                We track every trade on every token to calculate the exact bonding curve percentage
                                in real-time.
                            </p>
                        </div>
                        <div className="glass rounded-xl p-4">
                            <h3 className="font-bold mb-2">3. Hot Zone (90%+)</h3>
                            <p className="text-gray-400">
                                Tokens above 90% are in the "hot zone" - they could migrate at any moment.
                                These are highlighted in yellow/red.
                            </p>
                        </div>
                        <div className="glass rounded-xl p-4">
                            <h3 className="font-bold mb-2">4. Migration Alert</h3>
                            <p className="text-gray-400">
                                When a token reaches 100% and migrates, it moves to the "Migrated" section
                                with a direct link to DexScreener.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why it matters */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">Why Migration Matters</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            Tokens often pump hard right before migration due to FOMO
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            Migration to Raydium means more volume and visibility
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            Early entry before migration can be very profitable
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500">⚠</span>
                            But be careful - some tokens dump right after migration
                        </li>
                    </ul>
                </section>

                {/* Reading the UI */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">Reading the Interface</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-2 bg-[#262626] rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-gradient-to-r from-green-500 to-green-600" />
                            </div>
                            <span className="text-gray-400">0-70% - Normal tracking</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-2 bg-[#262626] rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-red-500" />
                            </div>
                            <span className="text-yellow-500">70-90% - Getting hot</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-2 bg-[#262626] rounded-full overflow-hidden">
                                <div className="h-full w-[95%] bg-gradient-to-r from-red-500 to-red-700" />
                            </div>
                            <span className="text-red-500">90%+ - About to molt!</span>
                        </div>
                    </div>
                </section>

                {/* Disclaimer */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">Disclaimer</h2>
                    <div className="glass rounded-xl p-6 border-yellow-500/30">
                        <p className="text-yellow-500 font-bold mb-2">⚠️ Not Financial Advice</p>
                        <p className="text-gray-400">
                            This tool is for informational purposes only. Trading memecoins is extremely risky.
                            You can lose all your money. Always DYOR and never invest more than you can afford to lose.
                        </p>
                    </div>
                </section>

                {/* Links */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">Links</h2>
                    <div className="flex gap-4">
                        <a href="/" className="text-red-400 hover:text-red-300">← Back to Tracker</a>
                        <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
                    </div>
                </section>
            </div>
        </div>
    );
}
