import type { TypeSelectService } from '$lib/types/select-service.types'
import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
import { getGithubUserData } from '$lib/utils/services/github/getGithubUserData'
import { ServicesList } from '$lib/utils/services/servicesList'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	locals: {
		supabase,
		user: { uuid }
	}
}) => {
	const serviceInformation = await loadDataServiceGithub(supabase, uuid)
	const info = serviceInformation ? serviceInformation : ({} as TypeGithubUserResponse)
	const { icon, childIcon, name } = ServicesList[0]

	return {
		title: name,
		service_info: info,
		module: {
			title: 'Services',
			icon: 'ant-design:api-outlined',
			href: '/space/services'
		},
		icon,
		child: {
			id: null,
			icon: childIcon,
			name: ''
		}
	}
}

async function loadDataServiceGithub(supabase: SupabaseClient, uuid: string) {
	const { data } = await supabase.from('services').select().eq('uuid', uuid).single()
	return await getGithubUserData(data.username)
}
