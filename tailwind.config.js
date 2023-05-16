/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                customOrange: {
                    100: "#FEF0E1",
                    900: "#EC7905",
                },
                customGray: {
                    100: "#EBEBEB",
                    900: "#B8B8B8",
                },
            },
        },
    },
    plugins: [],
};
