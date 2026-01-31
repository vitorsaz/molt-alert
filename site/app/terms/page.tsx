export default function Terms() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Acceptance of Terms</h2>
                    <p className="text-gray-300">
                        By using Molt Alert, you agree to these terms. This is an experimental project
                        provided as-is.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Risk Disclaimer</h2>
                    <p className="text-gray-300 mb-4">
                        Trading cryptocurrencies and memecoins involves significant risk. You may lose
                        all your funds. This tool is not financial advice.
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>Memecoins are extremely volatile</li>
                        <li>Past migration performance does not guarantee future results</li>
                        <li>Many tokens fail or rug after migration</li>
                        <li>Always do your own research (DYOR)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">No Guarantees</h2>
                    <p className="text-gray-300">
                        We make no guarantees about the accuracy of bonding curve data, migration timing,
                        or any other information displayed. Data may be delayed or incorrect.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Limitation of Liability</h2>
                    <p className="text-gray-300">
                        We are not liable for any losses incurred through use of this service. Use at
                        your own risk.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Service Availability</h2>
                    <p className="text-gray-300">
                        The service may be unavailable, modified, or discontinued at any time without notice.
                    </p>
                </section>

                <div className="mt-12">
                    <a href="/" className="text-red-400 hover:text-red-300">← Back to Tracker</a>
                </div>
            </div>
        </div>
    );
}
