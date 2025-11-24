/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",     // koyu mavi
        secondary: "#facc15",   // parlak sarı
        accent: "#f87171",      // kırmızı/uyarı
        bg: "#f9fafb",          // açık arka plan
        card: "#ffffff",         // kart rengi
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 15px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        lg: "1rem",
      },
    },
  },
  plugins: [],
};
