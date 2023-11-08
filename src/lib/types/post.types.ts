import type { Database } from '../../DatabaseDefinitions'
import type { IProfile } from './profile.types'

type IRowPosts = Database['public']['Tables']['posts']['Row']

export interface IPost extends IRowPosts {
	user: IProfile
	likes: {
		username: string
		uuid: string
		post_id: string
		like: boolean
		type: 'post' | 'comment' | 'reply' | 'subreply'
	}
	totalLikes: number
	isLiked: boolean
}
