import type { Metadata } from 'next';
import './globals.css';

// Google Fonts via next/font
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

// ⚠️ CONFIGURAÇÕES DO PROJETO
const PROJECT_NAME = 'Molt Alert';
const TWITTER_URL = ''; // Adicionar depois
const TOKEN_CA = ''; // Contract Address (opcional)

export const metadata: Metadata = {
    title: `${PROJECT_NAME} - Migration Tracker`,
    description: 'Track pump.fun tokens about to migrate to Raydium. Real-time bonding curve monitoring.',
    keywords: ['solana', 'pump.fun', 'raydium', 'migration', 'bonding curve', 'memecoin'],
    openGraph: {
        title: `${PROJECT_NAME} - Migration Tracker`,
        description: 'Track pump.fun tokens about to migrate to Raydium',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: PROJECT_NAME,
        description: 'Track pump.fun tokens about to migrate to Raydium',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
            <body className="min-h-screen bg-[#0a0a0a] text-white font-sans">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <a href="/" className="flex items-center gap-3">
                            <span className="text-3xl">🦞</span>
                            <span className="text-xl font-bold">{PROJECT_NAME}</span>
                        </a>
                        <div className="flex items-center gap-6">
                            <a href="/#tracker" className="text-gray-400 hover:text-white transition-colors">Tracker</a>
                            <a href="/#migrated" className="text-gray-400 hover:text-white transition-colors">Migrated</a>
                            <a href="/docs" className="text-gray-400 hover:text-white transition-colors">Docs</a>
                            {TWITTER_URL && (
                                <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    Twitter
                                </a>
                            )}
                        </div>
                    </div>
                </nav>
                <main className="pt-16">
                    {children}
                </main>
                <footer className="border-t border-white/5 py-8 mt-20">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-gray-500 text-sm">
                            {PROJECT_NAME} - Track migrations before they happen
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                            Not financial advice. Trade at your own risk.
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
