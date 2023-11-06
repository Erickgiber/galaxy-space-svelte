type IHeaderOption = {
	name: 'notifications' | 'menu' | 'dropdown'
	icon: string
	customClass: string
	onclick: (params?: any) => void
}

type IHeaderConfig = {
	options: IHeaderOption[]
}

export const HeaderConfig: IHeaderConfig = {
	options: [
		{
			name: 'menu',
			icon: 'ic:twotone-apps',
			customClass: '',
			onclick: (params?: any) => {
				console.log('Menu')
			}
		},
		{
			name: 'notifications',
			icon: 'mingcute:notification-line',
			customClass: '',
			onclick: (params?: any) => {
				const { isNotificationsOpen, value } = params
				isNotificationsOpen.set(!value)
			}
		},
		{
			name: 'dropdown',
			icon: 'eva:arrow-down-fill',
			customClass: '',
			onclick: (params?: any) => {
				console.log('Dropdown')
			}
		}
	]
}
