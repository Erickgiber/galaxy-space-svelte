import type { ICurrentUser } from '$lib/store/currentUser'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formEntry = await request.formData()
		const userData = Object.fromEntries(formEntry.entries())

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email: userData.email as string,
			password: userData.password as string
		})

		if (error) {
			return {
				message: `Error, ${error.message}`,
				invalidate: false
			}
		}

		const { data: getUserData, error: errorUserData } = await locals.supabase
			.from('register')
			.select()
			.eq('email', data.user.email)

		const { data: getProfileData, error: errorProfileData } = await locals.supabase
			.from('profiles')
			.select()
			.eq('uuid', getUserData![0].uuid)

		// * Saving data in variable
		const user: ICurrentUser = {
			email: data.user.email as string,
			access_token: data.session.access_token as string,
			public_name: getUserData![0].public_name,
			username: getUserData![0].username,
			refresh_token: data.session.refresh_token,
			uuid: getUserData![0].uuid,
			photo_url: getProfileData![0].photo_url,
			role: getUserData![0].role,
			cover_photo_url: getProfileData![0].cover_photo_url,
			is_star: getProfileData![0].is_star
		}

		return {
			user,
			session: data.session,
			invalidate: false,
			location: '/space/'
		}
	}
}
