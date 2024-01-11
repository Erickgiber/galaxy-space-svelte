import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals: { user, getSession } }) => {
	const session = await getSession()

	return {
		session,
		user
	}
}) satisfies LayoutServerLoad
