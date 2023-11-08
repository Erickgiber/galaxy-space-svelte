/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,scss}'],
	theme: {
		extend: {
			colors: {
				primary: '#7833ff',
				light_gray: '#f7f6f6',
				dark: '#505050',
				bg: '#f9f6ff',
			}
		}
	},
	plugins: []
}
