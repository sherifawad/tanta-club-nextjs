/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
		colors: {
			transparent: "transparent",
			black: "#000",
			white: "#fff",
			orange: {
				100: "#FEF0E1",
				900: "#EC7905",
			},
			gray: {
				100: "#EBEBEB",
				900: "#B8B8B8",
			},
		},
	},
	plugins: [],
};
