import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = ({ params }) => {
	const category = params.category as string

	return {
		category: {
			name: category
		}
	}
}
