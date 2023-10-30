import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ locals }) => {
	const { supabase } = locals
	const { data: totalUsers, error } = await locals.supabase.from('register').select('uuid')

	return {
		totalUsers: totalUsers?.length
	}
}
