import type { Database } from '../../DatabaseDefinitions'
import type { IProfile } from './profile.types'

type IRowPosts = Database['public']['Tables']['posts']['Row']

export interface IPost extends IRowPosts {
	user: IProfile
}
