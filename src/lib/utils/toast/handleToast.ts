import { toast } from '@zerodevx/svelte-toast'
import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'

export const handleToast = (msg: string, config?: SvelteToastOptions) => {
	toast.push(msg, {
		dismissable: false,
		duration: 1000,

		...config
	})
}
