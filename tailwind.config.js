module.exports = {
  darkMode: 'class',
  purge: {
    enabled: false, // keep during dev so all classes are available
    content: [
      './static/**/*.html',
      './src/**/*.{vue,js}'
    ]
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#4a6fa5',
          600: '#385785',
          700: '#2c4366'
        }
      }
    }
  },
  plugins: []
};
