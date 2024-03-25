import { MENU_CONFIG_PAGE } from '$lib/config/menus/menu-config-page'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = ({ params }) => {
	const idParam = params.id
	const currentPage = MENU_CONFIG_PAGE().find((data) => data.nameID === idParam);
	let icon = currentPage?.icon


	return {
		id: idParam,
		title: idParam,
		icon: icon
	}
}
