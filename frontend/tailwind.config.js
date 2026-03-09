/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gradient-1': '#667eea',
        'gradient-2': '#764ba2',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'blob': 'blob 7s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          '25%': {
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          },
          '50%': {
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          },
          '75%': {
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          },
        },
        'blob': {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'pulseGlow': {
          'from': {
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
          },
          'to': {
            boxShadow: '0 0 30px rgba(102, 126, 234, 0.8), 0 0 40px rgba(118, 75, 162, 0.5)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
