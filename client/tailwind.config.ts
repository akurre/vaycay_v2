import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors here later...
      },
      spacing: {
        // Add custom spacing here later...
      },
    },
  },
  plugins: [],
};
export default config;
