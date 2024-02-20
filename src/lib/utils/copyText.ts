import { toast } from '@zerodevx/svelte-toast'

export const copyText = (text: string): void => {
	navigator.clipboard
		.writeText(text)
		.then(function () {
			toast.pop()
			toast.push('Copied')
		})
		.catch(function (err) {
			toast.pop()
			toast.push('Error on copy text, try again')
		})
}
