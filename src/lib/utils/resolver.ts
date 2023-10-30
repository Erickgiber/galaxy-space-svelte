import { goto, invalidate, invalidateAll } from '$app/navigation'
import { currentUser, type ICurrentUser } from '$lib/store/currentUser'
import { toast } from '@zerodevx/svelte-toast'
import type { Writable } from 'svelte/store'

export const resolver = (
	disabled: Writable<boolean>,
	{ onError, onSuccess, action }: any | null
) => {
	disabled.set(true)

	return async ({ result: { data, type } }: any) => {
		if (data) {
			if (type == 'failure') {
				toast.push(data.message ?? '')
				onError?.()
			} else {
				onSuccess?.()

				if (data.user && data.location) {
					const user = data.user as ICurrentUser

					// Set data
					currentUser.set(user)

					goto(data.location)
					return
				}

				if (!data.bypasstoast && data?.message) {
					toast.push(data.message ?? '')
				}

				if (data.invalidate && data?.message) {
					await invalidateAll()
					toast.push(data.message ?? '')
				}

				if (data.location && data?.message) {
					await invalidate(data.location)
					await goto(data.location)
				}
			}

			action?.()
			disabled.set(false)
		} else {
			console.warn(`>>>>>>>>>>>>>>>>>>>>>>>>>>|||WARN|||>>>>>>>>>>>>>>>>>>>>>>>>>>`)
			console.warn(
				`if you see this warn your return form the the server if wrong please check src/lib/utils/resolver.ts, for docs`
			)
			console.warn(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<|||WARN|||<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)

			disabled.set(false)
			toast.push('Error desconocido, por favor intente de nuevo.')
		}
	}
}
