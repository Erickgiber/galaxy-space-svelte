import type { IPost } from '$lib/types/post.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { toast } from '@zerodevx/svelte-toast'

export class PostsRepository {
	load = async (supabase: SupabaseClient) => {
		// ? Insert photo to supabase bucket
		const { data, error } = await supabase.from('posts').select()

		return data as IPost[]
	}

	find = async (supabase: SupabaseClient, post_id: string) => {
		const { data, error } = await supabase.from('posts').select().eq('post_id', post_id)

		if (error) {
			toast.push('A error ocurred finding post! try again')
			setTimeout(() => location.reload(), 3000)
		}

		return data
	}
}
