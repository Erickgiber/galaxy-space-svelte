export const transformTextPost = (text: string): string => {
	return text.replace(/\r?\n|\r/g, '<br>')
}
