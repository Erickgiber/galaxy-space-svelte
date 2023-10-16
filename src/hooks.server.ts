// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { ICurrentUser } from '$lib/fakedb/currentUser'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	})

	event.locals.getSession = async () => {
		const {
			data: { session }
			// @ts-ignore
		} = await event.locals.supabase.auth.getSession()
		return session
	}

	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser()

	if (user) {
		// @ts-ignore
		event.locals.user = user as ICurrentUser
	}

	console.log(user)

	if (event.url.pathname === '/') {
		throw redirect(303, '/login')
	}

	if (event.url.pathname.includes('/space') && !user) {
		throw redirect(303, '/login')
	}

	if (event.url.pathname.includes('/login') && user) {
		throw redirect(303, '/space')
	}

	return resolve(event)
}
