import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Premium gradient colors
        "premium": {
          "dark": "#0a0e27",
          "darker": "#06081a",
          "blue": "#3b82f6",
          "indigo": "#6366f1",
          "cyan": "#06b6d4",
          "purple": "#a855f7",
          "pink": "#ec4899",
        },
        // Glow colors
        "glow": {
          "blue": "rgba(59, 130, 246, 0.3)",
          "cyan": "rgba(6, 182, 212, 0.3)",
          "purple": "rgba(168, 85, 247, 0.3)",
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        // Premium shadows
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 20px 60px 0 rgba(31, 38, 135, 0.25)",
        "glow-sm": "0 0 20px rgba(6, 182, 212, 0.2)",
        "glow-md": "0 0 40px rgba(6, 182, 212, 0.3)",
        "glow-lg": "0 0 60px rgba(6, 182, 212, 0.4)",
        "glow-purple": "0 0 40px rgba(168, 85, 247, 0.3)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.3)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
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
        // Premium animations
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(6, 182, 212, 0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "slide-in-top": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "ripple": "ripple 600ms ease-out",
        "slide-in-top": "slide-in-top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-in-bottom": "slide-in-bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-in-left": "slide-in-left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fade-in 0.3s ease-out",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-soft": "bounce-soft 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
