import type { IPost } from '$lib/types/post.types'
import type { IProfile } from '$lib/types/profile.types'
import { redirect, type ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ locals: { supabase, getSession }, params, url }) => {
	const { post_id } = params
	const username = url.searchParams.get('username')

	if (!post_id) {
		throw redirect(303, '/space')
	}

	const post = (await supabase.from('posts').select().eq('post_id', post_id).single()).data as IPost

	// ? Handle error
	if (!post) {
		throw redirect(303, '/space')
	}

	const { data: dataUser, error } = await supabase.auth.getUser()
	const { data: user, error: errorUser } = await supabase
		.from('profiles')
		.select()
		.eq('username', username)
		.single()

	const { data: getLikes, error: errorLikes } = await supabase
		.from('likes')
		.select('post_id, like, username, uuid, type')
		.eq('post_id', post.post_id)

	post.totalLikes = getLikes!.length ?? 0
	post.isLiked = Boolean(getLikes!.find((like) => like.uuid === dataUser.user?.id))
	post.user = user as IProfile

	return {
		post: post as IPost
	}
}
