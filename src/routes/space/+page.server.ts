import type { IProfile } from '$lib/types/profile.types'
import { transformTextPost } from '$lib/utils/transformTextPost'
import type { Actions, ServerLoad } from '@sveltejs/kit'
import type { IPost } from '$lib/types/post.types'

type IFormPost = {
	text: string
	image: File | File[]
	user: IProfile
}

export const load: ServerLoad = async ({ locals }) => {
	const { supabase } = locals
	const { data: posts, error } = await supabase
		.from('posts')
		.select('*')
		.order('created_at', { ascending: false })

	const { data: users, error: errorUsers } = await supabase.from('profiles').select('*')

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

		if (postData.text === '') {
			return {
				message: 'All fields are required',
				invalidate: false
			}
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

		return {
			message: 'Post created successfully',
			invalidate: false
		}
	}
}
