type IHeaderOption = {
	name: 'notifications' | 'menu' | 'dropdown' | 'bars'
	icon: string
	customClass: string
	onclick: (params?: any) => void
}

type IHeaderConfig = {
	options: IHeaderOption[]
}

export const HeaderConfig: IHeaderConfig = {
	options: [
		// {
		// 	name: 'menu',
		// 	icon: 'ic:twotone-apps',
		// 	customClass: '',
		// 	onclick: (params?: any) => {
		// 		console.log('Menu')
		// 	}
		// },
		{
			name: 'notifications',
			icon: 'ion:notifications-outline',
			customClass: '',
			onclick: (params?: any) => {
				const { isNotificationsOpen, value, isDropdownOpen } = params
				isNotificationsOpen.set(!value)
				isDropdownOpen.set(false)
			}
		},
		{
			name: 'dropdown',
			icon: 'iconamoon:arrow-down-2',
			customClass: '',
			onclick: (params?: any) => {
				const { isDropdownOpen, value, isNotificationsOpen } = params
				isDropdownOpen.set(!value)
				isNotificationsOpen.set(false)
			}
		},
		{
			name: 'bars',
			icon: 'uil:bars',
			customClass: 'md:hidden',
			onclick: (params?: any) => {
				const { isBars, value, isNotificationsOpen, isDropdownOpen } = params
				isBars.set(!value)
				isNotificationsOpen.set(false)
				isDropdownOpen.set(false)
			}
		}
	]
}
