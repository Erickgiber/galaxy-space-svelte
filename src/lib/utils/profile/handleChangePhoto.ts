import { currentUser, type ICurrentUser } from '$lib/store/currentUser'
import { ProfileRepository } from '$lib/supabase/profile/ProfileRepository'
import type { IProfile } from '$lib/types/profile.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Writable } from 'svelte/store'

const repository = new ProfileRepository()

export const handleChangePhoto = (
	user: IProfile | any,
	currentUserProp: ICurrentUser,
	supabase: SupabaseClient,
	profile: Writable<IProfile> | any,
	isPhotoLoading: Writable<boolean>
) => {
	const input = createInput()

	// * Event listener for input change
	input.addEventListener('change', async () => {
		const file = input.files?.[0]
		isPhotoLoading.set(true)
		const request = await repository.photo.change(user, file!, supabase)
		if (request) {
			// ? Updating user
			profile.set({ ...user, photo_url: request })
			currentUser.set({ ...currentUserProp, photo_url: request })
			isPhotoLoading.set(false)
		} else {
			isPhotoLoading.set(false)
		}
	})
}

function createInput(): HTMLInputElement {
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = 'image/*'
	input.maxLength = 1
	input.click()
	return input
}
