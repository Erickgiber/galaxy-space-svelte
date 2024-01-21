import type { ICurrentUser } from '$lib/store/currentUser'
import type { INotification } from '$lib/types/notification.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const handleLikeNotifications = async (
	currentUser: ICurrentUser,
	uuid_profile: string,
	username_profile: string,
	supabase: SupabaseClient,
	data: INotification
) => {
	const { data: InserNotifications, error } = await supabase.from('notifications').insert({
		uuid: uuid_profile,
		from_uuid: currentUser.uuid,
		from_username: currentUser.username,
		username: username_profile,
		title: data.title,
		subtitle: data.subtitle,
		description: data.description,
		type: data.type,
		url: data.url
	})
}
