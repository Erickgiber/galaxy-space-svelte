import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = ({ params }) => {
	const idParam = params.id

	return {
		id: idParam,
		title: idParam
	}
}
