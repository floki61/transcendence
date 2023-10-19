import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'diyali': '#182B65',
        'background': '#151515',
        'primecl': '#213D46',
        'segundcl': '#001E28',
        'terserocl': '#2C4B55',
        'quatrocl': '#4D8395',
      },
    },
  },
  plugins: [],
}

export default config
