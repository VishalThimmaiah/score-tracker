import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				"human-breathe": {
					"0%": { transform: "translateX(-100%)", opacity: "0.3" },
					"40%": { transform: "translateX(0%)", opacity: "0.6" }, // Inhale phase
					"50%": { transform: "translateX(0%)", opacity: "0.6" }, // Brief pause
					"90%": { transform: "translateX(100%)", opacity: "0.3" }, // Exhale phase
					"100%": { transform: "translateX(100%)", opacity: "0.3" }, // Brief pause
				},
			},
			animation: {
				"human-breathe": "human-breathe 3.75s ease-in-out infinite", // 16 breaths per minute
			},
		},
	},
	plugins: [],
};

export default config;
