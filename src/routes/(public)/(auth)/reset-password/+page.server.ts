import type { ICurrentUser } from '$lib/store/currentUser'
import type { INotification } from '$lib/types/notification.types'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formEntry = await request.formData()
		const userData = Object.fromEntries(formEntry.entries())

		if (userData.password !== userData.confirm_password) {
			return {
				message: 'Passwords do not match',
				invalidate: false
			}
		}

		return {
			message: 'Password saved successfully',
			invalidate: true
		}
	}
}
