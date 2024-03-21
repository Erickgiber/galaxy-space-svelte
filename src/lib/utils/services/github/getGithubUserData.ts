import { PRIVATE_GITHUB_API_USERS } from '$env/static/private'
import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
import axios from 'axios'

// ? Get information github user
export async function getGithubUserData(username: string | null) {
	const URL = `${PRIVATE_GITHUB_API_USERS}/${username}`
	const { data } = await axios.get(URL)
	return data as TypeGithubUserResponse
}
