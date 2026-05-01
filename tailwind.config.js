/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "h-l": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "h-m": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "h-s": ["22px", { lineHeight: "30px", fontWeight: "600" }],
        "title-m": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "title-s": ["18px", { lineHeight: "26px", fontWeight: "500" }],
        "body-m": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-s": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-m": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-l": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "label-s": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      colors: {
        primary: {
          DEFAULT: "#704AF8",
          light: "#9A9AF6",
        },
        secondary: {
          DEFAULT: "#FF8A00",
          dark: "#E27005",
        },
        error: "#F45B39",
        grey: {
          black: "#131313",
          dark: "#434346",
          light: "#787888",
          purple: "#A5A3AF",
          disabled: "#CFCFD8",
          stroke: "#EDECEF",
          divider: "#F7F6F9",
          chat: "#F3F3F4",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar-hide")],
};
