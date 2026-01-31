/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': '#0a0a0a',
                'bg-secondary': '#111111',
                'bg-card': '#1a1a1a',
                'accent': '#dc2626',
                'accent-dark': '#991b1b',
                'success': '#22c55e',
                'danger': '#ef4444',
                'warning': '#f59e0b',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
                display: ['var(--font-space)', 'Space Grotesk', 'sans-serif'],
                mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};
