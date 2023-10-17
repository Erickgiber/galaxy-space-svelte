import type { IProfile } from '$lib/types/profile.types'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async (event) => {
	const { supabase } = event.locals
	const { profile } = event.params

	const { data, error } = await supabase.from('profiles').select().eq('username', profile)

	if (data && data.length > 0) {
		return {
			profile: data![0] as IProfile
		}
	} else {
		return {
			profile: 'Profile not found',
			status: 404
		}
	}
}
