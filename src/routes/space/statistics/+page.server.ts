import type { IProfile } from '$lib/types/profile.types'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ locals }) => {
	const { supabase } = locals
	const { data: totalUsers, error } = await locals.supabase.from('profiles').select()

	return {
		totalUsers: totalUsers?.length,
		users: totalUsers?.reverse() as IProfile[]
	}
}
