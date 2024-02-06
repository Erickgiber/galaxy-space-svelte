import type { IPost } from '$lib/types/post.types'
import type { IProfile } from '$lib/types/profile.types'
import { transformTextPost } from '$lib/utils/transformTextPost'
import type { Actions, ServerLoad } from '@sveltejs/kit'
import { v4 } from 'uuid'

type IFormPost = {
	text: string
	image_url: File | File[] | string
	user: IProfile
}

export const load: ServerLoad = async ({ locals }) => {
	const { supabase } = locals
	const { data: posts, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
	const { data: users, error: errorUsers } = await supabase.from('profiles').select('*')
	const { data: getLikes } = await supabase.from('likes').select('post_id, like, username, uuid')
	const { data: getComments } = await supabase.from('comments').select('post_id, username, uuid, text, image_url')

	// ? Handle error
	if (error || errorUsers) {
		return {
			status: 500,
			error: new Error('Error fetching posts')
		}
	}

	// ? Map posts and users
	posts.map((post) => {
		const user = users.find((user) => user.uuid === post.uuid)
		post.user = user
	})

	if (getLikes) {
		posts.map((post) => {
			const likes = getLikes.filter((like) => like.post_id === post.post_id)
			post.likes = likes
			post.totalLikes = likes.length
			post.isLiked = likes.find((like) => like.uuid === locals.user.uuid) || false
		})
	}

	if (getComments) {
		posts.map((post) => {
			const comments = getComments.filter((comment) => comment.post_id === post.post_id)
			post.comments = comments
			post.totalComments = comments.length
		})

		for (let post of posts) {
			for (let i = 0; i < post.comments.length; i++) {
				const profile = await supabase.from('profiles').select().eq('username', post.comments[i].username).single()
				post.comments[i] = { ...post.comments[i], profile: profile.data as IProfile }
			}
		}
	}

	posts.map((post: IPost) => {
		if (post.image_url === '{}') {
			post.image_url = ''
		}
	})

	return {
		posts: posts as IPost[]
	}
}

export const actions: Actions = {
	new_post: async ({ request, locals }) => {
		const formEntry = await request.formData()
		const postData = Object.fromEntries(formEntry.entries() as any) as IFormPost
		const { supabase } = locals

		// ? Transform text
		postData.text = transformTextPost(postData.text)

		if (postData.text === '' && !postData.image_url) {
			return {
				message: 'All fields are required',
				invalidate: false
			}
		}

		// @ts-ignore
		if (postData.image_url?.name) {
			if ((postData.image_url as File).size > 5000000) {
				return {
					message: 'The image must be less than 5MB',
					invalidate: false
				}
			}

			const { data } = await supabase.storage.from('photos').upload(`/posts_img/${locals.user.username}/${v4()}.png`, postData.image_url as File)

			if (data) {
				const path = `https://ufcvvchllbhbkfekutmt.supabase.co/storage/v1/object/public/photos/${data.path}`
				postData.image_url = path as string
			}
		} else {
			postData.image_url = ''
		}

		const { error } = await supabase.from('posts').insert({
			...postData,
			uuid: locals.user.uuid,
			username: locals.user.username,
			email: locals.user.email
		})

		if (error) {
			return {
				message: error.message,
				invalidate: false
			}
		}

		const { data: posts } = await supabase.from('posts').select()
		const { data: users, error: errorUsers } = await supabase.from('profiles').select('*')
		const { data: getLikes } = await supabase.from('likes').select('post_id, like, username, uuid')
		const { data: getComments } = await supabase.from('comments').select('post_id, username, uuid, text, image_url')

		// ? Handle error
		if (error || errorUsers) {
			return {
				status: 500,
				error: new Error('Error fetching posts')
			}
		}

		if (posts) {
			// ? Map posts and users
			posts.map((post) => {
				const user = users.find((user) => user.uuid === post.uuid)
				post.user = user
			})

			if (getLikes) {
				posts.map((post) => {
					const likes = getLikes.filter((like) => like.post_id === post.post_id)
					post.likes = likes
					post.totalLikes = likes.length
					post.isLiked = likes.find((like) => like.uuid === locals.user.uuid) || false
				})
			}

			if (getComments) {
				posts.map((post) => {
					const comments = getComments.filter((comment) => comment.post_id === post.post_id)
					post.comments = comments
					post.totalComments = comments.length
				})

				for (let post of posts) {
					for (let i = 0; i < post.comments.length; i++) {
						const profile = await supabase.from('profiles').select().eq('username', post.comments[i].username).single()
						post.comments[i] = { ...post.comments[i], profile: profile.data as IProfile }
					}
				}
			}

			posts.map((post: IPost) => {
				if (post.image_url === '{}') {
					post.image_url = ''
				}
			})
		}

		return {
			message: 'Post created successfully',
			invalidate: false,
			posts: posts?.reverse()
		}
	}
}
