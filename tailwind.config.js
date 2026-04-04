/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F5F0',
        foreground: '#5C3A21',
        card: 'hsl(0 0% 100%)',
        primary: {
          DEFAULT: '#C2185B',
          foreground: 'hsl(0 0% 100%)',
        },
        secondary: {
          DEFAULT: '#F8E8D8',
          foreground: '#5C3A21',
        },
        muted: {
          DEFAULT: '#F0E6DC',
          foreground: '#8B7355',
        },
        accent: {
          DEFAULT: '#F8E8D8',
          foreground: '#5C3A21',
        },
        border: '#E8DDD0',
        success: 'hsl(150 60% 45%)',
        warning: 'hsl(35 90% 60%)',
        error: 'hsl(0 70% 60%)',
        info: 'hsl(210 70% 60%)',
        vintage: {
          pink: '#FFB6C1',
          pinkDeep: '#C2185B',
          pinkDark: '#8B0000',
          brown: '#5C3A21',
          cream: '#F8F5F0',
          creamLight: '#F8E8D8',
        },
        sidebar: {
          DEFAULT: '#F8F5F0',
          foreground: '#5C3A21',
          primary: '#C2185B',
          'primary-foreground': 'hsl(0 0% 100%)',
          accent: '#F8E8D8',
          'accent-foreground': '#5C3A21',
          border: '#E8DDD0',
          ring: '#C2185B',
        },
      },
      fontFamily: {
        heading: ['Quicksand', 'Nunito', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        body: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        handwritten: ['Permanent Marker', 'cursive'],
        cute: ['Bubblegum Sans', 'Fredoka One', 'cursive'],
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'soft': '0 4px 20px rgba(92, 58, 33, 0.15)',
      },
      animation: {
        'bounce-heart': 'bounce-heart 0.6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'bounce-heart': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}