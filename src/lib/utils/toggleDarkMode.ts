import { loadTheme } from "./loadTheme"

export const toggleDarkMode = (): void => {
    const storage = localStorage.getItem('theme')

    if (storage === 'dark') {
        localStorage.removeItem('theme')
    } else {
        localStorage.setItem('theme', 'dark')
    }

    loadTheme()
}