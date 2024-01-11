export const loadTheme = () => {
	const bodyStyle = document.documentElement.style

	console.log('No adsds')
	// On page load or when changing themes, best to add inline in `head` to avoid FOUC
	if (
		localStorage.theme === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		document.documentElement.classList.add('dark')
		bodyStyle.background = '#090909'
		console.log('Si está')
	} else {
		document.documentElement.classList.remove('dark')
		console.log('No está')
	}
}
