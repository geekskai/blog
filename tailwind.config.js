// @ts-check
const { fontFamily } = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  trailingSlash: true,
  content: [
    "./node_modules/pliny/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./layouts/**/*.{js,ts,tsx}",
    "./data/**/*.mdx",
  ],
  darkMode: "class",
  // async redirects() {
  //   return [
  //     {
  //       source:
  //         'https://geekskai.com/2021/02/17/101-GitHub-Repos-Absolute-List-Of-Useful-Repos/LINK',
  //       destination: '/404',
  //       permanent: true,
  //     },
  //   ]
  // },
  theme: {
    extend: {
      lineHeight: {
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
      },
      fontFamily: {
        sans: fontFamily.sans,
      },
      colors: {
        primary: {
          50: "#FFEEED", // Soft pink
          100: "#FFD5D3",
          200: "#FFABA8",
          300: "#FF817C",
          400: "#FF5751",
          500: "#FF6B6B", // Base color
          600: "#D95353",
          700: "#B33A3A",
          800: "#8C2222",
          900: "#660A0A", // Deep burgundy
          // 50: '#E6FFFC', // Lightest cyan (95% luminosity)
          // 100: '#B3FFF5',
          // 200: '#80FFEE',
          // 300: '#4DFFE7',
          // 400: '#1AFFE0',
          // 500: '#00FFE0', // Base color
          // 600: '#00CCB3',
          // 700: '#009986',
          // 800: '#006659',
          // 900: '#00332C', // Deep teal
        },
        stone: {
          50: "#F5F5F5", // Ultra-light gray
          100: "#D9D9D9",
          200: "#B3B3B3",
          300: "#8C8C8C",
          400: "#666666",
          500: "#2A2A2A", // Base color
          600: "#222222",
          700: "#1A1A1A",
          800: "#121212",
          900: "#0A0A0A", // Near-black
        },
        coralred: {
          50: "#FFEEED", // Soft pink
          100: "#FFD5D3",
          200: "#FFABA8",
          300: "#FF817C",
          400: "#FF5751",
          500: "#FF6B6B", // Base color
          600: "#D95353",
          700: "#B33A3A",
          800: "#8C2222",
          900: "#660A0A", // Deep burgundy
        },
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.600")}`,
              },
              code: { color: theme("colors.primary.400") },
            },
            "h1,h2": {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
            },
            h3: {
              fontWeight: "600",
            },
            code: {
              color: theme("colors.indigo.500"),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.400")}`,
              },
              code: { color: theme("colors.primary.400") },
            },
            "h1,h2,h3,h4,h5,h6": {
              color: theme("colors.stone.100"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
