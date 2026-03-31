import colors from "tailwindcss/colors";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import {
  padding,
  radius,
  blur,
  breakpoint,
  container,
  spacing,
  fontWeight,
} from "./theme/extends";
import { theme } from "./theme/theme";

const config: Config = {
  content: ["./**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: theme.colors,
      padding,
      borderRadius: radius,
      blur,
      container,
      spacing,
      fontWeight,
      fontFamily: {
        pretendard: ["var(--font-pretendard)", "sans-serif"],
      },
      screens: {
        ...breakpoint,
      },
      fontSize: {
        sm: ["14px", { lineHeight: "1.4" }],
        base: ["16px", { lineHeight: "1.4" }],
        lg: ["18px", { lineHeight: "20px" }],
      },
      keyframes: {
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-top": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        spinner: {
          "0%": {
            strokeDasharray: "1px 200px",
            strokeDashoffset: "0",
          },
          "50%": {
            strokeDasharray: "100px 200px",
            strokeDashoffset: "-15px",
          },
          "100%": {
            strokeDasharray: "100px 200px",
            strokeDashoffset: "-125px",
          },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
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
        loading: "loading 1.4s linear infinite",
        spinner: "spinner 1.4s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out forwards",
        "slide-out-to-right": "slide-out-to-right 0.3s ease-in forwards",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out forwards",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-in forwards",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out forwards",
        "slide-out-to-bottom": "slide-out-to-bottom 0.3s ease-in forwards",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out forwards",
        "slide-out-to-top": "slide-out-to-top 0.3s ease-in forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  plugins: [
    plugin(({ matchUtilities, addUtilities }) => {
      addUtilities({
        ".flex-center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".absolute-center": {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
        ".absolute-y-center": {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        },
        ".absolute-x-center": {
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        },
        ".ellipsis": {
          "white-space": "nowrap",
          overflow: "hidden",
          "text-overflow": "ellipsis",
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
      matchUtilities(
        {
          bs: (value) => {
            return {
              border: `1px solid ${value}`,
            };
          },
          bt: (value) => {
            return {
              "border-top": `1px solid ${value}`,
            };
          },
          bb: (value) => {
            return {
              "border-bottom": `1px solid ${value}`,
            };
          },
          bl: (value) => {
            return {
              "border-left": `1px solid ${value}`,
            };
          },
          br: (value) => {
            return {
              "border-right": `1px solid ${value}`,
            };
          },
          bx: (value) => {
            return {
              "border-right": `1px solid ${value}`,
              "border-left": `1px solid ${value}`,
            };
          },
          by: (value) => {
            return {
              "border-top": `1px solid ${value}`,
              "border-bottom": `1px solid ${value}`,
            };
          },
          "svg-color": (value) => ({
            "* color": value,
          }),
        },
        {
          values: flattenColorPalette({
            ...theme.colors,
            ...colors,
          }),
          type: "any",
        },
      );
    }),
  ],
};

export default config;
