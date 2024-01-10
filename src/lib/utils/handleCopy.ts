export const handleCopy = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text)
		return true
	} catch (err) {
		return false
	}
}
