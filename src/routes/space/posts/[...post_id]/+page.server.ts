import type { IComment, IPost } from '$lib/types/post.types'
import type { IProfile } from '$lib/types/profile.types'
import { redirect, type ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({ locals: { supabase, getSession }, params, url }) => {
	const { post_id } = params
	const id = url.searchParams.get('u')

	if (!post_id) {
		throw redirect(303, '/space')
	}

	const post = (await supabase.from('posts').select().eq('id', post_id).single()).data as IPost

	// ? Handle error
	if (!post) {
		throw redirect(303, '/space')
	}

	const { data: dataUser, error } = await supabase.auth.getUser()
	const { data: user, error: errorUser } = await supabase.from('profiles').select().eq('id', id).single()

	// ? Handle error
	if (!user) {
		throw redirect(303, '/space')
	}

	const { data: getLikes, error: errorLikes } = await supabase.from('likes').select('post_id, like, username, uuid, type').eq('post_id', post.post_id)
	const { data: getComments } = await await supabase.from('comments').select('post_id, username, uuid, text, image_url').eq('post_id', post.post_id)

	post.totalLikes = getLikes!.length ?? 0
	// @ts-ignore
	post.isLiked = Boolean(getLikes!.find((like) => like.uuid === dataUser.user?.id))
	// @ts-ignore
	post.user = user as IProfile
	// @ts-ignore
	post.likes = getLikes

	if (getComments) {
		const comments = getComments.filter((comment) => comment.post_id === post.post_id) as IComment[]
		post.comments = comments
		post.totalComments = comments.length

		for (let i = 0; i < post.comments.length; i++) {
			const profile = await supabase.from('profiles').select().eq('username', post.comments[i].username).single()
			post.comments[i] = { ...post.comments[i], profile: profile.data as IProfile }
		}
	}

	return {
		post: post as IPost
	}
}
