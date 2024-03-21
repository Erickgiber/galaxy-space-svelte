import type { TypeSelectService } from '$lib/types/select-service.types'
import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
import { getGithubUserData } from '$lib/utils/services/github/getGithubUserData'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	params: { type },
	locals: {
		supabase,
		user: { uuid }
	}
}) => {
	const serviceInformation = await loadDataService(type as TypeSelectService['service'], supabase, uuid)
	const info = serviceInformation ? serviceInformation : ({} as TypeGithubUserResponse)

	return { type, service_info: info }
}

async function loadDataService(type: TypeSelectService['service'], supabase: SupabaseClient, uuid: string) {
	if (type === 'github') {
		const { data } = await supabase.from('services').select().eq('uuid', uuid).single()
		return await getGithubUserData(data.username)
	}
}
