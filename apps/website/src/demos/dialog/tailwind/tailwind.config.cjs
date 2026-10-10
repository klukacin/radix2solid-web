const { violet, blackA, mauve, green, gray } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./demo.tsx"],
	theme: {
		extend: {
			colors: {
				...mauve,
				...violet,
				...green,
				...blackA,
				...gray,
			},
			keyframes: {
				overlayShow: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				contentShow: {
					from: {
						opacity: "0",
						transform: "translateY(2%) scale(0.96)",
					},
					to: { opacity: "1", transform: "scale(1)" },
				},
			},
			animation: {
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [],
};
