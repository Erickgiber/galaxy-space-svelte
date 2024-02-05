import { PUBLIC_PHOTO_DEFAULT } from '$env/static/public'
import { supabase } from '$lib/supabase/supabase'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		const formEntry = await request.formData()
		const userData = Object.fromEntries(formEntry.entries())

		if (
			userData.email === '' ||
			userData.password === '' ||
			userData.confirm_password === '' ||
			userData.public_name === '' ||
			userData.username === ''
		) {
			return {
				message: 'All fields are required',
				invalidate: false
			}
		}

		if (userData.password !== userData.confirm_password) {
			return {
				message: 'Passwords do not match',
				invalidate: false
			}
		}

		// ? Get usernames information
		const { data: usernames, error: errorUsernames } = await supabase.from('register').select('username').eq('username', userData.username).single()

		if (usernames?.username) {
			return {
				message: 'Username already exists',
				invalidate: false
			}
		}

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
		const { data: inserDataProfile, error: errorInsertProfile } = await supabase.from('profiles').insert({
			photo_url: PUBLIC_PHOTO_DEFAULT,
			email: userData.email,
			username: userData.username,
			public_name: userData.public_name
		})

		if (errorInsert) {
			return {
				message: errorInsert.message,
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
