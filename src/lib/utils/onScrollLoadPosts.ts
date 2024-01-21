import type { ICurrentUser } from '$lib/store/currentUser'
import { PostsRepository } from '$lib/supabase/posts/PostsRepository'
import type { IPost } from '$lib/types/post.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const onScrollLoadPosts = async (
	supabase: SupabaseClient,
	totalPosts: number,
	loadPosts: (posts: IPost[]) => void,
	currentUser: ICurrentUser
) => {
	const scrollHeight = document.documentElement.scrollHeight - 500
	const clientHeight = document.documentElement.clientHeight
	const scrollTop = document.documentElement.scrollTop
	const scrollBottom = Math.ceil(scrollTop + clientHeight)

	if (scrollBottom >= scrollHeight) {
		const repository = new PostsRepository()
		const posts = await repository.load(supabase)
		const { data: users, error: errorUsers } = await supabase.from('profiles').select('*')
		const { data: getLikes, error: errorLikes } = await supabase
			.from('likes')
			.select('post_id, like, username, uuid')

		// ? Map posts and users
		posts.map((post) => {
			const user = users?.find((user) => user.uuid === post.uuid)
			post.user = user
		})

		posts.map((post: any) => {
			const likes = getLikes?.filter((like) => like.post_id === post.post_id)
			if (likes) {
				post.likes = likes
				post.totalLikes = likes.length
				post.isLiked = likes.find((like) => like.uuid === currentUser.uuid) || false
			}
		})

		posts.slice(totalPosts, totalPosts + 5)
		loadPosts(posts)
	}
}
