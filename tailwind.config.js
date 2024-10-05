/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        cabinet: ["var(--font-cabinet)"],
        satoshi: ["var(--font-satoshi)"]
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cerulean: {
          50: "#f2f9fd",
          100: "#e3f2fb",
          200: "#c1e5f6",
          300: "#8bd1ee",
          400: "#4db9e3",
          500: "#30a9d9",
          600: "#1881b1",
          700: "#15678f",
          800: "#155877",
          900: "#174963",
          950: "#0f2f42"
        },
        punch: {
          50: "#fef4f2",
          100: "#fee7e2",
          200: "#fed3ca",
          300: "#fcb5a5",
          400: "#f88971",
          500: "#ef6344",
          600: "#d94423",
          700: "#b9381c",
          800: "#99321b",
          900: "#7f2f1d",
          950: "#45150a"
        },
        turbo: {
          50: "#fcfee8",
          100: "#f9ffc2",
          200: "#f8ff88",
          300: "#fbff45",
          400: "#fdf712",
          500: "#f2e205",
          600: "#cdaf01",
          700: "#a37e05",
          800: "#87630c",
          900: "#725011",
          950: "#432b05"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
