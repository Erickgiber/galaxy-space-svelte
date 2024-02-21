export const handleInputUsername = (e: Event): void => {
	const input = e.currentTarget as HTMLInputElement
	const { value } = input
	input.value = value.replace(/[^A-Za-z0-9\-]/g, '').toLocaleLowerCase()
}
