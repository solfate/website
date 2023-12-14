import { Colors } from "./src/lib/const/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: Colors,
      boxShadow: {
        "underline-sm": "0px -3px 0px 0px inset",
        underline: "0px -5px 0px 0px inset",
        "underline-lg": "0px -8px 0px 0px inset",
        "black-sm": "2px 2px 0px 0px rgba(18, 21, 30) !important",
        black: "3px 3px 0px 0px rgba(18, 21, 30) !important",
        "black-lg": "5px 5px 0px 0px rgba(18, 21, 30) !important",
        "hot-pink": "0px -3px 0px 0px rgba(253, 45, 120) inset !important",
      },
      scale: {
        flip: "-1",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
