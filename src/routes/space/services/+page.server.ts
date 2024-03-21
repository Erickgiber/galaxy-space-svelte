import type { TypeServicesResponse } from '$lib/types/services/response-api.types'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ locals: { user, supabase } }) => {
	const { data } = await supabase.from('services').select().eq('uuid', user.uuid)

	return {
		services: data as TypeServicesResponse[]
	}
}
