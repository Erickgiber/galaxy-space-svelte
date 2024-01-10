import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals: { user, getSession } }) => {
	const session = await getSession()

	console.log(session)
	console.log(user)

	return {
		session,
		user
	}
}) satisfies LayoutServerLoad
