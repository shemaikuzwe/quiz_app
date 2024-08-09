import  {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "@nextui-org"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],

}