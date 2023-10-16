// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { IUser } from 'localTypes'

import { SupabaseClient, Session } from '@supabase/supabase-js'
import type { Session } from '@supabase/gotrue-js/src/lib/types'
import type { ICurrentUser } from '$lib/store/currentUser'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			getSession(): Promise<Session | null>
			user: ICurrentUser
			error?: Error
		}

		interface Cookies {
			AuthorizationToken: string
		}

		interface Error {
			message?: string
			go?: string
		}

		interface PageData {
			session?: Session | null
			user?: ICurrentUser | null
			error?: boolean
		}

		// interface Platform {}
	}
}

export {}
