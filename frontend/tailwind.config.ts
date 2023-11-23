import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      skew: {
        "45": "45deg",
        "90": "90deg",
        "135": "135deg",
        "180": "180deg",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        diyali: "#182B65",
        background: "#151515",
        primecl: "#213D46",
        segundcl: "#001E28",
        terserocl: "#2C4B55",
        quatrocl: "#4D8395",
      },
      keyframes: {
        appear: {
          "0%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".5",
          },
          "100%": {
            opacity: "1",
          },
        },
        rotate: {
          "45%": {
            skew: "45",
          },
          // "90%": {
          //   skew: "90",
          // },
          "135%": {
            skew: "135",
          },
          '180%': {
            skew: "180",
          },
        },
      },
      animation: {
        appear: "appear 2s cubic-bezier(0.4, 0, 0.6, 1)",
        rotate: "rotateY(180deg)",
      },
    },
  },
  plugins: [],
};

export default config;
