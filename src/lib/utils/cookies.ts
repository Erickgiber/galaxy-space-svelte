import { CookieStorage } from 'cookie-storage'

export const saveAuthCookies = (access_token: string, refresh_token: string) => {
	// Crea una instancia de CookieStorage
	const cookieStorage = new CookieStorage()

	cookieStorage.setItem('authToken', access_token)
	cookieStorage.setItem('refreshToken', refresh_token)
}

type ResponseVoid = { access_token: string | null; refresh_token: string | null }
export const getAuthCookies = (): ResponseVoid => {
	const cookieStorage = new CookieStorage()
	return {
		access_token: cookieStorage.getItem('authToken') as string,
		refresh_token: cookieStorage.getItem('refreshToken') as string
	}
}
