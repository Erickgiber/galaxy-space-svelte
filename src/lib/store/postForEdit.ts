import type { IPost } from '$lib/types/post.types'
import { writable } from 'svelte/store'

export const postForEdit = writable({
	enable: false,
	post: {} as IPost | undefined,
	remove: false,
	edit: false
})
