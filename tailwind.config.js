/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safeList: [{
    pattern: /hljs+/,
  }],
  theme: {
    extend: {
      hljs: {
        theme: 'dracula'
      }
    },
  },
  daisyui: {
    themes: ["dracula"],
  },
  plugins: [
    require("daisyui"),
    require('tailwind-highlightjs')
  ],
}

