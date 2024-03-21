import type { RequestHandler } from './$types'
import { redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async (params) => {
	console.log('Se ingresó')
	console.log('Params: ', params)
	throw redirect(303, '/')
}
