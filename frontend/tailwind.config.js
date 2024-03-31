/** @type {import('tailwindcss').Config} */
const {createThemes} = require('tw-colors');
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    "./node_modules/flowbite/**/*.js"],
  darkMode: ["class", '[data-theme="dark"]'],
  lightMode: ["class", '[data-theme="light"]'],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    createThemes({
      light: {
        'primary': 'steelblue',
        'secondary': 'darkblue',
        'background': 'white',
        'brand': '#F3F3F3',
      },
      dark: {
        'primary': 'steelblue',
        'secondary': 'darkblue',
        'background': 'black',
        'brand': '#1A1A1A',
      },
    }),
  ],
}

