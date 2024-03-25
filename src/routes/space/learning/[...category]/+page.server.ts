import { CategoriesList } from '$lib/utils/learning/categories'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = ({ params }) => {
	const category = params.category as string
	const currentPage = CategoriesList.find(folder => folder.nameID === category)
	const icon = currentPage?.icon

	return {
			title: category,
			icon: icon
	}
}
