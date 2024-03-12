const { blackA } = require('@radix-ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      colors: {
        ...blackA,
      },
    },
  },
  plugins: [
    require("windy-radix-palette")({
      colors: require("./radix.config")
    })
  ]
}
