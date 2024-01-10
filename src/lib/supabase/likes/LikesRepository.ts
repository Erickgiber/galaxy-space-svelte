import type { ICurrentUser } from '$lib/store/currentUser'
import type { SupabaseClient } from '@supabase/supabase-js'

export class LikesRepository {
	setLike = async (supabase: SupabaseClient, post_id: string, currentUser: ICurrentUser) => {
		const { data, error } = await supabase.from('likes').insert({
			post_id,
			like: true,
			username: currentUser.username,
			uuid: currentUser.uuid,
			type: 'post'
		})

		return !Boolean(error)
	}

	removeLike = async (supabase: SupabaseClient, post_id: string, currentUser: ICurrentUser) => {
		const { data, error } = await supabase
			.from('likes')
			.delete()
			.match({ post_id, uuid: currentUser.uuid })

		return !Boolean(error)
	}
}
