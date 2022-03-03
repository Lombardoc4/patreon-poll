module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#07378f',
        secondary: '#c5d3ff',
        success:  '#0fcf08',
        danger: '#e84349',
        mute: '#e6e6e6',
        placeholder: '#9da3ae'
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'top': '0 -2px 5px rgba(0, 0, 0, 0.2)',
        'dark': '0 5px 5px rgba(0, 0, 0, 0.25)',
        'dark-hover': '0 2px 2px rgba(0, 0, 0, 0.15)',
      },
      minHeight: {
        '12': '3rem',
      }
    },
  },
  plugins: [],
}
