// src/routes/+layout.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import type { Database } from '../DatabaseDefinitions.js'
import type { Load } from '@sveltejs/kit'

export const load: Load = async ({ fetch, data, depends }) => {
	depends('supabase:auth')

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data!.session
	})

	const {
		data: { session }
	} = await supabase.auth.getSession()

	return {
		...data,
		supabase,
		session
	}
}
