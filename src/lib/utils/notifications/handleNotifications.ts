import type { ICurrentUser } from '$lib/store/currentUser'
import type { INotification } from '$lib/types/notification.types'
import type { IProfile } from '$lib/types/profile.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const handleNotifications = async (
	currentUser: ICurrentUser,
	profile: IProfile,
	supabase: SupabaseClient,
	data: INotification
) => {
	const { data: InserNotifications, error } = await supabase.from('notifications').insert({
		uuid: profile.uuid,
		from_uuid: currentUser.uuid,
		from_username: currentUser.username,
		username: profile.username,
		title: data.title,
		subtitle: data.subtitle,
		description: data.description
	})

	console.log(InserNotifications, error)
}
