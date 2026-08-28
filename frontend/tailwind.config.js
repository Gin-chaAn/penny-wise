/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Penny Wise palette — the single source of visual truth.
        // Semantic tokens map to these; components should reference
        // the semantic names below, not raw color values.
        void: "#080606",
        abyss: "#110C0D",
        charcoal: "#1A1516",
        wine: "#241114",
        crimsonDeep: "#4A0F18",
        crimson: "#7A1626",
        blood: "#A51D2D",
        rose: "#B85C68",
        ivory: "#E8D8C8",
        ash: "#B4AAA5",
        smoke: "#766D6A",
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 18px rgba(122, 22, 38, 0.35)",
        glowStrong: "0 0 22px rgba(165, 29, 45, 0.45)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
}
