import { goto } from '$app/navigation'
import { currentUser, type ICurrentUser } from '$lib/fakedb/currentUser'
import type { SupabaseClient } from '@supabase/supabase-js'

export const getCurrentUserData = async (supabase: SupabaseClient, email: string) => {
	const { data, error } = await supabase.from('register').select().eq('email', email)
	if (error) {
		supabase.auth.signOut()
		return false
	}

	if (data && data?.length > 0) {
		const user = data[0] as ICurrentUser
		currentUser.set(user)
		return user
	}
}
