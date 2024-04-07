/** @type {import('tailwindcss').Config} */
const {createThemes} = require('tw-colors');
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    "./node_modules/flowbite/**/*.js"],
//  darkMode: ["class", '[data-theme="dark"]'],
//  lightMode: ["class", '[data-theme="light"]'],
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
        'text': '#333333',
        'brand': '#F3F3F3',
      },
      dark: {
        'primary': '#8774E1',
        'secondary': '#2b2d30',
        'secondary-800': '#AAAAAA',
        'background': '#212121',
        'text': '#FFFFFF',
        'brand': '#1A1A1A',
      },
    }),
  ],
}

