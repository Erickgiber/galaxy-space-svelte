import { supabase } from '$lib/supabase/supabase'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		const formEntry = await request.formData()
		const userData = Object.fromEntries(formEntry.entries())

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

		const { data: inserData, error: errorInsert } = await supabase.from('register').upsert({
			public_name: userData.public_name,
			username: userData.username,
			email: userData.email
		})

		if (errorInsert) {
			return {
				message: `Error: ${errorInsert.message}`,
				invalidate: false
			}
		}

		return {
			message: 'Congratulations you have registered 🎉',
			invalidate: false
		}
	}
}
