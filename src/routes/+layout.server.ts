import Cookies from 'js-cookie'
import type { LayoutServerLoad } from './$types'
import { parse } from 'cookie'

export const load = (async ({ locals: { user, getSession } }) => {
	const session = await getSession()

	return {
		session,
		user
	}
}) satisfies LayoutServerLoad
