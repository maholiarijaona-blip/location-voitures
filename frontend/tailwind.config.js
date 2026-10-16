
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {

        teal: {
          50: '#f0fbfa', 100: '#d4f2ef', 200: '#a9e5e0', 300: '#78d1ca',
          400: '#4ab5ac', 500: '#2f9990', 600: '#237a73', 700: '#1f625d',
          800: '#1c4f4b', 900: '#1a4340', 950: '#0a2624',
        },
        terracotta: {
          50: '#fdf4f1', 100: '#fbe4dc', 200: '#f7c9b8', 300: '#f0a488',
          400: '#e6775a', 500: '#d95536', 600: '#c1402a', 700: '#a03224',
          800: '#822c22', 900: '#6c2921', 950: '#3a1210',
        },
        cream: { 50: '#fffdf8', 100: '#fdf8ee', 200: '#f8eeda' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
