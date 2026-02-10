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
                primary: '#EE3124', // TJ Red
                'tj-blue': '#103E68', // Dark Blue from screenshot
                'tj-yellow': '#FFC212', // Yellow from screenshot
                'tj-dark': '#212121',
                'tj-light-gray': '#F6F6F6',
                'tj-orange': '#F37021',
                secondary: '#1a1a1a',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
