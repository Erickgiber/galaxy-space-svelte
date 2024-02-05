import type { ICurrentUser } from '$lib/store/currentUser'
import { loaderStore } from '$lib/store/loader'
import type { IComment, IPost } from '$lib/types/post.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { toast } from '@zerodevx/svelte-toast'
import type { Writable } from 'svelte/store'

export class PostsRepository {
	load = async (supabase: SupabaseClient) => {
		// ? Insert photo to supabase bucket
		const { data, error } = await supabase.from('posts').select()

		return data as IPost[]
	}

	find = async (supabase: SupabaseClient, post_id: string | number) => {
		const { data, error } = await supabase.from('posts').select().eq('post_id', post_id)

		if (error) {
			toast.push('A error ocurred finding post! try again')
			setTimeout(() => location.reload(), 3000)
		}

		return data
	}

	newComment = async (
		supabase: SupabaseClient,
		post_id: string | number,
		user: ICurrentUser,
		comment: Writable<string>,
		text: string,
		image_url = '',
		commentsStore: Writable<IComment[]>,
		commentsStoreValue: IComment[]
	) => {
		if (!text) {
			return
		}

		loaderStore.set(true)

		const { data, error } = await supabase.from('comments').insert({
			uuid: user.uuid,
			username: user.username,
			post_id,
			text,
			image_url
		})

		if (error) {
			toast.push('A error ocurred saving comment! try again')
			loaderStore.set(false)
			return
		}

		comment.set('')
		commentsStore.set([
			...commentsStoreValue,
			{
				image_url: '',
				post_id,
				text,
				profile: user
			}
		] as IComment[])
		loaderStore.set(false)
	}
}
