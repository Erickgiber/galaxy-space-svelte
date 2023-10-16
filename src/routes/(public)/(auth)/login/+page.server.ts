import type { ICurrentUser } from '$lib/fakedb/currentUser'
import { supabase } from '$lib/supabase/supabase'
import type { Actions } from '@sveltejs/kit'
import { serialize } from 'cookie'

export const actions: Actions = {
	default: async ({ request }) => {
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
			refresh_token: data.session.refresh_token
		}

		supabase.auth.setSession(data.session)

		return {
			user,
			session: data.session,
			invalidate: false,
			location: '/space/'
		}
	}
}
