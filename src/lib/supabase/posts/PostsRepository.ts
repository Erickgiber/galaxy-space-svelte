import type { IPost } from '$lib/types/post.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export class PostsRepository {
	load = async (supabase: SupabaseClient) => {
		// ? Insert photo to supabase bucket
		const { data, error } = await supabase.from('posts').select()

		return data as IPost[]
	}
}
