import type { TypeMessageResponse } from '$lib/types/services/response-api.types.js'
import { GetMethodServer } from '$lib/utils/GetMethodServer.js'
import { PRIVATE_GITHUB_API_USERS } from '$env/static/private'
import axios from 'axios'
import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types.js'

export const GET = async (params) => {
	const username = params.url.searchParams.get('username')
	const isValid = isValidUsername(username)
	const isNotValid = isNotValidMessage()

	if (!isValid) {
		return new Response(toString(isNotValid), GetMethodServer)
	} else {
		const { avatar_url, name } = await getGithubUserData(username)

		return new Response(toString({ avatar_url, name }), GetMethodServer)
	}
}

function isValidUsername(username: string | null): boolean {
	return username ? username.length > 2 : false
}

function toString(object: object): string {
	return JSON.stringify(object)
}

function isNotValidMessage(): TypeMessageResponse {
	return {
		status: false,
		message: 'The username is invalid, it must have a login equal to or greater than 3.'
	}
}

// ? Get information github user
async function getGithubUserData(username: string | null) {
	const URL = `${PRIVATE_GITHUB_API_USERS}/${username}`
	const { data } = await axios.get(URL)
	return data as TypeGithubUserResponse
}
