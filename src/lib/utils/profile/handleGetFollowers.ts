import type { IProfile } from '$lib/types/profile.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const handleGetFollowers = async (supabase: SupabaseClient, uuid: IProfile['uuid']) => {
	const { data, error } = await supabase.from('profiles').select().eq('uuid', uuid).single()

	return error ? false : data
}
