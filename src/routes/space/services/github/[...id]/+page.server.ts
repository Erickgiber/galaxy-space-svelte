import type { TypeReposResponse } from '$lib/types/services/github-repos.response.types'
import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
import { getGithubUserData } from '$lib/utils/services/github/getGithubUserData'
import { ServicesList } from '$lib/utils/services/servicesList'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ServerLoad } from '@sveltejs/kit'
import axios from 'axios'

export const load: ServerLoad = async ({
	params: { id },
	locals: {
		supabase,
		user: { uuid }
	}
}) => {
	const service_info_request = await loadRepo(supabase, uuid)
	const service_info = service_info_request ? service_info_request : ({} as TypeGithubUserResponse)
	const { data } = await axios.get<TypeReposResponse[]>(service_info.repos_url)
	const repo = data.find((repo) => repo.id === Number(id)) ?? ({} as TypeReposResponse)
	const githubData = ServicesList[0]

	return {
		service_info,
		repo,
		current: {
			title: githubData.name,
			icon: githubData.icon,
			href: '/space/services/github'
		},
		module: {
			title: 'Services',
			icon: 'ant-design:api-outlined',
			href: '/space/services'
		},
		child: {
			title: repo.name,
			icon: githubData.childIcon
		}
	}
}

async function loadRepo(supabase: SupabaseClient, uuid: string) {
	const { data } = await supabase.from('services').select().eq('uuid', uuid).single()
	return await getGithubUserData(data.username)
}
