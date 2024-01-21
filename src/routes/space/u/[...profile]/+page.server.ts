import type { IFollower } from '$lib/types/follower.types'
import type { TypeImage } from '$lib/types/image.types'
import type { IProfile } from '$lib/types/profile.types'
import type { Actions, ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async (event) => {
	const { supabase } = event.locals
	const { profile } = event.params

	const { data } = await supabase.from('profiles').select().eq('username', profile)

	if (data && data.length > 0) {
		const profile = data![0] as IProfile
		const { data: dataUser, error } = await supabase.auth.getUser()
		const { data: dataFollowers, error: errorFollowers } = await supabase.from('followers').select().eq('username', profile.username)

		const isFollowing: boolean =
			dataFollowers && dataFollowers.length > 0
				? dataFollowers[0].followers.find((follower: IFollower) => follower.uuid === dataUser?.user?.id)
				: false

		const { data: imagesProfile } = await supabase.from('posts').select().eq('uuid', profile.uuid)

		const { data: users, error: errorUsers } = await supabase.from('profiles').select('*')
		const { data: getLikes } = await supabase.from('likes').select('post_id, like, username, uuid')

		// ? Handle error
		if (error || errorUsers) {
			return {
				status: 500,
				error: new Error('Error fetching posts')
			}
		}

		// ? Map posts and users
		imagesProfile?.map((post) => {
			const user = users.find((user) => user.uuid === post.uuid)
			post.user = user
		})

		if (getLikes) {
			imagesProfile?.map((post) => {
				const likes = getLikes.filter((like) => like.post_id === post.post_id)
				post.likes = likes
				post.totalLikes = likes.length
				post.isLiked = likes.find((like) => like.uuid === dataUser.user.id) || false
			})
		}

		return {
			profile,
			followers: dataFollowers && dataFollowers.length > 0 ? (dataFollowers[0].followers as IFollower[]) : ([] as IFollower[]),
			followings: dataFollowers && dataFollowers.length > 0 ? (dataFollowers[0].following as IFollower[]) : ([] as IFollower[]),
			isUserAuth: dataUser?.user ? dataUser.user.id === profile.uuid : false,
			isFollowing: isFollowing,
			images: imagesProfile ? (imagesProfile?.filter((obj: TypeImage) => obj.image_url) as TypeImage[]) : [],
			wordsPosts: imagesProfile?.filter((post: TypeImage) => post.image_url === '' || post.image_url === '{}'),
			status: 200,
			msg: 'Profile found'
		}
	} else {
		return {
			profile: false,
			isUserAuth: false,
			status: 404,
			msg: 'Profile not found',
			followers: [] as IFollower[],
			followings: [] as IFollower[]
		}
	}
}

export const actions: Actions = {
	async changeDescription(event) {
		const { locals } = event
		const { supabase } = locals
		const formEntries = await event.request.formData()
		const formData = Object.fromEntries(formEntries)

		const { error } = await supabase
			.from('profiles')
			.update({
				description: formData.description
			})
			.eq('uuid', locals.user.uuid)

		if (error) {
			return {
				message: 'Error updating description',
				invalidate: false
			}
		}

		return {
			message: 'Description updated',
			invalidate: false
		}
	}
}
