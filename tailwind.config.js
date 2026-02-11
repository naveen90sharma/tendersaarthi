/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#103e68', // Dark Navy Blue
                'soft-blue': '#f0f7ff',
                'border-light': '#edf2f7',
                'text-main': '#111827',
                'text-muted': '#64748b',
                'tj-yellow': '#FFC212', // Keep for support accents
                secondary: '#1a1a1a',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
