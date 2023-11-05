export const HeaderConfig = {
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
