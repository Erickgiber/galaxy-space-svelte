/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,scss}'],
	theme: {
		extend: {
			colors: {
				primary: '#4A00C6',
				light_gray: '#f7f6f6',
				dark: '#505050'
			}
		}
	},
	plugins: []
}
