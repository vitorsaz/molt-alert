export default function Privacy() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Information We Collect</h2>
                    <p className="text-gray-300">
                        Molt Alert collects publicly available blockchain data only. We do not collect
                        personal information, wallet addresses, or any private data from users.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">How We Use Information</h2>
                    <p className="text-gray-300">
                        Blockchain data is used solely to display token bonding curve progress and
                        migration status. All data shown is publicly available on the Solana blockchain.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Cookies</h2>
                    <p className="text-gray-300">
                        We may use minimal cookies for basic site functionality. No tracking cookies
                        or third-party analytics are used.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Third Party Services</h2>
                    <p className="text-gray-300">
                        We use Supabase for data storage and Vercel for hosting. These services have
                        their own privacy policies.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-red-400">Contact</h2>
                    <p className="text-gray-300">
                        For questions about this policy, contact us on Twitter/X.
                    </p>
                </section>

                <div className="mt-12">
                    <a href="/" className="text-red-400 hover:text-red-300">← Back to Tracker</a>
                </div>
            </div>
        </div>
    );
}
