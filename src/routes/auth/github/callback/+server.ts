import type { RequestHandler } from './$types'
import { redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async (params) => {
	throw redirect(303, '/')
}
