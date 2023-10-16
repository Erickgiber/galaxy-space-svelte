import type { ICurrentUser } from '$lib/store/currentUser'
import { supabase } from '$lib/supabase/supabase'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formEntry = await request.formData()
		const userData = Object.fromEntries(formEntry.entries())

		const { data, error } = await supabase.auth.signInWithPassword({
			email: userData.email as string,
			password: userData.password as string
		})

		if (error) {
			return {
				message: `Error, ${error.message}`,
				invalidate: false
			}
		}

		const { data: getUserData, error: errorUserData } = await supabase
			.from('register')
			.select()
			.eq('email', data.user.email)

		// * Saving data in variable
		const user: ICurrentUser = {
			email: data.user.email as string,
			access_token: data.session.access_token as string,
			public_name: getUserData![0].public_name,
			photo_url: '',
			username: getUserData![0].username,
			refresh_token: data.session.refresh_token,
			uuid: getUserData![0].uuid
		}

		supabase.auth.setSession(data.session)

		const refresh_token = data.session.refresh_token
		const access_token = data.session.access_token

		cookies.set('access_token', access_token)
		cookies.set('refresh_token', refresh_token)
		console.log('Token guardado')

		return {
			user,
			session: data.session,
			invalidate: false,
			location: '/space/'
		}
	}
}
