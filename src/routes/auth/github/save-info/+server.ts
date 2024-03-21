import type { TypeMessageResponse } from '$lib/types/services/response-api.types.js'
import { GetMethodServer } from '$lib/utils/GetMethodServer.js'
import axios from 'axios'
import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types.js'
import { getGithubUserData } from '$lib/utils/services/github/getGithubUserData.js'

export const POST = async ({ request, locals: { supabase, user } }) => {
	const { username } = await request.json()
	const isValid = isValidUsername(username)
	const isNotValid = isNotValidMessage()
	const message = newMessage('Successfully saved')

	if (!isValid) {
		return new Response(toString(isNotValid), GetMethodServer)
	} else {
		const { id, avatar_url, login, email } = await getGithubUserData(username)
		const { data } = await supabase.from('services').select().eq('uuid', user.uuid)

		if (data && data.length > 0) {
			await supabase
				.from('services')
				.update({
					username_service: login.toLowerCase(),
					type_service: 'github',
					user_email_service: email,
					photo_url: avatar_url,
					id_service: id,
					uuid: user.uuid,
					email: user.email,
					username: user.username
				})
				.eq('uuid', user.uuid)
			return new Response(toString(message), GetMethodServer)
		} else {
			const res = await supabase
				.from('services')
				.insert({
					username_service: login,
					type_service: 'github',
					user_email_service: email,
					photo_url: avatar_url,
					id_service: id,
					uuid: user.uuid,
					email: user.email,
					username: user.username
				})
				.eq('uuid', user.uuid)
			console.log(res)
			return new Response(toString(message), GetMethodServer)
		}
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

function newMessage(message: string): TypeMessageResponse {
	return { status: true, message }
}
