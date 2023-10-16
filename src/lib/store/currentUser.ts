import { writable } from 'svelte/store'

export type ICurrentUser = {
	email: string
	public_name: string
	access_token: string
	username: string
	photo_url?: string
	refresh_token: string
	uuid: string
}

export const currentUser = writable<ICurrentUser>()
