import { Colors } from "./src/lib/const/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
        // "2xl": "1400px",
        "2xl": "1280px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        black: "#12151E",
        "dark-gray": "#333640",
        "light-gray": "#646567",
        "hot-pink": "#fd2d78",
        "color-light": "#f1f6f1",
        // "color-light": "#fffaf4",
        "color-dark": "#f9eddd",
        "hot-red": "#dd2e44",
        twitter: "#1d9bf0",
        "solfate-orange": "#f5820b",
        yellow: {
          "50": "#fff9eb",
          "100": "#feecc7",
          "200": "#fddc96",
          "300": "#fcbe4d",
          "400": "#fba524",
          "500": "#f5820b",
          "600": "#d95e06",
          "700": "#b43e09",
          "800": "#92300e",
          "900": "#78280f",
          "950": "#451203",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // comment for better diffs
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
