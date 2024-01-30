import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = ({ params }) => {
	const category = params.category as string

	const icon: { [key: string]: string } = {
		html: 'devicon:html5'
	}

	return {
		category: {
			name: category,
			icon: icon[category]
		}
	}
}
