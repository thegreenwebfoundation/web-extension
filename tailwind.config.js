module.exports = {
  purge: [
    './thegreenweb/**/*.html',
    './thegreenweb/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'tgwf-green': '#76c22d'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

