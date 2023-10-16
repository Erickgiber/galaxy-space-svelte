import { PUBLIC_PHOTO_DEFAULT } from '$env/static/public'
import { supabase } from '$lib/supabase/supabase'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		const formEntry = await request.formData()
		const userData = Object.fromEntries(formEntry.entries())

		// ? Creating user
		const { data, error } = await supabase.auth.signUp({
			email: userData.email as string,
			password: userData.password as string
		})

		if (error) {
			return {
				message: `Error, ${error.message}`,
				invalidate: false
			}
		}

		// * Saving data in table register
		const { data: inserData, error: errorInsert } = await supabase.from('register').upsert({
			public_name: userData.public_name,
			username: userData.username,
			email: userData.email
		})

		// * Saving photo in table profiles
		const { data: inserDataProfile, error: errorInsertProfile } = await supabase
			.from('profiles')
			.insert({
				photo_url: PUBLIC_PHOTO_DEFAULT,
				email: userData.email,
				username: userData.username
			})

		console.log(inserDataProfile ?? errorInsertProfile)

		if (errorInsert) {
			return {
				message: `Error: ${errorInsert.message}`,
				invalidate: false
			}
		}

		return {
			message: 'Congratulations you have registered 🎉',
			invalidate: false,
			location: '/login'
		}
	}
}
