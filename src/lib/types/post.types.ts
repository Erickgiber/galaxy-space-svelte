import type { IProfile } from './profile.types'

export interface IPost {
	id: number
	created_at: Date
	text: string
	image_url: string
	uuid: string
	username: string
	email: string
	post_id: string
	user: User
	likes: IsLiked[]
	totalLikes: number
	isLiked: IsLiked
	comments: IComment[]
	totalComments: number
}

export type IsLiked = {
	post_id: string
	like: boolean
	username: string
	uuid: string
}

export interface User {
	id: number
	created_at: Date
	uuid: string
	photo_url: string
	cover_photo_url: string
	name: null
	lastname: null
	username: string
	email: string
	public_name: string
	is_star: boolean
	description: string
}

export interface IComment {
	image_url: string
	post_id: string
	username: string
	uuid: string
	profile: IProfile
	text: string
}
