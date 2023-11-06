import type { INotification } from '$lib/types/notification.types'
import { writable } from 'svelte/store'

export type ICurrentUser = {
	email: string
	public_name: string
	access_token: string
	username: string
	photo_url: string
	refresh_token: string
	uuid: string
	role: 'admin' | 'user'
	cover_photo_url: string
	is_star: boolean
	notifications: INotification[]
}

export const currentUser = writable<ICurrentUser>()
