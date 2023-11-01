import type { IProfile } from '$lib/types/profile.types'
import type { Actions, ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async (event) => {
	const { supabase } = event.locals
	const { profile } = event.params

	const { data, error } = await supabase.from('profiles').select().eq('username', profile)

	if (data && data.length > 0) {
		const profile = data![0] as IProfile
		const { data: dataUser, error } = await supabase.auth.getUser()

		return {
			profile,
			isUserAuth: dataUser?.user ? dataUser.user.id === profile.uuid : false,
			status: 200,
			msg: 'Profile found'
		}
	} else {
		return {
			profile: false,
			isUserAuth: false,
			status: 404,
			msg: 'Profile not found'
		}
	}
}

export const actions: Actions = {
	async changeDescription(event) {
		const { locals } = event
		const { supabase } = locals
		const formEntries = await event.request.formData()
		const formData = Object.fromEntries(formEntries)
		console.log(formData)

		const { data, error } = await supabase
			.from('profiles')
			.update({
				description: formData.description
			})
			.eq('uuid', locals.user.uuid)

		console.log(data, error)

		if (error) {
			return {
				message: 'Error updating description',
				invalidate: false
			}
		}

		return {
			message: 'Description updated',
			invalidate: false
		}
	}
}
