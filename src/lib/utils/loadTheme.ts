export const loadTheme = () => {
	const storage = localStorage.getItem('theme')

	// On page load or when changing themes, best to add inline in `head` to avoid FOUC
	if (storage === 'dark') {
		document.documentElement.classList.add('dark')
		document.documentElement.style.background = '#090909'
		;(document.querySelector('#theme') as HTMLMetaElement).content = '#151515'
	} else {
		document.documentElement.classList.remove('dark')
		document.documentElement.style.background = '#f9f6ff'
		;(document.querySelector('#theme') as HTMLMetaElement).content = '#ffffff'
	}
}
