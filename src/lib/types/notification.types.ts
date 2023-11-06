export type INotification = {
	title: string
	subtitle?: string
	description: string
	image_url?: string
	type: 'follow' | 'like' | 'comment' | 'share' | 'mention' | 'reply' | 'repost' | 'quote'
	from_username?: string
	from_uuid?: string
}
